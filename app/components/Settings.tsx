"use client"

import { Card, Form, Input, Select, Switch, Button, Divider, Row, Col, InputNumber, Upload } from "antd"
import { FiUpload, FiSave, FiRefreshCw } from "react-icons/fi"

const { Option } = Select

export default function Settings() {
  const [form] = Form.useForm()

  const handleSave = (values: any) => {
    console.log("Settings saved:", values)
    // Handle settings save logic here
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Button type="primary" icon={<FiSave />} onClick={() => form.submit()}>
          Save Settings
        </Button>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Row gutter={24}>
          {/* Business Settings */}
          <Col span={12}>
            <Card title="Business Information" className="h-full">
              <Form.Item name="businessName" label="Business Name">
                <Input placeholder="Enter business name" />
              </Form.Item>

              <Form.Item name="businessAddress" label="Business Address">
                <Input.TextArea rows={3} placeholder="Enter business address" />
              </Form.Item>

              <Form.Item name="businessPhone" label="Phone Number">
                <Input placeholder="Enter phone number" />
              </Form.Item>

              <Form.Item name="businessEmail" label="Email">
                <Input placeholder="Enter email address" />
              </Form.Item>

              <Form.Item name="taxRate" label="Tax Rate (%)">
                <InputNumber min={0} max={100} step={0.1} className="w-full" />
              </Form.Item>
            </Card>
          </Col>

          {/* System Settings */}
          <Col span={12}>
            <Card title="System Configuration" className="h-full">
              <Form.Item name="currency" label="Currency">
                <Select defaultValue="USD">
                  <Option value="USD">USD ($)</Option>
                  <Option value="EUR">EUR (€)</Option>
                  <Option value="GBP">GBP (£)</Option>
                </Select>
              </Form.Item>

              <Form.Item name="timezone" label="Timezone">
                <Select defaultValue="UTC">
                  <Option value="UTC">UTC</Option>
                  <Option value="EST">Eastern Time</Option>
                  <Option value="PST">Pacific Time</Option>
                </Select>
              </Form.Item>

              <Form.Item name="lowStockThreshold" label="Low Stock Threshold">
                <InputNumber min={1} className="w-full" />
              </Form.Item>

              <Form.Item name="autoBackup" label="Auto Backup" valuePropName="checked">
                <Switch />
              </Form.Item>

              <Form.Item name="emailNotifications" label="Email Notifications" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <Row gutter={24} className="mt-6">
          {/* Receipt Settings */}
          <Col span={12}>
            <Card title="Receipt Settings">
              <Form.Item name="receiptHeader" label="Receipt Header">
                <Input.TextArea rows={2} placeholder="Thank you for your purchase!" />
              </Form.Item>

              <Form.Item name="receiptFooter" label="Receipt Footer">
                <Input.TextArea rows={2} placeholder="Please come again!" />
              </Form.Item>

              <Form.Item name="printLogo" label="Print Logo" valuePropName="checked">
                <Switch />
              </Form.Item>

              <Form.Item name="logo" label="Business Logo">
                <Upload listType="picture-card" maxCount={1}>
                  <div>
                    <FiUpload />
                    <div className="mt-2">Upload Logo</div>
                  </div>
                </Upload>
              </Form.Item>
            </Card>
          </Col>

          {/* Security Settings */}
          <Col span={12}>
            <Card title="Security Settings">
              <Form.Item name="sessionTimeout" label="Session Timeout (minutes)">
                <InputNumber min={5} max={480} className="w-full" />
              </Form.Item>

              <Form.Item name="requirePasswordChange" label="Require Password Change" valuePropName="checked">
                <Switch />
              </Form.Item>

              <Form.Item name="twoFactorAuth" label="Two-Factor Authentication" valuePropName="checked">
                <Switch />
              </Form.Item>

              <Form.Item name="auditLog" label="Enable Audit Log" valuePropName="checked">
                <Switch />
              </Form.Item>

              <Divider />

              <Button icon={<FiRefreshCw />} block>
                Reset All Settings
              </Button>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
