import React from 'react';
import {
  Box,
  Flex,
  Text,
  Badge,
  Button,
  Stack,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Select,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiMoreVertical, FiPackage, FiTruck, FiClock, FiCheck, FiX } from 'react-icons/fi';
import StatusBadge from './StatusBadge';

/**
 * OrderCard component for displaying order information
 * 
 * @param {Object} props
 * @param {Object} props.order - The order data
 * @param {Function} props.onPress - Function to call when card is pressed
 * @param {Function} props.onStatusUpdate - Function to call when status is updated (distributor only)
 * @param {string} props.userRole - The current user's role
 */
const OrderCard = ({ order, onPress, onStatusUpdate, userRole }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newStatus, setNewStatus] = React.useState('');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Handle status update modal
  const handleOpenStatusModal = (e) => {
    e.stopPropagation();
    setNewStatus(order.status);
    onOpen();
  };

  // Handle status update submission
  const handleStatusUpdate = () => {
    onStatusUpdate(order.id, newStatus);
    onClose();
  };

  // Get status icon based on current status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return FiClock;
      case 'accepted':
        return FiCheck;
      case 'shipped':
        return FiTruck;
      case 'delivered':
        return FiCheck;
      case 'canceled':
        return FiX;
      default:
        return FiPackage;
    }
  };

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Card contents based on user role
  const renderCardContent = () => {
    // Common content for both roles
    return (
      <>
        <Flex justify="space-between" align="center" mb={3}>
          <Text fontWeight="bold" fontSize="md">Order #{order.id}</Text>
          <StatusBadge status={order.status} type="order" />
        </Flex>
        
        <Stack spacing={2} mb={3}>
          {/* Pharmacy-specific content */}
          {userRole === 'pharmacy' && (
            <Flex justify="space-between">
              <Text fontSize="sm" color="gray.600">Order Date:</Text>
              <Text fontSize="sm" fontWeight="medium">{formatDate(order.date)}</Text>
            </Flex>
          )}
          
          {/* Distributor-specific content */}
          {userRole === 'distributor' && (
            <Flex justify="space-between">
              <Text fontSize="sm" color="gray.600">Pharmacy:</Text>
              <Text fontSize="sm" fontWeight="medium">{order.pharmacy}</Text>
            </Flex>
          )}
          
          {/* Common content */}
          <Flex justify="space-between">
            <Text fontSize="sm" color="gray.600">Items:</Text>
            <Text fontSize="sm" fontWeight="medium">{order.items} items</Text>
          </Flex>
          
          <Flex justify="space-between">
            <Text fontSize="sm" color="gray.600">Total:</Text>
            <Text fontSize="sm" fontWeight="bold">JD {order.totalAmount.toFixed(2)}</Text>
          </Flex>
          
          {order.expectedDelivery && (
            <Flex justify="space-between">
              <Text fontSize="sm" color="gray.600">Expected Delivery:</Text>
              <Text fontSize="sm" fontWeight="medium">{formatDate(order.expectedDelivery)}</Text>
            </Flex>
          )}
        </Stack>
        
        <Divider mb={3} />
        
        <Flex justify="space-between" align="center">
          <Flex align="center">
            <Icon as={getStatusIcon(order.status)} mr={1} color="gray.500" />
            <Text fontSize="xs" color="gray.500">
              {formatDate(order.date)}
            </Text>
          </Flex>
          
          {/* Action buttons based on role */}
          {userRole === 'pharmacy' ? (
            <Button 
              as={RouterLink} 
              to={`/pharmacy/order-history/${order.id}`}
              size="sm" 
              variant="outline"
              colorScheme="blue"
            >
              View Details
            </Button>
          ) : (
            <Menu>
              <MenuButton
                as={Button}
                size="sm"
                variant="ghost"
                onClick={(e) => e.stopPropagation()}
              >
                <Icon as={FiMoreVertical} />
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to={`/distributor/manage-orders/${order.id}`}>
                  View Details
                </MenuItem>
                {order.status !== 'delivered' && order.status !== 'canceled' && (
                  <MenuItem onClick={handleOpenStatusModal}>Update Status</MenuItem>
                )}
                {order.status === 'accepted' && (
                  <MenuItem as={RouterLink} to={`/distributor/manage-deliveries/create/${order.id}`}>
                    Schedule Delivery
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          )}
        </Flex>
      </>
    );
  };

  return (
    <>
      <Box
        bg={cardBgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        p={4}
        shadow="sm"
        cursor="pointer"
        _hover={{ shadow: 'md', borderColor: 'brand.400' }}
        transition="all 0.2s"
        onClick={() => onPress && onPress(order.id)}
      >
        {renderCardContent()}
      </Box>

      {/* Status Update Modal (Distributor only) */}
      {userRole === 'distributor' && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update Order Status</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb={4}>
                Order #{order.id} for {order.pharmacy}
              </Text>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="canceled">Canceled</option>
                </Select>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleStatusUpdate}>
                Update Status
              </Button>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default OrderCard;