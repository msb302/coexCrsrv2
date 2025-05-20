
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#E6F3FA',
      100: '#CCE7F5',
      200: '#99CFEB',
      300: '#66B8E0',
      400: '#33A0D6',
      500: '#004B87', // Primary COEx blue
      600: '#003C6C',
      700: '#002D51',
      800: '#001E36',
      900: '#000F1B',
    },
    accent: {
      50: '#E6F7F5',
      100: '#CCEFEB',
      200: '#99DFD7',
      300: '#66CFC3',
      400: '#33BFAF',
      500: '#00A896', // COEx green-blue
      600: '#008678',
      700: '#00655A',
      800: '#00433C',
      900: '#00221E',
    },
    status: {
      pending: '#f6ad55',
      accepted: '#00A896',
      shipped: '#004B87',
      delivered: '#00A896',
      canceled: '#B71C1C',
    },
  },
  fonts: {
    body: 'Inter, system-ui, sans-serif',
    heading: 'Inter, system-ui, sans-serif',
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    bold: 700,
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
        outline: {
          borderColor: 'brand.500',
          color: 'brand.500',
          _hover: {
            bg: 'brand.50',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          backgroundColor: 'white',
          borderRadius: 'lg',
          boxShadow: 'md',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          _hover: {
            boxShadow: 'lg',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: '#f7fafc',
        color: 'gray.800',
      },
    },
  },
});

export default theme;
