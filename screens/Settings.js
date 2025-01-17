import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch } from 'react-native';
import {lightTheme, darkTheme} from './themes/themes';
import { useTheme } from './themes/themeContext';

const Settings = () => {
     const {isDarkMode, toggleTheme } = useTheme(); 
    
    const themeStyles = isDarkMode ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, themeStyles.container]}>
      {/* App Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/app-logo.png')} // Replace with your logo's path
          style={styles.logo}
          resizeMode="contain"
        />
      </View>



      {/* Settings Options */}
      <ScrollView style={styles.optionsContainer}>
    
        {/* Toggle for Dark/Light Mode */}
        <View style={styles.switchContainer}>
            <Text style={themeStyles.switchLabel}>Dark Mode</Text>
            <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                thumbColor={isDarkMode ? '#fff' : '#000'}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
            />
        </View>
        <TouchableOpacity style={styles.optionItem}>
          <Text style={styles.optionText}>Account Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem}>
          <Text style={styles.optionText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem}>
          <Text style={styles.optionText}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem}>
          <Text style={styles.optionText}>Terms of Service</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem}>
          <Text style={styles.optionText}>Help & Support</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Yomikata © 2025</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      light: {
        container: {
          backgroundColor: '#fff',
        },
        input: {
          backgroundColor: '#fff',
          color: '#000',
        },
        switchLabel: {
          color: '#000',
        },
      },
      dark: {
        container: {
          backgroundColor: '#333',
        },
        input: {
          backgroundColor: '#555',
          color: '#fff',
        },
        switchLabel: {
          color: '#fff',
        },
      },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  optionItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
  },
  footer: {
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  footerText: {
    fontSize: 14,
    color: '#888888',
  },
  switchContainer: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Settings;
