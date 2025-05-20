import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Select,
  useToast,
  Container,
  Link,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function RegisterScreen() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phoneNumber: '',
    businessName: '',
    address: '',
    role: 'pharmacy'
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { register } = useAuth();

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return !value.includes('@') ? 'Please enter a valid email' : '';
      case 'password':
        return value.length < 1 ? 'Password is required' : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate email and password
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else {
      const emailError = validateField('email', formData.email);
      if (emailError) {
        newErrors.email = emailError;
        isValid = false;
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else {
      const passwordError = validateField('password', formData.password);
      if (passwordError) {
        newErrors.password = passwordError;
        isValid = false;
      }
    }

    // Validate role
    if (!formData.role || !['pharmacy', 'distributor'].includes(formData.role)) {
      newErrors.role = 'Please select a valid account type';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check your email and password",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      // Use email as username
      const registrationData = {
        ...formData,
        username: formData.email
      };
      
      console.log('Attempting registration with:', registrationData);
      const result = await register(registrationData);
      console.log('Registration result:', result);
      
      if (result.success) {
        toast({
          title: "Registration successful",
          description: "You can now log in with your email and password",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate('/login');
      } else {
        console.error('Registration failed:', result);
        if (result.message.includes('already exists')) {
          setErrors(prev => ({ ...prev, email: 'This email is already registered' }));
        } else {
          toast({
            title: "Registration failed",
            description: result.message || "Please check your information",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message;
      
      if (errorMessage.includes('already exists')) {
        setErrors(prev => ({ ...prev, email: 'This email is already registered' }));
      } else {
        toast({
          title: "Registration failed",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8}>
        <Heading>Create Account</Heading>
        <Text>Join COEx Pharmaceutical Supply Chain Management</Text>
        
        <Box w="100%" p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired isInvalid={errors.email}>
                <FormLabel>Email (Username)</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.name}>
                <FormLabel>Full Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.phoneNumber}>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
                <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.businessName}>
                <FormLabel>Business Name</FormLabel>
                <Input
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Enter your business name"
                />
                <FormErrorMessage>{errors.businessName}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.address}>
                <FormLabel>Address (Optional)</FormLabel>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your business address (optional)"
                />
                <FormErrorMessage>{errors.address}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={errors.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Choose a password"
                  />
                  <InputRightElement>
                    <IconButton
                      variant="ghost"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={errors.role}>
                <FormLabel>Account Type</FormLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="pharmacy">Pharmacy</option>
                  <option value="distributor">Distributor</option>
                </Select>
                <FormErrorMessage>{errors.role}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="100%"
                mt={4}
              >
                Register
              </Button>

              <Text textAlign="center" mt={4}>
                Already have an account?{' '}
                <Link
                  as={RouterLink}
                  to="/login"
                  color="blue.500"
                  fontWeight="bold"
                >
                  Login here
                </Link>
              </Text>
            </VStack>
          </form>
        </Box>
      </VStack>
    </Container>
  );
}

export default RegisterScreen; 