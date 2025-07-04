"use client"

import { Card, Row, Col, Statistic, Table, Progress } from "antd"
import { FiDollarSign, FiShoppingCart, FiUsers, FiTrendingUp, FiAlertTriangle } from "react-icons/fi"

export default function Dashboard() {
  const todayStats = {
    sales: 15420,
    transactions: 87,
    customers: 65,
    avgTransaction: 177.24,
  }

  const topProducts = [
    { name: "iPhone 14 Pro", sold: 15, revenue: 14985 },
    { name: "Samsung Galaxy S23", sold: 12, revenue: 10788 },
    { name: "AirPods Pro", sold: 25, revenue: 6225 },
    { name: "MacBook Air M2", sold: 5, revenue: 6495 },
  ]

  const lowStockItems = [
    { name: "Samsung Galaxy S23", stock: 3, minStock: 5 },
    { name: "iPad Pro", stock: 2, minStock: 5 },
    { name: "Apple Watch Series 8", stock: 4, minStock: 8 },
  ]

  const recentTransactions = [
    { id: "TXN-087", customer: "John Doe", amount: 1248, time: "14:30" },
    { id: "TXN-086", customer: "Jane Smith", amount: 899, time: "14:15" },
    { id: "TXN-085", customer: "Mike Brown", amount: 2547, time: "13:45" },
    { id: "TXN-084", customer: "Sarah Wilson", amount: 399, time: "13:20" },
  ]

  const productColumns = [
    { title: "Product", dataIndex: "name", key: "name" },
    { title: "Sold", dataIndex: "sold", key: "sold" },
    { title: "Revenue", dataIndex: "revenue", key: "revenue", render: (val: number) => `$${val}` },
  ]

  const transactionColumns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Customer", dataIndex: "customer", key: "customer" },
    { title: "Amount", dataIndex: "amount", key: "amount", render: (val: number) => `$${val}` },
    { title: "Time", dataIndex: "time", key: "time" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">Today: {new Date().toLocaleDateString()}</div>
      </div>

      {/* Today's Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Today's Sales"
              value={todayStats.sales}
              precision={2}
              prefix={<FiDollarSign />}
              valueStyle={{ color: "#10b981" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Transactions"
              value={todayStats.transactions}
              prefix={<FiShoppingCart />}
              valueStyle={{ color: "#3b82f6" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Customers"
              value={todayStats.customers}
              prefix={<FiUsers />}
              valueStyle={{ color: "#8b5cf6" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Avg Transaction"
              value={todayStats.avgTransaction}
              precision={2}
              prefix={<FiTrendingUp />}
              valueStyle={{ color: "#f59e0b" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Top Products */}
        <Col xs={24} lg={12}>
          <Card title="Top Selling Products" className="h-full">
            <Table columns={productColumns} dataSource={topProducts} pagination={false} size="small" />
          </Card>
        </Col>

        {/* Recent Transactions */}
        <Col xs={24} lg={12}>
          <Card title="Recent Transactions" className="h-full">
            <Table columns={transactionColumns} dataSource={recentTransactions} pagination={false} size="small" />
          </Card>
        </Col>
      </Row>

      {/* Low Stock Alert */}
      <Card title="Low Stock Alert" className="border-orange-200">
        <div className="space-y-4">
          {lowStockItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded">
              <div className="flex items-center space-x-3">
                <FiAlertTriangle className="text-orange-600" />
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-600">
                    Current: {item.stock} | Minimum: {item.minStock}
                  </div>
                </div>
              </div>
              <Progress
                percent={(item.stock / item.minStock) * 100}
                size="small"
                status={item.stock < item.minStock ? "exception" : "normal"}
                className="w-32"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
