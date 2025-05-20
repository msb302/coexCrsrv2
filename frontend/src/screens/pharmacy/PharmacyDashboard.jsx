import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Button,
  HStack,
  Flex,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Progress,
  Stack,
  Icon,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Image,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { 
  FiShoppingBag, 
  FiCreditCard, 
  FiTruck, 
  FiAlertCircle, 
  FiPackage, 
  FiDollarSign,
  FiCalendar,
  FiUpload,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';

function PharmacyDashboard({ onLogout }) {
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Demo data
  const [stats] = useState({
    // Collecting (Payments) Stats
    totalOrders: 23,
    ordersChange: 15.36,
    pendingPayments: 3,
    paymentsChange: -5.2,
    creditLimit: 5000,
    creditUsed: 3200,
    tier: 'Gold',
    tierBenefits: ['30 days credit', '5% discount', 'Priority delivery'],
    
    // Ordering Stats
    lowStockItems: 8,
    stockChange: -2.05,
    pendingDeliveries: 5,
    deliveriesChange: 3.2,
    
    // Expired Items Stats
    expiringItems: 12,
    expiredItems: 3,
    returnRequests: 2,

    // Recent Orders with more details
    recentOrders: [
      { 
        id: 'ORD001', 
        date: '2024-03-20', 
        status: 'pending', 
        total: 450.75, 
        items: 8,
        distributor: 'MedMarket',
        paymentMethod: 'check',
        paymentStatus: 'pending_approval',
        checkImage: 'https://example.com/check1.jpg'
      },
      { 
        id: 'ORD002', 
        date: '2024-03-19', 
        status: 'processing', 
        total: 320.50, 
        items: 5,
        distributor: 'Jordan Medical',
        paymentMethod: 'credit',
        paymentStatus: 'approved'
      },
      { 
        id: 'ORD003', 
        date: '2024-03-18', 
        status: 'delivered', 
        total: 780.25, 
        items: 12,
        distributor: 'MedMarket',
        paymentMethod: 'cash',
        paymentStatus: 'confirmed'
      },
    ],

    // Expiring Items
    expiringItemsList: [
      { id: 'MED001', name: 'Paracetamol 500mg', expiryDate: '2024-04-15', quantity: 50, distributor: 'MedMarket' },
      { id: 'MED002', name: 'Amoxicillin 250mg', expiryDate: '2024-04-20', quantity: 30, distributor: 'Jordan Medical' },
      { id: 'MED003', name: 'Omeprazole 20mg', expiryDate: '2024-04-25', quantity: 25, distributor: 'MedMarket' },
    ],

    // Monthly Statements
    monthlyStatements: [
      { distributor: 'MedMarket', period: 'March 2024', total: 2500.75, paid: 1800.50, pending: 700.25 },
      { distributor: 'Jordan Medical', period: 'March 2024', total: 1800.25, paid: 1500.00, pending: 300.25 },
    ],

    notifications: [
      { type: 'warning', message: '3 items are running low on stock' },
      { type: 'info', message: 'New delivery scheduled for tomorrow' },
      { type: 'success', message: 'Payment received for Order #ORD003' },
      { type: 'warning', message: '5 items expiring within 30 days' },
    ]
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'yellow';
      case 'processing': return 'blue';
      case 'delivered': return 'green';
      default: return 'gray';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'pending_approval': return 'yellow';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'confirmed': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" p={4} bg="white" shadow="sm">
        <Heading size="md">COEx Pharmacy</Heading>
        <HStack spacing={4}>
          <Button variant="ghost" onClick={() => navigate('/pharmacy/orders')}>
            Orders
          </Button>
          <Button variant="ghost" onClick={() => navigate('/pharmacy/inventory')}>
            Inventory
          </Button>
          <Button variant="ghost" onClick={() => navigate('/pharmacy/payments')}>
            Payments
          </Button>
          <Button variant="ghost" onClick={() => navigate('/pharmacy/marketplace')}>
            Marketplace
          </Button>
          <Button colorScheme="red" variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </HStack>
      </Flex>

      <Container maxW="container.xl" py={5}>
        <Heading mb={6}>Pharmacy Dashboard</Heading>
        
        {/* Tier Information */}
        <Card mb={8} bg={cardBg} shadow="sm">
          <CardHeader>
            <Heading size="md">Your Tier: {stats.tier}</Heading>
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              <Flex justify="space-between">
                <Text>Credit Limit: JD {stats.creditLimit}</Text>
                <Text>Used: JD {stats.creditUsed}</Text>
              </Flex>
              <Progress 
                value={(stats.creditUsed / stats.creditLimit) * 100} 
                colorScheme={stats.creditUsed > stats.creditLimit * 0.8 ? 'red' : 'green'}
                size="lg"
                borderRadius="full"
              />
              <SimpleGrid columns={3} spacing={4}>
                {stats.tierBenefits.map((benefit, index) => (
                  <Flex key={index} align="center" p={2} bg={useColorModeValue('gray.50', 'gray.600')} rounded="md">
                    <Icon as={FiCheckCircle} color="green.500" mr={2} />
                    <Text>{benefit}</Text>
                  </Flex>
                ))}
              </SimpleGrid>
            </Stack>
          </CardBody>
        </Card>

        {/* Main Content Tabs */}
        <Tabs variant="enclosed" colorScheme="blue" mb={8}>
          <TabList>
            <Tab>Orders & Payments</Tab>
            <Tab>Expiring Items</Tab>
            <Tab>Monthly Statements</Tab>
          </TabList>

          <TabPanels>
            {/* Orders & Payments Panel */}
            <TabPanel>
              <Card bg={cardBg} shadow="sm">
                <CardHeader>
                  <Heading size="md">Recent Orders & Payments</Heading>
                </CardHeader>
                <CardBody>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Order ID</Th>
                        <Th>Date</Th>
                        <Th>Distributor</Th>
                        <Th>Status</Th>
                        <Th>Payment</Th>
                        <Th>Total</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {stats.recentOrders.map((order) => (
                        <Tr key={order.id}>
                          <Td>{order.id}</Td>
                          <Td>{order.date}</Td>
                          <Td>{order.distributor}</Td>
                          <Td>
                            <Badge colorScheme={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </Td>
                          <Td>
                            <Flex align="center">
                              <Badge colorScheme={getPaymentStatusColor(order.paymentStatus)} mr={2}>
                                {order.paymentStatus.replace('_', ' ')}
                              </Badge>
                              {order.paymentMethod === 'check' && (
                                <Button size="xs" leftIcon={<FiUpload />}>
                                  View Check
                                </Button>
                              )}
                            </Flex>
                          </Td>
                          <Td>JD {order.total}</Td>
                          <Td>
                            <Button size="sm" variant="ghost">
                              Details
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
            </TabPanel>

            {/* Expiring Items Panel */}
            <TabPanel>
              <Card bg={cardBg} shadow="sm">
                <CardHeader>
                  <Heading size="md">Expiring Items</Heading>
                </CardHeader>
                <CardBody>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Product</Th>
                        <Th>Expiry Date</Th>
                        <Th>Quantity</Th>
                        <Th>Distributor</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {stats.expiringItemsList.map((item) => (
                        <Tr key={item.id}>
                          <Td>{item.name}</Td>
                          <Td>{item.expiryDate}</Td>
                          <Td>{item.quantity}</Td>
                          <Td>{item.distributor}</Td>
                          <Td>
                            <Button size="sm" colorScheme="orange" variant="outline">
                              Request Return
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
            </TabPanel>

            {/* Monthly Statements Panel */}
            <TabPanel>
              <Card bg={cardBg} shadow="sm">
                <CardHeader>
                  <Heading size="md">Monthly Statements</Heading>
                </CardHeader>
                <CardBody>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Distributor</Th>
                        <Th>Period</Th>
                        <Th>Total</Th>
                        <Th>Paid</Th>
                        <Th>Pending</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {stats.monthlyStatements.map((statement, index) => (
                        <Tr key={index}>
                          <Td>{statement.distributor}</Td>
                          <Td>{statement.period}</Td>
                          <Td>JD {statement.total}</Td>
                          <Td>JD {statement.paid}</Td>
                          <Td>JD {statement.pending}</Td>
                          <Td>
                            <Button size="sm" variant="ghost" leftIcon={<FiUpload />}>
                              Export
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Notifications */}
        <Card bg={cardBg} shadow="sm">
          <CardHeader>
            <Heading size="md">Notifications</Heading>
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              {stats.notifications.map((notification, index) => (
                <Flex key={index} align="center" p={3} bg={useColorModeValue('gray.50', 'gray.600')} rounded="md">
                  <Icon 
                    as={notification.type === 'warning' ? FiAlertCircle : 
                        notification.type === 'info' ? FiTruck : FiDollarSign}
                    color={notification.type === 'warning' ? 'orange.500' : 
                           notification.type === 'info' ? 'blue.500' : 'green.500'}
                    mr={3}
                  />
                  <Text>{notification.message}</Text>
                </Flex>
              ))}
            </Stack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}

export default PharmacyDashboard; 