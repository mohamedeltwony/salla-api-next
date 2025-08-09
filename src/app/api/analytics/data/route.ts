import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface OrderData {
  orderNumber: string;
  orderStatus: string;
  trackingLink: string;
  cartTotal: number;
  discount: number;
  policyDate: string;
  shippingCost: number;
  paymentMethod: string;
  codFee: number;
  tax: number;
  totalOrder: number;
  orderDate: string;
  lastUpdate: string;
  shippingCompany: string;
  policyNumber: string;
  productNames: string;
  sku: string;
  referenceNumber: string;
  employee: string;
  customerName: string;
  phoneNumber: string;
  city: string;
  country: string;
  customerAddress: string;
  mapLink: string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function parseNumber(value: string): number {
  if (!value || value.trim() === '') return 0;
  // Remove any non-numeric characters except decimal point and minus
  const cleaned = value.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

function parseDate(dateStr: string): string {
  if (!dateStr || dateStr.trim() === '') return new Date().toISOString();
  
  // Try to parse various date formats
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    // If parsing fails, return current date
    return new Date().toISOString();
  }
  return date.toISOString();
}

export async function GET() {
  try {
    const csvPath = path.join(process.cwd(), 'public', '2589daec-f7a5-40d7-92ba-828505b3fe1f.csv');
    const csvContent = await fs.readFile(csvPath, 'utf-8');
    
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    const headers = parseCSVLine(lines[0]);
    
    const orders: OrderData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      
      if (values.length >= headers.length) {
        const order: OrderData = {
          orderNumber: values[0] || '',
          orderStatus: values[1] || '',
          trackingLink: values[2] || '',
          cartTotal: parseNumber(values[3]),
          discount: parseNumber(values[4]),
          policyDate: parseDate(values[5]),
          shippingCost: parseNumber(values[6]),
          paymentMethod: values[7] || '',
          codFee: parseNumber(values[8]),
          tax: parseNumber(values[9]),
          totalOrder: parseNumber(values[10]),
          orderDate: parseDate(values[11]),
          lastUpdate: parseDate(values[12]),
          shippingCompany: values[13] || '',
          policyNumber: values[14] || '',
          productNames: values[15] || '',
          sku: values[16] || '',
          referenceNumber: values[17] || '',
          employee: values[18] || '',
          customerName: values[19] || '',
          phoneNumber: values[20] || '',
          city: values[21] || '',
          country: values[22] || '',
          customerAddress: values[23] || '',
          mapLink: values[24] || '',
        };
        
        orders.push(order);
      }
    }
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error reading CSV file:', error);
    return NextResponse.json(
      { error: 'Failed to load CSV data' },
      { status: 500 }
    );
  }
}