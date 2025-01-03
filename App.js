import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MangaSearch from './screens/MangaSearch';
import SearchResults from './screens/SearchResults';
import MangaDetails from './screens/MangaDetails';
import Reader from './screens/Reader';
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Search"  screenOptions={{headerShown: false}}>
        <Stack.Screen name="Search" component={MangaSearch} />
        <Stack.Screen name="Results" component={SearchResults} />
        <Stack.Screen name="Details" component={MangaDetails} />
        <Stack.Screen name="Reader" component={Reader} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
