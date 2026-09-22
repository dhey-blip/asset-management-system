import { Typography, Button, Flex } from 'antd'
import { getCurrentUser, logout } from '../services/authService'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph } = Typography

function Dashboard() {
  const user = getCurrentUser()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ padding: 24 }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>
          Dashboard
        </Title>
        <Button onClick={handleLogout}>Logout</Button>
      </Flex>
      <Paragraph>
        Logged in as <strong>{user?.username}</strong> (role: {user?.role}).
      </Paragraph>
      <Paragraph type="secondary">
        This is a placeholder. The real dashboard with summary cards and a
        recent-assets table is built in a later phase.
      </Paragraph>
    </div>
  )
}

export default Dashboard