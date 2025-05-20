import React, { useRef, useState } from 'react';
import {
  IconButton,
  Avatar,
  Box,
  Flex,
  HStack,
  VStack,
  useColorModeValue,
  Text,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Badge,
  Icon,
  Link,
  Button,
  useBreakpointValue,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useToast,
} from '@chakra-ui/react';
import { FiMenu, FiBell, FiChevronDown, FiUser, FiSettings, FiHelpCircle } from 'react-icons/fi';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import Logo from './Logo';

const Navbar = ({ onOpen, ...rest }) => {
  const { user, logout } = useAuth();
  const { notifications, unread, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const btnRef = useRef();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error logging out",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getRoleBasedLinks = () => {
    if (!user) return [];
    
    if (user.role === 'pharmacy') {
      return [
        { name: 'Dashboard', path: '/pharmacy/dashboard' },
        { name: 'Place Order', path: '/pharmacy/place-order' },
        { name: 'Order History', path: '/pharmacy/order-history' },
        { name: 'Marketplace', path: '/pharmacy/marketplace' },
        { name: 'Payments', path: '/pharmacy/payments' },
      ];
    } else if (user.role === 'distributor') {
      return [
        { name: 'Dashboard', path: '/distributor/dashboard' },
        { name: 'Manage Orders', path: '/distributor/orders' },
        { name: 'Deliveries', path: '/distributor/deliveries' },
        { name: 'Payments', path: '/distributor/payments' },
      ];
    } else if (user.role === 'admin') {
      return [
        { name: 'Dashboard', path: '/admin/dashboard' },
        { name: 'Users', path: '/admin/users' },
        { name: 'Settings', path: '/admin/settings' },
      ];
    }
    return [];
  };

  const renderNavLinks = () => (
    <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
      {getRoleBasedLinks().map((link) => (
        <Link
          key={link.path}
          as={RouterLink}
          to={link.path}
          px={2}
          py={1}
          rounded="md"
          color={location.pathname === link.path ? 'brand.500' : 'inherit'}
          fontWeight={location.pathname === link.path ? 'bold' : 'normal'}
          _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700'),
          }}
        >
          {link.name}
        </Link>
      ))}
    </HStack>
  );

  const renderMobileNav = () => (
    <Drawer
      isOpen={isDrawerOpen}
      placement="left"
      onClose={() => setIsDrawerOpen(false)}
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          <Logo height="40px" />
        </DrawerHeader>
        <DrawerBody>
          <VStack spacing={4} align="stretch">
            {getRoleBasedLinks().map((link) => (
              <Link
                key={link.path}
                as={RouterLink}
                to={link.path}
                px={4}
                py={2}
                rounded="md"
                color={location.pathname === link.path ? 'brand.500' : 'inherit'}
                fontWeight={location.pathname === link.path ? 'bold' : 'normal'}
                onClick={() => setIsDrawerOpen(false)}
                _hover={{
                  textDecoration: 'none',
                  bg: useColorModeValue('gray.200', 'gray.700'),
                }}
              >
                {link.name}
              </Link>
            ))}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );

  if (!user) {
    return null;
  }

  return (
    <>
      <Flex
        ml={{ base: 0, md: 0 }}
        px={{ base: 4, md: 4 }}
        height="20"
        alignItems="center"
        bg={useColorModeValue('white', 'gray.900')}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
        justifyContent={{ base: 'space-between', md: 'space-between' }}
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        {...rest}
      >
        <Flex alignItems="center" flex="1">
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={() => setIsDrawerOpen(true)}
            variant="outline"
            aria-label="open menu"
            icon={<FiMenu />}
            ref={btnRef}
          />

          <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
            <Logo 
              display={{ base: 'flex', md: 'flex' }}
              height="32px"
              mr={8}
            />
          </Link>

          {renderNavLinks()}
        </Flex>

        <HStack spacing={{ base: '2', md: '6' }}>
          <Menu>
            <MenuButton
              as={IconButton}
              size="lg"
              variant="ghost"
              icon={
                <Box position="relative">
                  <FiBell />
                  {unread > 0 && (
                    <Badge
                      position="absolute"
                      top="-1"
                      right="-1"
                      colorScheme="red"
                      borderRadius="full"
                      minW="5"
                      textAlign="center"
                    >
                      {unread}
                    </Badge>
                  )}
                </Box>
              }
            />
            <MenuList>
              {notifications.length === 0 ? (
                <MenuItem>
                  <Text color="gray.500">No notifications</Text>
                </MenuItem>
              ) : (
                <>
                  {notifications.map((notification, index) => (
                    <MenuItem key={index}>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold">{notification.title}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {notification.message}
                        </Text>
                      </VStack>
                    </MenuItem>
                  ))}
                  <MenuDivider />
                  <MenuItem onClick={markAllAsRead}>
                    Mark all as read
                  </MenuItem>
                </>
              )}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}
            >
              <HStack>
                <Avatar
                  size="sm"
                  name={user?.name || user?.businessName}
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{user?.name || user?.businessName}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {user?.role?.toUpperCase()}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiUser />} as={RouterLink} to="/profile">
                Profile
              </MenuItem>
              <MenuItem icon={<FiSettings />} as={RouterLink} to="/settings">
                Settings
              </MenuItem>
              <MenuItem icon={<FiHelpCircle />} as={RouterLink} to="/help">
                Help & Support
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
      {renderMobileNav()}
    </>
  );
};

export default Navbar;