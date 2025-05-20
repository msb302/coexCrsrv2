import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';

// Auth Screens
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';

// Pharmacy Screens
import PharmacyDashboard from './screens/pharmacy/PharmacyDashboard';
import PlaceOrder from './screens/pharmacy/PlaceOrder';
import OrderHistory from './screens/pharmacy/OrderHistory';
import UploadPayment from './screens/pharmacy/UploadPayment';

// Distributor Screens
import DistributorDashboard from './screens/distributor/DistributorDashboard';
import ManageOrders from './screens/distributor/ManageOrders';
import ManageDeliveries from './screens/distributor/ManageDeliveries';
import PaymentCollection from './screens/distributor/PaymentCollection';

// Admin Screens
import AdminDashboard from './screens/admin/AdminDashboard';
import ManageUsers from './screens/admin/ManageUsers';
import CreditLimits from './screens/admin/CreditLimits';

// Common Screens and Context
import { useAuth } from './contexts/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Pharmacy Tab Navigator
const PharmacyTabs = () => {
  const theme = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.backdrop,
        tabBarLabelStyle: { fontSize: 12 },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="PharmacyDashboard" 
        component={PharmacyDashboard} 
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="PlaceOrder" 
        component={PlaceOrder} 
        options={{
          tabBarLabel: 'Order',
          tabBarIcon: ({ color, size }) => (
            <Icon name="shopping-cart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="OrderHistory" 
        component={OrderHistory} 
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color, size }) => (
            <Icon name="clock" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="UploadPayment" 
        component={UploadPayment} 
        options={{
          tabBarLabel: 'Payment',
          tabBarIcon: ({ color, size }) => (
            <Icon name="credit-card" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Distributor Tab Navigator
const DistributorTabs = () => {
  const theme = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.backdrop,
        tabBarLabelStyle: { fontSize: 12 },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="DistributorDashboard" 
        component={DistributorDashboard} 
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="ManageOrders" 
        component={ManageOrders} 
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <Icon name="package" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="ManageDeliveries" 
        component={ManageDeliveries} 
        options={{
          tabBarLabel: 'Deliveries',
          tabBarIcon: ({ color, size }) => (
            <Icon name="truck" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="PaymentCollection" 
        component={PaymentCollection} 
        options={{
          tabBarLabel: 'Payments',
          tabBarIcon: ({ color, size }) => (
            <Icon name="dollar-sign" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Admin Tab Navigator
const AdminTabs = () => {
  const theme = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.backdrop,
        tabBarLabelStyle: { fontSize: 12 },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="AdminDashboard" 
        component={AdminDashboard} 
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="ManageUsers" 
        component={ManageUsers} 
        options={{
          tabBarLabel: 'Users',
          tabBarIcon: ({ color, size }) => (
            <Icon name="users" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="CreditLimits" 
        component={CreditLimits} 
        options={{
          tabBarLabel: 'Credit',
          tabBarIcon: ({ color, size }) => (
            <Icon name="credit-card" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main Navigator
const AppNavigator = () => {
  const { user, isLoading } = useAuth();
  
  // If loading, we could show a splash screen
  if (isLoading) {
    return null; // Or a loading component
  }
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        // Auth Stack
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Group>
      ) : (
        // Role-based Stack
        <>
          {user.role === 'pharmacy' && (
            <Stack.Screen name="PharmacyTabs" component={PharmacyTabs} />
          )}
          
          {user.role === 'distributor' && (
            <Stack.Screen name="DistributorTabs" component={DistributorTabs} />
          )}
          
          {user.role === 'admin' && (
            <Stack.Screen name="AdminTabs" component={AdminTabs} />
          )}
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
