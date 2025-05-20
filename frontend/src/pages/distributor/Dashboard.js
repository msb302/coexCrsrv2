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
  Divider,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  Skeleton,
  Progress,
} from '@chakra-ui/react';
import { 
  FiPackage, 
  FiCreditCard, 
  FiTruck, 
  FiAlertCircle, 
  FiUsers, 
  FiDollarSign 
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../utils/api';
import StatusBadge from '../../components/StatusBadge';

const DistributorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    newOrders: 0,
    pendingPayments: 0,
    activeDeliveries: 0,
    totalSales: 0,
    topPharmacies: [],
    salesPerformance: { current: 0, target: 0 }
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
          newOrders: 8,
          pendingPayments: 12,
          activeDeliveries: 5,
          totalSales: 12750.50,
          topPharmacies: [
            { id: 1, name: 'Al-Shifa Pharmacy', totalOrders: 15, totalValue: 3200.75 },
            { id: 2, name: 'MedCare Pharmacy', totalOrders: 12, totalValue: 2850.25 },
            { id: 3, name: 'Atlas Pharmacy', totalOrders: 9, totalValue: 2100.00 },
          ],
          salesPerformance: { current: 12750.50, target: 15000.00 }
        });

        setRecentOrders([
          {
            id: '2001',
            date: '2023-04-20',
            status: 'pending',
            pharmacy: 'Al-Shifa Pharmacy',
            totalAmount: 950.25,
            items: 18
          },
          {
            id: '2002',
            date: '2023-04-19',
            status: 'accepted',
            pharmacy: 'MedCare Pharmacy',
            totalAmount: 750.50,
            items: 12
          },
          {
            id: '2003',
            date: '2023-04-18',
            status: 'shipped',
            pharmacy: 'Atlas Pharmacy',
            totalAmount: 1350.00,
            items: 22
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

  // Calculate sales performance percentage
  const salesPerformancePercent = stats.salesPerformance.target 
    ? Math.round((stats.salesPerformance.current / stats.salesPerformance.target) * 100) 
    : 0;

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">Distributor Dashboard</Heading>
          <Text color="gray.500">Welcome back, {user?.businessName || 'User'}</Text>
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
          borderColor="green.400"
        >
          <StatLabel color="gray.500" fontWeight="medium">New Orders</StatLabel>
          <Skeleton isLoaded={!loading}>
            <StatNumber fontSize="3xl">{stats.newOrders}</StatNumber>
          </Skeleton>
          <Flex mt={2} align="center">
            <Icon as={FiPackage} color="green.400" />
            <StatHelpText ml={1} mb={0}>
              Awaiting acceptance
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
          borderColor="orange.400"
        >
          <StatLabel color="gray.500" fontWeight="medium">Pending Payments</StatLabel>
          <Skeleton isLoaded={!loading}>
            <StatNumber fontSize="3xl">{stats.pendingPayments}</StatNumber>
          </Skeleton>
          <Flex mt={2} align="center">
            <Icon as={FiCreditCard} color="orange.400" />
            <StatHelpText ml={1} mb={0}>
              To be verified
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
          <StatLabel color="gray.500" fontWeight="medium">Active Deliveries</StatLabel>
          <Skeleton isLoaded={!loading}>
            <StatNumber fontSize="3xl">{stats.activeDeliveries}</StatNumber>
          </Skeleton>
          <Flex mt={2} align="center">
            <Icon as={FiTruck} color="purple.400" />
            <StatHelpText ml={1} mb={0}>
              In transit
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
          <StatLabel color="gray.500" fontWeight="medium">Total Sales (JD)</StatLabel>
          <Skeleton isLoaded={!loading}>
            <StatNumber fontSize="3xl">{stats.totalSales.toFixed(2)}</StatNumber>
          </Skeleton>
          <Flex mt={2} align="center">
            <Icon as={FiDollarSign} color="blue.400" />
            <StatHelpText ml={1} mb={0}>
              This month
            </StatHelpText>
          </Flex>
        </Stat>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
        {/* Recent Orders */}
        <Box>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md">Recent Orders</Heading>
            <Button 
              as={Link} 
              to="/distributor/manage-orders" 
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
            <Card bg={cardBgColor} boxShadow="sm">
              <CardBody>
                <Stack spacing={4}>
                  {[...Array(3)].map((_, i) => (
                    <Box key={i} p={3} borderWidth="1px" borderRadius="md">
                      <Skeleton height="20px" width="120px" mb={2} />
                      <Skeleton height="16px" width="80%" mb={2} />
                      <Skeleton height="16px" width="40%" />
                    </Box>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          ) : (
            <Card bg={cardBgColor} boxShadow="sm">
              <CardBody>
                <Stack spacing={4}>
                  {recentOrders.map((order) => (
                    <Box 
                      key={order.id} 
                      p={3} 
                      borderWidth="1px" 
                      borderRadius="md"
                      _hover={{ borderColor: 'brand.500', shadow: 'sm' }}
                      transition="all 0.2s"
                    >
                      <Flex justify="space-between" align="center" mb={2}>
                        <Text fontWeight="bold">Order #{order.id}</Text>
                        <StatusBadge status={order.status} type="order" />
                      </Flex>
                      <Text fontSize="sm" mb={2}>
                        {order.pharmacy} • {new Date(order.date).toLocaleDateString()}
                      </Text>
                      <Flex justify="space-between" fontSize="sm">
                        <Text color="gray.600">{order.items} items</Text>
                        <Text fontWeight="bold">JD {order.totalAmount.toFixed(2)}</Text>
                      </Flex>
                      <Flex justify="flex-end" mt={2}>
                        <Button 
                          as={Link} 
                          to={`/distributor/manage-orders/${order.id}`} 
                          size="xs" 
                          variant="outline"
                        >
                          View Details
                        </Button>
                      </Flex>
                    </Box>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          )}
        </Box>

        {/* Sales Performance */}
        <Box>
          <Heading size="md" mb={4}>Monthly Performance</Heading>
          <Card bg={cardBgColor} boxShadow="sm">
            <CardBody>
              <Stack spacing={6}>
                <Box>
                  <Flex justify="space-between" mb={2}>
                    <Text fontWeight="medium">Sales Target</Text>
                    <Text>
                      JD {stats.salesPerformance.current.toFixed(2)} / 
                      JD {stats.salesPerformance.target.toFixed(2)}
                    </Text>
                  </Flex>
                  <Progress 
                    value={salesPerformancePercent} 
                    colorScheme={salesPerformancePercent >= 70 ? "green" : "orange"}
                    borderRadius="md"
                    size="sm"
                  />
                  <Flex justify="flex-end">
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      {salesPerformancePercent}% of monthly target
                    </Text>
                  </Flex>
                </Box>

                <Divider />

                <Box>
                  <Text fontWeight="medium" mb={3}>Top Pharmacies</Text>
                  <Stack spacing={3}>
                    {stats.topPharmacies.map((pharmacy) => (
                      <Flex key={pharmacy.id} justify="space-between" align="center">
                        <Flex align="center">
                          <Icon as={FiUsers} color="brand.500" mr={2} />
                          <Text>{pharmacy.name}</Text>
                        </Flex>
                        <Text>JD {pharmacy.totalValue.toFixed(2)}</Text>
                      </Flex>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </CardBody>
            <CardFooter bg="gray.50" borderTopWidth="1px">
              <Button leftIcon={<FiCreditCard />} variant="ghost" size="sm">
                View Payment Reports
              </Button>
            </CardFooter>
          </Card>
        </Box>
      </SimpleGrid>

      {/* Action Cards */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Card bg={cardBgColor} boxShadow="sm">
          <CardBody>
            <Flex direction="column" align="center" textAlign="center">
              <Icon as={FiPackage} fontSize="3xl" color="green.500" mb={3} />
              <Heading size="md" mb={2}>Manage Orders</Heading>
              <Text color="gray.500" mb={4}>
                Accept new orders and track their status throughout the fulfillment process.
              </Text>
            </Flex>
          </CardBody>
          <CardFooter>
            <Button 
              as={Link} 
              to="/distributor/manage-orders" 
              colorScheme="blue" 
              width="full"
            >
              Process Orders
            </Button>
          </CardFooter>
        </Card>

        <Card bg={cardBgColor} boxShadow="sm">
          <CardBody>
            <Flex direction="column" align="center" textAlign="center">
              <Icon as={FiCreditCard} fontSize="3xl" color="orange.500" mb={3} />
              <Heading size="md" mb={2}>Payment Collection</Heading>
              <Text color="gray.500" mb={4}>
                Verify payments and manage outstanding invoices from pharmacies.
              </Text>
            </Flex>
          </CardBody>
          <CardFooter>
            <Button 
              as={Link} 
              to="/distributor/payment-collection" 
              colorScheme="blue" 
              width="full"
            >
              Manage Payments
            </Button>
          </CardFooter>
        </Card>

        <Card bg={cardBgColor} boxShadow="sm">
          <CardBody>
            <Flex direction="column" align="center" textAlign="center">
              <Icon as={FiTruck} fontSize="3xl" color="purple.500" mb={3} />
              <Heading size="md" mb={2}>Manage Deliveries</Heading>
              <Text color="gray.500" mb={4}>
                Schedule deliveries and track shipments to ensure on-time delivery.
              </Text>
            </Flex>
          </CardBody>
          <CardFooter>
            <Button 
              as={Link} 
              to="/distributor/manage-deliveries" 
              colorScheme="blue" 
              width="full"
            >
              Track Deliveries
            </Button>
          </CardFooter>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default DistributorDashboard;