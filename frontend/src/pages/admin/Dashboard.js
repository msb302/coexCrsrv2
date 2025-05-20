import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Flex,
  Button,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Skeleton,
  Divider,
  Alert,
  AlertIcon,
  Progress,
} from '@chakra-ui/react';
import { 
  FiUsers, 
  FiShoppingBag, 
  FiCreditCard, 
  FiAlertCircle, 
  FiAlertTriangle, 
  FiCheckCircle,
  FiBarChart2
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../utils/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activePharmacies: 0,
    activeDistributors: 0,
    totalTransactions: 0,
    recentUsers: [],
    creditLimitAlerts: [],
    systemAlerts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // In a real implementation, we would fetch this data from the API
        // For now, we'll simulate a delay and use hardcoded data
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Example data - in real app this would come from API
        setStats({
          totalUsers: 56,
          activePharmacies: 35,
          activeDistributors: 8,
          totalTransactions: 248,
          recentUsers: [
            { id: 1, username: 'alshifa123', businessName: 'Al-Shifa Pharmacy', role: 'pharmacy', registeredDate: '2023-04-15' },
            { id: 2, username: 'medmarket', businessName: 'MedMarket Distributor', role: 'distributor', registeredDate: '2023-04-12' },
            { id: 3, username: 'atlaspharm', businessName: 'Atlas Pharmacy', role: 'pharmacy', registeredDate: '2023-04-10' },
            { id: 4, username: 'jordanmed', businessName: 'Jordan Medical Supplies', role: 'distributor', registeredDate: '2023-04-08' },
            { id: 5, username: 'healthzone', businessName: 'Health Zone Pharmacy', role: 'pharmacy', registeredDate: '2023-04-05' },
          ],
          creditLimitAlerts: [
            { id: 1, pharmacy: 'Noor Pharmacy', currentLimit: 2000, currentBalance: 1850, status: 'warning' },
            { id: 2, pharmacy: 'MedCare Pharmacy', currentLimit: 5000, currentBalance: 4750, status: 'warning' },
            { id: 3, pharmacy: 'Health First', currentLimit: 3000, currentBalance: 3200, status: 'exceeded' },
          ],
          systemAlerts: [
            { id: 1, message: 'System update scheduled for April 30, 2023', type: 'info' },
            { id: 2, message: 'Health First Pharmacy exceeded credit limit by JD 200', type: 'warning' },
            { id: 3, message: 'New distributor registration: Jordan Medical Supplies', type: 'success' },
          ]
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Card background styles
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const statBgColor = useColorModeValue('gray.50', 'gray.700');

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">Admin Dashboard</Heading>
          <Text color="gray.500">Welcome back, Administrator</Text>
        </Box>
      </Flex>

      {/* Stats */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Stat
          px={4}
          py={5}
          bg={statBgColor}
          rounded="lg"
          boxShadow="sm"
          borderLeft="4px solid"
          borderColor="brand.500"
        >
          <StatLabel color="gray.500" fontWeight="medium">Total Users</StatLabel>
          <Skeleton isLoaded={!loading}>
            <StatNumber fontSize="3xl">{stats.totalUsers}</StatNumber>
          </Skeleton>
          <Flex mt={2} align="center">
            <Icon as={FiUsers} color="brand.500" />
            <StatHelpText ml={1} mb={0}>
              Registered accounts
            </StatHelpText>
          </Flex>
        </Stat>

        <Stat
          px={4}
          py={5}
          bg={statBgColor}
          rounded="lg"
          boxShadow="sm"
          borderLeft="4px solid"
          borderColor="green.400"
        >
          <StatLabel color="gray.500" fontWeight="medium">Active Pharmacies</StatLabel>
          <Skeleton isLoaded={!loading}>
            <StatNumber fontSize="3xl">{stats.activePharmacies}</StatNumber>
          </Skeleton>
          <Flex mt={2} align="center">
            <Icon as={FiUsers} color="green.400" />
            <StatHelpText ml={1} mb={0}>
              Pharmacy accounts
            </StatHelpText>
          </Flex>
        </Stat>

        <Stat
          px={4}
          py={5}
          bg={statBgColor}
          rounded="lg"
          boxShadow="sm"
          borderLeft="4px solid"
          borderColor="blue.400"
        >
          <StatLabel color="gray.500" fontWeight="medium">Active Distributors</StatLabel>
          <Skeleton isLoaded={!loading}>
            <StatNumber fontSize="3xl">{stats.activeDistributors}</StatNumber>
          </Skeleton>
          <Flex mt={2} align="center">
            <Icon as={FiUsers} color="blue.400" />
            <StatHelpText ml={1} mb={0}>
              Distributor accounts
            </StatHelpText>
          </Flex>
        </Stat>

        <Stat
          px={4}
          py={5}
          bg={statBgColor}
          rounded="lg"
          boxShadow="sm"
          borderLeft="4px solid"
          borderColor="purple.400"
        >
          <StatLabel color="gray.500" fontWeight="medium">Total Transactions</StatLabel>
          <Skeleton isLoaded={!loading}>
            <StatNumber fontSize="3xl">{stats.totalTransactions}</StatNumber>
          </Skeleton>
          <Flex mt={2} align="center">
            <Icon as={FiBarChart2} color="purple.400" />
            <StatHelpText ml={1} mb={0}>
              Orders processed
            </StatHelpText>
          </Flex>
        </Stat>
      </SimpleGrid>

      {/* Credit Limit Alerts */}
      <Box mb={8}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">Credit Limit Alerts</Heading>
          <Button 
            as={Link} 
            to="/admin/credit-limits" 
            variant="outline" 
            size="sm"
            rightIcon={<Icon as={FiCreditCard} />}
          >
            Manage Credit Limits
          </Button>
        </Flex>

        {error && (
          <Alert status="error" borderRadius="md" mb={4}>
            <AlertIcon />
            <Text>{error}</Text>
          </Alert>
        )}

        {loading ? (
          <Card bg={cardBgColor} boxShadow="sm">
            <CardBody>
              <Stack spacing={4}>
                {[...Array(3)].map((_, i) => (
                  <Box key={i}>
                    <Skeleton height="24px" mb={2} />
                    <Skeleton height="16px" width="70%" mb={2} />
                    <Skeleton height="8px" width="100%" />
                  </Box>
                ))}
              </Stack>
            </CardBody>
          </Card>
        ) : (
          <Card bg={cardBgColor} boxShadow="sm">
            <CardBody>
              <Stack spacing={4}>
                {stats.creditLimitAlerts.map((alert) => (
                  <Box key={alert.id}>
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
        )}
      </Box>

      {/* Recent Users */}
      <Box mb={8}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">Recent User Registrations</Heading>
          <Button 
            as={Link} 
            to="/admin/manage-users" 
            variant="outline" 
            size="sm"
            rightIcon={<Icon as={FiUsers} />}
          >
            Manage Users
          </Button>
        </Flex>

        <Card bg={cardBgColor} boxShadow="sm" overflowX="auto">
          <CardBody p={0}>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr bg="gray.50">
                  <Th>Business Name</Th>
                  <Th>Username</Th>
                  <Th>Role</Th>
                  <Th>Registered</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <Tr key={i}>
                      <Td><Skeleton height="20px" width="120px" /></Td>
                      <Td><Skeleton height="20px" width="100px" /></Td>
                      <Td><Skeleton height="20px" width="80px" /></Td>
                      <Td><Skeleton height="20px" width="80px" /></Td>
                      <Td><Skeleton height="20px" width="60px" /></Td>
                    </Tr>
                  ))
                ) : (
                  stats.recentUsers.map((user) => (
                    <Tr key={user.id}>
                      <Td fontWeight="medium">{user.businessName}</Td>
                      <Td>{user.username}</Td>
                      <Td>
                        <Badge 
                          colorScheme={user.role === 'pharmacy' ? 'green' : 'blue'}
                          textTransform="capitalize"
                        >
                          {user.role}
                        </Badge>
                      </Td>
                      <Td>{formatDate(user.registeredDate)}</Td>
                      <Td>
                        <Button 
                          as={Link} 
                          to={`/admin/manage-users/${user.id}`}
                          size="xs" 
                          variant="outline"
                        >
                          View
                        </Button>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </Box>

      {/* System Alerts */}
      <Box>
        <Heading size="md" mb={4}>System Alerts</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          {stats.systemAlerts.map((alert) => (
            <Alert 
              key={alert.id} 
              status={alert.type}
              variant="left-accent"
              borderRadius="md"
            >
              <AlertIcon />
              <Box>
                <Text fontSize="sm">{alert.message}</Text>
              </Box>
            </Alert>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;