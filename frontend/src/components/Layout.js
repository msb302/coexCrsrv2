import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Drawer,
  DrawerContent,
  useDisclosure,
} from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

const Layout = ({ role }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to the appropriate dashboard based on user role
  useEffect(() => {
    if (isAuthenticated && user) {
      const userRole = role || user.role;
      
      if (window.location.pathname === '/') {
        if (userRole === 'pharmacy') {
          navigate('/pharmacy');
        } else if (userRole === 'distributor') {
          navigate('/distributor');
        } else if (userRole === 'admin') {
          navigate('/admin');
        }
      }
    }
  }, [isAuthenticated, user, navigate, role]);

  // Get the menu items based on user role
  const getMenuItems = () => {
    const userRole = role || (user ? user.role : '');
    
    if (userRole === 'pharmacy') {
      return [
        { name: 'Dashboard', icon: 'home', path: '/pharmacy' },
        { name: 'Place Order', icon: 'shopping-cart', path: '/pharmacy/place-order' },
        { name: 'Order History', icon: 'clipboard', path: '/pharmacy/order-history' },
        { name: 'Upload Payment', icon: 'credit-card', path: '/pharmacy/upload-payment' },
      ];
    } else if (userRole === 'distributor') {
      return [
        { name: 'Dashboard', icon: 'home', path: '/distributor' },
        { name: 'Manage Orders', icon: 'package', path: '/distributor/manage-orders' },
        { name: 'Manage Deliveries', icon: 'truck', path: '/distributor/manage-deliveries' },
        { name: 'Payment Collection', icon: 'dollar-sign', path: '/distributor/payment-collection' },
      ];
    } else if (userRole === 'admin') {
      return [
        { name: 'Dashboard', icon: 'home', path: '/admin' },
        { name: 'Manage Users', icon: 'users', path: '/admin/manage-users' },
        { name: 'Credit Limits', icon: 'credit-card', path: '/admin/credit-limits' },
      ];
    }
    return [];
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Sidebar
        onClose={onClose}
        display={{ base: 'none', md: 'block' }}
        menuItems={getMenuItems()}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <Sidebar 
            onClose={onClose} 
            menuItems={getMenuItems()} 
          />
        </DrawerContent>
      </Drawer>
      
      {/* Main content area */}
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Navbar onOpen={onOpen} />
        <Box pt="20px" pb="40px">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;