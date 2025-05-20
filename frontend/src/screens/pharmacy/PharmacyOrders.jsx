import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  Flex,
  Badge,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function PharmacyOrders({ onLogout }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [orders] = useState([
    {
      id: 'ORD001',
      date: '2024-03-15',
      items: 5,
      total: '$1,250',
      status: 'pending',
    },
    {
      id: 'ORD002',
      date: '2024-03-14',
      items: 3,
      total: '$750',
      status: 'delivered',
    },
    {
      id: 'ORD003',
      date: '2024-03-13',
      items: 7,
      total: '$1,750',
      status: 'processing',
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'processing':
        return 'blue';
      case 'delivered':
        return 'green';
      default:
        return 'gray';
    }
  };

  const handleNewOrder = () => {
    // In a real app, this would open a new order form
    toast({
      title: "New Order",
      description: "Order form will be implemented soon",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" p={4} bg="white" shadow="sm">
        <Heading size="md">COEx Pharmacy</Heading>
        <HStack spacing={4}>
          <Button variant="ghost" onClick={() => navigate('/pharmacy/dashboard')}>
            Dashboard
          </Button>
          <Button variant="ghost" onClick={() => navigate('/pharmacy/inventory')}>
            Inventory
          </Button>
          <Button variant="ghost" onClick={() => navigate('/pharmacy/payments')}>
            Payments
          </Button>
          <Button colorScheme="red" variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </HStack>
      </Flex>

      <Container maxW="container.xl" py={5}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">Orders</Heading>
          <Button colorScheme="blue" onClick={handleNewOrder}>
            New Order
          </Button>
        </Flex>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Order ID</Th>
                <Th>Date</Th>
                <Th>Items</Th>
                <Th>Total</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.map((order) => (
                <Tr key={order.id}>
                  <Td>{order.id}</Td>
                  <Td>{order.date}</Td>
                  <Td>{order.items}</Td>
                  <Td>{order.total}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(order.status)}>
                      {order.status}
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
        </Box>
      </Container>
    </Box>
  );
}

export default PharmacyOrders; 