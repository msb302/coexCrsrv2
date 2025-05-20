import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Button,
  HStack,
  Flex,
  Text,
  Card,
  CardHeader,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  Icon,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useDisclosure,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { 
  FiSearch, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiFilter,
  FiPackage,
  FiAlertCircle
} from 'react-icons/fi';

function DistributorInventory({ onLogout }) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Demo data
  const [products] = useState([
    { 
      id: 1,
      name: 'Amoxicillin 500mg',
      description: 'Antibiotic capsules for bacterial infections',
      price: 12.50,
      category: 'Antibiotics',
      manufacturer: 'JoPharma',
      sku: 'AMX500',
      stockQuantity: 500,
      expiryDate: '2024-12-31',
      status: 'active'
    },
    { 
      id: 2,
      name: 'Lisinopril 10mg',
      description: 'Blood pressure medication for hypertension',
      price: 8.75,
      category: 'Cardiovascular',
      manufacturer: 'MedEast',
      sku: 'LIS10',
      stockQuantity: 300,
      expiryDate: '2024-11-30',
      status: 'active'
    },
    { 
      id: 3,
      name: 'Metformin 850mg',
      description: 'Oral diabetes medication for type 2 diabetes',
      price: 6.90,
      category: 'Diabetes',
      manufacturer: 'JoPharma',
      sku: 'MET850',
      stockQuantity: 400,
      expiryDate: '2024-10-31',
      status: 'low_stock'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Get unique categories for filter
  const categories = [...new Set(products.map(product => product.category))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || product.category === categoryFilter;
    const matchesStatus = statusFilter === '' || product.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'low_stock': return 'orange';
      case 'out_of_stock': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" p={4} bg="white" shadow="sm">
        <Heading size="md">COEx Distributor</Heading>
        <HStack spacing={4}>
          <Button variant="ghost" onClick={() => navigate('/distributor/dashboard')}>
            Dashboard
          </Button>
          <Button variant="ghost" onClick={() => navigate('/distributor/orders')}>
            Orders
          </Button>
          <Button variant="ghost" onClick={() => navigate('/distributor/payments')}>
            Payments
          </Button>
          <Button colorScheme="red" variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </HStack>
      </Flex>

      <Container maxW="container.xl" py={5}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading>Inventory Management</Heading>
          <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={onOpen}>
            Add Product
          </Button>
        </Flex>

        {/* Filters */}
        <Card bg={cardBg} shadow="sm" mb={6}>
          <CardBody>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              <Select
                placeholder="Category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                icon={<FiFilter />}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>

              <Select
                placeholder="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                icon={<FiAlertCircle />}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </Select>
            </Stack>
          </CardBody>
        </Card>

        {/* Products Table */}
        <Card bg={cardBg} shadow="sm">
          <CardHeader>
            <Heading size="md">Products</Heading>
          </CardHeader>
          <CardBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>SKU</Th>
                  <Th>Name</Th>
                  <Th>Category</Th>
                  <Th>Price</Th>
                  <Th>Stock</Th>
                  <Th>Expiry</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredProducts.map((product) => (
                  <Tr key={product.id}>
                    <Td>{product.sku}</Td>
                    <Td>
                      <Text fontWeight="medium">{product.name}</Text>
                      <Text fontSize="sm" color="gray.500">{product.description}</Text>
                    </Td>
                    <Td>{product.category}</Td>
                    <Td>JD {product.price}</Td>
                    <Td>{product.stockQuantity}</Td>
                    <Td>{product.expiryDate}</Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(product.status)}>
                        {product.status.replace('_', ' ')}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button size="sm" variant="ghost" leftIcon={<FiEdit2 />}>
                          Edit
                        </Button>
                        <Button size="sm" variant="ghost" colorScheme="red" leftIcon={<FiTrash2 />}>
                          Delete
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </Container>

      {/* Add/Edit Product Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Product Name</FormLabel>
                <Input placeholder="Enter product name" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Input placeholder="Enter product description" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Category</FormLabel>
                <Select placeholder="Select category">
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Manufacturer</FormLabel>
                <Input placeholder="Enter manufacturer name" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>SKU</FormLabel>
                <Input placeholder="Enter SKU" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Price (JD)</FormLabel>
                <NumberInput min={0} precision={2}>
                  <NumberInputField placeholder="Enter price" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Stock Quantity</FormLabel>
                <NumberInput min={0}>
                  <NumberInputField placeholder="Enter quantity" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Expiry Date</FormLabel>
                <Input type="date" />
              </FormControl>

              <Button colorScheme="blue" mr={3}>
                Save Product
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default DistributorInventory; 