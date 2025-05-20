import React, { useEffect } from 'react';
import { StatusBar, SafeAreaView, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/Navigation';
import { AuthProvider } from './src/contexts/AuthContext';
import { NotificationProvider } from './src/contexts/NotificationContext';
import { theme } from './src/components/theme';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Reanimated 2',
  'VirtualizedLists should never be nested',
  'Cannot update a component'
]);

export default function App() {
  // Set up app initialization logic here
  useEffect(() => {
    // App initialization code
    console.log('COEx app initialized');
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <AuthProvider>
          <NotificationProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </NotificationProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaView>
  );
}
