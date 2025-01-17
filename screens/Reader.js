// Reader.js
import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';

const Reader = ({ route }) => {
  const { chapters, initialChapter } = route.params;  // Receive chapters and initial chapter ID
  const [currentChapterIndex, setCurrentChapterIndex] = useState(
    chapters.findIndex((chapter) => chapter.id === initialChapter)
  );
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentChapter = chapters[currentChapterIndex];
  console.log(currentChapter.attributes.chapter);
  useEffect(() => {
    const fetchPages = async () => {
      try {
        // Fetch the chapter data using the MangaDex 'at-home' endpoint
        const response = await axios.get(`https://api.mangadex.org/at-home/server/${currentChapter.id}`);
        
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
  }, [currentChapter.id]);

  const goToNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  const goToPreviousChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Current Chapter Display */}
      <View style={styles.chapterInfo}>
      <Text style={styles.chapterText}>Chapter {Math.ceil(parseFloat(currentChapter.attributes.chapter))}</Text>


      </View>

      {/* Chapter Pages */}
      <ScrollView contentContainerStyle={styles.pageContainer}>
        {pages.map((pageUrl, index) => (
          <Image
            key={index}
            source={{ uri: pageUrl }}
            resizeMode="contain"
            style={styles.pageImage}
          />
        ))}
      </ScrollView>

      {/* Bottom Navigation Buttons */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={goToPreviousChapter} disabled={currentChapterIndex === 0}>
          <Text style={[styles.navText, currentChapterIndex === 0 && styles.disabled]}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNextChapter} disabled={currentChapterIndex === chapters.length - 1}>
          <Text style={[styles.navText, currentChapterIndex === chapters.length - 1 && styles.disabled]}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'space-between',
  },
  chapterInfo: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#222222',
  },
  chapterText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#222222',
  },
  navText: {
    fontSize: 18,
    color: '#fff',
  },
  disabled: {
    color: '#555',
  },
  pageContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 20,
  },
  pageImage: {
    width: '100%',
    height: 600,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Reader;
