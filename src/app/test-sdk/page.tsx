"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Loader2, Package, Store, Users, ShoppingBag, RefreshCw } from 'lucide-react';
import { sallaApi, SallaProduct, SallaCategory } from '@/services/salla-api';
import Link from 'next/link';

interface TestResult {
  name: string;
  status: 'loading' | 'success' | 'error';
  data?: any;
  error?: string;
  duration?: number;
}

export default function TestSDKPage() {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTest = (name: string, update: Partial<TestResult>) => {
    setTests(prev => {
      const existing = prev.find(t => t.name === name);
      if (existing) {
        return prev.map(t => t.name === name ? { ...t, ...update } : t);
      } else {
        return [...prev, { name, status: 'loading', ...update }];
      }
    });
  };

  const runTest = async (name: string, testFn: () => Promise<any>) => {
    const startTime = Date.now();
    updateTest(name, { status: 'loading' });
    
    try {
      const result = await testFn();
      const duration = Date.now() - startTime;
      updateTest(name, { 
        status: 'success', 
        data: result, 
        duration 
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      updateTest(name, { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error',
        duration 
      });
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTests([]);

    // Test 1: Get Products
    await runTest('Get Products', async () => {
      const response = await sallaApi.getProducts(1, 5);
      return {
        count: response.data.length,
        total: response.pagination?.total || 0,
        products: response.data.slice(0, 3).map(p => ({
          id: p.id,
          name: p.name,
          price: p.price.amount,
          currency: p.price.currency
        }))
      };
    });

    // Test 2: Get Categories
    await runTest('Get Categories', async () => {
      const response = await sallaApi.getCategories();
      return {
        count: response.data.length,
        categories: response.data.slice(0, 5).map(c => ({
          id: c.id,
          name: c.name
        }))
      };
    });

    // Test 3: Search Products
    await runTest('Search Products', async () => {
      const response = await sallaApi.searchProducts('test', 1);
      return {
        count: response.data.length,
        searchResults: response.data.slice(0, 3).map(p => ({
          id: p.id,
          name: p.name,
          price: p.price.amount
        }))
      };
    });

    // Test 4: Get Single Product (if products exist)
    const productsTest = tests.find(t => t.name === 'Get Products');
    if (productsTest && productsTest.status === 'success' && productsTest.data?.products?.length > 0) {
      const productId = productsTest.data.products[0].id;
      await runTest('Get Single Product', async () => {
        const response = await sallaApi.getProduct(productId);
        return {
          id: response.data.id,
          name: response.data.name,
          description: response.data.description?.substring(0, 100) + '...',
          images: response.data.images?.length || 0,
          categories: response.data.categories?.length || 0
        };
      });
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <div className="w-4 h-4 rounded-full bg-green-500" />;
      case 'error':
        return <div className="w-4 h-4 rounded-full bg-red-500" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'loading':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            اختبار Salla SDK
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            اختبار تكامل Salla API مع المتجر التجريبي
          </p>
          
          <div className="flex gap-4 justify-center mb-6">
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              size="lg"
              className="gap-2"
            >
              {isRunning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {isRunning ? 'جاري التشغيل...' : 'تشغيل جميع الاختبارات'}
            </Button>
            
            <Button variant="outline" asChild>
              <Link href="/">العودة للرئيسية</Link>
            </Button>
          </div>
        </motion.div>

        {/* Test Results */}
        <div className="grid gap-6">
          {tests.map((test, index) => (
            <motion.div
              key={test.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`${getStatusColor(test.status)} transition-all duration-300`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      <CardTitle className="text-lg">{test.name}</CardTitle>
                    </div>
                    {test.duration && (
                      <Badge variant="secondary">
                        {test.duration}ms
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  {test.status === 'loading' && (
                    <p className="text-muted-foreground">جاري التحميل...</p>
                  )}
                  
                  {test.status === 'error' && (
                    <div className="text-red-600">
                      <p className="font-medium mb-2">خطأ:</p>
                      <p className="text-sm bg-red-100 p-3 rounded border">
                        {test.error}
                      </p>
                    </div>
                  )}
                  
                  {test.status === 'success' && test.data && (
                    <div className="space-y-3">
                      <div className="text-green-600 font-medium">نجح الاختبار ✅</div>
                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-64">
                        {JSON.stringify(test.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Info Cards */}
        {tests.length === 0 && !isRunning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
          >
            <Card className="text-center p-6">
              <Package className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">المنتجات</h3>
              <p className="text-sm text-muted-foreground">جلب قائمة المنتجات من المتجر</p>
            </Card>
            
            <Card className="text-center p-6">
              <Store className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">الفئات</h3>
              <p className="text-sm text-muted-foreground">عرض فئات المنتجات المتاحة</p>
            </Card>
            
            <Card className="text-center p-6">
              <ShoppingBag className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">البحث</h3>
              <p className="text-sm text-muted-foreground">البحث في المنتجات</p>
            </Card>
            
            <Card className="text-center p-6">
              <Users className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">تفاصيل المنتج</h3>
              <p className="text-sm text-muted-foreground">عرض تفاصيل منتج محدد</p>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}