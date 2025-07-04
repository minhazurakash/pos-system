"use client"

import { useState } from "react"
import { Layout } from "antd"
import Sidebar from "./components/Sidebar"
import TopBar from "./components/TopBar"
import POSPage from "./components/POSPage"
import ProductManagement from "./components/ProductManagement"
import VendorList from "./components/VendorList"
import InventoryView from "./components/InventoryView"
import SalesHistory from "./components/SalesHistory"
import CustomerManagement from "./components/CustomerManagement"
import UserManagement from "./components/UserManagement"
import Dashboard from "./components/Dashboard"
import Settings from "./components/Settings"

const { Content } = Layout

export default function App() {
  const [currentPage, setCurrentPage] = useState("pos")
  const [selectedBranch, setSelectedBranch] = useState("main-branch")

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />
      case "pos":
        return <POSPage />
      case "products":
        return <ProductManagement />
      case "inventory":
        return <InventoryView />
      case "sales":
        return <SalesHistory />
      case "customers":
        return <CustomerManagement />
      case "vendors":
        return <VendorList />
      case "users":
        return <UserManagement />
      case "settings":
        return <Settings />
      default:
        return <POSPage />
    }
  }

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <Layout>
        <TopBar selectedBranch={selectedBranch} setSelectedBranch={setSelectedBranch} />
        <Content className="p-6">{renderContent()}</Content>
      </Layout>
    </Layout>
  )
}
