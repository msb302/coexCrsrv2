import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Heading,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useColorModeValue,
  Select,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  InputGroup,
  InputRightElement,
  Icon,
  FormErrorMessage,
} from '@chakra-ui/react';
import { FiCamera, FiCheck, FiClipboard } from 'react-icons/fi';
import StatusBadge from './StatusBadge';

/**
 * DeliveryConfirmation component for confirming delivery receipt
 * 
 * @param {Object} props
 * @param {Object} props.delivery - The delivery data
 * @param {Function} props.onConfirm - Function to call when delivery is confirmed
 */
const DeliveryConfirmation = ({ delivery, onConfirm }) => {
  const [confirmMethod, setConfirmMethod] = useState('signature');
  const [receiverName, setReceiverName] = useState('');
  const [notes, setNotes] = useState('');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const fileInputRef = React.useRef(null);
  
  // Color schemes
  const boxBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (confirmMethod === 'signature' || confirmMethod === 'photo') {
      if (!receiverName) {
        newErrors.receiverName = 'Receiver name is required';
      }
      if (confirmMethod === 'photo' && !imageFile) {
        newErrors.image = 'Proof of delivery image is required';
      }
    } else if (confirmMethod === 'otp') {
      if (!otp) {
        newErrors.otp = 'OTP code is required';
      } else if (otp.length < 4) {
        newErrors.otp = 'OTP code must be at least 4 digits';
      }
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      
      // Create form data for submission
      const formData = new FormData();
      formData.append('confirmMethod', confirmMethod);
      formData.append('receiverName', receiverName);
      formData.append('notes', notes);
      
      if (confirmMethod === 'otp') {
        formData.append('otp', otp);
      }
      
      if (confirmMethod === 'photo' && imageFile) {
        formData.append('image', imageFile);
      }
      
      // Call the onConfirm callback
      onConfirm(delivery.id, formData).then(() => {
        onOpen(); // Open success modal
        setIsSubmitting(false);
      }).catch(() => {
        setIsSubmitting(false);
      });
    }
  };
  
  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <Box
        bg={boxBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        p={6}
        shadow="md"
      >
        <Heading size="md" mb={4}>Confirm Delivery Receipt</Heading>
        
        <Stack spacing={4} mb={6}>
          <Flex justify="space-between">
            <Text fontWeight="medium">Order #:</Text>
            <Text>{delivery.orderId}</Text>
          </Flex>
          
          <Flex justify="space-between">
            <Text fontWeight="medium">Delivery Date:</Text>
            <Text>{formatDate(delivery.expectedDelivery)}</Text>
          </Flex>
          
          <Flex justify="space-between">
            <Text fontWeight="medium">Status:</Text>
            <StatusBadge status={delivery.status} type="delivery" />
          </Flex>
          
          <Flex justify="space-between">
            <Text fontWeight="medium">Delivery Method:</Text>
            <Text>{delivery.method}</Text>
          </Flex>
          
          {delivery.trackingNumber && (
            <Flex justify="space-between">
              <Text fontWeight="medium">Tracking #:</Text>
              <Text>{delivery.trackingNumber}</Text>
            </Flex>
          )}
        </Stack>
        
        <Alert
          status="info"
          variant="subtle"
          borderRadius="md"
          mb={6}
        >
          <AlertIcon />
          <Box>
            <AlertTitle mb={1} fontSize="sm">
              Confirmation Required
            </AlertTitle>
            <AlertDescription fontSize="sm">
              Please confirm that you have received this delivery by providing one of the following confirmation methods.
            </AlertDescription>
          </Box>
        </Alert>
        
        <form onSubmit={handleSubmit}>
          <Stack spacing={6}>
            <FormControl>
              <FormLabel>Confirmation Method</FormLabel>
              <Select
                value={confirmMethod}
                onChange={(e) => setConfirmMethod(e.target.value)}
              >
                <option value="signature">Signature</option>
                <option value="photo">Photo Proof</option>
                <option value="otp">OTP Code</option>
              </Select>
            </FormControl>
            
            {(confirmMethod === 'signature' || confirmMethod === 'photo') && (
              <FormControl isInvalid={errors.receiverName}>
                <FormLabel>Receiver Name</FormLabel>
                <Input
                  placeholder="Enter name of person receiving delivery"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                />
                <FormErrorMessage>{errors.receiverName}</FormErrorMessage>
              </FormControl>
            )}
            
            {confirmMethod === 'photo' && (
              <FormControl isInvalid={errors.image}>
                <FormLabel>Upload Proof Image</FormLabel>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <Flex 
                  direction="column" 
                  align="center" 
                  border="1px dashed" 
                  borderColor={errors.image ? "red.500" : borderColor}
                  borderRadius="md" 
                  p={4}
                  mb={2}
                >
                  {imagePreview ? (
                    <Box 
                      backgroundImage={`url(${imagePreview})`}
                      backgroundSize="cover"
                      backgroundPosition="center"
                      width="100%"
                      height="200px"
                      borderRadius="md"
                      mb={2}
                    />
                  ) : (
                    <Icon as={FiCamera} fontSize="3xl" mb={2} />
                  )}
                  
                  <Button
                    onClick={() => fileInputRef.current.click()}
                    size="sm"
                    leftIcon={<FiCamera />}
                  >
                    {imagePreview ? 'Change Image' : 'Upload Image'}
                  </Button>
                </Flex>
                <FormErrorMessage>{errors.image}</FormErrorMessage>
              </FormControl>
            )}
            
            {confirmMethod === 'otp' && (
              <FormControl isInvalid={errors.otp}>
                <FormLabel>OTP Code</FormLabel>
                <InputGroup>
                  <Input
                    placeholder="Enter OTP code provided by delivery personnel"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    type="number"
                  />
                  <InputRightElement>
                    <Icon as={FiClipboard} color="gray.400" />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.otp}</FormErrorMessage>
              </FormControl>
            )}
            
            <FormControl>
              <FormLabel>Notes (Optional)</FormLabel>
              <Textarea
                placeholder="Any additional notes about the delivery"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </FormControl>
            
            <Button
              colorScheme="green"
              leftIcon={<FiCheck />}
              isLoading={isSubmitting}
              loadingText="Confirming..."
              type="submit"
              size="lg"
            >
              Confirm Delivery
            </Button>
          </Stack>
        </form>
      </Box>
      
      {/* Success Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delivery Confirmed</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert
              status="success"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              borderRadius="md"
              py={4}
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Delivery Successfully Confirmed!
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                Thank you for confirming receipt of your order. The delivery status has been updated.
              </AlertDescription>
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeliveryConfirmation;