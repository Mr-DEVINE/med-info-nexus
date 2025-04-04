
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Pill, ShoppingCart, Search, Check, AlertCircle, Package, Smartphone 
} from "lucide-react";
import { toast } from "sonner";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";

// Mock medication data
const medications = [
  { 
    id: 1, 
    name: "Cardiozen", 
    generic: "Amlodipine", 
    category: "Cardiovascular",
    price: 25.99, 
    available: 50, 
    dosage: "10mg",
    description: "For treatment of high blood pressure and coronary artery disease" 
  },
  { 
    id: 2, 
    name: "Respiclear", 
    generic: "Fluticasone", 
    category: "Respiratory",
    price: 34.50, 
    available: 30, 
    dosage: "50mcg",
    description: "Corticosteroid for asthma and allergic rhinitis" 
  },
  { 
    id: 3, 
    name: "Glucobalance", 
    generic: "Metformin", 
    category: "Endocrine",
    price: 18.75, 
    available: 100, 
    dosage: "500mg",
    description: "Oral medication for type 2 diabetes" 
  },
  { 
    id: 4, 
    name: "Neuroease", 
    generic: "Gabapentin", 
    category: "Neurology",
    price: 42.25, 
    available: 25, 
    dosage: "300mg",
    description: "For seizures and neuropathic pain" 
  },
  { 
    id: 5, 
    name: "Antibiomax", 
    generic: "Amoxicillin", 
    category: "Antibiotics",
    price: 15.99, 
    available: 80, 
    dosage: "500mg",
    description: "Broad-spectrum antibiotic" 
  },
  { 
    id: 6, 
    name: "Painrelief Plus", 
    generic: "Ibuprofen", 
    category: "Pain Management",
    price: 9.99, 
    available: 150, 
    dosage: "200mg",
    description: "NSAID for pain and inflammation" 
  },
  { 
    id: 7, 
    name: "Gastroguard", 
    generic: "Omeprazole", 
    category: "Gastrointestinal",
    price: 22.50, 
    available: 60, 
    dosage: "20mg",
    description: "Proton pump inhibitor for acid reflux and ulcers" 
  },
  { 
    id: 8, 
    name: "Antivert", 
    generic: "Loratadine", 
    category: "Allergy",
    price: 12.99, 
    available: 90, 
    dosage: "10mg",
    description: "Non-drowsy antihistamine for allergies" 
  },
];

// Available categories for filtering
const categories = [
  "All",
  "Cardiovascular",
  "Respiratory",
  "Endocrine",
  "Neurology",
  "Antibiotics",
  "Pain Management",
  "Gastrointestinal",
  "Allergy"
];

const Pharmacy = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<Array<{ productId: number, quantity: number }>>([]);
  const [orders, setOrders] = useState<Array<{ products: Array<{id: number, quantity: number}>, total: number, date: Date }>>([]);
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);

  // Redirect if not authenticated or not a patient
  if (!isAuthenticated || role !== "patient") {
    navigate("/");
    return null;
  }

  // Filter medications based on search term and category
  const filteredMedications = medications.filter(med => {
    const matchesSearch = 
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      med.generic.toLowerCase().includes(searchTerm.toLowerCase()) || 
      med.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || med.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const product = medications.find(p => p.id === item.productId);
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
    
    const product = medications.find(p => p.id === productId);
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

  // Simulated prescription upload
  const uploadPrescription = () => {
    setPrescriptionUploaded(true);
    toast.success("Prescription uploaded successfully");
  };

  // Checkout process
  const checkout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    // Check if prescription is needed but not uploaded
    const hasPrescriptionMedication = cart.some(item => {
      const med = medications.find(m => m.id === item.productId);
      // For this demo, let's assume medications in these categories need a prescription
      return med && ["Cardiovascular", "Neurology", "Antibiotics", "Endocrine"].includes(med.category);
    });
    
    if (hasPrescriptionMedication && !prescriptionUploaded) {
      toast.error("Please upload a prescription for prescription medications");
      return;
    }
    
    const newOrder = {
      products: cart.map(item => ({ id: item.productId, quantity: item.quantity })),
      total: calculateTotal(),
      date: new Date()
    };
    
    setOrders([...orders, newOrder]);
    setCart([]);
    setPrescriptionUploaded(false);
    toast.success("Order placed successfully!");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-medicare-blue">Pharmacy</h1>
            <p className="text-gray-600">Purchase prescription and over-the-counter medications</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search medications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMedications.map((medication) => (
                <Card key={medication.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-white p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          <Pill className="text-medicare-blue" size={20} />
                          {medication.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {medication.generic} {medication.dosage}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-medicare-blue">${medication.price.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">{medication.category}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-3">{medication.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="text-sm text-gray-600">
                          <span className={medication.available > 10 ? "text-green-600" : "text-orange-500"}>
                            {medication.available} in stock
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => addToCart(medication.id)}
                        className="bg-medicare-teal hover:bg-teal-600"
                        disabled={medication.available === 0}
                        size="sm"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredMedications.length === 0 && (
                <div className="col-span-2 flex flex-col items-center justify-center p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium">No medications found</h3>
                  <p className="text-muted-foreground mt-1">Try adjusting your search or filter</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Cart</CardTitle>
                <CardDescription>Review your selected medications</CardDescription>
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
                      const product = medications.find(p => p.id === item.productId);
                      if (!product) return null;
                      
                      const needsPrescription = ["Cardiovascular", "Neurology", "Antibiotics", "Endocrine"].includes(product.category);
                      
                      return (
                        <div key={item.productId} className="flex justify-between items-center border-b pb-2">
                          <div>
                            <div className="font-medium flex items-center gap-1">
                              {product.name}
                              {needsPrescription && (
                                <span className="text-xs bg-orange-100 text-orange-700 rounded-full px-2 py-0.5">Rx</span>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">${product.price.toFixed(2)} each</div>
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

                {cart.some(item => {
                  const med = medications.find(m => m.id === item.productId);
                  return med && ["Cardiovascular", "Neurology", "Antibiotics", "Endocrine"].includes(med.category);
                }) && (
                  <div className="mt-4 border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <Label>Prescription Required</Label>
                      {prescriptionUploaded ? (
                        <div className="flex items-center text-green-600 text-sm">
                          <Check size={16} className="mr-1" />
                          Uploaded
                        </div>
                      ) : (
                        <Button size="sm" onClick={uploadPrescription}>
                          Upload
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Some medications in your cart require a valid prescription
                    </p>
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

            <Card>
              <CardHeader>
                <CardTitle>Delivery Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 border rounded-md">
                    <Package className="h-5 w-5 text-medicare-blue mt-0.5" />
                    <div>
                      <div className="font-medium">Home Delivery</div>
                      <p className="text-sm text-muted-foreground">Medications delivered to your doorstep within 24-48 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 border rounded-md">
                    <Smartphone className="h-5 w-5 text-medicare-blue mt-0.5" />
                    <div>
                      <div className="font-medium">Refill Reminders</div>
                      <p className="text-sm text-muted-foreground">Get SMS notifications when it's time to refill your prescription</p>
                    </div>
                  </div>
                </div>
              </CardContent>
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
                            <span className="text-sm font-medium">Order #{orders.length - index}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(order.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-sm font-medium">${order.total.toFixed(2)}</div>
                          <div className="flex items-center gap-2 mt-2 text-xs text-green-600">
                            <Check size={14} />
                            <span>Processing</span>
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

export default Pharmacy;
