"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SallaProduct } from "@/services/salla-api";
import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "./button";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SallaCartResponse } from "@/types/salla";

interface ProductCardProps {
  product: SallaProduct;
  className?: string;
  delay?: number;
}

export function ProductCard({ product, className, delay = 0 }: ProductCardProps) {
  const router = useRouter();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const hasDiscount = product.sale_price && product.sale_price.amount < product.price.amount;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price.amount - product.sale_price!.amount) / product.price.amount) * 100)
    : 0;

  const formatPrice = (price: { amount: number; currency: string }) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: price.currency || 'SAR',
    }).format(price.amount);
  };

  const handleViewProduct = () => {
    router.push(`/product/${product.id}`);
  };

  const handleAddToCart = async () => {
    if (isAddingToCart) return;
    
    // Check if Salla SDK is available
    if (typeof window === 'undefined' || !window.salla) {
      console.error('[DEBUG] Salla SDK not available');
      alert('خدمة السلة غير متاحة حالياً');
      return;
    }

    setIsAddingToCart(true);
    
    try {
      // Set up event listeners before making the call
      window.salla.cart.event.onItemAdded((response: SallaCartResponse, product_id?: string | number) => {
        console.log('[DEBUG] Item added successfully:', response, product_id);
        alert('تم إضافة المنتج إلى السلة بنجاح!');
      });
      
      window.salla.cart.event.onItemAddedFailed((errorMessage: string | Error, product_id?: string | number) => {
        console.error('[DEBUG] Failed to add item:', errorMessage, product_id);
        const message = typeof errorMessage === 'string' ? errorMessage : 'خطأ غير معروف';
        alert('فشل في إضافة المنتج إلى السلة: ' + message);
      });
      
      // Add item to cart with proper payload structure
      const cartOptions = {
        id: product.id,
        quantity: 1,
        notes: "Added from product card"
      };
      
      console.log('[DEBUG] Adding to cart from product card:', cartOptions);
      const response = await window.salla.cart.addItem(cartOptions);
      console.log('[DEBUG] Cart response:', response);
      
    } catch (error) {
      console.error('[DEBUG] Error adding to cart:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      alert('فشل في إضافة المنتج إلى السلة: ' + errorMessage);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border bg-background shadow-lg",
        "hover:shadow-xl hover:border-primary/50 transition-all duration-300",
        className
      )}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        {product.images && product.images.length > 0 && product.images[0].url ? (
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            width={400}
            height={400}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">لا توجد صورة</span>
          </div>
        )}
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded-md text-xs font-semibold">
            -{discountPercentage}%
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button 
            size="sm" 
            variant="secondary" 
            className="bg-background/90 hover:bg-background"
            onClick={handleViewProduct}
          >
            <Eye className="w-4 h-4 ml-2" />
            عرض المنتج
          </Button>
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/90"
            onClick={handleAddToCart}
            disabled={isAddingToCart || (product.quantity !== undefined && product.quantity <= 0)}
          >
            <ShoppingCart className="w-4 h-4 ml-2" />
            {isAddingToCart ? 'جاري الإضافة...' : 'أضف للسلة'}
          </Button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <h3 
          className="font-semibold text-lg mb-2 line-clamp-2 text-foreground group-hover:text-primary transition-colors cursor-pointer"
          onClick={handleViewProduct}
        >
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        
        {/* Categories */}
        {product.categories && product.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.categories.slice(0, 2).map((category) => (
              <span
                key={category.id}
                className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(product.sale_price!)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-primary">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          
          {/* Stock Status */}
          {product.quantity !== undefined && (
            <div className={cn(
              "text-xs px-2 py-1 rounded-md",
              product.quantity > 0 
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            )}>
              {product.quantity > 0 ? `متوفر (${product.quantity})` : "نفد المخزون"}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}