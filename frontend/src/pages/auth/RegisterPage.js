import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  useColorModeValue,
  Flex,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
  Alert,
  AlertIcon,
  Grid,
  GridItem,
  Image,
  Link,
  Select,
  Divider,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    role: 'pharmacy',
    email: '',
    phone: '',
    address: '',
  });
  
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'pharmacy') {
        navigate('/pharmacy');
      } else if (user.role === 'distributor') {
        navigate('/distributor');
      } else if (user.role === 'admin') {
        navigate('/admin');
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.businessName) newErrors.businessName = 'Business name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.address) newErrors.address = 'Address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Remove confirmPassword from the data sent to the API
      const { confirmPassword, ...registrationData } = formData;
      
      const result = await register(registrationData);
      if (!result.success) {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Grid 
      templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} 
      h="100vh"
    >
      {/* Registration Form */}
      <GridItem>
        <Flex
          minH={'100vh'}
          align={'center'}
          justify={'center'}
          bg={useColorModeValue('gray.50', 'gray.800')}
          p={8}
        >
          <Stack spacing={8} mx={'auto'} maxW={'lg'} w={{ base: '100%', md: '500px' }} py={8} px={6}>
            <Stack align={'center'}>
              <Heading fontSize={'4xl'} color="brand.500">Create an Account</Heading>
              <Text fontSize={'lg'} color={'gray.600'}>
                Join COEx to streamline your pharmaceutical operations
              </Text>
            </Stack>
            
            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}
            
            <Box
              rounded={'lg'}
              bg={useColorModeValue('white', 'gray.700')}
              boxShadow={'lg'}
              p={8}
            >
              <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <FormControl id="businessName" isInvalid={errors.businessName}>
                    <FormLabel>Business Name</FormLabel>
                    <Input 
                      type="text" 
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.businessName}</FormErrorMessage>
                  </FormControl>
                  
                  <FormControl id="role">
                    <FormLabel>Account Type</FormLabel>
                    <Select 
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="pharmacy">Pharmacy</option>
                      <option value="distributor">Distributor</option>
                    </Select>
                  </FormControl>
                  
                  <Divider my={2} />
                  
                  <FormControl id="username" isInvalid={errors.username}>
                    <FormLabel>Username</FormLabel>
                    <Input 
                      type="text" 
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.username}</FormErrorMessage>
                  </FormControl>
                  
                  <FormControl id="password" isInvalid={errors.password}>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <InputRightElement h={'full'}>
                        <Button
                          variant={'ghost'}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                  
                  <FormControl id="confirmPassword" isInvalid={errors.confirmPassword}>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                  </FormControl>
                  
                  <Divider my={2} />
                  
                  <FormControl id="email" isInvalid={errors.email}>
                    <FormLabel>Email Address</FormLabel>
                    <Input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>
                  
                  <FormControl id="phone" isInvalid={errors.phone}>
                    <FormLabel>Phone Number</FormLabel>
                    <Input 
                      type="text" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.phone}</FormErrorMessage>
                  </FormControl>
                  
                  <FormControl id="address" isInvalid={errors.address}>
                    <FormLabel>Business Address</FormLabel>
                    <Input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.address}</FormErrorMessage>
                  </FormControl>
                  
                  <Stack spacing={6} pt={4}>
                    <Button
                      loadingText="Submitting"
                      size="lg"
                      bg={'brand.500'}
                      color={'white'}
                      _hover={{
                        bg: 'brand.600',
                      }}
                      type="submit"
                      isLoading={isSubmitting}
                    >
                      Register
                    </Button>
                  </Stack>
                  
                  <Stack pt={6}>
                    <Text align={'center'}>
                      Already a user?{' '}
                      <Link as={RouterLink} to="/auth/login" color={'brand.500'}>
                        Login
                      </Link>
                    </Text>
                  </Stack>
                </Stack>
              </form>
            </Box>
          </Stack>
        </Flex>
      </GridItem>
      
      {/* Illustration */}
      <GridItem 
        display={{ base: 'none', md: 'block' }}
        bg="brand.500"
      >
        <Flex 
          height="100%" 
          direction="column" 
          justify="center" 
          align="center"
          p={10}
          color="white"
        >
          <Image
            src="/frontend/assets/pharmacy-illustration.svg"
            alt="Pharmacy Illustration"
            maxW="70%"
            mb={8}
          />
          <Heading as="h2" size="xl" mb={4} textAlign="center">
            Join the COEx Network
          </Heading>
          <Text fontSize="lg" textAlign="center">
            Connect with pharmacies and distributors across Jordan to streamline your operations and reduce costs.
          </Text>
          <Text fontSize="lg" mt={4} textAlign="center">
            All pricing in Jordanian Dinar (JD).
          </Text>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default RegisterPage;