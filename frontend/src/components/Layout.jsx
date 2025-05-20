import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

// Import your page components
import Dashboard from '../pages/Dashboard';
import Orders from '../pages/Orders';
import Payments from '../pages/Payments';
import Deliveries from '../pages/Deliveries';

const Layout = () => {
  const { user } = useAuth();
  const isPharmacy = user?.role === 'pharmacy';

  return (
    <Box minH="100vh">
      <Sidebar />
      <Box
        ml={{ base: 0, md: 60 }}
        p="4"
      >
        <Navbar />
        <Box p="4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/deliveries" element={<Deliveries />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 