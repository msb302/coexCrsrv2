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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUsers, 
  FiShoppingBag, 
  FiCreditCard, 
  FiAlertCircle, 
  FiPackage, 
  FiDollarSign,
  FiSettings,
  FiShield
} from 'react-icons/fi';

function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Demo data
  const [stats] = useState({
    totalUsers: 56,
    usersChange: 8.5,
    activePharmacies: 35,
    pharmaciesChange: 5.2,
    activeDistributors: 8,
    distributorsChange: 2.1,
    totalTransactions: 248,
    transactionsChange: 15.8,
    recentUsers: [
      { id: 1, username: 'alshifa123', businessName: 'Al-Shifa Pharmacy', role: 'pharmacy', registeredDate: '2024-03-15', status: 'active' },
      { id: 2, username: 'medmarket', businessName: 'MedMarket Distributor', role: 'distributor', registeredDate: '2024-03-12', status: 'pending' },
      { id: 3, username: 'atlaspharm', businessName: 'Atlas Pharmacy', role: 'pharmacy', registeredDate: '2024-03-10', status: 'active' },
      { id: 4, username: 'jordanmed', businessName: 'Jordan Medical Supplies', role: 'distributor', registeredDate: '2024-03-08', status: 'active' },
      { id: 5, username: 'healthzone', businessName: 'Health Zone Pharmacy', role: 'pharmacy', registeredDate: '2024-03-05', status: 'suspended' },
    ],
    creditLimitAlerts: [
      { id: 1, pharmacy: 'Noor Pharmacy', currentLimit: 2000, currentBalance: 1850, status: 'warning' },
      { id: 2, pharmacy: 'MedCare Pharmacy', currentLimit: 5000, currentBalance: 4750, status: 'warning' },
      { id: 3, pharmacy: 'Health First', currentLimit: 3000, currentBalance: 3200, status: 'exceeded' },
    ],
    systemAlerts: [
      { id: 1, message: 'System update scheduled for March 30, 2024', type: 'info' },
      { id: 2, message: 'Health First Pharmacy exceeded credit limit by JD 200', type: 'warning' },
      { id: 3, message: 'New distributor registration: Jordan Medical Supplies', type: 'success' },
    ]
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'pending': return 'yellow';
      case 'suspended': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" p={4} bg="white" shadow="sm">
        <Heading size="md">COEx Admin</Heading>
        <HStack spacing={4}>
          <Button variant="ghost" onClick={() => navigate('/admin/users')}>
            Users
          </Button>
          <Button variant="ghost" onClick={() => navigate('/admin/settings')}>
            Settings
          </Button>
          <Button variant="ghost" onClick={() => navigate('/admin/reports')}>
            Reports
          </Button>
          <Button colorScheme="red" variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </HStack>
      </Flex>

      <Container maxW="container.xl" py={5}>
        <Heading mb={6}>Admin Dashboard</Heading>
        
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
            <StatLabel>Total Users</StatLabel>
            <StatNumber>{stats.totalUsers}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {stats.usersChange}%
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
            <StatLabel>Active Distributors</StatLabel>
            <StatNumber>{stats.activeDistributors}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {stats.distributorsChange}%
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
            <StatLabel>Total Transactions</StatLabel>
            <StatNumber>{stats.totalTransactions}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {stats.transactionsChange}%
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Main Content Tabs */}
        <Tabs variant="enclosed" colorScheme="blue" mb={8}>
          <TabList>
            <Tab>Recent Users</Tab>
            <Tab>Credit Alerts</Tab>
            <Tab>System Alerts</Tab>
          </TabList>

          <TabPanels>
            {/* Recent Users Panel */}
            <TabPanel>
              <Card bg={cardBg} shadow="sm">
                <CardHeader>
                  <Heading size="md">Recent User Registrations</Heading>
                </CardHeader>
                <CardBody>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Business Name</Th>
                        <Th>Username</Th>
                        <Th>Role</Th>
                        <Th>Registered Date</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {stats.recentUsers.map((user) => (
                        <Tr key={user.id}>
                          <Td fontWeight="medium">{user.businessName}</Td>
                          <Td>{user.username}</Td>
                          <Td>
                            <Badge colorScheme={user.role === 'pharmacy' ? 'green' : 'blue'}>
                              {user.role}
                            </Badge>
                          </Td>
                          <Td>{user.registeredDate}</Td>
                          <Td>
                            <Badge colorScheme={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                          </Td>
                          <Td>
                            <Button size="sm" variant="ghost">
                              View Details
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
            </TabPanel>

            {/* Credit Alerts Panel */}
            <TabPanel>
              <Card bg={cardBg} shadow="sm">
                <CardHeader>
                  <Heading size="md">Credit Limit Alerts</Heading>
                </CardHeader>
                <CardBody>
                  <Stack spacing={4}>
                    {stats.creditLimitAlerts.map((alert) => (
                      <Box key={alert.id} p={4} bg={useColorModeValue('gray.50', 'gray.600')} rounded="md">
                        <Flex justify="space-between" align="center" mb={2}>
                          <Text fontWeight="medium">{alert.pharmacy}</Text>
                          <Badge colorScheme={alert.status === 'exceeded' ? 'red' : 'orange'}>
                            {alert.status === 'exceeded' ? 'Limit Exceeded' : 'Approaching Limit'}
                          </Badge>
                        </Flex>
                        <Text fontSize="sm" color="gray.600" mb={2}>
                          {alert.status === 'exceeded' 
                            ? `Exceeded limit by JD ${(alert.currentBalance - alert.currentLimit).toFixed(2)}` 
                            : `JD ${alert.currentBalance.toFixed(2)} of JD ${alert.currentLimit.toFixed(2)} limit used`}
                        </Text>
                        <Progress 
                          value={(alert.currentBalance / alert.currentLimit) * 100} 
                          colorScheme={alert.status === 'exceeded' ? 'red' : 'orange'}
                          size="sm"
                          borderRadius="full"
                        />
                      </Box>
                    ))}
                  </Stack>
                </CardBody>
              </Card>
            </TabPanel>

            {/* System Alerts Panel */}
            <TabPanel>
              <Card bg={cardBg} shadow="sm">
                <CardHeader>
                  <Heading size="md">System Alerts</Heading>
                </CardHeader>
                <CardBody>
                  <Stack spacing={4}>
                    {stats.systemAlerts.map((alert) => (
                      <Flex key={alert.id} align="center" p={3} bg={useColorModeValue('gray.50', 'gray.600')} rounded="md">
                        <Icon 
                          as={alert.type === 'warning' ? FiAlertCircle : 
                              alert.type === 'info' ? FiSettings : FiShield}
                          color={alert.type === 'warning' ? 'orange.500' : 
                                 alert.type === 'info' ? 'blue.500' : 'green.500'}
                          mr={3}
                        />
                        <Text>{alert.message}</Text>
                      </Flex>
                    ))}
                  </Stack>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
}

export default AdminDashboard; 