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

function PharmacyPayments({ onLogout }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [payments] = useState([
    {
      id: 'PAY001',
      date: '2024-03-15',
      amount: '$1,250',
      orderId: 'ORD001',
      status: 'pending',
    },
    {
      id: 'PAY002',
      date: '2024-03-14',
      amount: '$750',
      orderId: 'ORD002',
      status: 'completed',
    },
    {
      id: 'PAY003',
      date: '2024-03-13',
      amount: '$1,750',
      orderId: 'ORD003',
      status: 'failed',
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'completed':
        return 'green';
      case 'failed':
        return 'red';
      default:
        return 'gray';
    }
  };

  const handleNewPayment = () => {
    toast({
      title: "New Payment",
      description: "Payment form will be implemented soon",
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
          <Button variant="ghost" onClick={() => navigate('/pharmacy/orders')}>
            Orders
          </Button>
          <Button variant="ghost" onClick={() => navigate('/pharmacy/inventory')}>
            Inventory
          </Button>
          <Button colorScheme="red" variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </HStack>
      </Flex>

      <Container maxW="container.xl" py={5}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">Payments</Heading>
          <Button colorScheme="blue" onClick={handleNewPayment}>
            New Payment
          </Button>
        </Flex>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Payment ID</Th>
                <Th>Date</Th>
                <Th>Amount</Th>
                <Th>Order ID</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {payments.map((payment) => (
                <Tr key={payment.id}>
                  <Td>{payment.id}</Td>
                  <Td>{payment.date}</Td>
                  <Td>{payment.amount}</Td>
                  <Td>{payment.orderId}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(payment.status)}>
                      {payment.status}
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

export default PharmacyPayments; 