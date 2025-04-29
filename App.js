import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AddMemoryScreen from './screens/AddMemoryScreen';
import MemoryDetailScreen from './screens/MemoryDetailScreen';
import { Image, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import {
  useFonts,
  JetBrainsMono_400Regular,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';

const Stack = createStackNavigator();

// Custom theme with Coral and Mint Green pastels
const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F0F9F3', // Mint green background
    card: '#FBE6D3', // Soft pastel Coral card background
    text: 'white', // Muted brownish text color
    border: '#F4D1D0', // Light pastel Coral border color
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold,
  });

  if (!fontsLoaded) {
    return null; // Can replace with a <Loading /> component
  }

  return (
    <NavigationContainer theme={AppTheme}>
      <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{
          headerStyle: { backgroundColor: '#787F79' }, // Soft pastel Coral header
          headerTintColor: '#F0F9F3', // Muted brownish header text
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 22,
            fontFamily: 'JetBrainsMono_700Bold',
          },
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: '',
            headerLeft: () => (
              <View style={styles.headerLogoContainer}>
                <Image
                  source={require('./assets/Logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            ),
            // Adding the logo click to refresh the screen
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                <View style={styles.headerLogoContainer}>
                  <Image
                    source={require('./assets/Logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="AddMemoryScreen"
          component={AddMemoryScreen}
          options={{
            title: 'Add a New Memory',
            headerStyle: { backgroundColor: '#787F79' }, // Soft pastel Coral header
          }}
        />
        <Stack.Screen
          name="MemoryDetailScreen"
          component={MemoryDetailScreen}
          options={{
            title: 'Memory Details',
            headerStyle: { backgroundColor: '#787F79' }, // Soft pastel Coral header
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerLogoContainer: {
    marginLeft: 16,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});
