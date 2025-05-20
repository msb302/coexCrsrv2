import React from 'react';
import {
  Box,
  Container,
  Heading,
} from '@chakra-ui/react';
import Navbar from '../../components/Navbar';

function DistributorOrders() {
  return (
    <Box>
      <Navbar />
      <Box pt="20">
        <Container maxW="container.xl" py={5}>
          <Heading mb={6}>Orders Management</Heading>
          {/* Orders content will be added here */}
        </Container>
      </Box>
    </Box>
  );
}

export default DistributorOrders; 