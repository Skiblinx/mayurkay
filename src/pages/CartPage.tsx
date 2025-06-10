
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const total = getTotalPrice();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <ShoppingCart className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="text-lg font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${(total * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>${(total * 1.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleCheckout}
                className="w-full"
                size="lg"
              >
                {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
              </Button>

              <div className="mt-4 text-center">
                <Link to="/" className="text-primary hover:text-primary/80">
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
