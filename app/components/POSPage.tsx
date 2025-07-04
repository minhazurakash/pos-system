"use client"

import { useState } from "react"
import { Input, Card, Button, Row, Col, InputNumber, Divider, Modal, Radio, Space, Badge, Select, Form } from "antd"
import {
  FiSearch,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiGrid,
  FiList,
  FiShoppingCart,
  FiPercent,
  FiDollarSign,
  FiTag,
  FiCheck,
} from "react-icons/fi"
import Swal from "sweetalert2"

const { Option } = Select

interface Product {
  id: string
  name: string
  price: number
  stock: number
  image: string
  barcode: string
  category: string
  description?: string
}

interface CartItem extends Product {
  quantity: number
}

interface DiscountDetails {
  type: "percentage" | "amount"
  value: number
  reason: string
  appliedBy: string
}

export default function POSPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentModalVisible, setPaymentModalVisible] = useState(false)
  const [discountModalVisible, setDiscountModalVisible] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [discount, setDiscount] = useState<DiscountDetails>({
    type: "percentage",
    value: 0,
    reason: "",
    appliedBy: "John Doe",
  })
  const [amountReceived, setAmountReceived] = useState(0)
  const [discountForm] = Form.useForm()

  const products: Product[] = [
    {
      id: "1",
      name: "iPhone 14 Pro Max 256GB Space Black",
      price: 999,
      stock: 15,
      image: "/placeholder.svg?height=300&width=300",
      barcode: "123456789",
      category: "Electronics",
      description: "Latest iPhone with A16 Bionic chip and ProRAW camera",
    },
    {
      id: "2",
      name: "Samsung Galaxy S23 Ultra 512GB Phantom Black",
      price: 899,
      stock: 8,
      image: "/placeholder.svg?height=300&width=300",
      barcode: "987654321",
      category: "Electronics",
      description: "Premium Android smartphone with S Pen and 200MP camera",
    },
    {
      id: "3",
      name: "MacBook Air M2 13-inch 8GB RAM 256GB SSD",
      price: 1299,
      stock: 5,
      image: "/placeholder.svg?height=300&width=300",
      barcode: "456789123",
      category: "Electronics",
      description: "Lightweight laptop with M2 chip and all-day battery life",
    },
    {
      id: "4",
      name: "iPad Pro 12.9-inch WiFi 128GB Space Gray",
      price: 799,
      stock: 12,
      image: "/placeholder.svg?height=300&width=300",
      barcode: "789123456",
      category: "Electronics",
      description: "Professional tablet with M2 chip for creative work",
    },
    {
      id: "5",
      name: "AirPods Pro 2nd Generation with MagSafe Case",
      price: 249,
      stock: 25,
      image: "/placeholder.svg?height=300&width=300",
      barcode: "321654987",
      category: "Accessories",
      description: "Wireless earbuds with active noise cancellation",
    },
    {
      id: "6",
      name: "Apple Watch Series 8 GPS 45mm Midnight Aluminum",
      price: 399,
      stock: 18,
      image: "/placeholder.svg?height=300&width=300",
      barcode: "654987321",
      category: "Accessories",
      description: "Advanced health and fitness tracking smartwatch",
    },
  ]

  const filteredProducts = products.filter(
    (product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.barcode.includes(searchTerm),
  )

  const isProductInCart = (productId: string) => {
    return cart.some((item) => item.id === productId)
  }

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const removeFromCart = (id: string) => {
    Swal.fire({
      title: "Remove Item?",
      text: "Are you sure you want to remove this item from cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setCart(cart.filter((item) => item.id !== id))
      }
    })
  }

  const clearCart = () => {
    Swal.fire({
      title: "Clear Cart?",
      text: "Are you sure you want to clear all items from cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, clear it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setCart([])
        setDiscount({ type: "percentage", value: 0, reason: "", appliedBy: "John Doe" })
      }
    })
  }

  const handleDiscountSubmit = (values: any) => {
    setDiscount({
      type: values.type,
      value: values.value || 0,
      reason: values.reason || "",
      appliedBy: "John Doe",
    })
    setDiscountModalVisible(false)
    discountForm.resetFields()
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = discount.type === "percentage" ? (subtotal * discount.value) / 100 : discount.value
  const afterDiscount = Math.max(0, subtotal - discountAmount)
  const tax = afterDiscount * 0.1
  const total = afterDiscount + tax
  const changeAmount = amountReceived - total

  const handleCheckout = () => {
    setAmountReceived(total)
    setPaymentModalVisible(true)
  }

  const processPayment = () => {
    if (paymentMethod === "cash" && amountReceived < total) {
      Swal.fire("Insufficient Amount", "Please enter the correct amount received", "error")
      return
    }

    Swal.fire({
      title: "Process Payment?",
      html: `
        <div class="text-left">
          <p><strong>Total:</strong> $${total.toFixed(2)}</p>
          ${paymentMethod === "cash" ? `<p><strong>Received:</strong> $${amountReceived.toFixed(2)}</p>` : ""}
          ${paymentMethod === "cash" && changeAmount > 0 ? `<p><strong>Change:</strong> $${changeAmount.toFixed(2)}</p>` : ""}
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Process & Print",
    }).then((result) => {
      if (result.isConfirmed) {
        setPaymentModalVisible(false)
        setCart([])
        setDiscount({ type: "percentage", value: 0, reason: "", appliedBy: "John Doe" })
        setAmountReceived(0)
        Swal.fire("Success!", "Payment processed successfully!", "success")
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-6">
      <Row gutter={[16, 16]} className="h-full">
        {/* Left Section - Products */}
        <Col xs={24} lg={16}>
          <Card className="h-full shadow-xl border-0 rounded-2xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 -m-6 mb-6 p-4 sm:p-6 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">Product Catalog</h2>
                  <p className="text-blue-100 text-sm sm:text-base">Select products to add to cart</p>
                </div>
                <div className="flex space-x-2 sm:space-x-3">
                  <Button
                    type={viewMode === "grid" ? "primary" : "default"}
                    icon={<FiGrid />}
                    onClick={() => setViewMode("grid")}
                    size="large"
                    className={`${viewMode === "grid" ? "bg-white text-blue-600 border-white hover:bg-gray-100" : "bg-blue-500 text-white border-blue-500 hover:bg-blue-400"}`}
                  >
                    <span className="hidden sm:inline">Grid</span>
                  </Button>
                  <Button
                    type={viewMode === "list" ? "primary" : "default"}
                    icon={<FiList />}
                    onClick={() => setViewMode("list")}
                    size="large"
                    className={`${viewMode === "list" ? "bg-white text-blue-600 border-white hover:bg-gray-100" : "bg-blue-500 text-white border-blue-500 hover:bg-blue-400"}`}
                  >
                    <span className="hidden sm:inline">List</span>
                  </Button>
                </div>
              </div>

              <div className="mt-4">
                <Input
                  placeholder="Search products by name or scan barcode..."
                  prefix={<FiSearch className="text-gray-400" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="large"
                  className="shadow-lg"
                />
              </div>
            </div>

            {/* Products Grid/List */}
            <div className="overflow-y-auto" style={{ height: "calc(100vh - 320px)" }}>
              <Row gutter={[12, 12]} className="sm:gutter-[20, 20]">
                {filteredProducts.map((product) => {
                  const inCart = isProductInCart(product.id)
                  return (
                    <Col key={product.id} xs={12} sm={8} md={viewMode === "grid" ? 8 : 24}>
                      <Card
                        hoverable
                        className={`product-card shadow-lg border-0 rounded-xl transition-all duration-300 hover:shadow-2xl cursor-pointer overflow-hidden ${
                          inCart ? "ring-2 ring-green-500 bg-green-50" : ""
                        }`}
                        style={{ height: viewMode === "grid" ? "auto" : "auto" }}
                        cover={
                          viewMode === "grid" ? (
                            <div className="relative h-32 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                              <img
                                alt={product.name}
                                src={product.image || "/placeholder.svg"}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                              />
                              <div className="absolute top-2 right-2">
                                <Badge
                                  count={product.stock}
                                  style={{
                                    backgroundColor:
                                      product.stock > 10 ? "#10b981" : product.stock > 5 ? "#f59e0b" : "#ef4444",
                                    fontSize: "10px",
                                    fontWeight: "600",
                                  }}
                                />
                              </div>
                              <div className="absolute top-2 left-2">
                                <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                                  {product.category}
                                </div>
                              </div>
                              {inCart && (
                                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <FiCheck className="text-white text-sm" />
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : null
                        }
                        onClick={() => addToCart(product)}
                      >
                        <div className={viewMode === "list" ? "flex items-start space-x-3" : "flex flex-col"}>
                          {viewMode === "list" && (
                            <div className="relative flex-shrink-0">
                              <img
                                alt={product.name}
                                src={product.image || "/placeholder.svg"}
                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-md"
                              />
                              <div className="absolute -top-1 -right-1">
                                <Badge
                                  count={product.stock}
                                  style={{
                                    backgroundColor:
                                      product.stock > 10 ? "#10b981" : product.stock > 5 ? "#f59e0b" : "#ef4444",
                                  }}
                                />
                              </div>
                              {inCart && (
                                <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <FiCheck className="text-white text-xs" />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex-1 flex flex-col">
                            {/* Product Title - Always at Top */}
                            <div className="mb-2">
                              <h3 className="font-bold text-sm sm:text-base text-gray-900 leading-tight line-clamp-2 mb-1">
                                {product.name}
                              </h3>

                              {viewMode === "list" && (
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                    {product.category}
                                  </span>
                                  <span className="text-gray-500 text-xs">SKU: {product.barcode}</span>
                                </div>
                              )}

                              {product.description && (
                                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-2">
                                  {product.description}
                                </p>
                              )}
                            </div>

                            {/* Price and Stock Info */}
                            <div className="mt-auto">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <div className="text-lg sm:text-xl font-bold text-green-600">${product.price}</div>
                                  {viewMode === "grid" && (
                                    <div className="text-xs text-gray-500">SKU: {product.barcode}</div>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div
                                    className={`text-xs sm:text-sm font-semibold ${
                                      product.stock > 10
                                        ? "text-green-600"
                                        : product.stock > 5
                                          ? "text-yellow-600"
                                          : "text-red-600"
                                    }`}
                                  >
                                    {product.stock} in stock
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {product.stock > 10 ? "In Stock" : product.stock > 5 ? "Low Stock" : "Very Low"}
                                  </div>
                                </div>
                              </div>

                              {/* Add to Cart Button */}
                              <Button
                                type="primary"
                                icon={inCart ? <FiCheck /> : <FiPlus />}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  addToCart(product)
                                }}
                                className={`w-full border-0 shadow-lg font-semibold text-xs sm:text-sm ${
                                  inCart
                                    ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                }`}
                                size="large"
                              >
                                {inCart ? "Added to Cart" : "Add to Cart"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  )
                })}
              </Row>
            </div>
          </Card>
        </Col>

        {/* Right Section - Cart */}
        <Col xs={24} lg={8}>
          <Card className="h-full shadow-xl border-0 rounded-2xl overflow-hidden">
            {/* Cart Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 -m-6 mb-6 p-4 sm:p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <FiShoppingCart className="text-xl sm:text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold">Shopping Cart</h2>
                    <p className="text-green-100 text-sm">{cart.length} items selected</p>
                  </div>
                </div>
                {cart.length > 0 && (
                  <Button
                    type="text"
                    danger
                    icon={<FiTrash2 />}
                    onClick={clearCart}
                    className="text-white hover:bg-white/20 border-white/30 text-xs sm:text-sm"
                    size="small"
                  >
                    <span className="hidden sm:inline">Clear</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Cart Items */}
            <div className="overflow-y-auto mb-6" style={{ height: "300px" }}>
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 py-12 sm:py-16">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiShoppingCart className="text-2xl sm:text-3xl text-gray-400" />
                  </div>
                  <p className="text-lg sm:text-xl font-medium mb-2">Cart is empty</p>
                  <p className="text-sm text-gray-400">Click on products to add them to cart</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 sm:p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      {/* Title at Top */}
                      <div className="mb-3">
                        <h4 className="font-bold text-sm sm:text-base text-gray-900 leading-tight line-clamp-2">
                          {item.name}
                        </h4>
                      </div>

                      {/* Product Details */}
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg shadow-md flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-base sm:text-lg font-bold text-green-600">${item.price}</span>
                            <span className="text-xs sm:text-sm text-gray-500">
                              Total: ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">SKU: {item.barcode}</div>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                          <Button
                            size="small"
                            icon={<FiMinus />}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center p-0"
                          />
                          <InputNumber
                            size="small"
                            min={1}
                            value={item.quantity}
                            onChange={(value) => updateQuantity(item.id, value || 1)}
                            className="w-12 sm:w-16 text-center"
                          />
                          <Button
                            size="small"
                            icon={<FiPlus />}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center p-0"
                          />
                        </div>
                        <Button
                          size="small"
                          type="text"
                          danger
                          icon={<FiTrash2 />}
                          onClick={() => removeFromCart(item.id)}
                          className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center p-0"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Discount Section */}
            {cart.length > 0 && (
              <div className="mb-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold flex items-center text-blue-800 text-sm sm:text-base">
                    <FiTag className="mr-2" />
                    Discount Applied
                  </span>
                  <Button
                    type="link"
                    icon={<FiPercent />}
                    onClick={() => setDiscountModalVisible(true)}
                    className="p-0 h-auto text-blue-600 hover:text-blue-800 text-xs sm:text-sm"
                  >
                    {discount.value > 0 ? "Modify" : "Add Discount"}
                  </Button>
                </div>
                {discount.value > 0 ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">Type:</span>
                      <span className="font-semibold text-blue-800">
                        {discount.type === "percentage" ? `${discount.value}%` : `$${discount.value}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">Amount:</span>
                      <span className="font-semibold text-red-600">-${discountAmount.toFixed(2)}</span>
                    </div>
                    {discount.reason && (
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700">Reason:</span>
                        <span className="font-medium text-xs text-blue-800">{discount.reason}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    type="dashed"
                    block
                    icon={<FiPlus />}
                    onClick={() => setDiscountModalVisible(true)}
                    className="border-blue-300 text-blue-600 hover:border-blue-400 hover:text-blue-700 text-sm"
                  >
                    Add Discount
                  </Button>
                )}
              </div>
            )}

            {/* Summary */}
            <div className="border-t border-gray-200 pt-4 sm:pt-6">
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between text-sm sm:text-lg">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-red-600 text-sm sm:text-base">
                    <span>Discount:</span>
                    <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                  <span>Tax (10%):</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <Divider className="my-2 sm:my-3" />
                <div className="flex justify-between text-xl sm:text-2xl font-bold">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-green-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <Row gutter={8}>
                  <Col span={12}>
                    <Button block size="large" className="font-semibold text-xs sm:text-sm">
                      Hold Order
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button block size="large" onClick={clearCart} className="font-semibold text-xs sm:text-sm">
                      Cancel
                    </Button>
                  </Col>
                </Row>
                <Button
                  type="primary"
                  size="large"
                  block
                  disabled={cart.length === 0}
                  onClick={handleCheckout}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-0 shadow-lg font-bold text-sm sm:text-lg h-12 sm:h-14"
                >
                  <FiDollarSign className="mr-2 text-lg sm:text-xl" />
                  <span className="hidden sm:inline">Checkout & Print Receipt</span>
                  <span className="sm:hidden">Checkout</span>
                </Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Discount Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-3 pb-4 border-b">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FiPercent className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Apply Discount</h3>
              <p className="text-gray-500 text-sm">Configure discount for this transaction</p>
            </div>
          </div>
        }
        open={discountModalVisible}
        onCancel={() => {
          setDiscountModalVisible(false)
          discountForm.resetFields()
        }}
        footer={null}
        width={500}
        className="discount-modal"
      >
        <Form
          form={discountForm}
          layout="vertical"
          onFinish={handleDiscountSubmit}
          initialValues={discount}
          className="mt-6"
        >
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <h4 className="font-semibold mb-2">Current Subtotal</h4>
              <p className="text-2xl font-bold text-blue-600">${subtotal.toFixed(2)}</p>
            </div>
          </div>

          <Form.Item name="type" label="Discount Type" rules={[{ required: true }]}>
            <Radio.Group className="w-full">
              <Space direction="vertical" className="w-full">
                <Radio value="percentage" className="w-full p-3 border rounded-lg">
                  <div className="flex items-center justify-between w-full">
                    <span>📊 Percentage Discount</span>
                    <span className="text-gray-500">%</span>
                  </div>
                </Radio>
                <Radio value="amount" className="w-full p-3 border rounded-lg">
                  <div className="flex items-center justify-between w-full">
                    <span>💰 Fixed Amount Discount</span>
                    <span className="text-gray-500">$</span>
                  </div>
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="value"
            label="Discount Value"
            rules={[
              { required: true, message: "Please enter discount value" },
              { type: "number", min: 0, message: "Value must be positive" },
            ]}
          >
            <InputNumber
              className="w-full"
              size="large"
              min={0}
              max={discount.type === "percentage" ? 100 : subtotal}
              step={discount.type === "percentage" ? 1 : 0.01}
              prefix={discount.type === "percentage" ? "%" : "$"}
              placeholder={`Enter ${discount.type === "percentage" ? "percentage" : "amount"}`}
            />
          </Form.Item>

          <Form.Item name="reason" label="Discount Reason">
            <Select placeholder="Select reason for discount" size="large" allowClear>
              <Option value="customer-loyalty">🎯 Customer Loyalty</Option>
              <Option value="bulk-purchase">📦 Bulk Purchase</Option>
              <Option value="promotional">🎉 Promotional Offer</Option>
              <Option value="price-match">🏷️ Price Match</Option>
              <Option value="employee-discount">👥 Employee Discount</Option>
              <Option value="damaged-item">⚠️ Damaged Item</Option>
              <Option value="manager-approval">👨‍💼 Manager Approval</Option>
              <Option value="other">📝 Other</Option>
            </Select>
          </Form.Item>

          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex justify-between items-center">
              <span className="font-medium">Preview Discount:</span>
              <span className="text-lg font-bold text-green-600">-${discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-gray-600">New Total:</span>
              <span className="font-bold text-green-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button size="large" onClick={() => setDiscountModalVisible(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
            >
              Apply Discount
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Payment Modal */}
      <Modal
        title={
          <div className="text-center pb-4">
            <h3 className="text-2xl font-bold">Payment Processing</h3>
            <p className="text-gray-500">Complete the transaction</p>
          </div>
        }
        open={paymentModalVisible}
        onCancel={() => setPaymentModalVisible(false)}
        footer={[
          <Button key="cancel" size="large" onClick={() => setPaymentModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="process"
            type="primary"
            size="large"
            onClick={processPayment}
            className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
          >
            Process Payment
          </Button>,
        ]}
        width={500}
      >
        <div className="py-4">
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Total Amount</h3>
              <p className="text-4xl font-bold text-green-600">${total.toFixed(2)}</p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold mb-3">Payment Method</h4>
            <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full">
              <Space direction="vertical" className="w-full">
                <Radio value="cash" className="w-full p-3 border rounded-lg">
                  💵 Cash Payment
                </Radio>
                <Radio value="card" className="w-full p-3 border rounded-lg">
                  💳 Card Payment
                </Radio>
                <Radio value="mobile" className="w-full p-3 border rounded-lg">
                  📱 Mobile Wallet
                </Radio>
                <Radio value="split" className="w-full p-3 border rounded-lg">
                  🔄 Split Payment
                </Radio>
              </Space>
            </Radio.Group>
          </div>

          {paymentMethod === "cash" && (
            <div className="mb-4">
              <h4 className="font-semibold mb-3">Amount Received</h4>
              <InputNumber
                value={amountReceived}
                onChange={(value) => setAmountReceived(value || 0)}
                min={0}
                step={0.01}
                prefix="$"
                size="large"
                className="w-full"
                placeholder="Enter amount received"
              />
              {changeAmount > 0 && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Change to give:</span>
                    <span className="text-xl font-bold text-green-600">${changeAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
