import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './screens/context/themeContext'; 
import { FontProvider } from './screens/context/fontContext';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons

// Import Screens
import Home from './screens/Home';
import Search from './screens/Search';
import Settings from './screens/Settings';
import MangaDetails from './screens/MangaDetails';
import Reader from './screens/Reader';
import SearchResults from './screens/SearchResults';

// Create Navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Bottom Tab Navigator Component
function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Set icon name based on route name and focus state
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          // Return Ionicons icon
          return <Ionicons name={iconName} size={20} color={color} />;
        },
        tabBarShowLabel: false, // Hide labels
        tabBarStyle: {
          paddingTop: 5,
          backgroundColor: '#5b2f98',
          height: 50,
          paddingBottom: 2,
          elevation: 10,
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 8,
          position: 'absolute',
          marginHorizontal: 50,
          left: 0,
          right: 0,
          bottom: 10,
          borderTopWidth: 0,
          borderRadius: 60,
        },
        tabBarActiveTintColor: '#f2f3f2', // Active tab icon color
        tabBarInactiveTintColor: 'gray', // Inactive tab icon color
        headerShown: false, // Hide the header
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

// Main App with Stack and Tabs
const App = () => {
 
  return (
    <NavigationContainer>
      <ThemeProvider>
      <FontProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MyTabs} />
          <Stack.Screen name="Details" component={MangaDetails} />
          <Stack.Screen name="Reader" component={Reader} />
          <Stack.Screen name="SearchResults" component={SearchResults} />
        </Stack.Navigator>
      </FontProvider>  
      </ThemeProvider>
    </NavigationContainer>
  );
};

export default App;
