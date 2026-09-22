import { useEffect } from 'react'
import { Modal, Form, Input, Select, DatePicker, message } from 'antd'
import dayjs from 'dayjs'
import { createAsset, updateAsset } from '../services/assetService'

function AssetFormModal({ open, asset, onClose, onSuccess }) {
  const [form] = Form.useForm()
  const isEditMode = Boolean(asset)

  useEffect(() => {
    if (open && asset) {
      form.setFieldsValue({
        assetCode: asset.AssetCode,
        assetName: asset.AssetName,
        category: asset.Category,
        brand: asset.Brand,
        status: asset.Status,
        assignedTo: asset.AssignedTo,
        purchaseDate: asset.PurchaseDate ? dayjs(asset.PurchaseDate) : null,
      })
    } else if (open) {
      form.resetFields()
    }
  }, [open, asset, form])

  function handleAssignedToChange(e) {
  const value = e.target.value

  if (value.trim()) {
    form.setFieldValue('status', 'Assigned')
  } else {
    if (form.getFieldValue('status') === 'Assigned') {
      form.setFieldValue('status', 'Available')
    }
  }
}

  async function handleFinish(values) {
    const payload = {
      ...values,
      purchaseDate: values.purchaseDate ? values.purchaseDate.format('YYYY-MM-DD') : null,
    }

    try {
      if (isEditMode) {
        await updateAsset(asset.Id, payload)
        message.success('Asset updated successfully')
      } else {
        await createAsset(payload)
        message.success('Asset created successfully')
      }
      onSuccess()
    } catch (err) {
      message.error(err.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <Modal
      title={isEditMode ? 'Edit Asset' : 'Add Asset'}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={isEditMode ? 'Save Changes' : 'Add Asset'}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Asset Code"
          name="assetCode"
          rules={[{ required: true, message: 'Asset code is required' }]}
        >
          <Input placeholder="e.g. AST-0008" />
        </Form.Item>

        <Form.Item
          label="Asset Name"
          name="assetName"
          rules={[{ required: true, message: 'Asset name is required' }]}
        >
          <Input placeholder="e.g. Dell Latitude 5440" />
        </Form.Item>

        <Form.Item label="Category" name="category">
          <Input placeholder="e.g. Laptop" />
        </Form.Item>

        <Form.Item label="Brand" name="brand">
          <Input placeholder="e.g. Dell" />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Status is required' }]}
          initialValue="Available"
        >
          <Select
            options={[
              { value: 'Available', label: 'Available' },
              { value: 'Assigned', label: 'Assigned' },
              { value: 'Maintenance', label: 'Maintenance' },
            ]}
          />
        </Form.Item>

        <Form.Item label="Assigned To" name="assignedTo">
          <Input placeholder="e.g. Juan Dela Cruz" onChange={handleAssignedToChange} />
        </Form.Item>

        <Form.Item label="Purchase Date" name="purchaseDate">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AssetFormModal