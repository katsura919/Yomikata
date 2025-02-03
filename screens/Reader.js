import React, { useState, useEffect } from 'react';
import { 
  View, Image, StyleSheet, ScrollView, ActivityIndicator, 
  TouchableOpacity, Text, StatusBar, TouchableWithoutFeedback, Dimensions 
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

const { width: screenWidth } = Dimensions.get('window'); // Get screen width

const Reader = ({ route }) => {
  const { chapters, initialChapter } = route.params;
  const [currentChapterIndex, setCurrentChapterIndex] = useState(
    chapters.findIndex((chapter) => chapter.id === initialChapter)
  );
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUIVisible, setIsUIVisible] = useState(false); // Initially hidden UI (StatusBar + NavBar)
  const [imageDimensions, setImageDimensions] = useState([]); // Store dynamic image dimensions

  const currentChapter = chapters[currentChapterIndex];

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await axios.get(`https://api.mangadex.org/at-home/server/${currentChapter.id}`);
        const { baseUrl, chapter } = response.data;
        const pageUrls = chapter.data.map((page) => `${baseUrl}/data/${chapter.hash}/${page}`);
        setPages(pageUrls);
      } catch (error) {
        console.error('Error fetching chapter pages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [currentChapter.id]);

  const handleScroll = (event) => {
    // Hide UI (StatusBar + NavBar) when scrolling
    if (event.nativeEvent.contentOffset.y > 0) {
      setIsUIVisible(false);
    }
  };

  const handleTap = () => {
    // Show UI when tapped
    setIsUIVisible(true);
  };

  const goToNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      setLoading(true);
    }
  };

  const goToPreviousChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      setLoading(true);
    }
  };

  const onImageLoad = (index, width, height) => {
    // Calculate the image height based on the screen width to maintain aspect ratio
    const aspectRatio = width / height;
    const calculatedHeight = screenWidth / aspectRatio;

    setImageDimensions((prevState) => {
      const newDimensions = [...prevState];
      newDimensions[index] = { width: screenWidth, height: calculatedHeight };
      return newDimensions;
    });
  };

  return (
    <View style={styles.container}>
      {/* Transparent StatusBar */}
      <StatusBar 
        barStyle="light-content" 
        translucent={true} 
        backgroundColor="transparent" 
        hidden={!isUIVisible} 
      />

      {/* Touchable to detect tap and show UI */}
      <TouchableWithoutFeedback onPress={handleTap}>
        <View style={[styles.chapterInfo, isUIVisible && styles.showNavBar]}>
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
      </TouchableWithoutFeedback>

      {/* Chapter Pages */}
      <ScrollView 
        contentContainerStyle={styles.pageContainer}
        onScroll={handleScroll} 
        scrollEventThrottle={16} // Throttle the scroll event
      >
        {loading ? (
          <ActivityIndicator size="large" color="white" style={styles.spinner} />
        ) : (
          pages.map((pageUrl, index) => (
            <Image
              key={index}
              source={{ uri: pageUrl }}
              resizeMode="contain" 
              style={[styles.pageImage, imageDimensions[index] && {
                height: imageDimensions[index].height,
                width: imageDimensions[index].width,
              }]}
              onLoad={(event) => {
                const { width, height } = event.nativeEvent.source;
                onImageLoad(index, width, height); // Store the loaded image dimensions
              }}
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
  },
  chapterInfo: {
    position: 'absolute', // Fixed position to make it float above content
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 7,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Translucent background
    zIndex: 10,
  },
  showNavBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker translucent when shown
  },
  chapterText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
    color: '#fff',
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
    width: screenWidth, // Set the width to the screen width
    marginBottom: 10,
  },
  spinner: {
    marginTop: 20,
    color: 'white',
  },
});

export default Reader;
