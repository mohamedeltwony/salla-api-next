"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SallaProduct } from "@/services/salla-api";
import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "./button";
import Image from "next/image";

import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: SallaProduct;
  className?: string;
  delay?: number;
}

export function ProductCard({ product, className, delay = 0 }: ProductCardProps) {
  const router = useRouter();
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
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <ShoppingCart className="w-4 h-4 ml-2" />
            أضف للسلة
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