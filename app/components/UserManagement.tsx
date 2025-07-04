"use client"

import { useState } from "react"
import { Card, Table, Button, Modal, Form, Input, Select, Space, Tag, Switch } from "antd"
import { FiPlus, FiEdit, FiTrash2, FiUser, FiShield } from "react-icons/fi"
import Swal from "sweetalert2"

const { Option } = Select

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "admin" | "manager" | "cashier"
  branch: string
  status: "active" | "inactive"
  lastLogin: string
  permissions: string[]
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Admin",
      email: "admin@company.com",
      phone: "+1-555-0001",
      role: "admin",
      branch: "All Branches",
      status: "active",
      lastLogin: "2024-01-15 14:30",
      permissions: ["all"],
    },
    {
      id: "2",
      name: "Alice Manager",
      email: "alice@company.com",
      phone: "+1-555-0002",
      role: "manager",
      branch: "Main Branch",
      status: "active",
      lastLogin: "2024-01-15 13:45",
      permissions: ["sales", "inventory", "customers", "reports"],
    },
    {
      id: "3",
      name: "Bob Cashier",
      email: "bob@company.com",
      phone: "+1-555-0003",
      role: "cashier",
      branch: "Downtown Branch",
      status: "active",
      lastLogin: "2024-01-15 12:20",
      permissions: ["sales", "customers"],
    },
  ])

  const [modalVisible, setModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form] = Form.useForm()

  const rolePermissions = {
    admin: ["all"],
    manager: ["sales", "inventory", "customers", "reports", "users"],
    cashier: ["sales", "customers"],
  }

  const columns = [
    {
      title: "User",
      key: "user",
      render: (record: User) => (
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
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        const colors = {
          admin: "red",
          manager: "blue",
          cashier: "green",
        }
        return (
          <Tag color={colors[role as keyof typeof colors]} icon={<FiShield />}>
            {role.toUpperCase()}
          </Tag>
        )
      },
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
      render: (date: string) => <div className="text-sm">{date}</div>,
    },
    {
      title: "Status",
      key: "status",
      render: (record: User) => (
        <Switch
          checked={record.status === "active"}
          onChange={(checked) => handleStatusChange(record.id, checked)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: User) => (
        <Space>
          <Button type="text" icon={<FiEdit />} onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button
            type="text"
            danger
            icon={<FiTrash2 />}
            onClick={() => handleDelete(record.id)}
            disabled={record.role === "admin"}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  const handleEdit = (user: User) => {
    setEditingUser(user)
    form.setFieldsValue(user)
    setModalVisible(true)
  }

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Delete User?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers(users.filter((u) => u.id !== id))
        Swal.fire("Deleted!", "User has been deleted.", "success")
      }
    })
  }

  const handleStatusChange = (id: string, active: boolean) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: active ? "active" : "inactive" } : u)))
  }

  const handleSubmit = (values: any) => {
    const permissions = rolePermissions[values.role as keyof typeof rolePermissions]

    if (editingUser) {
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                ...values,
                permissions,
              }
            : u,
        ),
      )
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        ...values,
        status: "active",
        lastLogin: "Never",
        permissions,
      }
      setUsers([...users, newUser])
    }
    setModalVisible(false)
    setEditingUser(null)
    form.resetFields()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button type="primary" icon={<FiPlus />} onClick={() => setModalVisible(true)} size="large">
          Add User
        </Button>
      </div>

      <Card>
        <Table columns={columns} dataSource={users} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setEditingUser(null)
          form.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
          <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Please enter user name" }]}>
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

            <Form.Item name="role" label="Role" rules={[{ required: true, message: "Please select role" }]}>
              <Select placeholder="Select role">
                <Option value="admin">Admin</Option>
                <Option value="manager">Manager</Option>
                <Option value="cashier">Cashier</Option>
              </Select>
            </Form.Item>

            <Form.Item name="branch" label="Branch" rules={[{ required: true, message: "Please select branch" }]}>
              <Select placeholder="Select branch">
                <Option value="All Branches">All Branches</Option>
                <Option value="Main Branch">Main Branch</Option>
                <Option value="Downtown Branch">Downtown Branch</Option>
                <Option value="Mall Branch">Mall Branch</Option>
              </Select>
            </Form.Item>
          </div>

          {!editingUser && (
            <Form.Item name="password" label="Password" rules={[{ required: true, message: "Please enter password" }]}>
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingUser ? "Update" : "Create"} User
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
