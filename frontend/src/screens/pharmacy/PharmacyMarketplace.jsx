import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Button,
  HStack,
  Flex,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
  Text,
  VStack,
  Image,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { SearchIcon, AddIcon, MinusIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

function PharmacyMarketplace({ onLogout }) {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen: isCartOpen, onOpen: onCartOpen, onClose: onCartClose } = useDisclosure();
  const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onClose: onPreviewClose } = useDisclosure();
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = [
    {
      id: 'paracetamol-500mg',
      name: 'Paracetamol 500mg',
      manufacturer: 'Jordan Pharma',
      description: 'Fast-acting pain relief for headaches, toothaches, and general body pain.',
      price: 5.50,
      originalPrice: 6.20,
      unit: 'Box of 20 tablets',
      image: 'https://www.pharmax.ae/media/catalog/product/cache/8ad67eb399db4e7d29fd1acbcfcca04c/p/a/panadol-advance500mg-24tabs.jpg',
      badge: 'bestseller',
      stock: 'in-stock',
    },
    {
      id: 'amoxicillin-250mg',
      name: 'Amoxicillin 250mg',
      manufacturer: 'MedEast',
      description: 'Broad-spectrum antibiotic effective against a wide range of bacterial infections.',
      price: 12.75,
      unit: 'Box of 15 capsules',
      image: '/frontend/images/products/amoxicillin.svg',
      stock: 'in-stock',
    },
    {
      id: 'vitamin-d3-1000iu',
      name: 'Vitamin D3 1000IU',
      manufacturer: 'GlobalHealth',
      description: 'Essential vitamin for bone health, immune function, and overall wellbeing.',
      price: 8.90,
      unit: 'Bottle of 60 tablets',
      image: '/frontend/images/products/vitamin-d.svg',
      badge: 'new',
      stock: 'in-stock',
    },
  ];

  const handleAddToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }

    toast({
      title: "Added to cart",
      description: `${quantity} ${product.name} added to your cart`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
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
          <Heading size="lg">Marketplace</Heading>
          <HStack>
            <InputGroup w="300px">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
            <Button
              leftIcon={<Box as="span" fontSize="lg">🛒</Box>}
              onClick={onCartOpen}
            >
              Cart ({cart.length})
            </Button>
          </HStack>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredProducts.map((product) => (
            <Box
              key={product.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              bg="white"
              shadow="md"
              _hover={{ shadow: 'lg' }}
            >
              {product.badge && (
                <Badge
                  position="absolute"
                  top={2}
                  left={2}
                  colorScheme={product.badge === 'bestseller' ? 'red' : 'blue'}
                >
                  {product.badge}
                </Badge>
              )}
              <Image
                src={product.image}
                alt={product.name}
                height="200px"
                width="100%"
                objectFit="cover"
              />
              <Box p={4}>
                <Heading size="md" mb={2}>{product.name}</Heading>
                <Text color="gray.600" mb={2}>{product.manufacturer}</Text>
                <Text color="gray.500" mb={4} noOfLines={2}>
                  {product.description}
                </Text>
                <Flex justify="space-between" align="center" mb={4}>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xl" fontWeight="bold" color="green.500">
                      JD {product.price.toFixed(2)}
                    </Text>
                    {product.originalPrice && (
                      <Text fontSize="sm" color="gray.500" textDecoration="line-through">
                        JD {product.originalPrice.toFixed(2)}
                      </Text>
                    )}
                  </VStack>
                  <Badge colorScheme={product.stock === 'in-stock' ? 'green' : 'red'}>
                    {product.stock}
                  </Badge>
                </Flex>
                <Flex justify="space-between" align="center">
                  <NumberInput
                    defaultValue={1}
                    min={1}
                    max={99}
                    size="sm"
                    w="100px"
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Button
                    colorScheme="blue"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </Flex>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Container>

      {/* Cart Modal */}
      <Modal isOpen={isCartOpen} onClose={onCartClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Your Shopping Cart</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {cart.length === 0 ? (
              <Text textAlign="center" py={4}>Your cart is empty</Text>
            ) : (
              <>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Product</Th>
                      <Th>Price</Th>
                      <Th>Quantity</Th>
                      <Th>Total</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {cart.map((item) => (
                      <Tr key={item.id}>
                        <Td>{item.name}</Td>
                        <Td>JD {item.price.toFixed(2)}</Td>
                        <Td>
                          <HStack>
                            <IconButton
                              size="sm"
                              icon={<MinusIcon />}
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            />
                            <Text>{item.quantity}</Text>
                            <IconButton
                              size="sm"
                              icon={<AddIcon />}
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            />
                          </HStack>
                        </Td>
                        <Td>JD {(item.price * item.quantity).toFixed(2)}</Td>
                        <Td>
                          <Button
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleRemoveFromCart(item.id)}
                          >
                            Remove
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                <Flex justify="space-between" align="center" mt={4}>
                  <Text fontSize="lg" fontWeight="bold">
                    Total: JD {getTotalPrice().toFixed(2)}
                  </Text>
                  <Button colorScheme="blue">Proceed to Checkout</Button>
                </Flex>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default PharmacyMarketplace; 