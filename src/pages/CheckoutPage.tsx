
import { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { nigerianStates } from '../data/products';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from '../hooks/use-toast';
import { PaymentData } from '../services/paymentService';
import StripeCheckoutForm from '../components/StripeCheckoutForm';

const CheckoutPage = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    fullName: '',
    address: '',
    city: '',
    state: ''
  });

  const subtotal = getTotalPrice();
  const selectedState = nigerianStates.find(state => state.name === formData.state);
  const deliveryFee = selectedState ? selectedState.fee : 0;
  const total = subtotal + deliveryFee;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.mobile || !formData.fullName ||
      !formData.address || !formData.city || !formData.state) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Show Stripe payment form
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Order placed successfully!",
      description: "You will receive a confirmation email shortly.",
    });

    // Clear cart after successful payment
    clearCart();

    // Redirect to success page or home
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    setShowPayment(false); // Allow user to try again
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  // Prepare payment data for Stripe
  const paymentData: PaymentData = {
    amount: total / 100, // Convert from cents to dollars for display
    currency: 'NGN', // Stripe uses USD by default
    customerInfo: formData,
    items: items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price / 100, // Convert from cents to dollars
      quantity: item.quantity
    }))
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Add some items to checkout.</p>
          <Button onClick={() => window.location.href = '/'}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Show payment form if customer info is validated */}
        {showPayment ? (
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <StripeCheckoutForm
                paymentData={paymentData}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />

              {/* Order Summary - Same as before */}
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="space-y-4">
                    <div className="max-h-60 sm:max-h-80 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 mb-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">{item.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                      <div className="flex justify-between text-gray-900 dark:text-white text-sm sm:text-base">
                        <span>Subtotal:</span>
                        <span>₦{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-900 dark:text-white text-sm sm:text-base">
                        <span>Delivery Fee:</span>
                        <span>₦{deliveryFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-2">
                        <span>Total:</span>
                        <span>₦{total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setShowPayment(false)}
                    variant="outline"
                    className="w-full mt-4"
                  >
                    Back to Delivery Info
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <>
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white">Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 6 }, (_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-gray-900 dark:text-white text-sm">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mobile" className="text-gray-900 dark:text-white text-sm">Mobile Number *</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        required
                        value={formData.mobile}
                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                        placeholder="+234 8012345678"
                      />
                    </div>

                    <div>
                      <Label htmlFor="fullName" className="text-gray-900 dark:text-white text-sm">Full Name *</Label>
                      <Input
                        id="fullName"
                        required
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-gray-900 dark:text-white text-sm">Address *</Label>
                      <Input
                        id="address"
                        required
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-gray-900 dark:text-white text-sm">City *</Label>
                        <Input
                          id="city"
                          required
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                          placeholder="Lagos"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-gray-900 dark:text-white text-sm">State *</Label>
                        <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                          <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1">
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 max-h-60">
                            {nigerianStates.map((state) => (
                              <SelectItem key={state.name} value={state.name}>
                                {state.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          💳 Payment will be processed securely after you place your order.
                        </p>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                        size="lg"
                      >
                        {loading ? 'Processing Payment...' : `Place Order - ₦${total.toLocaleString()}`}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="space-y-4">
                  <div className="max-h-60 sm:max-h-80 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 mb-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">{item.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-900 dark:text-white text-sm sm:text-base">
                      <span>Subtotal:</span>
                      <span>₦{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-900 dark:text-white text-sm sm:text-base">
                      <span>Delivery Fee:</span>
                      <span>{deliveryFee > 0 ? `₦${deliveryFee.toLocaleString()}` : 'Select state'}</span>
                    </div>
                    <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-2">
                      <span>Total:</span>
                      <span>₦{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
