import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './screens/themes/themeContext'; 

// Screens
import MangaSearch from './screens/MangaSearch';
import SearchResults from './screens/SearchResults';
import MangaDetails from './screens/MangaDetails';
import Reader from './screens/Reader';
import Settings from './screens/Settings';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <ThemeProvider>
      <Stack.Navigator initialRouteName="Search"  screenOptions={{headerShown: false}}>
        <Stack.Screen name="Search" component={MangaSearch} />
        <Stack.Screen name="Results" component={SearchResults} />
        <Stack.Screen name="Details" component={MangaDetails} />
        <Stack.Screen name="Reader" component={Reader} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
      </ThemeProvider>
    </NavigationContainer>
  );
};

export default App;
