import React, { useState, useEffect }  from 'react';
import { View, Text, StyleSheet, Image, Switch, StatusBar } from 'react-native';
import { useTheme } from './context/themeContext'; 
import Ionicons from 'react-native-vector-icons/Ionicons'

const Settings = ({navigation}) => {
  const { isDarkMode, toggleTheme } = useTheme(); 


  const themeStyles = isDarkMode ? styles.dark : styles.light;


  return (
    <View style={[styles.container, themeStyles.container]}>
      <StatusBar/>
      <Ionicons 
                    name="arrow-back" 
                    size={25} 
                    color={isDarkMode ? '#ccc' : '#666'} 
                    onPress={() => navigation.goBack()}
                    style={{padding: 5}} 
            />
      {/* App Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/app-logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        {/* Title with dynamic color */}
        <Text style={themeStyles.appTitle}>Yomikata</Text>
      </View>

      {/* Dark Mode Toggle */}
      <View style={styles.switchContainer}>
        <Text style={themeStyles.switchLabel}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          thumbColor={isDarkMode ? '#fff' : '#000'}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
        />
        
      </View>
      <View style={{ marginHorizontal: 10 }}>
        <Text style={themeStyles.switchLabel} onPress={() => navigation.navigate('BugReport')}>
          Report a Bug
        </Text>
      </View>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 0,
  },
  light: {
    container: {
      backgroundColor: '#fff',
    },
    switchLabel: {
      fontFamily: 'Poppins-Light',
      color: '#454545',
    },
    appTitle: {
      fontFamily: 'Knewave-Regular',
      color: '#454545', // Light mode color for title
      fontSize: 30,
    },
  },
  dark: {
    container: {
      backgroundColor: '#1e1e1e',
    },
    switchLabel: {
      fontFamily: 'Poppins-Light',
      color: '#fff',
    },
    appTitle: {
      fontFamily: 'Knewave-Regular',
      color: '#fff', // Dark mode color for title
      fontSize: 30,
     
    },
  },
  logoContainer: {
    marginTop: 70,
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  switchContainer: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Settings;
