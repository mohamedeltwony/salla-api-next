"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { SallaProduct } from "@/services/salla-api";
import { Button } from "@/components/ui/button";
import { Shimmer } from "@/components/ui/shimmer";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  ArrowRight,
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Minus,
  Plus,
  Package,
  Truck,
  Shield,
  AlertCircle
} from "lucide-react";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<SallaProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'فشل في تحميل المنتج');
        }
        
        if (data.success && data.data) {
          setProduct(data.data);
        } else {
          throw new Error('المنتج غير موجود');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل المنتج');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const formatPrice = (price: { amount: number; currency: string }) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: price.currency || 'SAR',
    }).format(price.amount);
  };

  const hasDiscount = product?.sale_price && product.sale_price.amount < product.price.amount;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price.amount - product.sale_price!.amount) / product.price.amount) * 100)
    : 0;

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && (!product?.quantity || newQuantity <= product.quantity)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!product) {
      console.error('[DEBUG] handleAddToCart: No product available');
      return;
    }
    
    console.log('[DEBUG] Starting add to cart process for product:', {
      id: product.id,
      name: product.name,
      quantity: quantity
    });
    
    setIsAddingToCart(true);
    
    try {
      // Check if Salla SDK is available
      if (typeof window === 'undefined' || !window.salla) {
        console.error('[DEBUG] Salla SDK not available');
        alert('خدمة السلة غير متاحة حالياً');
        return;
      }

      if (!window.sallaSDKReady) {
        console.error('[DEBUG] Salla SDK not ready');
        alert('خدمة السلة لا تزال قيد التحميل، يرجى المحاولة مرة أخرى');
        return;
      }

      console.log('[DEBUG] Using Salla SDK for cart operation');

      // Set up event listeners before making the call (following best practices)
      window.salla.cart.event.onItemAdded((response: any, product_id?: any) => {
        console.log('[DEBUG] Salla SDK: Item added successfully:', response, product_id);
        alert('تم إضافة المنتج إلى السلة بنجاح!');
      });
      
      window.salla.cart.event.onItemAddedFailed((errorMessage: any, product_id?: any) => {
        console.error('[DEBUG] Salla SDK: Failed to add item:', errorMessage, product_id);
        const message = typeof errorMessage === 'string' ? errorMessage : 'خطأ غير معروف';
        alert('فشل في إضافة المنتج إلى السلة: ' + message);
      });
      
      // Prepare cart options following Salla SDK documentation
      const cartOptions = {
        id: product.id,
        quantity: quantity,
        notes: "Added from product page"
      };
      
      console.log('[DEBUG] Calling salla.cart.addItem with options:', cartOptions);
      const response = await window.salla.cart.addItem(cartOptions);
      console.log('[DEBUG] Salla SDK response:', response);
    } catch (error) {
      console.error('[DEBUG] Error in handleAddToCart:', {
        error: error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      alert('فشل في إضافة المنتج إلى السلة: ' + (error instanceof Error ? error.message : 'خطأ غير معروف'));
    } finally {
      console.log('[DEBUG] Add to cart process completed');
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Shimmer className="aspect-square rounded-lg" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <Shimmer key={i} className="w-20 h-20 rounded-md" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Shimmer className="h-8 w-3/4" />
              <Shimmer className="h-6 w-1/2" />
              <Shimmer className="h-20 w-full" />
              <Shimmer className="h-12 w-full" />
              <Shimmer className="h-10 w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8"
        >
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">خطأ في تحميل المنتج</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.back()} variant="outline">
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة
            </Button>
            <Button onClick={() => window.location.reload()}>
              إعادة المحاولة
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
        >
          <button onClick={() => router.push('/')} className="hover:text-primary transition-colors">
            الرئيسية
          </button>
          <span>/</span>
          <button onClick={() => router.back()} className="hover:text-primary transition-colors">
            المنتجات
          </button>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-background">
              {product.images && product.images.length > 0 && product.images[selectedImageIndex]?.url ? (
                <Image
                  src={product.images[selectedImageIndex].url}
                  alt={product.images[selectedImageIndex].alt || product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Package className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
              
              {/* Discount Badge */}
              {hasDiscount && (
                <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-md text-sm font-semibold">
                  -{discountPercentage}%
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 rounded-md border-2 overflow-hidden transition-all",
                      selectedImageIndex === index
                        ? "border-primary"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {image.url ? (
                      <Image
                        src={image.url}
                        alt={image.alt || product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Package className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Product Title */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              {product.sku && (
                <p className="text-sm text-muted-foreground">رقم المنتج: {product.sku}</p>
              )}
            </div>

            {/* Rating (placeholder) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(4.5) 128 تقييم</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                {hasDiscount ? (
                  <>
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(product.sale_price!)}
                    </span>
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <p className="text-sm text-green-600">توفر {formatPrice({ amount: product.price.amount - product.sale_price!.amount, currency: product.price.currency })}</p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">وصف المنتج</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Categories */}
            {product.categories && product.categories.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">التصنيفات</h3>
                <div className="flex flex-wrap gap-2">
                  {product.categories.map((category) => (
                    <span
                      key={category.id}
                      className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-md hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            {product.quantity !== undefined && (
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  product.quantity > 0 ? "bg-green-500" : "bg-red-500"
                )} />
                <span className={cn(
                  "text-sm font-medium",
                  product.quantity > 0 ? "text-green-600" : "text-red-600"
                )}>
                  {product.quantity > 0 ? `متوفر (${product.quantity} قطعة)` : "نفد المخزون"}
                </span>
              </div>
            )}

            {/* Quantity Selector */}
            {product.quantity && product.quantity > 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الكمية</label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.quantity}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="flex-1"
                    size="lg"
                  >
                    {isAddingToCart ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin ml-2" />
                    ) : (
                      <ShoppingCart className="w-4 h-4 ml-2" />
                    )}
                    {isAddingToCart ? "جاري الإضافة..." : "أضف إلى السلة"}
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">شحن مجاني</p>
                  <p className="text-muted-foreground">للطلبات أكثر من 200 ريال</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">ضمان الجودة</p>
                  <p className="text-muted-foreground">ضمان لمدة سنة</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Package className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">إرجاع مجاني</p>
                  <p className="text-muted-foreground">خلال 30 يوم</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}