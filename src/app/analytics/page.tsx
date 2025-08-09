'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const statusColors: Record<string, string> = {
  'مكتمل': 'bg-green-100 text-green-800',
  'قيد التنفيذ': 'bg-blue-100 text-blue-800',
  'ملغي': 'bg-red-100 text-red-800',
  'مرتجع': 'bg-yellow-100 text-yellow-800',
  'معلق': 'bg-gray-100 text-gray-800',
};

export default function AnalyticsPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    loadCSVData();
  }, []);

  const loadCSVData = async () => {
    try {
      const response = await fetch('/api/analytics/data');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Failed to load CSV data');
      }
    } catch (error) {
      console.error('Error loading CSV data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.orderNumber.includes(searchTerm) ||
                           order.phoneNumber.includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
      const matchesCity = cityFilter === 'all' || order.city === cityFilter;
      return matchesSearch && matchesStatus && matchesCity;
    });
  }, [orders, searchTerm, statusFilter, cityFilter]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalOrder, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalShipping = orders.reduce((sum, order) => sum + order.shippingCost, 0);
    const totalTax = orders.reduce((sum, order) => sum + order.tax, 0);
    const totalDiscount = orders.reduce((sum, order) => sum + order.discount, 0);

    // Status distribution
    const statusDistribution = orders.reduce((acc, order) => {
      acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Payment method distribution
    const paymentDistribution = orders.reduce((acc, order) => {
      acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // City distribution (top 10)
    const cityDistribution = orders.reduce((acc, order) => {
      acc[order.city] = (acc[order.city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCities = Object.entries(cityDistribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([city, count]) => ({ city, count }));

    // Monthly revenue trend
    const monthlyRevenue = orders.reduce((acc, order) => {
      const month = new Date(order.orderDate).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' });
      acc[month] = (acc[month] || 0) + order.totalOrder;
      return acc;
    }, {} as Record<string, number>);

    const revenueChart = Object.entries(monthlyRevenue)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      totalShipping,
      totalTax,
      totalDiscount,
      statusDistribution: Object.entries(statusDistribution).map(([status, count]) => ({ status, count })),
      paymentDistribution: Object.entries(paymentDistribution).map(([method, count]) => ({ method, count })),
      topCities,
      revenueChart
    };
  }, [orders]);

  const uniqueStatuses = [...new Set(orders.map(order => order.orderStatus))];
  const uniqueCities = [...new Set(orders.map(order => order.city))].sort();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">جاري تحميل البيانات...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">لوحة تحليل الطلبات</h1>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {orders.length.toLocaleString('ar-SA')} طلب
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalRevenue.toLocaleString('ar-SA')} ر.س</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عدد الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalOrders.toLocaleString('ar-SA')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط قيمة الطلب</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageOrderValue.toFixed(2)} ر.س</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الخصومات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalDiscount.toLocaleString('ar-SA')} ر.س</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع حالات الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: { payload?: { status?: string; percent?: number } }) => {
                    const { status, percent } = props.payload || {};
                    return `${status || ''} (${((percent || 0) * 100).toFixed(0)}%)`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>طرق الدفع</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.paymentDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="method" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Cities */}
        <Card>
          <CardHeader>
            <CardTitle>أكثر المدن طلباً</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.topCities}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="city" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>اتجاه الإيرادات الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.revenueChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>جدول الطلبات</CardTitle>
          <CardDescription>يمكنك البحث والتصفية حسب الحالة والمدينة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <Input
              placeholder="البحث بالاسم أو رقم الطلب أو الهاتف..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="md:w-1/3"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="md:w-1/4">
                <SelectValue placeholder="حالة الطلب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                {uniqueStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="md:w-1/4">
                <SelectValue placeholder="المدينة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المدن</SelectItem>
                {uniqueCities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الطلب</TableHead>
                  <TableHead>اسم العميل</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>المدينة</TableHead>
                  <TableHead>طريقة الدفع</TableHead>
                  <TableHead>إجمالي الطلب</TableHead>
                  <TableHead>تاريخ الطلب</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow key={order.orderNumber}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.orderStatus] || 'bg-gray-100 text-gray-800'}>
                        {order.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.city}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell>{order.totalOrder.toLocaleString('ar-SA')} ر.س</TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString('ar-SA')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              عرض {((currentPage - 1) * itemsPerPage) + 1} إلى {Math.min(currentPage * itemsPerPage, filteredOrders.length)} من {filteredOrders.length} طلب
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                السابق
              </Button>
              <span className="flex items-center px-3 text-sm">
                {currentPage} من {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                التالي
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}