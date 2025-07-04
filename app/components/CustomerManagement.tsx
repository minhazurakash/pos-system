"use client"

import { useState } from "react"
import { Card, Table, Button, Modal, Form, Input, Space, Tag, Tabs } from "antd"
import { FiPlus, FiEdit, FiTrash2, FiPhone, FiMail, FiUser } from "react-icons/fi"
import Swal from "sweetalert2"

const { TabPane } = Tabs

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  totalPurchases: number
  totalSpent: number
  lastVisit: string
  status: "active" | "inactive"
  loyaltyPoints: number
}

interface Purchase {
  id: string
  date: string
  items: string[]
  total: number
}

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1-555-0123",
      address: "123 Main St, City, State 12345",
      totalPurchases: 15,
      totalSpent: 4500,
      lastVisit: "2024-01-15",
      status: "active",
      loyaltyPoints: 450,
    },
    {
      id: "2",
      name: "Jane Wilson",
      email: "jane.wilson@email.com",
      phone: "+1-555-0456",
      address: "456 Oak Ave, City, State 12345",
      totalPurchases: 8,
      totalSpent: 2200,
      lastVisit: "2024-01-12",
      status: "active",
      loyaltyPoints: 220,
    },
  ])

  const [modalVisible, setModalVisible] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [form] = Form.useForm()

  const purchaseHistory: Record<string, Purchase[]> = {
    "1": [
      { id: "1", date: "2024-01-15", items: ["iPhone 14 Pro", "AirPods Pro"], total: 1248 },
      { id: "2", date: "2024-01-10", items: ["MacBook Air M2"], total: 1299 },
    ],
    "2": [
      { id: "3", date: "2024-01-12", items: ["Samsung Galaxy S23"], total: 899 },
      { id: "4", date: "2024-01-08", items: ["iPad Pro", "Apple Pencil"], total: 928 },
    ],
  }

  const expandedRowRender = (record: Customer) => {
    const purchases = purchaseHistory[record.id] || []

    return (
      <div className="p-4 bg-gray-50">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Purchase History" key="1">
            <div className="space-y-3">
              {purchases.map((purchase) => (
                <div key={purchase.id} className="bg-white p-3 rounded border">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{purchase.date}</div>
                      <div className="text-sm text-gray-600">Items: {purchase.items.join(", ")}</div>
                    </div>
                    <div className="font-semibold text-green-600">${purchase.total}</div>
                  </div>
                </div>
              ))}
            </div>
          </TabPane>
          <TabPane tab="Loyalty Program" key="2">
            <div className="bg-white p-4 rounded border">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{record.loyaltyPoints}</div>
                <div className="text-gray-600">Loyalty Points</div>
                <div className="mt-4">
                  <Button type="primary">Redeem Points</Button>
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    )
  }

  const columns = [
    {
      title: "Customer",
      key: "customer",
      render: (record: Customer) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <FiUser className="text-blue-600" />
          </div>
          <div>
            <div className="font-semibold">{record.name}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Contact",
      key: "contact",
      render: (record: Customer) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <FiPhone className="text-gray-400" />
            <span className="text-sm">{record.phone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiMail className="text-gray-400" />
            <span className="text-sm">{record.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Purchase Stats",
      key: "stats",
      render: (record: Customer) => (
        <div>
          <div className="font-semibold">{record.totalPurchases} orders</div>
          <div className="text-green-600 font-medium">${record.totalSpent}</div>
          <div className="text-sm text-gray-500">Last: {record.lastVisit}</div>
        </div>
      ),
    },
    {
      title: "Loyalty Points",
      dataIndex: "loyaltyPoints",
      key: "loyaltyPoints",
      render: (points: number) => (
        <div className="text-center">
          <div className="font-bold text-blue-600">{points}</div>
          <div className="text-xs text-gray-500">points</div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color={status === "active" ? "green" : "red"}>{status.toUpperCase()}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Customer) => (
        <Space>
          <Button type="text" icon={<FiEdit />} onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="text" danger icon={<FiTrash2 />} onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    form.setFieldsValue(customer)
    setModalVisible(true)
  }

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Delete Customer?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setCustomers(customers.filter((c) => c.id !== id))
        Swal.fire("Deleted!", "Customer has been deleted.", "success")
      }
    })
  }

  const handleSubmit = (values: any) => {
    if (editingCustomer) {
      setCustomers(customers.map((c) => (c.id === editingCustomer.id ? { ...c, ...values } : c)))
    } else {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        ...values,
        totalPurchases: 0,
        totalSpent: 0,
        lastVisit: new Date().toISOString().split("T")[0],
        status: "active",
        loyaltyPoints: 0,
      }
      setCustomers([...customers, newCustomer])
    }
    setModalVisible(false)
    setEditingCustomer(null)
    form.resetFields()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <Button type="primary" icon={<FiPlus />} onClick={() => setModalVisible(true)} size="large">
          Add Customer
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={customers}
          rowKey="id"
          expandable={{
            expandedRowRender,
            rowExpandable: () => true,
          }}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingCustomer ? "Edit Customer" : "Add Customer"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setEditingCustomer(null)
          form.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
          <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Please enter customer name" }]}>
            <Input placeholder="Enter full name" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter valid email" },
              ]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>

            <Form.Item name="phone" label="Phone" rules={[{ required: true, message: "Please enter phone number" }]}>
              <Input placeholder="Enter phone number" />
            </Form.Item>
          </div>

          <Form.Item name="address" label="Address" rules={[{ required: true, message: "Please enter address" }]}>
            <Input.TextArea rows={3} placeholder="Enter full address" />
          </Form.Item>

          <div className="flex justify-end space-x-2 pt-4">
            <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingCustomer ? "Update" : "Create"} Customer
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
