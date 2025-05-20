import React from 'react';
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
  Badge,
  Button,
} from '@chakra-ui/react';

function ManageOrders() {
  // Sample data - replace with actual data from API
  const orders = [
    {
      id: 'ORD001',
      pharmacy: 'City Pharmacy',
      date: '2024-03-07',
      status: 'pending',
      total: '$1,200.00'
    },
    {
      id: 'ORD002',
      pharmacy: 'Health Plus',
      date: '2024-03-06',
      status: 'processing',
      total: '$850.00'
    },
    {
      id: 'ORD003',
      pharmacy: 'MediCare',
      date: '2024-03-05',
      status: 'completed',
      total: '$2,300.00'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'processing':
        return 'blue';
      case 'completed':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <Container maxW="container.xl" py={5}>
      <Heading mb={6}>Manage Orders</Heading>
      
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Order ID</Th>
              <Th>Pharmacy</Th>
              <Th>Date</Th>
              <Th>Status</Th>
              <Th>Total</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <Tr key={order.id}>
                <Td>{order.id}</Td>
                <Td>{order.pharmacy}</Td>
                <Td>{order.date}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </Td>
                <Td>{order.total}</Td>
                <Td>
                  <Button size="sm" colorScheme="blue" mr={2}>
                    View
                  </Button>
                  <Button size="sm" colorScheme="green">
                    Process
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
}

export default ManageOrders; 