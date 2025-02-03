import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ScrollView, StatusBar, SafeAreaView } from 'react-native';

const BugReport = () => {
  const [bugReport, setBugReport] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    // Add your bug reporting logic here (e.g., send bug report to a server or database)
    setTimeout(() => {
      setLoading(false);
      alert('Report submitted!');
      setBugReport('');
    }, 2000);
  };

  const handleScroll = (event) => {
    // Optional: Add logic for dynamic UI changes on scroll if needed
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        translucent={true} 
        backgroundColor="transparent" 
      />
      <View style={styles.header}>
        <Text style={styles.headerText}>Report a Bug</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        onScroll={handleScroll} 
        scrollEventThrottle={16}
      >
        <View style={styles.formContainer}>
          <Text style={styles.label}>Describe the issue:</Text>
          <TextInput
            value={bugReport}
            onChangeText={setBugReport}
            placeholder="Enter details about the bug..."
            placeholderTextColor="gray"
            style={styles.textInput}
            multiline
            numberOfLines={6}
          />
          <Button 
            title={loading ? 'Submitting...' : 'Submit Report'}
            onPress={handleSubmit}
            color="#FF6347" 
            disabled={loading || !bugReport}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 7,
    height: 50,
    backgroundColor: '#121212',
  },
  headerText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#fff',
  },
  scrollViewContent: {
    paddingTop: 60, // Adjusted padding to ensure content is spaced below the status bar
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 20,
    marginTop: 20,
    elevation: 5,
  },
  label: {
    fontFamily: 'Poppins-Light',
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  textInput: {
    fontFamily: 'Poppins-Light',
    height: 150,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    color: '#fff',
    backgroundColor: '#333',
    fontSize: 14,
    marginBottom: 20,
  },
});

export default BugReport;
