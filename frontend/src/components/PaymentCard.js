import React from 'react';
import {
  Box,
  Flex,
  Text,
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
  Image,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiMoreVertical, FiClock, FiCheck, FiX, FiFileText, FiCreditCard } from 'react-icons/fi';
import StatusBadge from './StatusBadge';

/**
 * PaymentCard component for displaying payment information
 * 
 * @param {Object} props
 * @param {Object} props.payment - The payment data
 * @param {Function} props.onPress - Function to call when card is pressed
 * @param {Function} props.onStatusUpdate - Function to call when status is updated (distributor only)
 * @param {string} props.userRole - The current user's role
 */
const PaymentCard = ({ payment, onPress, onStatusUpdate, userRole }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isImageOpen, 
    onOpen: onImageOpen, 
    onClose: onImageClose 
  } = useDisclosure();
  const [newStatus, setNewStatus] = React.useState('');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Handle status update modal
  const handleOpenStatusModal = (e) => {
    e.stopPropagation();
    setNewStatus(payment.status);
    onOpen();
  };

  // Handle check image modal
  const handleOpenImageModal = (e) => {
    e.stopPropagation();
    onImageOpen();
  };

  // Handle status update submission
  const handleStatusUpdate = () => {
    onStatusUpdate(payment.id, newStatus);
    onClose();
  };

  // Get status icon based on current status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return FiClock;
      case 'verified':
        return FiCheck;
      case 'rejected':
        return FiX;
      default:
        return FiCreditCard;
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
          <Text fontWeight="bold" fontSize="md">Payment #{payment.id}</Text>
          <StatusBadge status={payment.status} type="payment" />
        </Flex>
        
        <Stack spacing={2} mb={3}>
          {/* Pharmacy-specific content */}
          {userRole === 'pharmacy' && (
            <Flex justify="space-between">
              <Text fontSize="sm" color="gray.600">For Order:</Text>
              <Text fontSize="sm" fontWeight="medium">#{payment.orderId}</Text>
            </Flex>
          )}
          
          {/* Distributor-specific content */}
          {userRole === 'distributor' && (
            <Flex justify="space-between">
              <Text fontSize="sm" color="gray.600">From:</Text>
              <Text fontSize="sm" fontWeight="medium">{payment.pharmacy}</Text>
            </Flex>
          )}
          
          {/* Common content */}
          <Flex justify="space-between">
            <Text fontSize="sm" color="gray.600">Amount:</Text>
            <Text fontSize="sm" fontWeight="bold">JD {payment.amount.toFixed(2)}</Text>
          </Flex>
          
          <Flex justify="space-between">
            <Text fontSize="sm" color="gray.600">Payment Date:</Text>
            <Text fontSize="sm" fontWeight="medium">{formatDate(payment.date)}</Text>
          </Flex>
          
          <Flex justify="space-between">
            <Text fontSize="sm" color="gray.600">Type:</Text>
            <Text fontSize="sm" fontWeight="medium">{payment.type || 'Check'}</Text>
          </Flex>
          
          {payment.checkNumber && (
            <Flex justify="space-between">
              <Text fontSize="sm" color="gray.600">Check Number:</Text>
              <Text fontSize="sm" fontWeight="medium">{payment.checkNumber}</Text>
            </Flex>
          )}
        </Stack>
        
        <Divider mb={3} />
        
        <Flex justify="space-between" align="center">
          <Flex align="center">
            <Icon as={getStatusIcon(payment.status)} mr={1} color="gray.500" />
            <Text fontSize="xs" color="gray.500">
              {formatDate(payment.date)}
            </Text>
          </Flex>
          
          {/* Action buttons based on role */}
          {userRole === 'pharmacy' ? (
            <Button 
              leftIcon={<Icon as={FiFileText} />}
              size="sm" 
              variant="outline"
              colorScheme="blue"
              onClick={handleOpenImageModal}
            >
              View Check
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
                <MenuItem onClick={handleOpenImageModal}>View Check Image</MenuItem>
                {payment.status === 'pending' && (
                  <>
                    <MenuItem onClick={handleOpenStatusModal}>Update Status</MenuItem>
                    <MenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusUpdate(payment.id, 'verified');
                      }}
                      icon={<Icon as={FiCheck} color="green.500" />}
                    >
                      Verify Payment
                    </MenuItem>
                    <MenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusUpdate(payment.id, 'rejected');
                      }}
                      icon={<Icon as={FiX} color="red.500" />}
                    >
                      Reject Payment
                    </MenuItem>
                  </>
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
        onClick={() => onPress && onPress(payment.id)}
      >
        {renderCardContent()}
      </Box>

      {/* Status Update Modal (Distributor only) */}
      {userRole === 'distributor' && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update Payment Status</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb={4}>
                Payment #{payment.id} from {payment.pharmacy}
              </Text>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
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

      {/* Check Image Modal */}
      <Modal isOpen={isImageOpen} onClose={onImageClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Check Image</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" align="center">
              <Image 
                src={payment.checkImage || '/frontend/assets/check-placeholder.png'} 
                alt="Check Image" 
                maxW="100%" 
                borderRadius="md"
                fallbackSrc="https://via.placeholder.com/600x300?text=Check+Image"
              />
              <Stack spacing={2} w="full" mt={4}>
                <Flex justify="space-between">
                  <Text fontWeight="medium">Check Number:</Text>
                  <Text>{payment.checkNumber}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text fontWeight="medium">Amount:</Text>
                  <Text>JD {payment.amount.toFixed(2)}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text fontWeight="medium">Date:</Text>
                  <Text>{formatDate(payment.date)}</Text>
                </Flex>
              </Stack>
            </Flex>
          </ModalBody>
          <ModalFooter>
            {userRole === 'distributor' && payment.status === 'pending' && (
              <>
                <Button 
                  colorScheme="green" 
                  mr={3} 
                  leftIcon={<Icon as={FiCheck} />}
                  onClick={() => {
                    onStatusUpdate(payment.id, 'verified');
                    onImageClose();
                  }}
                >
                  Verify Payment
                </Button>
                <Button 
                  colorScheme="red" 
                  mr={3} 
                  leftIcon={<Icon as={FiX} />}
                  onClick={() => {
                    onStatusUpdate(payment.id, 'rejected');
                    onImageClose();
                  }}
                >
                  Reject Payment
                </Button>
              </>
            )}
            <Button variant="ghost" onClick={onImageClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PaymentCard;