import React from 'react';
import {
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  VStack,
  Divider,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, 
  FiShoppingCart, 
  FiClipboard, 
  FiCreditCard, 
  FiPackage, 
  FiTruck, 
  FiDollarSign, 
  FiUsers,
  FiSettings,
  FiHelpCircle,
  FiLogOut
} from 'react-icons/fi';
import Logo from './Logo';

// Map icon names to React Icons
const IconMap = {
  'home': FiHome,
  'shopping-cart': FiShoppingCart,
  'clipboard': FiClipboard,
  'credit-card': FiCreditCard,
  'package': FiPackage,
  'truck': FiTruck,
  'dollar-sign': FiDollarSign,
  'users': FiUsers,
  'settings': FiSettings,
  'help': FiHelpCircle,
  'logout': FiLogOut,
};

const NavItem = ({ icon, children, path, isActive, onClick, ...rest }) => {
  return (
    <RouterLink to={path} style={{ textDecoration: 'none' }} onClick={onClick}>
      <Flex
        align="center"
        px="4"
        py="3"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        fontWeight="medium"
        transition="all 0.2s"
        bg={isActive ? 'brand.500' : 'transparent'}
        color={isActive ? 'white' : 'gray.600'}
        _hover={{
          bg: 'brand.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            as={IconMap[icon]}
          />
        )}
        {children}
      </Flex>
    </RouterLink>
  );
};

const Sidebar = ({ onClose, ...rest }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getMenuItems = () => {
    if (!user) return [];
    
    if (user.role === 'pharmacy') {
      return [
        { name: 'Dashboard', icon: 'home', path: '/pharmacy/dashboard' },
        { name: 'Place Order', icon: 'shopping-cart', path: '/pharmacy/place-order' },
        { name: 'Order History', icon: 'clipboard', path: '/pharmacy/order-history' },
        { name: 'Marketplace', icon: 'package', path: '/pharmacy/marketplace' },
        { name: 'Payments', icon: 'credit-card', path: '/pharmacy/payments' },
      ];
    } else if (user.role === 'distributor') {
      return [
        { name: 'Dashboard', icon: 'home', path: '/distributor/dashboard' },
        { name: 'Manage Orders', icon: 'package', path: '/distributor/orders' },
        { name: 'Deliveries', icon: 'truck', path: '/distributor/deliveries' },
        { name: 'Payments', icon: 'dollar-sign', path: '/distributor/payments' },
      ];
    } else if (user.role === 'admin') {
      return [
        { name: 'Dashboard', icon: 'home', path: '/admin/dashboard' },
        { name: 'Users', icon: 'users', path: '/admin/users' },
        { name: 'Settings', icon: 'settings', path: '/admin/settings' },
      ];
    }
    return [];
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Logo height="40px" />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>

      {user && (
        <Box mx="8" mb="4">
          <Text fontSize="sm" fontWeight="bold" color="gray.500">
            {user.role.toUpperCase()}
          </Text>
          <Text fontSize="md" fontWeight="medium">
            {user.name || user.businessName}
          </Text>
        </Box>
      )}

      <VStack spacing="1" align="stretch" mt="4">
        {getMenuItems().map((item) => (
          <NavItem 
            key={item.name} 
            icon={item.icon} 
            path={item.path}
            isActive={location.pathname === item.path}
          >
            {item.name}
          </NavItem>
        ))}

        <Divider my={4} />

        <NavItem 
          icon="settings" 
          path="/settings"
          isActive={location.pathname === '/settings'}
        >
          Settings
        </NavItem>

        <NavItem 
          icon="help" 
          path="/help"
          isActive={location.pathname === '/help'}
        >
          Help & Support
        </NavItem>

        <NavItem 
          icon="logout" 
          path="#"
          onClick={handleLogout}
        >
          Sign out
        </NavItem>
      </VStack>
    </Box>
  );
};

export default Sidebar;