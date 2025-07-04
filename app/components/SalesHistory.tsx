"use client"

import { useState } from "react"
import { Card, Table, DatePicker, Select, Input, Button, Tag, Statistic } from "antd"
import { FiSearch, FiDownload, FiDollarSign, FiShoppingCart, FiTrendingUp } from "react-icons/fi"
import dayjs from "dayjs"

const { RangePicker } = DatePicker
const { Option } = Select

interface Sale {
  id: string
  date: string
  time: string
  customer: string
  cashier: string
  branch: string
  items: number
  subtotal: number
  tax: number
  total: number
  paymentMethod: string
  status: "completed" | "refunded" | "cancelled"
}

export default function SalesHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [branchFilter, setBranchFilter] = useState("all")
  const [cashierFilter, setCashierFilter] = useState("all")
  const [dateRange, setDateRange] = useState<any>(null)

  const salesData: Sale[] = [
    {
      id: "TXN-001",
      date: "2024-01-15",
      time: "14:30",
      customer: "John Doe",
      cashier: "Alice Smith",
      branch: "Main Branch",
      items: 3,
      subtotal: 2547.0,
      tax: 254.7,
      total: 2801.7,
      paymentMethod: "Card",
      status: "completed",
    },
    {
      id: "TXN-002",
      date: "2024-01-15",
      time: "15:45",
      customer: "Jane Wilson",
      cashier: "Bob Johnson",
      branch: "Downtown Branch",
      items: 1,
      subtotal: 999.0,
      tax: 99.9,
      total: 1098.9,
      paymentMethod: "Cash",
      status: "completed",
    },
    {
      id: "TXN-003",
      date: "2024-01-14",
      time: "11:20",
      customer: "Mike Brown",
      cashier: "Alice Smith",
      branch: "Main Branch",
      items: 2,
      subtotal: 1548.0,
      tax: 154.8,
      total: 1702.8,
      paymentMethod: "Mobile Wallet",
      status: "completed",
    },
    {
      id: "TXN-004",
      date: "2024-01-14",
      time: "16:10",
      customer: "Sarah Davis",
      cashier: "Carol White",
      branch: "Mall Branch",
      items: 1,
      subtotal: 249.0,
      tax: 24.9,
      total: 273.9,
      paymentMethod: "Card",
      status: "refunded",
    },
  ]

  const filteredData = salesData.filter((sale) => {
    const matchesSearch =
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBranch = branchFilter === "all" || sale.branch === branchFilter
    const matchesCashier = cashierFilter === "all" || sale.cashier === cashierFilter

    let matchesDate = true
    if (dateRange && dateRange.length === 2) {
      const saleDate = dayjs(sale.date)
      matchesDate = saleDate.isAfter(dateRange[0].startOf("day")) && saleDate.isBefore(dateRange[1].endOf("day"))
    }

    return matchesSearch && matchesBranch && matchesCashier && matchesDate
  })

  const totalSales = filteredData.reduce((sum, sale) => sum + sale.total, 0)
  const totalTransactions = filteredData.length
  const averageTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "id",
      key: "id",
      render: (id: string) => <span className="font-mono text-blue-600">{id}</span>,
    },
    {
      title: "Date & Time",
      key: "datetime",
      render: (record: Sale) => (
        <div>
          <div className="font-medium">{record.date}</div>
          <div className="text-sm text-gray-500">{record.time}</div>
        </div>
      ),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Cashier",
      dataIndex: "cashier",
      key: "cashier",
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: (items: number) => <span className="font-medium">{items} items</span>,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total: number) => <span className="font-semibold text-green-600">${total.toFixed(2)}</span>,
    },
    {
      title: "Payment",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method: string) => <Tag color="blue">{method}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colors = {
          completed: "green",
          refunded: "orange",
          cancelled: "red",
        }
        return <Tag color={colors[status as keyof typeof colors]}>{status.toUpperCase()}</Tag>
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sales History</h1>
        <Button type="primary" icon={<FiDownload />} size="large">
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <Statistic
            title="Total Sales"
            value={totalSales}
            precision={2}
            prefix={<FiDollarSign />}
            valueStyle={{ color: "#10b981" }}
          />
        </Card>

        <Card>
          <Statistic
            title="Total Transactions"
            value={totalTransactions}
            prefix={<FiShoppingCart />}
            valueStyle={{ color: "#3b82f6" }}
          />
        </Card>

        <Card>
          <Statistic
            title="Average Transaction"
            value={averageTransaction}
            precision={2}
            prefix={<FiTrendingUp />}
            valueStyle={{ color: "#8b5cf6" }}
          />
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="Search by transaction ID or customer..."
            prefix={<FiSearch />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select value={branchFilter} onChange={setBranchFilter} placeholder="Filter by branch">
            <Option value="all">All Branches</Option>
            <Option value="Main Branch">Main Branch</Option>
            <Option value="Downtown Branch">Downtown Branch</Option>
            <Option value="Mall Branch">Mall Branch</Option>
          </Select>

          <Select value={cashierFilter} onChange={setCashierFilter} placeholder="Filter by cashier">
            <Option value="all">All Cashiers</Option>
            <Option value="Alice Smith">Alice Smith</Option>
            <Option value="Bob Johnson">Bob Johnson</Option>
            <Option value="Carol White">Carol White</Option>
          </Select>

          <RangePicker value={dateRange} onChange={setDateRange} placeholder={["Start Date", "End Date"]} />
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  )
}
