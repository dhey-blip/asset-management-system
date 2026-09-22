import { Typography } from 'antd'
import { getCurrentUser } from '../services/authService'

const { Title, Paragraph } = Typography

function Dashboard() {
  const user = getCurrentUser()

  return (
    <div>
      <Title level={3}>Dashboard</Title>
      <Paragraph>
        Welcome, <strong>{user?.username}</strong>. Summary cards and a recent-assets
        table will be built here in a later phase.
      </Paragraph>
    </div>
  )
}

export default Dashboard