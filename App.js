import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './screens/context/themeContext';
import { FontProvider } from './screens/context/fontContext';

// Import Screens
import Home from './screens/Home';
import Search from './screens/Search';
import Settings from './screens/Settings';
import MangaDetails from './screens/MangaDetails';
import Reader from './screens/Reader';
import SearchResults from './screens/SearchResults';
import BugReport from './screens/BugReport';
// Create Stack Navigator
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <ThemeProvider>
        <FontProvider>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Details" component={MangaDetails} />
            <Stack.Screen name="Reader" component={Reader} />
            <Stack.Screen name="SearchResults" component={SearchResults} />
            <Stack.Screen name="BugReport" component={BugReport} />
          </Stack.Navigator>
        </FontProvider>
      </ThemeProvider>
    </NavigationContainer>
  );
};

export default App;
