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
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isAuthenticated, user } = useAuth();
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

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    
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
      const result = await login(username, password);
      if (!result.success) {
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Grid 
      templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} 
      h="100vh"
    >
      {/* Login Form */}
      <GridItem>
        <Flex
          minH={'100vh'}
          align={'center'}
          justify={'center'}
          bg={useColorModeValue('gray.50', 'gray.800')}
          p={8}
        >
          <Stack spacing={8} mx={'auto'} maxW={'lg'} w={{ base: '100%', md: '400px' }} py={12} px={6}>
            <Stack align={'center'}>
              <Heading fontSize={'4xl'} color="brand.500">COEx</Heading>
              <Text fontSize={'lg'} color={'gray.600'}>
                Pharmaceutical Supply Chain Management
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
                  <FormControl id="username" isInvalid={errors.username}>
                    <FormLabel>Username</FormLabel>
                    <Input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <FormErrorMessage>{errors.username}</FormErrorMessage>
                  </FormControl>
                  
                  <FormControl id="password" isInvalid={errors.password}>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                  
                  <Stack spacing={6}>
                    <Button
                      colorScheme={'blue'}
                      bg={'brand.500'}
                      _hover={{ bg: 'brand.600' }}
                      type="submit"
                      isLoading={isSubmitting}
                      loadingText="Logging in..."
                    >
                      Sign in
                    </Button>
                  </Stack>
                </Stack>
              </form>
              
              <Stack pt={6}>
                <Text align={'center'}>
                  Don't have an account?{' '}
                  <Link as={RouterLink} to="/auth/register" color={'brand.500'}>
                    Register
                  </Link>
                </Text>
              </Stack>
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
            Streamline Your Pharmaceutical Supply Chain
          </Heading>
          <Text fontSize="lg" textAlign="center">
            COEx helps pharmacies, distributors, and manufacturers efficiently manage orders, payments, and deliveries with our intuitive digital platform.
          </Text>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default LoginPage;