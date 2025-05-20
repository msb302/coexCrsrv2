import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // Primary colors
    primary: '#004B87', // COEx blue
    accent: '#00A896', // COEx green-blue

    // Background colors
    background: '#F9FCFF',
    surface: '#FFFFFF',

    // Functional colors
    error: '#B71C1C',
    warning: '#F2994A',
    success: '#00A896',

    // Text colors
    text: '#1A1A2E',
    placeholder: '#6E7191',

    // Status colors
    pending: '#F2994A',
    accepted: '#00A896',
    processing: '#004B87',
    shipped: '#00A896',
    delivered: '#00A896',
    cancelled: '#B71C1C',
    rejected: '#B71C1C',

    // Payment status colors
    cleared: '#00A896',
    bounced: '#B71C1C',

    // Card backgrounds
    cardBackground: '#FFFFFF',

    // Dividers
    divider: '#EFF0F6',

    // Misc
    disabled: '#D9DBE9',
    notification: '#B71C1C',
  },
  fonts: DefaultTheme.fonts,
  roundness: 8,
  animation: {
    scale: 1.0,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 8,
    },
  },
};