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
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

function PaymentCollection() {
  // Sample data - replace with actual data from API
  const payments = [
    {
      id: 'PAY001',
      pharmacy: 'City Pharmacy',
      amount: '$1,200.00',
      date: '2024-03-07',
      status: 'pending',
      method: 'Check'
    },
    {
      id: 'PAY002',
      pharmacy: 'Health Plus',
      amount: '$850.00',
      date: '2024-03-06',
      status: 'verified',
      method: 'Bank Transfer'
    },
    {
      id: 'PAY003',
      pharmacy: 'MediCare',
      amount: '$2,300.00',
      date: '2024-03-05',
      status: 'completed',
      method: 'Check'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'verified':
        return 'blue';
      case 'completed':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <Container maxW="container.xl" py={5}>
      <Heading mb={6}>Payment Collection</Heading>
      
      <Flex mb={4}>
        <InputGroup maxW="400px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input placeholder="Search payments..." />
        </InputGroup>
      </Flex>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Payment ID</Th>
              <Th>Pharmacy</Th>
              <Th>Amount</Th>
              <Th>Date</Th>
              <Th>Method</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {payments.map((payment) => (
              <Tr key={payment.id}>
                <Td>{payment.id}</Td>
                <Td>{payment.pharmacy}</Td>
                <Td>{payment.amount}</Td>
                <Td>{payment.date}</Td>
                <Td>{payment.method}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(payment.status)}>
                    {payment.status}
                  </Badge>
                </Td>
                <Td>
                  <Button size="sm" colorScheme="blue" mr={2}>
                    View
                  </Button>
                  <Button size="sm" colorScheme="green">
                    Verify
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

export default PaymentCollection; 