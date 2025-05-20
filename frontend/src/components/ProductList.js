import React, { useState } from 'react';
import {
  Box,
  Grid,
  Flex,
  Image,
  Text,
  Button,
  Checkbox,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  Icon,
  Badge,
  useColorModeValue,
  Stack,
  Divider,
  IconButton,
} from '@chakra-ui/react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

/**
 * ProductList component for displaying and selecting products
 * 
 * @param {Object} props
 * @param {Array} props.products - Array of products to display
 * @param {Function} props.onSelectProduct - Function to call when a product is selected
 * @param {Array} props.selectedProducts - Array of already selected products
 * @param {Boolean} props.isSelectable - Whether products can be selected
 */
const ProductList = ({ 
  products = [], 
  onSelectProduct, 
  selectedProducts = [], 
  isSelectable = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('name_asc');
  
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Get unique categories for the filter dropdown
  const categories = [...new Set(products.map(product => product.category))];
  
  // Handle product selection
  const handleSelect = (product) => {
    if (!isSelectable) return;
    
    const isSelected = selectedProducts.some(p => p.id === product.id);
    let quantity = 1;
    
    if (isSelected) {
      // Find existing product to get its quantity
      const existingProduct = selectedProducts.find(p => p.id === product.id);
      if (existingProduct) {
        quantity = existingProduct.quantity;
      }
      
      // Remove product
      onSelectProduct(
        selectedProducts.filter(p => p.id !== product.id)
      );
    } else {
      // Add product with quantity 1
      onSelectProduct([
        ...selectedProducts,
        { ...product, quantity }
      ]);
    }
  };
  
  // Handle quantity change
  const handleQuantityChange = (productId, quantity) => {
    const updatedProducts = selectedProducts.map(p => 
      p.id === productId ? { ...p, quantity: parseInt(quantity) } : p
    );
    onSelectProduct(updatedProducts);
  };
  
  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === '' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'name_desc':
        return b.name.localeCompare(a.name);
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      default:
        return 0;
    }
  });
  
  // Check if a product is selected
  const isProductSelected = (productId) => {
    return selectedProducts.some(p => p.id === productId);
  };
  
  // Get quantity of a selected product
  const getSelectedQuantity = (productId) => {
    const product = selectedProducts.find(p => p.id === productId);
    return product ? product.quantity : 1;
  };
  
  // Render product item
  const renderProduct = (product) => {
    const isSelected = isProductSelected(product.id);
    const quantity = getSelectedQuantity(product.id);
    
    return (
      <Box
        key={product.id}
        bg={cardBg}
        borderWidth="1px"
        borderColor={isSelected ? 'brand.500' : borderColor}
        borderRadius="lg"
        overflow="hidden"
        boxShadow={isSelected ? 'md' : 'sm'}
        transition="all 0.2s"
        _hover={{ shadow: 'md' }}
        position="relative"
      >
        {isSelectable && isSelected && (
          <Box
            position="absolute"
            top="0"
            right="0"
            bg="brand.500"
            color="white"
            py={1}
            px={2}
            borderBottomLeftRadius="md"
          >
            <Text fontSize="sm" fontWeight="bold">Selected</Text>
          </Box>
        )}
        
        <Box height="160px" bg="gray.100" position="relative">
          <Image
            src={product.image || 'https://via.placeholder.com/300x160?text=No+Image'}
            alt={product.name}
            objectFit="cover"
            width="100%"
            height="100%"
            fallbackSrc="https://via.placeholder.com/300x160?text=No+Image"
          />
          {product.stock <= 5 && (
            <Badge
              position="absolute"
              top="2"
              left="2"
              colorScheme="red"
              variant="solid"
            >
              Low Stock: {product.stock}
            </Badge>
          )}
        </Box>
        
        <Box p={4}>
          <Text fontWeight="bold" fontSize="md" mb={1} isTruncated>
            {product.name}
          </Text>
          <Text fontSize="sm" color="gray.600" mb={2} noOfLines={2}>
            {product.description}
          </Text>
          
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontWeight="bold" color="brand.600">
              JD {product.price.toFixed(2)}
            </Text>
            <Badge colorScheme="blue">
              {product.category}
            </Badge>
          </Flex>
          
          {isSelectable ? (
            <Flex mt={3} justify="space-between" align="center">
              {isSelected ? (
                <NumberInput
                  size="sm"
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={(valueString) => handleQuantityChange(product.id, valueString)}
                  maxW="100px"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              ) : (
                <Text fontSize="sm">
                  In Stock: {product.stock}
                </Text>
              )}
              
              <Button
                size="sm"
                colorScheme={isSelected ? "red" : "brand"}
                variant={isSelected ? "outline" : "solid"}
                onClick={() => handleSelect(product)}
              >
                {isSelected ? "Remove" : "Add"}
              </Button>
            </Flex>
          ) : (
            <Text fontSize="sm" mt={2}>
              In Stock: {product.stock}
            </Text>
          )}
        </Box>
      </Box>
    );
  };
  
  return (
    <Box>
      {/* Search and Filters */}
      <Flex 
        direction={{ base: "column", md: "row" }} 
        mb={6} 
        gap={4}
        justify="space-between"
      >
        <Box flex={{ base: "1", md: "2" }}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <IconButton
                icon={<FiX />}
                size="sm"
                position="absolute"
                right="2"
                top="50%"
                transform="translateY(-50%)"
                variant="ghost"
                onClick={() => setSearchTerm('')}
                zIndex="1"
                aria-label="Clear search"
              />
            )}
          </InputGroup>
        </Box>
        
        <Stack 
          direction={{ base: "column", md: "row" }} 
          spacing={4} 
          flex={{ base: "1", md: "1" }}
        >
          <Box flex="1">
            <Select
              placeholder="Filter by Category"
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
          </Box>
          
          <Box flex="1">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="price_asc">Price (Low to High)</option>
              <option value="price_desc">Price (High to Low)</option>
            </Select>
          </Box>
        </Stack>
      </Flex>
      
      {/* Selected Products Summary (when selectable) */}
      {isSelectable && selectedProducts.length > 0 && (
        <Box 
          mb={6} 
          p={4} 
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="md"
        >
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontWeight="bold">Selected Products ({selectedProducts.length})</Text>
            <Text fontWeight="bold" color="brand.600">
              Total: JD {selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(2)}
            </Text>
          </Flex>
          <Divider mb={3} />
          <Stack spacing={2}>
            {selectedProducts.map(product => (
              <Flex key={product.id} justify="space-between" align="center">
                <Text>{product.name}</Text>
                <Flex align="center">
                  <Text mr={4}>{product.quantity} x JD {product.price.toFixed(2)}</Text>
                  <IconButton
                    icon={<FiX />}
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => handleSelect(product)}
                    aria-label="Remove product"
                  />
                </Flex>
              </Flex>
            ))}
          </Stack>
        </Box>
      )}
      
      {/* Product Grid */}
      {sortedProducts.length > 0 ? (
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)"
          }}
          gap={6}
        >
          {sortedProducts.map(product => renderProduct(product))}
        </Grid>
      ) : (
        <Box 
          p={8} 
          textAlign="center" 
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="md"
        >
          <Text>No products found matching your search criteria.</Text>
        </Box>
      )}
    </Box>
  );
};

export default ProductList;