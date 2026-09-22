import { useState, useEffect } from 'react'
import {
  Typography,
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Alert,
  Popconfirm,
  Flex,
  message,
} from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { getAssets, deleteAsset } from '../services/assetService'
import AssetFormModal from '../components/AssetFormModal'

const { Title } = Typography

const STATUS_COLORS = {
  Available: 'green',
  Assigned: 'blue',
  Maintenance: 'orange',
}

function Assets() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState(null)

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

  function handleAddClick() {
    setEditingAsset(null)
    setModalOpen(true)
  }

  function handleEditClick(asset) {
    setEditingAsset(asset)
    setModalOpen(true)
  }

  function handleModalClose() {
    setModalOpen(false)
    setEditingAsset(null)
  }

  function handleModalSuccess() {
    setModalOpen(false)
    setEditingAsset(null)
    loadAssets()
  }

  async function handleDelete(id) {
    try {
      await deleteAsset(id)
      message.success('Asset deleted successfully')
      loadAssets()
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to delete asset')
    }
  }

  // Filter on the data we already have — no extra API call needed
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      !searchText ||
      asset.AssetCode.toLowerCase().includes(searchText.toLowerCase()) ||
      asset.AssetName.toLowerCase().includes(searchText.toLowerCase())

    const matchesStatus = !statusFilter || asset.Status === statusFilter

    return matchesSearch && matchesStatus
  })

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
    {
      title: 'Actions',
      key: 'actions',
      render: (_, asset) => (
        <Space>
          <Button size="small" onClick={() => handleEditClick(asset)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this asset?"
            description={`"${asset.AssetName}" will be permanently removed.`}
            onConfirm={() => handleDelete(asset.Id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Flex justify="space-between" align="center" wrap="wrap" gap="small" style={{ marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>
          Assets
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
          Add Asset
        </Button>
      </Flex>

      {errorMessage && (
        <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: 16 }} />
      )}

      <Flex gap="middle" wrap="wrap" style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search by asset code or name"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: 300 }}
          allowClear
        />
        <Select
          placeholder="Filter by status"
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ minWidth: 180 }}
          allowClear
          options={[
            { value: 'Available', label: 'Available' },
            { value: 'Assigned', label: 'Assigned' },
            { value: 'Maintenance', label: 'Maintenance' },
          ]}
        />
      </Flex>

      <Table
        columns={columns}
        dataSource={filteredAssets}
        rowKey="Id"
        loading={loading}
        scroll={{ x: true }}
        locale={{ emptyText: 'No assets found' }}
      />

      <AssetFormModal
        open={modalOpen}
        asset={editingAsset}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </div>
  )
}

export default Assets