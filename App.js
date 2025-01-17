import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './screens/themes/themeContext'; 

// Screens
import Home from './screens/Home';
import SearchResults from './screens/SearchResults';
import MangaDetails from './screens/MangaDetails';
import Reader from './screens/Reader';
import Settings from './screens/Settings';
import Search from './screens/Search';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigator for Home and Details
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Details" component={MangaDetails} />
      <Stack.Screen name="Reader" component={Reader} />
    </Stack.Navigator>
  );
};

// Stack Navigator for Search
const SearchStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Results" component={SearchResults} />
      <Stack.Screen name="Details" component={MangaDetails} />
    </Stack.Navigator>
  );
};

// Main App with Bottom Tab Navigator
const App = () => {
  return (
    <NavigationContainer>
      <ThemeProvider>
        <Tab.Navigator
          initialRouteName="HomeTab"
          screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: '#f8f8f8' },
          }}
        >
          <Tab.Screen name="HomeTab" component={HomeStack} options={{ tabBarLabel: 'Home' }} />
          <Tab.Screen name="SearchTab" component={SearchStack} options={{ tabBarLabel: 'Search' }} />
          <Tab.Screen name="Settings" component={Settings} options={{ tabBarLabel: 'Settings' }} />
        </Tab.Navigator>
      </ThemeProvider>
    </NavigationContainer>
  );
};

export default App;
