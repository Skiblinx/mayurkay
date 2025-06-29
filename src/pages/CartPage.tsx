
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCartStore();
  const navigate = useNavigate();

  const total = getTotalPrice();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 sm:w-24 sm:h-24 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 sm:w-20 sm:h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{item.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">₦{item.price.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:items-end sm:space-y-3">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="border-gray-300 dark:border-gray-600 h-8 w-8 p-0"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-lg font-medium w-8 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="border-gray-300 dark:border-gray-600 h-8 w-8 p-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-900 dark:text-white">
                  <span>Subtotal ({items.length} items):</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300 text-sm">
                  <span>Delivery:</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                    <span>Total:</span>
                    <span>₦{total.toLocaleString()}+</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleCheckout}
                className="w-full mb-4"
                size="lg"
              >
                Proceed to Checkout
              </Button>

              <div className="text-center">
                <Link to="/" className="text-primary hover:text-primary/80 text-sm">
                  Continue Shopping
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
