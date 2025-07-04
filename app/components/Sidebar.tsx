"use client"

import { Layout, Menu } from "antd"
import { FiHome, FiShoppingCart, FiPackage, FiBarChart, FiUsers, FiFileText, FiSettings, FiTruck } from "react-icons/fi"

const { Sider } = Layout

interface SidebarProps {
  currentPage: string
  setCurrentPage: (page: string) => void
}

export default function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const menuItems = [
    {
      key: "dashboard",
      icon: <FiHome className="text-lg" />,
      label: "Dashboard",
    },
    {
      key: "pos",
      icon: <FiShoppingCart className="text-lg" />,
      label: "Point of Sale",
    },
    {
      key: "products",
      icon: <FiPackage className="text-lg" />,
      label: "Products",
    },
    {
      key: "inventory",
      icon: <FiBarChart className="text-lg" />,
      label: "Inventory",
    },
    {
      key: "sales",
      icon: <FiFileText className="text-lg" />,
      label: "Sales",
    },
    {
      key: "customers",
      icon: <FiUsers className="text-lg" />,
      label: "Customers",
    },
    {
      key: "vendors",
      icon: <FiTruck className="text-lg" />,
      label: "Vendors",
    },
    {
      key: "users",
      icon: <FiUsers className="text-lg" />,
      label: "User Management",
    },
    {
      key: "settings",
      icon: <FiSettings className="text-lg" />,
      label: "Settings",
    },
  ]

  return (
    <Sider width={250} className="bg-white shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">POS System</h1>
        <p className="text-sm text-gray-500">Multi-Branch Management</p>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[currentPage]}
        onClick={({ key }) => setCurrentPage(key)}
        items={menuItems}
        className="border-none h-full pt-4"
      />
    </Sider>
  )
}
