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
  Badge,
  Button,
  useColorModeValue,
  Divider,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  Skeleton,
} from '@chakra-ui/react';
import { FiShoppingBag, FiCreditCard, FiTruck, FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../utils/api';
import StatusBadge from '../../components/StatusBadge';

const PharmacyDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pendingOrders: 0,
    pendingPayments: 0,
    incomingDeliveries: 0,
    totalSpent: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
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
          pendingOrders: 3,
          pendingPayments: 2,
          incomingDeliveries: 1,
          totalSpent: 2450.75,
        });

        setRecentOrders([
          {
            id: '1001',
            date: '2023-04-20',
            status: 'delivered',
            totalAmount: 750.25,
            items: 12
          },
          {
            id: '1002',
            date: '2023-04-18',
            status: 'shipped',
            totalAmount: 450.50,
            items: 8
          },
          {
            id: '1003',
            date: '2023-04-15',
            status: 'accepted',
            totalAmount: 1250.00,
            items: 15
          }
        ]);
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

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">Pharmacy Dashboard</Heading>
          <Text color="gray.500">Welcome back, {user?.businessName || 'User'}</Text>
        </Box>
        <Button 
          as={Link} 
          to="/pharmacy/place-order" 
          colorScheme="blue" 
          leftIcon={<Icon as={FiShoppingBag} />}
        >
          Place New Order
        </Button>
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
          borderColor="orange.400"
        >
          <StatLabel color="gray.500" fontWeight="medium">Pending Orders</StatLabel>
          <Skeleton isLoaded={!loading}>
            <StatNumber fontSize="3xl">{stats.pendingOrders}</StatNumber>
          </Skeleton>
          <Flex mt={2} align="center">
            <Icon as={FiShoppingBag} color="orange.400" />
            <StatHelpText ml={1} mb={0}>
              Awaiting processing
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
          borderColor="red.400"
        >
          <StatLabel color="gray.500" fontWeight="medium">Pending Payments</StatLabel>
          <Skeleton isLoaded={!loading}>
            <StatNumber fontSize="3xl">{stats.pendingPayments}</StatNumber>
          </Skeleton>
          <Flex mt={2} align="center">
            <Icon as={FiCreditCard} color="red.400" />
            <StatHelpText ml={1} mb={0}>
              Require payment
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
          <StatLabel color="gray.500" fontWeight="medium">Incoming Deliveries</StatLabel>
          <Skeleton isLoaded={!loading}>
            <StatNumber fontSize="3xl">{stats.incomingDeliveries}</StatNumber>
          </Skeleton>
          <Flex mt={2} align="center">
            <Icon as={FiTruck} color="purple.400" />
            <StatHelpText ml={1} mb={0}>
              On the way
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
          <StatLabel color="gray.500" fontWeight="medium">Total Spent (JD)</StatLabel>
          <Skeleton isLoaded={!loading}>
            <StatNumber fontSize="3xl">{stats.totalSpent.toFixed(2)}</StatNumber>
          </Skeleton>
          <Flex mt={2} align="center">
            <Icon as={FiCreditCard} color="blue.400" />
            <StatHelpText ml={1} mb={0}>
              This month
            </StatHelpText>
          </Flex>
        </Stat>
      </SimpleGrid>

      {/* Recent Orders */}
      <Box mb={8}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">Recent Orders</Heading>
          <Button 
            as={Link} 
            to="/pharmacy/order-history" 
            variant="outline" 
            size="sm"
          >
            View All Orders
          </Button>
        </Flex>

        {error && (
          <Box bg="red.50" p={4} borderRadius="md" mb={4}>
            <Flex align="center">
              <Icon as={FiAlertCircle} color="red.500" mr={2} />
              <Text color="red.500">{error}</Text>
            </Flex>
          </Box>
        )}

        {loading ? (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {[...Array(3)].map((_, i) => (
              <Card key={i} bg={cardBgColor} boxShadow="sm">
                <CardHeader>
                  <Skeleton height="20px" width="120px" mb={2} />
                  <Skeleton height="16px" width="80px" />
                </CardHeader>
                <CardBody>
                  <Skeleton height="20px" mb={2} />
                  <Skeleton height="20px" width="60%" />
                </CardBody>
                <CardFooter>
                  <Skeleton height="32px" width="100px" />
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {recentOrders.map((order) => (
              <Card key={order.id} bg={cardBgColor} boxShadow="sm">
                <CardHeader>
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="bold">Order #{order.id}</Text>
                    <StatusBadge status={order.status} type="order" />
                  </Flex>
                  <Text fontSize="sm" color="gray.500">
                    Placed on {new Date(order.date).toLocaleDateString()}
                  </Text>
                </CardHeader>
                <CardBody py={2}>
                  <Stack spacing={2}>
                    <Flex justify="space-between">
                      <Text color="gray.600">Items:</Text>
                      <Text fontWeight="medium">{order.items}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text color="gray.600">Total (JD):</Text>
                      <Text fontWeight="bold">{order.totalAmount.toFixed(2)}</Text>
                    </Flex>
                  </Stack>
                </CardBody>
                <CardFooter>
                  <Button as={Link} to={`/pharmacy/order-history/${order.id}`} size="sm" variant="outline" width="full">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Box>

      {/* Reminders & Alerts */}
      <Box>
        <Heading size="md" mb={4}>Notifications & Reminders</Heading>
        <Card bg={cardBgColor} boxShadow="sm">
          <CardBody>
            <Stack spacing={4}>
              <Flex align="center">
                <Icon as={FiAlertCircle} color="red.500" mr={3} />
                <Box>
                  <Text fontWeight="medium">Payment Due: Order #1002</Text>
                  <Text fontSize="sm" color="gray.500">Due date: April 25, 2023</Text>
                </Box>
              </Flex>
              <Divider />
              <Flex align="center">
                <Icon as={FiTruck} color="purple.500" mr={3} />
                <Box>
                  <Text fontWeight="medium">Delivery Scheduled: Order #1003</Text>
                  <Text fontSize="sm" color="gray.500">Expected: April 22, 2023</Text>
                </Box>
              </Flex>
              <Divider />
              <Flex align="center">
                <Icon as={FiShoppingBag} color="green.500" mr={3} />
                <Box>
                  <Text fontWeight="medium">Order #1001 Completed</Text>
                  <Text fontSize="sm" color="gray.500">All items delivered successfully</Text>
                </Box>
              </Flex>
            </Stack>
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
};

export default PharmacyDashboard;