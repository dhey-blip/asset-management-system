import { useState, useEffect } from 'react'
import { Typography, Row, Col, Card, Statistic, Table, Alert, Spin, Tag, Button, Flex } from 'antd'
import { PrinterOutlined } from '@ant-design/icons'
import { getAssets } from '../services/assetService'

const { Title, Text } = Typography

const STATUS_COLORS = {
  Available: 'green',
  Assigned: 'blue',
  Maintenance: 'orange',
}

const columns = [
  { title: 'Asset Code', dataIndex: 'AssetCode', key: 'AssetCode' },
  { title: 'Asset Name', dataIndex: 'AssetName', key: 'AssetName' },
  { title: 'Category', dataIndex: 'Category', key: 'Category', responsive: ['md'] },
  { title: 'Brand', dataIndex: 'Brand', key: 'Brand', responsive: ['lg'] },
  {
    title: 'Status',
    dataIndex: 'Status',
    key: 'Status',
    render: (status) => <Tag color={STATUS_COLORS[status]}>{status}</Tag>,
  },
  { title: 'Assigned To', dataIndex: 'AssignedTo', key: 'AssignedTo', responsive: ['lg'] },
]

function Reports() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadAssets() {
      setLoading(true)
      setErrorMessage('')

      try {
        const result = await getAssets()
        setAssets(result.data)
      } catch (err) {
        setErrorMessage(err.response?.data?.message || 'Failed to load report data')
      } finally {
        setLoading(false)
      }
    }

    loadAssets()
  }, [])

  const totalCount = assets.length
  const availableCount = assets.filter((a) => a.Status === 'Available').length
  const assignedCount = assets.filter((a) => a.Status === 'Assigned').length
  const maintenanceCount = assets.filter((a) => a.Status === 'Maintenance').length

  function handlePrint() {
    window.print()
  }

  const generatedOn = new Date().toLocaleString()

  return (
    <div>
      <Flex justify="space-between" align="center" wrap="wrap" gap="small" style={{ marginBottom: 16 }} className="no-print">
        <Title level={3} style={{ margin: 0 }}>
          Asset Report
        </Title>
        <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint} disabled={loading || assets.length === 0}>
          Print Report
        </Button>
      </Flex>

      {errorMessage && (
        <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: 16 }} className="no-print" />
      )}

      <div id="report-content">
        <div className="print-only" style={{ marginBottom: 16 }}>
          <Title level={3} style={{ marginBottom: 0 }}>
            Asset Management System — Asset Report
          </Title>
          <Text type="secondary">Generated on {generatedOn}</Text>
        </div>

        <Spin spinning={loading}>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={12} md={6}>
              <Card>
                <Statistic title="Total Assets" value={totalCount} />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card>
                <Statistic
                  title="Available"
                  value={availableCount}
                  styles={{ content: { color: '#3f8600' } }}
                />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card>
                <Statistic
                  title="Assigned"
                  value={assignedCount}
                  styles={{ content: { color: '#1677ff' } }}
                />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card>
                <Statistic
                  title="Maintenance"
                  value={maintenanceCount}
                  styles={{ content: { color: '#d46b08' } }}
                />
              </Card>
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={assets}
            rowKey="Id"
            pagination={false}
            scroll={{ x: true }}
            locale={{ emptyText: 'No assets to report' }}
          />
        </Spin>
      </div>
    </div>
  )
}

export default Reports