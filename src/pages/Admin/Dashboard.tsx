
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../hooks/useAuth';

// Types
interface SalesData {
  date: string;
  revenue: number;
}

interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

interface OrderData {
  id: string;
  customerName: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
  items: number;
}

const Dashboard = () => {
  const { user, loading, isAdmin } = useAuth();
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  
  useEffect(() => {
    // In a real app, this data would come from Supabase
    // This is just mock data for demonstration purposes
    
    // Mock sales data for the last 7 days
    const mockSalesData = [
      { date: '01/05', revenue: 1250.90 },
      { date: '02/05', revenue: 980.50 },
      { date: '03/05', revenue: 1420.30 },
      { date: '04/05', revenue: 1680.75 },
      { date: '05/05', revenue: 1540.20 },
      { date: '06/05', revenue: 2100.40 },
      { date: '07/05', revenue: 1890.15 },
    ];
    
    // Mock top products
    const mockTopProducts = [
      { name: 'Hambúrguer Clássico', quantity: 48, revenue: 1387.20 },
      { name: 'Pizza Margherita', quantity: 36, revenue: 1544.40 },
      { name: 'Refrigerante', quantity: 72, revenue: 432.00 },
      { name: 'Salada Caesar', quantity: 23, revenue: 572.70 },
      { name: 'Pasta Carbonara', quantity: 21, revenue: 766.50 },
    ];
    
    // Mock order data
    const mockOrders = [
      {
        id: 'ORD-001',
        customerName: 'João Silva',
        total: 78.50,
        status: 'completed' as const,
        date: '07/05/2025 - 19:23',
        items: 3
      },
      {
        id: 'ORD-002',
        customerName: 'Maria Santos',
        total: 124.90,
        status: 'completed' as const,
        date: '07/05/2025 - 18:15',
        items: 5
      },
      {
        id: 'ORD-003',
        customerName: 'Pedro Oliveira',
        total: 45.00,
        status: 'completed' as const,
        date: '07/05/2025 - 17:42',
        items: 2
      },
      {
        id: 'ORD-004',
        customerName: 'Ana Costa',
        total: 92.30,
        status: 'pending' as const,
        date: '07/05/2025 - 16:58',
        items: 4
      },
      {
        id: 'ORD-005',
        customerName: 'Lucas Ferreira',
        total: 67.80,
        status: 'cancelled' as const,
        date: '07/05/2025 - 16:30',
        items: 3
      }
    ];
    
    // Calculate total revenue and orders
    const calculatedTotalRevenue = mockSalesData.reduce((sum, day) => sum + day.revenue, 0);
    
    setSalesData(mockSalesData);
    setTopProducts(mockTopProducts);
    setOrders(mockOrders);
    setTotalRevenue(calculatedTotalRevenue);
    setTotalOrders(mockOrders.length);
  }, []);

  // Custom colors for the pie chart
  const COLORS = ['#FF7F2A', '#8B4513', '#F5DEB3', '#A0522D', '#CD853F'];
  
  // Format currency as Brazilian Real
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Check if user is logged in and is an admin
  if (!user || !isAdmin) {
    return <Navigate to="/admin" />;
  }
  
  // Status badge component
  const StatusBadge = ({ status }: { status: 'pending' | 'completed' | 'cancelled' }) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    const statusText = {
      pending: 'Pendente',
      completed: 'Concluído',
      cancelled: 'Cancelado'
    };
    
    return (
      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold">Dashboard</h1>
          <button className="bg-primary text-white px-4 py-2 rounded-md">
            Exportar Relatório
          </button>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-1">Receita Total</h3>
            <p className="text-3xl font-bold">{formatCurrency(totalRevenue)}</p>
            <p className="text-muted-foreground text-sm">Últimos 7 dias</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-1">Pedidos</h3>
            <p className="text-3xl font-bold">{totalOrders}</p>
            <p className="text-muted-foreground text-sm">Últimos 7 dias</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-1">Ticket Médio</h3>
            <p className="text-3xl font-bold">
              {totalOrders > 0 ? formatCurrency(totalRevenue / totalOrders) : 'R$ 0,00'}
            </p>
            <p className="text-muted-foreground text-sm">Por pedido</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-1">Produto Mais Vendido</h3>
            <p className="text-xl font-bold">{topProducts[0]?.name || 'N/A'}</p>
            <p className="text-muted-foreground text-sm">
              {topProducts[0]?.quantity || 0} unidades vendidas
            </p>
          </div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Receita Diária</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis 
                    tickFormatter={(value) => `R$ ${value}`}
                    width={80}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => `Data: ${label}`}
                  />
                  <Bar dataKey="revenue" fill="#FF7F2A" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Top Products Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Top 5 Produtos</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topProducts}
                    dataKey="revenue"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => entry.name}
                    labelLine={false}
                  >
                    {topProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(_, payload) => payload?.[0]?.name || ''}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Pedidos Recentes</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-sm border-b">ID</th>
                  <th className="py-3 px-4 text-left font-semibold text-sm border-b">Cliente</th>
                  <th className="py-3 px-4 text-left font-semibold text-sm border-b">Data</th>
                  <th className="py-3 px-4 text-left font-semibold text-sm border-b">Itens</th>
                  <th className="py-3 px-4 text-left font-semibold text-sm border-b">Total</th>
                  <th className="py-3 px-4 text-left font-semibold text-sm border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{order.id}</td>
                    <td className="py-3 px-4 border-b">{order.customerName}</td>
                    <td className="py-3 px-4 border-b">{order.date}</td>
                    <td className="py-3 px-4 border-b">{order.items}</td>
                    <td className="py-3 px-4 border-b">{formatCurrency(order.total)}</td>
                    <td className="py-3 px-4 border-b">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {orders.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum pedido encontrado.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
