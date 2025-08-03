"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedCard } from "@/components/ui/animated-card";
import Link from "next/link";

import { FloatingDock } from "@/components/ui/floating-dock";
import { ProductsGrid } from "@/components/ui/products-grid";
import { ShoppingCart, Store, Package, Settings, Home as HomeIcon, User } from "lucide-react";

export default function Home() {
  const dockItems = [
    { title: "الرئيسية", icon: <HomeIcon className="w-5 h-5" />, href: "/" },
    { title: "المتجر", icon: <Store className="w-5 h-5" />, href: "/" },
    { title: "المنتجات", icon: <Package className="w-5 h-5" />, href: "/" },
    { title: "السلة", icon: <ShoppingCart className="w-5 h-5" />, href: "/cart" },
    { title: "الملف الشخصي", icon: <User className="w-5 h-5" />, href: "/" },
    { title: "الإعدادات", icon: <Settings className="w-5 h-5" />, href: "/" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h1
            className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            تطبيق اختبار سلة
          </motion.h1>
          <motion.p
            className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            تطبيق Next.js مع Motion Primitives و Magic UI لاختبار تكامل سلة
          </motion.p>
          <motion.div
            className="flex gap-4 justify-center flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-background">
              ابدأ التكامل
            </Button>
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10">
              عرض الوثائق
            </Button>
            <Link href="/cart">
              <Button variant="outline" size="lg" className="border-accent text-accent hover:bg-accent/10">
                <ShoppingCart className="w-5 h-5 ml-2" />
                سلة التسوق
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Configuration Warning */}
        <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-500">⚠️</span>
            <h3 className="text-lg font-semibold text-yellow-500">تكوين المتجر مطلوب</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            يستخدم هذا التطبيق بيانات تجريبية. لاختبار وظائف السلة الحقيقية، يرجى:
          </p>
          <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
            <li>إنشاء حساب في <a href="https://salla.partners" target="_blank" className="text-blue-400 hover:underline">بوابة شركاء سلة</a></li>
            <li>إنشاء تطبيق ومتجر تجريبي</li>
            <li>تحديث ملف <code className="bg-gray-800 px-1 rounded">.env.local</code> ببيانات المتجر الحقيقية</li>
            <li>مراجعة <code className="bg-gray-800 px-1 rounded">SALLA_SDK_SETUP_GUIDE.md</code> للتعليمات التفصيلية</li>
          </ol>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <AnimatedCard delay={0.1}>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-primary">تكامل سلة</h3>
              <p className="text-foreground/70">ربط سلس مع منصة سلة للتجارة الإلكترونية</p>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.2}>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-accent">إدارة المنتجات</h3>
              <p className="text-foreground/70">إدارة شاملة للمنتجات والمخزون</p>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.3}>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-secondary">نظام الطلبات</h3>
              <p className="text-foreground/70">معالجة متقدمة للطلبات والمدفوعات</p>
            </div>
          </AnimatedCard>
        </div>

        {/* Salla Products Section */}
        <AnimatedCard delay={0.4} className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-8"
          >
            <h3 className="text-3xl font-bold mb-4 text-primary">منتجات سلة</h3>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              استعرض مجموعة منتجاتنا المتنوعة المحملة مباشرة من منصة سلة
            </p>
          </motion.div>
          
          <ProductsGrid maxProducts={8} showLoadMore={false} />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-8"
          >
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              عرض جميع المنتجات
            </Button>
          </motion.div>
        </AnimatedCard>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div>
            <motion.div
              className="text-4xl font-bold text-primary mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: "spring" }}
            >
              100+
            </motion.div>
            <p className="text-foreground/70">متجر متصل</p>
          </div>
          <div>
            <motion.div
              className="text-4xl font-bold text-accent mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.1, type: "spring" }}
            >
              50K+
            </motion.div>
            <p className="text-foreground/70">منتج</p>
          </div>
          <div>
            <motion.div
              className="text-4xl font-bold text-secondary mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: "spring" }}
            >
              99.9%
            </motion.div>
            <p className="text-foreground/70">وقت التشغيل</p>
          </div>
          <div>
            <motion.div
              className="text-4xl font-bold text-primary mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.3, type: "spring" }}
            >
              24/7
            </motion.div>
            <p className="text-foreground/70">الدعم</p>
          </div>
        </motion.div>
      </section>

      {/* Floating Dock */}
      <FloatingDock items={dockItems} />
    </div>
  );
}
