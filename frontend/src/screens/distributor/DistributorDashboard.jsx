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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { 
  FiShoppingBag, 
  FiCreditCard, 
  FiTruck, 
  FiAlertCircle, 
  FiPackage, 
  FiDollarSign,
  FiUsers,
  FiCalendar,
  FiUpload,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiEdit,
  FiTrash2,
  FiPlus
} from 'react-icons/fi';
import Navbar from '../../components/Navbar';

function DistributorDashboard() {
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Demo data
  const [stats] = useState({
    // Collecting (Payments) Stats
    totalRevenue: 45000,
    revenueChange: 12.5,
    pendingPayments: 8,
    paymentsChange: -5.2,
    checkPayments: 5,
    creditPayments: 3,
    
    // Ordering Stats
    totalOrders: 45,
    ordersChange: 12.5,
    pendingDeliveries: 12,
    deliveriesChange: -9.05,
    activePharmacies: 28,
    pharmaciesChange: 4.2,
    
    // Expired Items Stats
    expiringItems: 15,
    expiredItems: 5,
    returnRequests: 8,
    collectionScheduled: 3,

    // Recent Orders with payment details
    recentOrders: [
      { 
        id: 'ORD001', 
        date: '2024-03-20', 
        pharmacy: 'Al-Shifa Pharmacy',
        status: 'pending', 
        total: 950.75, 
        items: 15,
        paymentMethod: 'check',
        paymentStatus: 'pending_approval',
        checkImage: 'https://example.com/check1.jpg',
        tier: 'Gold'
      },
      { 
        id: 'ORD002', 
        date: '2024-03-19', 
        pharmacy: 'MedCare Pharmacy',
        status: 'processing', 
        total: 750.50, 
        items: 12,
        paymentMethod: 'credit',
        paymentStatus: 'approved',
        tier: 'Silver'
      },
      { 
        id: 'ORD003', 
        date: '2024-03-18', 
        pharmacy: 'Atlas Pharmacy',
        status: 'shipped', 
        total: 1350.25, 
        items: 22,
        paymentMethod: 'cash',
        paymentStatus: 'pending_confirmation',
        tier: 'Gold'
      },
    ],

    // Pharmacy Tiers
    pharmacyTiers: [
      { name: 'Gold', count: 8, benefits: ['30 days credit', '5% discount', 'Priority delivery'] },
      { name: 'Silver', count: 12, benefits: ['15 days credit', '3% discount', 'Standard delivery'] },
      { name: 'Bronze', count: 8, benefits: ['7 days credit', '1% discount', 'Standard delivery'] },
    ],

    // Expiring Items
    expiringItemsList: [
      { id: 'MED001', name: 'Paracetamol 500mg', expiryDate: '2024-04-15', quantity: 500, pharmacy: 'Al-Shifa', status: 'pending_collection' },
      { id: 'MED002', name: 'Amoxicillin 250mg', expiryDate: '2024-04-20', quantity: 300, pharmacy: 'MedCare', status: 'scheduled' },
      { id: 'MED003', name: 'Omeprazole 20mg', expiryDate: '2024-04-25', quantity: 250, pharmacy: 'Atlas', status: 'pending_request' },
    ],

    // Monthly Statements
    monthlyStatements: [
      { pharmacy: 'Al-Shifa Pharmacy', period: 'March 2024', total: 8500.75, paid: 6500.50, pending: 2000.25, tier: 'Gold' },
      { pharmacy: 'MedCare Pharmacy', period: 'March 2024', total: 6200.25, paid: 5000.00, pending: 1200.25, tier: 'Silver' },
      { pharmacy: 'Atlas Pharmacy', period: 'March 2024', total: 9800.50, paid: 8000.00, pending: 1800.50, tier: 'Gold' },
    ],

    notifications: [
      { type: 'warning', message: '5 check payments pending approval' },
      { type: 'info', message: 'New pharmacy registration: Health Zone' },
      { type: 'success', message: 'Monthly target achieved: 120%' },
      { type: 'warning', message: '3 expired items collections scheduled for tomorrow' },
    ]
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'yellow';
      case 'processing': return 'blue';
      case 'shipped': return 'purple';
      case 'delivered': return 'green';
      default: return 'gray';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'pending_approval': return 'yellow';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'pending_confirmation': return 'blue';
      default: return 'gray';
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Gold': return 'yellow';
      case 'Silver': return 'gray';
      case 'Bronze': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <Box>
      <Navbar />
      <Box pt="20">
        <Container maxW="container.xl" py={5}>
          <Heading mb={6}>Distributor Dashboard</Heading>
          
          {/* Stats Overview */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
            <Stat
              px={4}
              py={5}
              shadow="xl"
              border="1px solid"
              borderColor={borderColor}
              rounded="lg"
              bg={cardBg}
            >
              <StatLabel>Total Revenue (JD)</StatLabel>
              <StatNumber>{stats.totalRevenue}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                {stats.revenueChange}%
              </StatHelpText>
            </Stat>

            <Stat
              px={4}
              py={5}
              shadow="xl"
              border="1px solid"
              borderColor={borderColor}
              rounded="lg"
              bg={cardBg}
            >
              <StatLabel>Pending Payments</StatLabel>
              <StatNumber>{stats.pendingPayments}</StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
                {stats.paymentsChange}%
              </StatHelpText>
            </Stat>

            <Stat
              px={4}
              py={5}
              shadow="xl"
              border="1px solid"
              borderColor={borderColor}
              rounded="lg"
              bg={cardBg}
            >
              <StatLabel>Active Pharmacies</StatLabel>
              <StatNumber>{stats.activePharmacies}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                {stats.pharmaciesChange}%
              </StatHelpText>
            </Stat>

            <Stat
              px={4}
              py={5}
              shadow="xl"
              border="1px solid"
              borderColor={borderColor}
              rounded="lg"
              bg={cardBg}
            >
              <StatLabel>Expiring Items</StatLabel>
              <StatNumber>{stats.expiringItems}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                {stats.returnRequests} requests
              </StatHelpText>
            </Stat>
          </SimpleGrid>

          {/* Main Content Tabs */}
          <Tabs variant="enclosed" colorScheme="blue" mb={8}>
            <TabList>
              <Tab>Orders & Payments</Tab>
              <Tab>Pharmacy Tiers</Tab>
              <Tab>Expired Items</Tab>
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
                          <Th>Pharmacy</Th>
                          <Th>Tier</Th>
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
                            <Td>{order.pharmacy}</Td>
                            <Td>
                              <Badge colorScheme={getTierColor(order.tier)}>
                                {order.tier}
                              </Badge>
                            </Td>
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
                                  <Button size="xs" leftIcon={<FiEye />} onClick={onOpen}>
                                    View Check
                                  </Button>
                                )}
                              </Flex>
                            </Td>
                            <Td>JD {order.total}</Td>
                            <Td>
                              <HStack spacing={2}>
                                <Button size="sm" variant="ghost" leftIcon={<FiCheckCircle />}>
                                  Approve
                                </Button>
                                <Button size="sm" variant="ghost" leftIcon={<FiXCircle />}>
                                  Reject
                                </Button>
                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </CardBody>
                </Card>
              </TabPanel>

              {/* Pharmacy Tiers Panel */}
              <TabPanel>
                <Card bg={cardBg} shadow="sm">
                  <CardHeader>
                    <Flex justify="space-between" align="center">
                      <Heading size="md">Pharmacy Tiers</Heading>
                      <Button leftIcon={<FiPlus />} colorScheme="blue" size="sm">
                        Add Tier
                      </Button>
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                      {stats.pharmacyTiers.map((tier) => (
                        <Card key={tier.name} bg={useColorModeValue('gray.50', 'gray.600')}>
                          <CardHeader>
                            <Flex justify="space-between" align="center">
                              <Heading size="md">{tier.name}</Heading>
                              <Badge colorScheme={getTierColor(tier.name)}>
                                {tier.count} Pharmacies
                              </Badge>
                            </Flex>
                          </CardHeader>
                          <CardBody>
                            <Stack spacing={2}>
                              {tier.benefits.map((benefit, index) => (
                                <Flex key={index} align="center">
                                  <Icon as={FiCheckCircle} color="green.500" mr={2} />
                                  <Text>{benefit}</Text>
                                </Flex>
                              ))}
                            </Stack>
                          </CardBody>
                          <CardFooter>
                            <Button size="sm" variant="ghost" leftIcon={<FiEdit />}>
                              Edit Tier
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </SimpleGrid>
                  </CardBody>
                </Card>
              </TabPanel>

              {/* Expired Items Panel */}
              <TabPanel>
                <Card bg={cardBg} shadow="sm">
                  <CardHeader>
                    <Heading size="md">Expired Items Management</Heading>
                  </CardHeader>
                  <CardBody>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Product</Th>
                          <Th>Expiry Date</Th>
                          <Th>Quantity</Th>
                          <Th>Pharmacy</Th>
                          <Th>Status</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {stats.expiringItemsList.map((item) => (
                          <Tr key={item.id}>
                            <Td>{item.name}</Td>
                            <Td>{item.expiryDate}</Td>
                            <Td>{item.quantity}</Td>
                            <Td>{item.pharmacy}</Td>
                            <Td>
                              <Badge colorScheme={
                                item.status === 'pending_collection' ? 'yellow' :
                                item.status === 'scheduled' ? 'blue' :
                                'gray'
                              }>
                                {item.status.replace('_', ' ')}
                              </Badge>
                            </Td>
                            <Td>
                              <Button size="sm" colorScheme="blue" variant="outline">
                                Schedule Collection
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
                          <Th>Pharmacy</Th>
                          <Th>Tier</Th>
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
                            <Td>{statement.pharmacy}</Td>
                            <Td>
                              <Badge colorScheme={getTierColor(statement.tier)}>
                                {statement.tier}
                              </Badge>
                            </Td>
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
                          notification.type === 'info' ? FiUsers : FiDollarSign}
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

      {/* Check Image Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Check Image</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image src="https://example.com/check1.jpg" alt="Check Image" />
            <Stack spacing={4} mt={4}>
              <Button colorScheme="green" leftIcon={<FiCheckCircle />}>
                Approve Check
              </Button>
              <Button colorScheme="red" leftIcon={<FiXCircle />}>
                Reject Check
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default DistributorDashboard; 