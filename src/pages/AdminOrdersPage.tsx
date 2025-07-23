import { useState } from 'react';
import { useAdminOrders, useUpdateOrderStatus } from '@/hooks/useApiData';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Eye, 
  Search, 
  Filter, 
  Package, 
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const AdminOrdersPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', note: '' });
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  
  const { data: ordersData, isLoading, error } = useAdminOrders({
    page,
    limit: 20,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: search || undefined,
  });
  
  const { mutate: updateOrderStatus, isPending: isUpdating } = useUpdateOrderStatus();
  const { isAdmin, loading } = useAdminAuth();

  const handleStatusUpdate = () => {
    if (!selectedOrder || !statusUpdate.status) return;
    
    updateOrderStatus({
      id: selectedOrder._id,
      status: statusUpdate.status,
      note: statusUpdate.note || undefined,
    }, {
      onSuccess: () => {
        toast.success('Order status updated successfully');
        setIsStatusDialogOpen(false);
        setStatusUpdate({ status: '', note: '' });
        setSelectedOrder(null);
      },
      onError: (error: any) => {
        toast.error(`Failed to update order status: ${error.message}`);
      },
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600' },
      confirmed: { variant: 'default' as const, icon: CheckCircle, color: 'text-blue-600' },
      processing: { variant: 'default' as const, icon: Package, color: 'text-purple-600' },
      shipped: { variant: 'default' as const, icon: Truck, color: 'text-green-600' },
      delivered: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-700' },
      cancelled: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
      refunded: { variant: 'outline' as const, icon: AlertCircle, color: 'text-orange-600' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="capitalize">
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100); // Assuming prices are stored in cents
  };

  if (loading || isLoading) {
    return (
      <AdminLayout title="Orders">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Orders">
        <div className="text-center py-8">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load orders. Please try again.</p>
        </div>
      </AdminLayout>
    );
  }

  const orders = ordersData?.orders || [];
  const totalPages = Math.ceil((ordersData?.total || 0) / 20);

  return (
    <AdminLayout title="Orders Management">
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Orders</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by order number, email, or customer name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <Label htmlFor="status">Status Filter</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Orders ({ordersData?.total || 0})</CardTitle>
                <CardDescription>
                  Manage customer orders and track their status
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No orders found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order: any) => (
                        <TableRow key={order._id}>
                          <TableCell className="font-medium">
                            {order.orderNumber || order._id.slice(-8)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.userName}</div>
                              <div className="text-sm text-gray-500">{order.userEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell>{order.items?.length || 0} items</TableCell>
                          <TableCell className="font-medium">
                            {formatPrice(order.totalAmount)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(order.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Order Details</DialogTitle>
                                    <DialogDescription>
                                      Order #{order.orderNumber || order._id.slice(-8)}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-semibold">Customer Information</h4>
                                        <p>{order.userName}</p>
                                        <p className="text-sm text-gray-600">{order.userEmail}</p>
                                        {order.userPhone && (
                                          <p className="text-sm text-gray-600">{order.userPhone}</p>
                                        )}
                                      </div>
                                      <div>
                                        <h4 className="font-semibold">Shipping Address</h4>
                                        {order.shippingAddress && (
                                          <div className="text-sm">
                                            <p>{order.shippingAddress.street}</p>
                                            <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                            <p>{order.shippingAddress.zipCode}</p>
                                            <p>{order.shippingAddress.country}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-2">Order Items</h4>
                                      <div className="space-y-2">
                                        {order.items?.map((item: any, index: number) => (
                                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                            <div>
                                              <p className="font-medium">{item.productId?.name || 'Product'}</p>
                                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setStatusUpdate({ status: order.status, note: '' });
                                  setIsStatusDialogOpen(true);
                                }}
                              >
                                Update Status
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="py-2 px-4 text-sm">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Status Update Dialog */}
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Order Status</DialogTitle>
              <DialogDescription>
                Update the status for order #{selectedOrder?.orderNumber || selectedOrder?._id?.slice(-8)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={statusUpdate.status} onValueChange={(value) => setStatusUpdate(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="note">Note (Optional)</Label>
                <Textarea
                  id="note"
                  placeholder="Add a note about this status change..."
                  value={statusUpdate.note}
                  onChange={(e) => setStatusUpdate(prev => ({ ...prev, note: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleStatusUpdate}
                disabled={!statusUpdate.status || isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Update Status'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;