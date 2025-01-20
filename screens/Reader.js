import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

const Reader = ({ route }) => {
  const { chapters, initialChapter } = route.params; // Receive chapters and initial chapter ID
  const [currentChapterIndex, setCurrentChapterIndex] = useState(
    chapters.findIndex((chapter) => chapter.id === initialChapter)
  );
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageDimensions, setImageDimensions] = useState([]);

  const currentChapter = chapters[currentChapterIndex];

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

        // Calculate and set the image dimensions for each page
        const dimensions = await Promise.all(
          pageUrls.map(async (pageUrl) => {
            const { width, height } = await new Promise((resolve) => {
              Image.getSize(pageUrl, (width, height) => resolve({ width, height }));
            });
            return { width, height };
          })
        );

        setImageDimensions(dimensions);
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
      setLoading(true); // Reset loading state for the next chapter
    }
  };

  const goToPreviousChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      setLoading(true); // Reset loading state for the previous chapter
    }
  };

  return (
    <View style={styles.container}>
      {/* Current Chapter Display */}
      <View style={styles.chapterInfo}>
        <TouchableOpacity onPress={goToPreviousChapter} disabled={currentChapterIndex === 0}>
          <Text style={[styles.navText, currentChapterIndex === 0 && styles.disabled]}>
            <Icon name="chevron-back" size={25} color="white" />
          </Text>
        </TouchableOpacity>

        <Text style={styles.chapterText}>
          Chapter {Math.ceil(parseFloat(currentChapter.attributes.chapter))}
        </Text>

        <TouchableOpacity onPress={goToNextChapter} disabled={currentChapterIndex === chapters.length - 1}>
          <Text style={[styles.navText, currentChapterIndex === chapters.length - 1 && styles.disabled]}>
            <Icon name="chevron-forward" size={25} color="white" />
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chapter Pages */}
      <ScrollView contentContainerStyle={styles.pageContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="white" style={styles.spinner} />
        ) : (
          pages.map((pageUrl, index) => (
            <Image
              key={index}
              source={{ uri: pageUrl }}
              resizeMode="contain" // "contain" ensures the image retains its aspect ratio
              style={styles.pageImage} // Dynamically set the height
            />
          ))
        )}
      </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 7,
    height: 50,
    backgroundColor: '#222222',
  },
  chapterText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
    color: '#fff',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#222222',
  },
  navText: {
    fontFamily: 'Poppins-Light',
    fontSize: 14,
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
    width: '100%', // Full width of the container
    height: 600,
    marginBottom: 10,
  },
  spinner: {
    marginTop: 20,
    color: 'white'
  },
});

export default Reader;
