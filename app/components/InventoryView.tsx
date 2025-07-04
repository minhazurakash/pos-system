"use client"

import { useState } from "react"
import { Card, Table, Tag, Alert, Select, Input, Button } from "antd"
import { FiSearch, FiAlertTriangle, FiPackage, FiTrendingDown } from "react-icons/fi"

const { Option } = Select

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  unitPrice: number
  totalValue: number
  lastRestocked: string
  status: "in-stock" | "low-stock" | "out-of-stock"
}

export default function InventoryView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const inventoryData: InventoryItem[] = [
    {
      id: "1",
      name: "iPhone 14 Pro",
      sku: "IPH14PRO",
      category: "Electronics",
      currentStock: 15,
      minStock: 5,
      maxStock: 50,
      unitPrice: 999,
      totalValue: 14985,
      lastRestocked: "2024-01-15",
      status: "in-stock",
    },
    {
      id: "2",
      name: "Samsung Galaxy S23",
      sku: "SGS23",
      category: "Electronics",
      currentStock: 3,
      minStock: 5,
      maxStock: 30,
      unitPrice: 899,
      totalValue: 2697,
      lastRestocked: "2024-01-10",
      status: "low-stock",
    },
    {
      id: "3",
      name: "MacBook Air M2",
      sku: "MBA-M2",
      category: "Electronics",
      currentStock: 0,
      minStock: 3,
      maxStock: 20,
      unitPrice: 1299,
      totalValue: 0,
      lastRestocked: "2024-01-05",
      status: "out-of-stock",
    },
    {
      id: "4",
      name: "AirPods Pro",
      sku: "APP-2",
      category: "Accessories",
      currentStock: 25,
      minStock: 10,
      maxStock: 100,
      unitPrice: 249,
      totalValue: 6225,
      lastRestocked: "2024-01-12",
      status: "in-stock",
    },
  ]

  const filteredData = inventoryData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const lowStockItems = inventoryData.filter((item) => item.status === "low-stock" || item.status === "out-of-stock")
  const totalValue = inventoryData.reduce((sum, item) => sum + item.totalValue, 0)

  const columns = [
    {
      title: "Product",
      key: "product",
      render: (record: InventoryItem) => (
        <div>
          <div className="font-semibold">{record.name}</div>
          <div className="text-sm text-gray-500">SKU: {record.sku}</div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Stock Level",
      key: "stock",
      render: (record: InventoryItem) => (
        <div>
          <div
            className={`font-semibold ${
              record.status === "out-of-stock"
                ? "text-red-600"
                : record.status === "low-stock"
                  ? "text-orange-600"
                  : "text-green-600"
            }`}
          >
            {record.currentStock} units
          </div>
          <div className="text-sm text-gray-500">
            Min: {record.minStock} | Max: {record.maxStock}
          </div>
        </div>
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price: number) => `$${price}`,
    },
    {
      title: "Total Value",
      dataIndex: "totalValue",
      key: "totalValue",
      render: (value: number) => <span className="font-semibold text-green-600">${value.toLocaleString()}</span>,
    },
    {
      title: "Last Restocked",
      dataIndex: "lastRestocked",
      key: "lastRestocked",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colors = {
          "in-stock": "green",
          "low-stock": "orange",
          "out-of-stock": "red",
        }
        return <Tag color={colors[status as keyof typeof colors]}>{status.replace("-", " ").toUpperCase()}</Tag>
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <Button type="primary" size="large">
          Generate Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <FiPackage className="text-3xl text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold">{inventoryData.length}</div>
          <div className="text-gray-600">Total Products</div>
        </Card>

        <Card className="text-center">
          <FiTrendingDown className="text-3xl text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
          <div className="text-gray-600">Total Value</div>
        </Card>

        <Card className="text-center">
          <FiAlertTriangle className="text-3xl text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold">{lowStockItems.length}</div>
          <div className="text-gray-600">Low Stock Items</div>
        </Card>

        <Card className="text-center">
          <FiAlertTriangle className="text-3xl text-red-600 mx-auto mb-2" />
          <div className="text-2xl font-bold">
            {inventoryData.filter((item) => item.status === "out-of-stock").length}
          </div>
          <div className="text-gray-600">Out of Stock</div>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Alert
          message="Low Stock Warning"
          description={`${lowStockItems.length} items are running low or out of stock. Please restock soon.`}
          type="warning"
          showIcon
          className="mb-4"
        />
      )}

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <Input
            placeholder="Search by product name or SKU..."
            prefix={<FiSearch />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 max-w-md"
          />

          <Select value={categoryFilter} onChange={setCategoryFilter} className="w-40">
            <Option value="all">All Categories</Option>
            <Option value="Electronics">Electronics</Option>
            <Option value="Accessories">Accessories</Option>
            <Option value="Clothing">Clothing</Option>
          </Select>

          <Select value={statusFilter} onChange={setStatusFilter} className="w-40">
            <Option value="all">All Status</Option>
            <Option value="in-stock">In Stock</Option>
            <Option value="low-stock">Low Stock</Option>
            <Option value="out-of-stock">Out of Stock</Option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          rowClassName={(record) => {
            if (record.status === "out-of-stock") return "bg-red-50"
            if (record.status === "low-stock") return "bg-orange-50"
            return ""
          }}
        />
      </Card>
    </div>
  )
}
