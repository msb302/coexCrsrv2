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
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon } from '@chakra-ui/icons';

function PharmacyInventory({ onLogout }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [inventory] = useState([
    {
      id: 'MED001',
      name: 'Paracetamol 500mg',
      category: 'Pain Relief',
      stock: 150,
      price: '$5.99',
      status: 'in-stock',
    },
    {
      id: 'MED002',
      name: 'Amoxicillin 250mg',
      category: 'Antibiotics',
      stock: 45,
      price: '$12.99',
      status: 'low-stock',
    },
    {
      id: 'MED003',
      name: 'Omeprazole 20mg',
      category: 'Gastrointestinal',
      stock: 0,
      price: '$8.99',
      status: 'out-of-stock',
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-stock':
        return 'green';
      case 'low-stock':
        return 'yellow';
      case 'out-of-stock':
        return 'red';
      default:
        return 'gray';
    }
  };

  const handleAddItem = () => {
    toast({
      title: "Add Item",
      description: "Add item form will be implemented soon",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Heading size="lg">Inventory</Heading>
          <Button colorScheme="blue" onClick={handleAddItem}>
            Add Item
          </Button>
        </Flex>

        <InputGroup mb={6}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Category</Th>
                <Th>Stock</Th>
                <Th>Price</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredInventory.map((item) => (
                <Tr key={item.id}>
                  <Td>{item.id}</Td>
                  <Td>{item.name}</Td>
                  <Td>{item.category}</Td>
                  <Td>{item.stock}</Td>
                  <Td>{item.price}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </Td>
                  <Td>
                    <Button size="sm" variant="ghost">
                      Edit
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

export default PharmacyInventory; 