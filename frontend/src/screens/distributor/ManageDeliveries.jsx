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
  Text,
} from '@chakra-ui/react';

function ManageDeliveries() {
  // Sample data - replace with actual data from API
  const deliveries = [
    {
      id: 'DEL001',
      orderId: 'ORD001',
      pharmacy: 'City Pharmacy',
      address: '123 Main St, City',
      status: 'scheduled',
      date: '2024-03-08'
    },
    {
      id: 'DEL002',
      orderId: 'ORD002',
      pharmacy: 'Health Plus',
      address: '456 Oak Ave, Town',
      status: 'in_transit',
      date: '2024-03-07'
    },
    {
      id: 'DEL003',
      orderId: 'ORD003',
      pharmacy: 'MediCare',
      address: '789 Pine Rd, Village',
      status: 'delivered',
      date: '2024-03-06'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'yellow';
      case 'in_transit':
        return 'blue';
      case 'delivered':
        return 'green';
      default:
        return 'gray';
    }
  };

  const formatStatus = (status) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Container maxW="container.xl" py={5}>
      <Heading mb={6}>Manage Deliveries</Heading>
      
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Delivery ID</Th>
              <Th>Order ID</Th>
              <Th>Pharmacy</Th>
              <Th>Address</Th>
              <Th>Status</Th>
              <Th>Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {deliveries.map((delivery) => (
              <Tr key={delivery.id}>
                <Td>{delivery.id}</Td>
                <Td>{delivery.orderId}</Td>
                <Td>{delivery.pharmacy}</Td>
                <Td>
                  <Text noOfLines={1}>{delivery.address}</Text>
                </Td>
                <Td>
                  <Badge colorScheme={getStatusColor(delivery.status)}>
                    {formatStatus(delivery.status)}
                  </Badge>
                </Td>
                <Td>{delivery.date}</Td>
                <Td>
                  <Button size="sm" colorScheme="blue" mr={2}>
                    Track
                  </Button>
                  <Button size="sm" colorScheme="green">
                    Update
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

export default ManageDeliveries; 