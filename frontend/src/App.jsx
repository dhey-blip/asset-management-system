import { Button, Flex, Tag, Typography } from 'antd'

const { Title, Paragraph } = Typography

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <Flex vertical gap="middle">
        <Title level={2}>Asset Management System</Title>
        <Paragraph>
          Frontend setup test. If you can see a styled button and tag below,
          React, Vite, and Ant Design are all working.
        </Paragraph>
        <Flex gap="small" align="center" wrap>
          <Button type="primary">Test Button</Button>
          <Tag color="success">Ant Design works</Tag>
        </Flex>
      </Flex>
    </div>
  )
}

export default App