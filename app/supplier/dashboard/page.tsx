"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { SupplierLayout } from "@/components/layouts/supplier-layout"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Clock, Check, Truck, X, Plus, Package, Edit, Trash2 } from "lucide-react"

type Product = {
  id: string
  name: string
  category: string
  price: number
  unit: string
  stock_quantity: number
  description: string
  supplier_id: string
}

type Order = {
  id: string
  created_at: string
  status: string
  vendor_name: string
  vendor_phone: string
  vendor_address: string
  items: {
    product_name: string
    quantity: number
    price: number
  }[]
  total_amount: number
}

const DashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    price: "",
    unit: "",
    stock_quantity: "",
    description: "",
  })

  const router = useRouter()
  const supabase = createClientComponentClient()

  const categories = ["Vegetables", "Spices", "Oil", "Grains", "Dairy", "Meat", "Other"]
  const units = ["kg", "liter", "piece", "packet", "box", "dozen"]

  useEffect(() => {
    checkUser()
    fetchProducts()
    fetchOrders()
  }, [])

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth/login")
      return
    }

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (profile?.role !== "supplier") {
      router.push("/auth/login")
      return
    }

    setUser(profile)
  }

  const fetchProducts = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("supplier_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          profiles!orders_vendor_id_fkey (full_name, phone, address),
          order_items (
            quantity,
            price,
            products (name)
          )
        `)
        .eq("supplier_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      const formattedOrders = data.map((order) => ({
        ...order,
        vendor_name: order.profiles.full_name,
        vendor_phone: order.profiles.phone,
        vendor_address: order.profiles.address,
        items: order.order_items.map((item: any) => ({
          product_name: item.products.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total_amount: order.order_items.reduce((total, item) => total + item.price * item.quantity, 0),
      }))

      setOrders(formattedOrders)
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const productData = {
        ...productForm,
        price: Number.parseFloat(productForm.price),
        stock_quantity: Number.parseInt(productForm.stock_quantity),
        supplier_id: user.id,
      }

      if (editingProduct) {
        const { error } = await supabase.from("products").update(productData).eq("id", editingProduct.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("products").insert(productData)

        if (error) throw error
      }

      setProductForm({
        name: "",
        category: "",
        price: "",
        unit: "",
        stock_quantity: "",
        description: "",
      })
      setEditingProduct(null)
      setShowAddProduct(false)
      fetchProducts()
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Failed to save product. Please try again.")
    }
  }

  const handleEditProduct = (product: Product) => {
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      unit: product.unit,
      stock_quantity: product.stock_quantity.toString(),
      description: product.description,
    })
    setEditingProduct(product)
    setShowAddProduct(true)
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const { error } = await supabase.from("products").delete().eq("id", productId)

      if (error) throw error
      fetchProducts()
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Failed to delete product. Please try again.")
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase.from("orders").update({ status }).eq("id", orderId)

      if (error) throw error
      fetchOrders()
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Failed to update order status. Please try again.")
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
        return <Check className="h-4 w-4" />
      case "dispatched":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <Check className="h-4 w-4" />
      case "cancelled":
        return <X className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <SupplierLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
        </div>
      </SupplierLayout>
    )
  }

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.full_name}</h1>
            <p className="text-gray-600">Manage your products and orders</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{products.length}</p>
              <p className="text-sm text-gray-600">Products</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{orders.filter((o) => o.status === "pending").length}</p>
              <p className="text-sm text-gray-600">Pending Orders</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Product Inventory</CardTitle>
                    <CardDescription>Manage your product listings and stock</CardDescription>
                  </div>
                  <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
                    <DialogTrigger asChild>
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                        <DialogDescription>
                          {editingProduct ? "Update product details" : "Add a new product to your inventory"}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleProductSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Product Name
                          </label>
                          <Input
                            id="name"
                            value={productForm.name}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Category
                          </label>
                          <Select
                            value={productForm.category}
                            onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                              Price (₹)
                            </label>
                            <Input
                              id="price"
                              type="number"
                              step="0.01"
                              value={productForm.price}
                              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                              Unit
                            </label>
                            <Select
                              value={productForm.unit}
                              onValueChange={(value) => setProductForm({ ...productForm, unit: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select unit" />
                              </SelectTrigger>
                              <SelectContent>
                                {units.map((unit) => (
                                  <SelectItem key={unit} value={unit}>
                                    {unit}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                            Stock Quantity
                          </label>
                          <Input
                            id="stock"
                            type="number"
                            value={productForm.stock_quantity}
                            onChange={(e) => setProductForm({ ...productForm, stock_quantity: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <Input
                            id="description"
                            value={productForm.description}
                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            placeholder="Brief description of the product"
                          />
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowAddProduct(false)
                              setEditingProduct(null)
                              setProductForm({
                                name: "",
                                category: "",
                                price: "",
                                unit: "",
                                stock_quantity: "",
                                description: "",
                              })
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                            {editingProduct ? "Update" : "Add"} Product
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
                    <p className="text-gray-600">Add your first product to start selling</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <Card key={product.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{product.name}</CardTitle>
                              <CardDescription>{product.category}</CardDescription>
                            </div>
                            <Badge variant="secondary">{product.unit}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
                              <span className="text-sm text-gray-500">Stock: {product.stock_quantity}</span>
                            </div>

                            {product.description && <p className="text-sm text-gray-600">{product.description}</p>}

                            <div className="flex justify-between items-center">
                              <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)}>
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>View and manage incoming orders from vendors</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600">Orders from vendors will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="border-l-4 border-l-orange-600">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(order.created_at).toLocaleDateString()} at{" "}
                                {new Date(order.created_at).toLocaleTimeString()}
                              </p>
                              <div className="mt-2">
                                <p className="font-medium">{order.vendor_name}</p>
                                <p className="text-sm text-gray-600">{order.vendor_phone}</p>
                                <p className="text-sm text-gray-600">{order.vendor_address}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(order.status)}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1 capitalize">{order.status}</span>
                              </Badge>
                              <p className="text-2xl font-bold text-orange-600 mt-2">
                                ₹{order.total_amount.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <h5 className="font-medium mb-2">Order Items:</h5>
                            <div className="space-y-1">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                                  <span>
                                    {item.product_name} × {item.quantity}
                                  </span>
                                  <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {order.status === "pending" && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, "accepted")}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Accept Order
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateOrderStatus(order.id, "cancelled")}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Decline
                              </Button>
                            </div>
                          )}

                          {order.status === "accepted" && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, "dispatched")}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Truck className="h-4 w-4 mr-1" />
                              Mark as Dispatched
                            </Button>
                          )}

                          {order.status === "dispatched" && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, "delivered")}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Mark as Delivered
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SupplierLayout>
  )
}

export default DashboardPage
