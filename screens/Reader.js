// Reader.js
import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';

const Reader = ({ route }) => {
  const { chapterId } = route.params;
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        // Fetch the chapter data using the MangaDex 'at-home' endpoint
        const response = await axios.get(`https://api.mangadex.org/at-home/server/${chapterId}`);
        
        // If the request is successful, extract the page data
        const { baseUrl, chapter } = response.data;

        const pageUrls = chapter.data.map((page) => `${baseUrl}/data/${chapter.hash}/${page}`);

        // Update the state with the page URLs
        setPages(pageUrls);
      } catch (error) {
        console.error('Error fetching chapter pages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [chapterId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {pages.map((pageUrl, index) => (
        <Image 
        key={index} 
        source={{ uri: pageUrl }} 
        resizeMode='contain'
        style={styles.pageImage} 
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'column', 
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  pageImage: { 
    width: '100%', 
    height: 600, 

  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});

export default Reader;