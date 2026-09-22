import { useState, useEffect } from 'react'
import { Typography, Row, Col, Card, Statistic, Table, Alert, Spin, Tag } from 'antd'
import {
  AppstoreOutlined,
  CheckCircleOutlined,
  UserSwitchOutlined,
  ToolOutlined,
} from '@ant-design/icons'
import { getCurrentUser } from '../services/authService'
import { getAssets } from '../services/assetService'

const { Title, Paragraph } = Typography

const STATUS_COLORS = {
  Available: 'green',
  Assigned: 'blue',
  Maintenance: 'orange',
}

const columns = [
  { title: 'Asset Code', dataIndex: 'AssetCode', key: 'AssetCode' },
  { title: 'Asset Name', dataIndex: 'AssetName', key: 'AssetName' },
  { title: 'Category', dataIndex: 'Category', key: 'Category', responsive: ['md'] },
  {
    title: 'Status',
    dataIndex: 'Status',
    key: 'Status',
    render: (status) => <Tag color={STATUS_COLORS[status]}>{status}</Tag>,
  },
]

function Dashboard() {
  const user = getCurrentUser()
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    loadAssets()
  }, [])

  async function loadAssets() {
    setLoading(true)
    setErrorMessage('')

    try {
      const result = await getAssets()
      setAssets(result.data)
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to load assets')
    } finally {
      setLoading(false)
    }
  }

  // Derive the summary counts from the same data the table uses,
  // instead of a separate API call
  const totalCount = assets.length
  const availableCount = assets.filter((a) => a.Status === 'Available').length
  const assignedCount = assets.filter((a) => a.Status === 'Assigned').length
  const maintenanceCount = assets.filter((a) => a.Status === 'Maintenance').length

  const recentAssets = [...assets]
    .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt))
    .slice(0, 5)

  return (
    <div>
      <Title level={3}>Dashboard</Title>
      <Paragraph type="secondary">
        Welcome back, <strong>{user?.username}</strong>.
      </Paragraph>

      {errorMessage && (
        <Alert
          message={errorMessage}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Spin spinning={loading}>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={12} md={6}>
            <Card>
              <Statistic
                title="Total Assets"
                value={totalCount}
                prefix={<AppstoreOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card>
              <Statistic
                title="Available"
                value={availableCount}
                valueStyle={{ color: '#3f8600' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card>
              <Statistic
                title="Assigned"
                value={assignedCount}
                valueStyle={{ color: '#1677ff' }}
                prefix={<UserSwitchOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card>
              <Statistic
                title="Maintenance"
                value={maintenanceCount}
                valueStyle={{ color: '#d46b08' }}
                prefix={<ToolOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Title level={4}>Recent Assets</Title>
        <Table
          columns={columns}
          dataSource={recentAssets}
          rowKey="Id"
          pagination={false}
          scroll={{ x: true }}
          locale={{ emptyText: 'No assets yet' }}
        />
      </Spin>
    </div>
  )
}

export default Dashboard