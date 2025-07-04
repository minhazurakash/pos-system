"use client"

import { useState } from "react"
import { Card, Table, Button, Modal, Form, Input, Space, Tag } from "antd"
import { FiPlus, FiEdit, FiTrash2, FiPhone, FiMail } from "react-icons/fi"
import Swal from "sweetalert2"

interface Vendor {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  address: string
  totalPurchases: number
  status: "active" | "inactive"
}

interface Purchase {
  id: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  date: string
}

export default function VendorList() {
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: "1",
      name: "Tech Supplies Co.",
      contact: "John Smith",
      email: "john@techsupplies.com",
      phone: "+1-555-0123",
      address: "123 Tech Street, Silicon Valley, CA",
      totalPurchases: 25000,
      status: "active",
    },
    {
      id: "2",
      name: "Mobile World Distributors",
      contact: "Sarah Johnson",
      email: "sarah@mobileworld.com",
      phone: "+1-555-0456",
      address: "456 Mobile Ave, New York, NY",
      totalPurchases: 45000,
      status: "active",
    },
  ])

  const [modalVisible, setModalVisible] = useState(false)
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
  const [form] = Form.useForm()

  const purchaseHistory: Record<string, Purchase[]> = {
    "1": [
      { id: "1", productName: "iPhone 14 Pro", quantity: 10, unitPrice: 800, totalPrice: 8000, date: "2024-01-15" },
      { id: "2", productName: "MacBook Air M2", quantity: 5, unitPrice: 1000, totalPrice: 5000, date: "2024-01-10" },
    ],
    "2": [
      {
        id: "3",
        productName: "Samsung Galaxy S23",
        quantity: 15,
        unitPrice: 700,
        totalPrice: 10500,
        date: "2024-01-12",
      },
      { id: "4", productName: "iPad Pro", quantity: 8, unitPrice: 650, totalPrice: 5200, date: "2024-01-08" },
    ],
  }

  const expandedRowRender = (record: Vendor) => {
    const purchases = purchaseHistory[record.id] || []

    const purchaseColumns = [
      { title: "Product", dataIndex: "productName", key: "productName" },
      { title: "Quantity", dataIndex: "quantity", key: "quantity" },
      { title: "Unit Price", dataIndex: "unitPrice", key: "unitPrice", render: (price: number) => `$${price}` },
      { title: "Total Price", dataIndex: "totalPrice", key: "totalPrice", render: (price: number) => `$${price}` },
      { title: "Date", dataIndex: "date", key: "date" },
    ]

    return (
      <div className="p-4 bg-gray-50">
        <h4 className="font-semibold mb-3">Purchase History</h4>
        <Table columns={purchaseColumns} dataSource={purchases} pagination={false} size="small" rowKey="id" />
      </div>
    )
  }

  const columns = [
    {
      title: "Vendor",
      key: "vendor",
      render: (record: Vendor) => (
        <div>
          <div className="font-semibold text-lg">{record.name}</div>
          <div className="text-sm text-gray-600">Contact: {record.contact}</div>
        </div>
      ),
    },
    {
      title: "Contact Info",
      key: "contact",
      render: (record: Vendor) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <FiMail className="text-gray-400" />
            <span className="text-sm">{record.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiPhone className="text-gray-400" />
            <span className="text-sm">{record.phone}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address: string) => <div className="text-sm max-w-xs">{address}</div>,
    },
    {
      title: "Total Purchases",
      dataIndex: "totalPurchases",
      key: "totalPurchases",
      render: (amount: number) => <div className="font-semibold text-green-600">${amount.toLocaleString()}</div>,
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
      render: (record: Vendor) => (
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

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor)
    form.setFieldsValue(vendor)
    setModalVisible(true)
  }

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Delete Vendor?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setVendors(vendors.filter((v) => v.id !== id))
        Swal.fire("Deleted!", "Vendor has been deleted.", "success")
      }
    })
  }

  const handleSubmit = (values: any) => {
    if (editingVendor) {
      setVendors(vendors.map((v) => (v.id === editingVendor.id ? { ...v, ...values } : v)))
    } else {
      const newVendor: Vendor = {
        id: Date.now().toString(),
        ...values,
        totalPurchases: 0,
        status: "active",
      }
      setVendors([...vendors, newVendor])
    }
    setModalVisible(false)
    setEditingVendor(null)
    form.resetFields()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Vendor Management</h1>
        <Button type="primary" icon={<FiPlus />} onClick={() => setModalVisible(true)} size="large">
          Add Vendor
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={vendors}
          rowKey="id"
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => (purchaseHistory[record.id]?.length || 0) > 0,
          }}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingVendor ? "Edit Vendor" : "Add Vendor"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setEditingVendor(null)
          form.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
          <Form.Item name="name" label="Vendor Name" rules={[{ required: true, message: "Please enter vendor name" }]}>
            <Input placeholder="Enter vendor name" />
          </Form.Item>

          <Form.Item
            name="contact"
            label="Contact Person"
            rules={[{ required: true, message: "Please enter contact person" }]}
          >
            <Input placeholder="Enter contact person name" />
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
              {editingVendor ? "Update" : "Create"} Vendor
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
