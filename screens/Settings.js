import React from 'react';
import { View, Text, StyleSheet, Image, Switch } from 'react-native';
import { useTheme } from './themes/themeContext'; // Ensure this is the correct path

const Settings = () => {
  const { isDarkMode, toggleTheme } = useTheme(); // Use context for theme management
  
  // Dynamically choose theme styles based on current mode
  const themeStyles = isDarkMode ? styles.dark : styles.light;

  return (
    <View style={[styles.container, themeStyles.container]}>
      {/* App Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/app-logo.png')} // Ensure path to image is correct
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  light: {
    container: {
      backgroundColor: '#fff',
    },
    switchLabel: {
      color: '#000',
    },
    appTitle: {
      color: '#000', // Light mode color for title
      fontSize: 25,
      fontWeight: 'bold',
    },
  },
  dark: {
    container: {
      backgroundColor: '#333',
    },
    switchLabel: {
      color: '#fff',
    },
    appTitle: {
      color: '#fff', // Dark mode color for title
      fontSize: 25,
      fontWeight: 'bold',
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
