import React from 'react';
import { Badge } from '@chakra-ui/react';

/**
 * StatusBadge component for displaying order, payment, or delivery status
 * 
 * @param {Object} props
 * @param {string} props.status - The status to display
 * @param {string} props.type - The type of status (order, payment, delivery)
 */
const StatusBadge = ({ status, type = 'order' }) => {
  // Status color mapping
  const getColorScheme = () => {
    // Order status colors
    if (type === 'order') {
      switch (status.toLowerCase()) {
        case 'pending':
          return 'orange';
        case 'accepted':
          return 'blue';
        case 'shipped':
          return 'purple';
        case 'delivered':
          return 'green';
        case 'canceled':
          return 'red';
        default:
          return 'gray';
      }
    }
    
    // Payment status colors
    if (type === 'payment') {
      switch (status.toLowerCase()) {
        case 'pending':
          return 'orange';
        case 'verified':
          return 'green';
        case 'rejected':
          return 'red';
        default:
          return 'gray';
      }
    }
    
    // Delivery status colors
    if (type === 'delivery') {
      switch (status.toLowerCase()) {
        case 'scheduled':
          return 'blue';
        case 'in_transit':
          return 'purple';
        case 'delivered':
          return 'green';
        case 'failed':
          return 'red';
        default:
          return 'gray';
      }
    }
    
    return 'gray';
  };

  return (
    <Badge 
      colorScheme={getColorScheme()}
      px={2} 
      py={1} 
      borderRadius="md"
      textTransform="capitalize"
    >
      {status.replace('_', ' ')}
    </Badge>
  );
};

export default StatusBadge;