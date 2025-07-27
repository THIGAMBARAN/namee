"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Search, Plus, Minus, Package, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { createSupabaseClient, hasSupabaseConfig } from "@/lib/supabase-client"
import VendorLayout from "@/components/VendorLayout"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

interface Product {
  id: string
  name: string
  category: string
  price: number
  unit: string
  supplier_id: string
  supplier_name: string
  supplier_city: string
  supplier_rating: number
  stock_quantity: number
}

interface CartItem extends Product {
  quantity: number
}

interface Order {
  id: string
  total_amount: number
  status: string
  created_at: string
  supplier_name: string
  items: Array<{
    product_name: string
    quantity: number
    price: number
  }>
}

export default function VendorDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCity, setSelectedCity] = useState("all")
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const router = useRouter()
  const supabase = hasSupabaseConfig() ? createSupabaseClient() : null

  const categories = ["Vegetables", "Spices", "Oil", "Grains", "Dairy", "Meat", "Other"]
  const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Pune", "Hyderabad"]

  // Show configuration error if environment variables are missing
  if (!hasSupabaseConfig()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <h1 className="text-2xl font-bold text-red-600">Configuration Required</h1>
            </div>
            <CardTitle>Supabase Setup Needed</CardTitle>
            <CardDescription>Please configure your Supabase environment variables to continue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Missing Environment Variables</strong>
                <br />
                <br />
                Create a <code className="bg-gray-100 px-1 rounded">.env.local</code> file in your project root with
                your Supabase credentials.
              </AlertDescription>
            </Alert>

            <div className="text-center pt-4">
              <Link href="/" className="text-orange-600 hover:underline">
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  useEffect(() => {
    checkUser()
    fetchProducts()
    fetchOrders()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, selectedCategory, selectedCity])

  const checkUser = async () => {
    if (!supabase) return

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth/login")
      return
    }

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (profile?.role !== "vendor") {
      router.push("/auth/login")
      return
    }

    setUser(profile)
  }

  const fetchProducts = async () => {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          profiles!products_supplier_id_fkey (
            full_name,
            city,
            rating
          )
        `)
        .gt("stock_quantity", 0)

      if (error) throw error

      const formattedProducts = data.map((product) => ({
        ...product,
        supplier_name: product.profiles.full_name,
        supplier_city: product.profiles.city,
        supplier_rating: product.profiles.rating || 4.5,
      }))

      setProducts(formattedProducts)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    if (!supabase) return

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          profiles!orders_supplier_id_fkey (full_name),
          order_items (
            quantity,
            price,
            products (name)
          )
        `)
        .eq("vendor_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      const formattedOrders = data.map((order) => ({
        ...order,
        supplier_name: order.profiles.full_name,
        items: order.order_items.map((item: any) => ({
          product_name: item.products.name,
          quantity: item.quantity,
          price: item.price,
        })),
      }))

      setOrders(formattedOrders)
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  const filterProducts = () => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    if (selectedCity !== "all") {
      filtered = filtered.filter((product) => product.supplier_city === selectedCity)
    }

    setFilteredProducts(filtered)
  }

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.stock_quantity) } : item,
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId)
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
      }
      return prevCart.filter((item) => item.id !== productId)
    })
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const placeOrder = async () => {
    if (cart.length === 0 || !supabase) return

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Group cart items by supplier
      const ordersBySupplier = cart.reduce(
        (acc, item) => {
          if (!acc[item.supplier_id]) {
            acc[item.supplier_id] = []
          }
          acc[item.supplier_id].push(item)
          return acc
        },
        {} as Record<string, CartItem[]>,
      )

      // Create separate orders for each supplier
      for (const [supplierId, items] of Object.entries(ordersBySupplier)) {
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert({
            vendor_id: user.id,
            supplier_id: supplierId,
            total_amount: totalAmount,
            status: "pending",
          })
          .select()
          .single()

        if (orderError) throw orderError

        // Create order items
        const orderItems = items.map((item) => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        }))

        const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

        if (itemsError) throw itemsError
      }

      setCart([])
      fetchOrders()
      alert("Orders placed successfully!")
    } catch (error) {
      console.error("Error placing order:", error)
      alert("Failed to place order. Please try again.")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-blue-100 text-blue-800"
      case "dispatched":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "accepted":
        return <Package className="h-4 w-4" />
      case "dispatched":
        return <Package className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <VendorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
        </div>
      </VendorLayout>
    )
  }

  return (
    <VendorLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.full_name || "Vendor"}</h1>
            <p className="text-gray-600">Find the best suppliers for your raw materials</p>
          </div>
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5 text-orange-600" />
            <span className="font-semibold">{cart.length} items in cart</span>
          </div>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Products</TabsTrigger>
            <TabsTrigger value="cart">Cart ({cart.length})</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Find Raw Materials</CardTitle>
                <CardDescription>Search and filter products from verified suppliers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search products or suppliers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Product List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">
                        Price: {product.price} {product.unit}
                      </span>
                      <Badge>{product.supplier_rating.toFixed(1)}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Supplier: {product.supplier_name}</span>
                      <span className="font-semibold">City: {product.supplier_city}</span>
                    </div>
                    <Button onClick={() => addToCart(product)} className="mt-4">
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cart" className="space-y-6">
            {/* Cart Items */}
            {cart.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cart.map((item) => (
                  <Card key={item.id} className="flex flex-col justify-between">
                    <CardHeader>
                      <CardTitle>{item.name}</CardTitle>
                      <CardDescription>{item.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">
                          Price: {item.price} {item.unit}
                        </span>
                        <Badge>{item.supplier_rating.toFixed(1)}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Supplier: {item.supplier_name}</span>
                        <span className="font-semibold">City: {item.supplier_city}</span>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <Button onClick={() => removeFromCart(item.id)} className="mr-2">
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-semibold">{item.quantity}</span>
                        <Button onClick={() => addToCart(item)} className="ml-2">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600">Your cart is empty.</p>
              </div>
            )}

            {/* Total Amount and Place Order Button */}
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Amount: {getTotalAmount()}</span>
              <Button onClick={placeOrder} className="bg-orange-600 text-white">
                Place Order
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            {/* Orders List */}
            {orders.map((order) => (
              <Card key={order.id} className="flex flex-col justify-between">
                <CardHeader>
                  <CardTitle>Order #{order.id}</CardTitle>
                  <CardDescription>Supplier: {order.supplier_name}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total Amount: {order.total_amount}</span>
                    <div className={`flex items-center space-x-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="font-semibold">
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {order.items.map((item) => (
                      <div key={item.product_name} className="flex items-center justify-between">
                        <span>{item.product_name}</span>
                        <span className="font-semibold">Quantity: {item.quantity}</span>
                        <span className="font-semibold">
                          Price: {item.price} {item.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </VendorLayout>
  )
}
