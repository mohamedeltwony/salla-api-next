import { NextRequest, NextResponse } from 'next/server';
import { sallaApi } from '@/services/salla-api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: 'معرف المنتج غير صحيح' },
        { status: 400 }
      );
    }

    console.log(`🔍 Fetching product with ID: ${productId}`);
    
    const response = await sallaApi.getProduct(productId);
    
    if (!response.success) {
      console.error('❌ Failed to fetch product:', response);
      return NextResponse.json(
        { success: false, error: 'فشل في تحميل المنتج من سلة' },
        { status: 500 }
      );
    }

    console.log('✅ Product fetched successfully:', response.data.name);
    
    return NextResponse.json({
      success: true,
      data: response.data
    });
    
  } catch (error) {
    console.error('❌ Error in /api/products/[id]:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        return NextResponse.json(
          { success: false, error: 'المنتج غير موجود' },
          { status: 404 }
        );
      }
      
      if (error.message.includes('Authentication failed')) {
        return NextResponse.json(
          { success: false, error: 'فشل في المصادقة. يرجى إعادة تسجيل الدخول.' },
          { status: 401 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى.' 
      },
      { status: 500 }
    );
  }
}