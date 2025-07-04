"use client"

import { useState } from "react"
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  Select,
  Tag,
  Space,
  Row,
  Col,
  Divider,
} from "antd"
import { FiPlus, FiEdit, FiTrash2, FiImage, FiPackage } from "react-icons/fi"
import Swal from "sweetalert2"

const { Option } = Select

interface Product {
  id: string
  name: string
  category: string
  sku: string
  barcode: string
  costPrice: number
  regularPrice: number
  salePrice: number
  stock: number
  minStock: number
  status: "active" | "inactive"
  variants?: ProductVariant[]
}

interface ProductVariant {
  id: string
  name: string
  value: string
  price: number
  stock: number
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "iPhone 14 Pro",
      category: "Electronics",
      sku: "IPH14PRO",
      barcode: "123456789",
      costPrice: 800,
      regularPrice: 999,
      salePrice: 949,
      stock: 15,
      minStock: 5,
      status: "active",
      variants: [
        { id: "1", name: "Color", value: "Space Black", price: 999, stock: 5 },
        { id: "2", name: "Color", value: "Silver", price: 999, stock: 10 },
      ],
    },
    {
      id: "2",
      name: "Samsung Galaxy S23",
      category: "Electronics",
      sku: "SGS23",
      barcode: "987654321",
      costPrice: 700,
      regularPrice: 899,
      salePrice: 849,
      stock: 8,
      minStock: 3,
      status: "active",
    },
  ])

  const [modalVisible, setModalVisible] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form] = Form.useForm()

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Product) => (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <FiPackage className="text-gray-400 text-xl" />
          </div>
          <div>
            <div className="font-semibold text-lg">{text}</div>
            <div className="text-sm text-gray-500">SKU: {record.sku}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "Pricing",
      key: "pricing",
      render: (record: Product) => (
        <div className="space-y-1">
          <div className="text-sm">
            Cost: <span className="font-medium text-red-600">${record.costPrice}</span>
          </div>
          <div className="text-sm">
            Regular: <span className="font-medium">${record.regularPrice}</span>
          </div>
          <div className="text-sm">
            Sale: <span className="font-medium text-green-600">${record.salePrice}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Stock",
      key: "stock",
      render: (record: Product) => (
        <div>
          <div
            className={`font-semibold text-lg ${record.stock <= record.minStock ? "text-red-600" : "text-green-600"}`}
          >
            {record.stock}
          </div>
          <div className="text-sm text-gray-500">Min: {record.minStock}</div>
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
      render: (record: Product) => (
        <Space>
          <Button type="text" icon={<FiEdit />} onClick={() => handleEdit(record)} className="text-blue-600">
            Edit
          </Button>
          <Button type="text" danger icon={<FiTrash2 />} onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    form.setFieldsValue(product)
    setModalVisible(true)
  }

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Delete Product?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setProducts(products.filter((p) => p.id !== id))
        Swal.fire("Deleted!", "Product has been deleted.", "success")
      }
    })
  }

  const handleSubmit = (values: any) => {
    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? { ...p, ...values } : p)))
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        ...values,
        status: "active",
      }
      setProducts([...products, newProduct])
    }
    setModalVisible(false)
    setEditingProduct(null)
    form.resetFields()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-1">Manage your inventory and product catalog</p>
        </div>
        <Button
          type="primary"
          icon={<FiPlus />}
          onClick={() => setModalVisible(true)}
          size="large"
          className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 shadow-lg"
        >
          Add New Product
        </Button>
      </div>

      <Card className="shadow-lg border-0">
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }}
          className="custom-table"
        />
      </Card>

      <Modal
        title={
          <div className="flex items-center space-x-3 pb-4 border-b">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FiPackage className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
              <p className="text-gray-500 text-sm">Fill in the product details below</p>
            </div>
          </div>
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setEditingProduct(null)
          form.resetFields()
        }}
        footer={null}
        width={900}
        className="product-modal"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-6">
          {/* Product Image Section */}
          <Card className="mb-6 bg-gray-50 border-dashed border-2 border-gray-300">
            <div className="text-center">
              <Form.Item name="image" label="Product Image">
                <Upload.Dragger listType="picture-card" maxCount={1} beforeUpload={() => false} className="bg-white">
                  <div className="p-6">
                    <FiImage className="text-4xl text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium">Upload Product Image</p>
                    <p className="text-gray-500">Drag & drop or click to browse</p>
                  </div>
                </Upload.Dragger>
              </Form.Item>
            </div>
          </Card>

          <Row gutter={24}>
            {/* Basic Information */}
            <Col span={16}>
              <Card title="Basic Information" className="h-full">
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name="name"
                      label="Product Name"
                      rules={[{ required: true, message: "Please enter product name" }]}
                    >
                      <Input placeholder="Enter product name" size="large" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="category"
                      label="Category"
                      rules={[{ required: true, message: "Please select category" }]}
                    >
                      <Select placeholder="Select category" size="large">
                        <Option value="Electronics">📱 Electronics</Option>
                        <Option value="Clothing">👕 Clothing</Option>
                        <Option value="Accessories">⌚ Accessories</Option>
                        <Option value="Home & Garden">🏠 Home & Garden</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item name="status" label="Status">
                      <Select defaultValue="active" size="large">
                        <Option value="active">✅ Active</Option>
                        <Option value="inactive">❌ Inactive</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item name="sku" label="SKU" rules={[{ required: true, message: "Please enter SKU" }]}>
                      <Input placeholder="Enter SKU" size="large" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="barcode"
                      label="Barcode"
                      rules={[{ required: true, message: "Please enter barcode" }]}
                    >
                      <Input placeholder="Enter barcode" size="large" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Pricing & Inventory */}
            <Col span={8}>
              <Card title="Pricing & Stock" className="h-full">
                <Form.Item
                  name="costPrice"
                  label="Cost Price"
                  rules={[{ required: true, message: "Please enter cost price" }]}
                >
                  <InputNumber placeholder="0.00" className="w-full" prefix="$" min={0} step={0.01} size="large" />
                </Form.Item>

                <Form.Item
                  name="regularPrice"
                  label="Regular Price"
                  rules={[{ required: true, message: "Please enter regular price" }]}
                >
                  <InputNumber placeholder="0.00" className="w-full" prefix="$" min={0} step={0.01} size="large" />
                </Form.Item>

                <Form.Item name="salePrice" label="Sale Price">
                  <InputNumber placeholder="0.00" className="w-full" prefix="$" min={0} step={0.01} size="large" />
                </Form.Item>

                <Divider />

                <Form.Item
                  name="stock"
                  label="Stock Quantity"
                  rules={[{ required: true, message: "Please enter stock quantity" }]}
                >
                  <InputNumber placeholder="0" className="w-full" min={0} size="large" />
                </Form.Item>

                <Form.Item
                  name="minStock"
                  label="Minimum Stock"
                  rules={[{ required: true, message: "Please enter minimum stock" }]}
                >
                  <InputNumber placeholder="0" className="w-full" min={0} size="large" />
                </Form.Item>
              </Card>
            </Col>
          </Row>

          <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
            <Button size="large" onClick={() => setModalVisible(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
            >
              {editingProduct ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
