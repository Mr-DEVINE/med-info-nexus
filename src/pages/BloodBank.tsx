
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, User, ShoppingCart, Check, AlertCircle, Search } from "lucide-react";
import { toast } from "sonner";

// Mock blood products data
const bloodProducts = [
  { id: 1, type: "A+", price: 120, available: 15, description: "Fresh whole blood, type A positive" },
  { id: 2, type: "A-", price: 130, available: 8, description: "Fresh whole blood, type A negative" },
  { id: 3, type: "B+", price: 120, available: 12, description: "Fresh whole blood, type B positive" },
  { id: 4, type: "B-", price: 135, available: 6, description: "Fresh whole blood, type B negative" },
  { id: 5, type: "AB+", price: 140, available: 5, description: "Fresh whole blood, type AB positive" },
  { id: 6, type: "AB-", price: 150, available: 3, description: "Fresh whole blood, type AB negative" },
  { id: 7, type: "O+", price: 125, available: 20, description: "Fresh whole blood, type O positive" },
  { id: 8, type: "O-", price: 160, available: 10, description: "Universal donor type O negative" },
  { id: 9, type: "Platelets", price: 200, available: 8, description: "Platelet concentrate, any blood type" },
  { id: 10, type: "Plasma", price: 180, available: 14, description: "Fresh frozen plasma" },
];

const BloodBank = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<Array<{ productId: number, quantity: number }>>([]);
  const [orders, setOrders] = useState<Array<{ products: Array<{id: number, quantity: number}>, total: number, date: Date }>>([]);

  // Redirect if not authenticated or not a patient
  if (!isAuthenticated || role !== "patient") {
    navigate("/");
    return null;
  }

  // Filter products based on search term
  const filteredProducts = bloodProducts.filter(product => 
    product.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const product = bloodProducts.find(p => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  // Add product to cart
  const addToCart = (productId: number) => {
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.productId === productId 
        ? { ...item, quantity: item.quantity + 1 }
        : item
      ));
    } else {
      setCart([...cart, { productId, quantity: 1 }]);
    }
    
    toast.success("Added to cart");
  };

  // Remove product from cart
  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  // Update quantity in cart
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    const product = bloodProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Check if quantity exceeds available stock
    if (quantity > product.available) {
      toast.error(`Only ${product.available} units available`);
      return;
    }
    
    setCart(cart.map(item => 
      item.productId === productId 
      ? { ...item, quantity }
      : item
    ));
  };

  // Checkout process
  const checkout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    const newOrder = {
      products: cart.map(item => ({ id: item.productId, quantity: item.quantity })),
      total: calculateTotal(),
      date: new Date()
    };
    
    setOrders([...orders, newOrder]);
    setCart([]);
    toast.success("Order placed successfully!");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-medicare-blue">Blood Bank</h1>
            <p className="text-gray-600">Purchase blood products for medical needs</p>
          </div>
          <div className="mt-4 md:mt-0 relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search blood products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-red-50 to-white p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          <Heart className="text-red-500" size={20} />
                          {product.type}
                        </CardTitle>
                        <CardDescription className="mt-1">{product.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-medicare-blue">${product.price}</div>
                        <div className="text-xs text-gray-500">per unit</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="text-sm text-gray-600">
                          <span className={product.available > 5 ? "text-green-600" : "text-orange-500"}>
                            {product.available} units available
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => addToCart(product.id)}
                        className="bg-medicare-teal hover:bg-teal-600"
                        disabled={product.available === 0}
                        size="sm"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredProducts.length === 0 && (
                <div className="col-span-2 flex flex-col items-center justify-center p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium">No products found</h3>
                  <p className="text-muted-foreground mt-1">Try adjusting your search terms</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Cart</CardTitle>
                <CardDescription>Review your selected blood products</CardDescription>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    Your cart is empty
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => {
                      const product = bloodProducts.find(p => p.id === item.productId);
                      if (!product) return null;
                      
                      return (
                        <div key={item.productId} className="flex justify-between items-center border-b pb-2">
                          <div>
                            <div className="font-medium">{product.type}</div>
                            <div className="text-sm text-muted-foreground">${product.price} per unit</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" size="icon" 
                              className="h-6 w-6" 
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button 
                              variant="outline" size="icon" 
                              className="h-6 w-6" 
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              disabled={item.quantity >= product.available}
                            >
                              +
                            </Button>
                            <Button 
                              variant="ghost" size="icon" 
                              onClick={() => removeFromCart(item.productId)}
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
              {cart.length > 0 && (
                <CardFooter className="flex-col space-y-4">
                  <div className="flex justify-between w-full">
                    <span className="font-medium">Total</span>
                    <span className="font-bold">${calculateTotal().toFixed(2)}</span>
                  </div>
                  <Button 
                    className="w-full bg-medicare-blue hover:bg-medicare-dark" 
                    onClick={checkout}
                  >
                    Checkout
                  </Button>
                </CardFooter>
              )}
            </Card>

            {orders.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orders.map((order, index) => (
                      <Card key={index} className="bg-gray-50">
                        <CardContent className="p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Order #{index + 1}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(order.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-sm font-medium">${order.total.toFixed(2)}</div>
                          <div className="flex items-center gap-2 mt-2 text-xs text-green-600">
                            <Check size={14} />
                            <span>Completed</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BloodBank;
