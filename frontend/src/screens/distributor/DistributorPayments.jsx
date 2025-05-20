import React from 'react';
import {
  Box,
  Container,
  Heading,
} from '@chakra-ui/react';
import Navbar from '../../components/Navbar';

function DistributorPayments() {
  return (
    <Box>
      <Navbar />
      <Box pt="20">
        <Container maxW="container.xl" py={5}>
          <Heading mb={6}>Payments Management</Heading>
          {/* Payments content will be added here */}
        </Container>
      </Box>
    </Box>
  );
}

export default DistributorPayments; 