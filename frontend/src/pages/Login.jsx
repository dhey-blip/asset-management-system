import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, Alert, Flex } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { login, saveSession } from '../services/authService'

const { Title, Text } = Typography

function Login() {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(values) {
    setErrorMessage('')
    setLoading(true)

    try {
      const result = await login(values.username, values.password)
      saveSession(result.data.token, result.data.user)
      navigate('/dashboard')
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong. Please try again.'
      setErrorMessage(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Flex
      justify="center"
      align="center"
      style={{ minHeight: '100vh', padding: 16, background: '#f5f5f5' }}
    >
      <Card style={{ width: '100%', maxWidth: 380 }}>
        <Flex vertical align="center" style={{ marginBottom: 24 }}>
          <Title level={3} style={{ marginBottom: 0 }}>
            Asset Management System
          </Title>
          <Text type="secondary">Sign in to continue</Text>
        </Flex>

        {errorMessage && (
          <Alert
            message={errorMessage}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form layout="vertical" onFinish={handleSubmit} disabled={loading}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please enter your username' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" autoFocus />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Log In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  )
}

export default Login