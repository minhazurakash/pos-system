"use client"

import { Layout, Select, Badge, Avatar, Dropdown } from "antd"
import { FiBell, FiChevronDown, FiUser, FiSettings, FiLogOut } from "react-icons/fi"

const { Header } = Layout
const { Option } = Select

interface TopBarProps {
  selectedBranch: string
  setSelectedBranch: (branch: string) => void
}

export default function TopBar({ selectedBranch, setSelectedBranch }: TopBarProps) {
  const branches = [
    { value: "main-branch", label: "Main Branch" },
    { value: "downtown-branch", label: "Downtown Branch" },
    { value: "mall-branch", label: "Mall Branch" },
    { value: "online-store", label: "Online Store" },
  ]

  const userMenuItems = [
    {
      key: "profile",
      icon: <FiUser />,
      label: "Profile",
    },
    {
      key: "settings",
      icon: <FiSettings />,
      label: "Settings",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <FiLogOut />,
      label: "Logout",
    },
  ]

  return (
    <Header className="bg-white shadow-sm px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold text-gray-800">Welcome back, John Doe</h2>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Branch:</span>
          <Select value={selectedBranch} onChange={setSelectedBranch} className="w-48" suffixIcon={<FiChevronDown />}>
            {branches.map((branch) => (
              <Option key={branch.value} value={branch.value}>
                {branch.label}
              </Option>
            ))}
          </Select>
        </div>

        <Badge count={3} className="cursor-pointer">
          <FiBell className="text-xl text-gray-600 hover:text-blue-600" />
        </Badge>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg">
            <Avatar size="small" className="bg-blue-600">
              JD
            </Avatar>
            <span className="text-sm font-medium">John Doe</span>
            <FiChevronDown className="text-gray-400" />
          </div>
        </Dropdown>
      </div>
    </Header>
  )
}
