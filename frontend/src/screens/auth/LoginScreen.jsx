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
  useToast,
  Container,
  Link,
  Image,
  Flex,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../../assets/logo.png';

function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth();

  // Colors
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (username && password) {
      try {
        console.log('Attempting login with:', { username, password });
        const result = await login(username, password);
        console.log('Login result:', result);
        
        if (result.success) {
          toast({
            title: "Login successful",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          console.error('Login failed:', result);
          toast({
            title: "Login failed",
            description: result.message || "Please check your credentials",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error('Login error:', error);
        toast({
          title: "Login failed",
          description: error.response?.data?.message || error.message || "An error occurred during login",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Login failed",
        description: "Please enter both username and password",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex 
      minH="100vh" 
      bg={bgColor}
      align="center"
      justify="center"
      px={{ base: 4, md: 8 }}
      py={{ base: 8, md: 12 }}
    >
      <Container 
        maxW="container.xl" 
        centerContent
        px={{ base: 4, md: 8 }}
      >
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="center"
          gap={{ base: 8, md: 12 }}
          w="full"
          maxW="1200px"
        >
          {/* Left side - Logo and Welcome */}
          <Box
            flex="1"
            textAlign="center"
            p={{ base: 4, md: 8 }}
            display={{ base: 'none', md: 'block' }}
            maxW={{ md: '500px' }}
          >
            <Box
              as="img"
              src={logo}
              alt="COEx Logo"
              maxW="300px"
              mx="auto"
              mb={8}
            />
            <Heading size="xl" mb={4} color="brand.500">
              Welcome to COEx
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Pharmaceutical Supply Chain Management Platform
            </Text>
          </Box>

          {/* Right side - Login Form */}
          <Box
            flex="1"
            maxW="md"
            w="full"
            p={{ base: 6, md: 8 }}
            bg={cardBg}
            borderRadius="xl"
            boxShadow="xl"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <VStack spacing={6}>
              {/* Mobile Logo */}
              <Box display={{ base: 'block', md: 'none' }}>
                <Box
                  as="img"
                  src={logo}
                  alt="COEx Logo"
                  maxW="200px"
                  mx="auto"
                  mb={4}
                />
              </Box>

              <Heading size="lg" color="brand.500">
                Sign In
              </Heading>

              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      size="lg"
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup size="lg">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
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
                  </FormControl>
                  
                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    width="100%"
                    bg="brand.500"
                    _hover={{ bg: 'brand.600' }}
                    mt={4}
                  >
                    Sign In
                  </Button>
                  
                  <Text textAlign="center" mt={4}>
                    Don't have an account?{' '}
                    <Link
                      as={RouterLink}
                      to="/register"
                      color="brand.500"
                      fontWeight="bold"
                    >
                      Register here
                    </Link>
                  </Text>
                </VStack>
              </form>
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Flex>
  );
}

export default LoginScreen; 