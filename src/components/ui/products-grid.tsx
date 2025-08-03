"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "./product-card";
import { Shimmer } from "./shimmer";
import { Button } from "./button";
import { SallaProduct } from "@/services/salla-api";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductsGridProps {
  className?: string;
  maxProducts?: number;
  showLoadMore?: boolean;
}

export function ProductsGrid({ className, maxProducts = 12, showLoadMore = true }: ProductsGridProps) {
  const [products, setProducts] = useState<SallaProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchProducts = async (page: number = 1, append: boolean = false) => {
    try {
      if (!append) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const response = await fetch(`/api/products?page=${page}&perPage=12`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch products');
      }

      if (data.success && data.data) {
        const newProducts = data.data;

        if (append) {
          setProducts(prev => [...prev, ...newProducts]);
        } else {
          setProducts(newProducts);
        }

        if (data.pagination) {
          setHasMore(data.pagination.currentPage < data.pagination.totalPages);
        } else {
          setHasMore(newProducts.length === 12);
        }
      } else {
        throw new Error(data.error || 'Failed to fetch products');
      }
      

    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل المنتجات');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchProducts(nextPage, true);
    }
  };

  const handleRetry = () => {
    setCurrentPage(1);
    fetchProducts(1, false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
        {Array.from({ length: 8 }).map((_, index) => (
          <Shimmer key={index} className="aspect-[3/4] rounded-lg">
            <div className="p-4 h-full flex flex-col justify-end">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-muted rounded w-1/2"></div>
            </div>
          </Shimmer>
        ))}
      </div>
    );
  }

  // Error state
  if (error && products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h3 className="text-xl font-semibold mb-2">خطأ في تحميل المنتجات</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          {error}
        </p>
        <Button onClick={handleRetry} className="bg-primary hover:bg-primary/90">
          <RefreshCw className="w-4 h-4 ml-2" />
          إعادة المحاولة
        </Button>
      </motion.div>
    );
  }

  // No products found
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">📦</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">لا توجد منتجات</h3>
        <p className="text-muted-foreground">
          لم يتم العثور على أي منتجات في المتجر حالياً
        </p>
      </motion.div>
    );
  }

  const displayProducts = maxProducts ? products.slice(0, maxProducts) : products;

  return (
    <div className={className}>
      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Load More Button */}
      {showLoadMore && hasMore && !maxProducts && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mt-12"
        >
          <Button
            onClick={handleLoadMore}
            disabled={loadingMore}
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
          >
            {loadingMore ? (
              <>
                <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                جاري التحميل...
              </>
            ) : (
              'تحميل المزيد'
            )}
          </Button>
        </motion.div>
      )}

      {/* Error message for load more */}
      {error && products.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mt-6"
        >
          <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm">
            خطأ في تحميل المزيد من المنتجات
          </div>
        </motion.div>
      )}
    </div>
  );
}