import React from 'react';
import { Image, Box } from '@chakra-ui/react';
import logoImage from '../../assets/logo.png';

const Logo = ({ height = '40px', ...props }) => {
  return (
    <Box {...props}>
      <Image
        src={logoImage}
        alt="COEx Logo"
        height={height}
        objectFit="contain"
      />
    </Box>
  );
};

export default Logo; 