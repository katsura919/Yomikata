import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, StatusBar} from 'react-native';
import { useTheme } from './context/themeContext';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const MangaDetails = ({ route, navigation }) => {
  const { manga } = route.params;
  const [chapters, setChapters] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMoreChapters, setHasMoreChapters] = useState(true);
  const { isDarkMode } = useTheme();
  const themeStyles = isDarkMode ? styles.dark : styles.light;

  const getCoverImageUrl = () => {
    const coverRelation = manga.relationships.find((rel) => rel.type === 'cover_art');
    if (coverRelation) {
      const fileName = coverRelation.attributes.fileName;
      return `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.512.jpg`;
    }
    return null;
  };

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.mangadex.org/chapter', {
        params: {
          manga: manga.id,
          limit: 20,
          translatedLanguage: ['en'],
          order: { chapter: 'asc' },
          offset: (page - 1) * 20,
        },
      });

      const newChapters = response.data.data;

      if (newChapters.length === 0) {
        setHasMoreChapters(false);
      } else {
        setChapters((prevChapters) => [...prevChapters, ...newChapters]);
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMoreChapters) {
      setPage(page + 1);
    }
  };

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    fetchChapters();
  }, [page]);

  return (
    <ScrollView style={[styles.container, themeStyles.container]}>
      <StatusBar 
        translucent 
        backgroundColor="transparent" 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
      />
      <ImageBackground
        source={{ uri: getCoverImageUrl() }}
        style={{height: 370}}
      
      >
        <LinearGradient
          colors={['transparent', isDarkMode ? '#1e1e1e' : '#fff' ]} // Fades from transparent to black
          start={{ x: 0.5, y: 0.1 }} // Start of the gradient (top center)
          end={{ x: 0.5, y: 1 }} // End of the gradient (bottom center)
          style={styles.gradient}
        >
      <Ionicons 
              name="arrow-back" 
              size={25} 
              color={isDarkMode ? '#fff' : '#fff'} 
              onPress={() => navigation.goBack()}
              style={{padding: 5, marginTop: 30}} 
      />
      <View style={[styles.cardContainer, themeStyles.cardContainer]}>
        <View style={styles.metadataContainer}>
          <View>
          <Text style={themeStyles.title}>{manga.attributes.title.en || 'No Title Available'}</Text>
          <Text style={themeStyles.subTitle}>Romance • Action • Manhwa</Text>
          </View>
        </View>
      </View>
      </LinearGradient>
      </ImageBackground>

    <View style={{padding: 10}}>
      <Text style={themeStyles.sectionTitle}>Synopsis</Text>
      <Text
        style={[themeStyles.description, { textAlign: 'justify' }]}
        numberOfLines={isExpanded ? 0 : 3}>
        {manga.attributes.description.en || 'No Description Available'}
      </Text>
      <TouchableOpacity onPress={toggleDescription} style={styles.toggleButton}>
        <View style={styles.viewMoreBtn}>
          <Icon
            name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={24}
            color={isDarkMode ? '#ccc' : '#666'} 
          />
        </View>
      </TouchableOpacity>
      </View>

      <View style={{padding: 10}}>
      <Text style={themeStyles.sectionTitle}>Chapters</Text>
      <FlatList
        data={chapters}
        keyExtractor={(item, index) => `${item.id}-${page}-${index}`}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Reader', {
                chapters,
                initialChapter: item.id,
              })
            }>
            <View style={[styles.chapterCard, themeStyles.chapterCard]}>
              <Text style={themeStyles.chapterTitle}>
                Chapter {item.attributes.chapter}: {item.attributes.title || 'No Title'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : hasMoreChapters ? (
            <TouchableOpacity style={styles.loadMoreButton} onPress={loadMore}>
              <Text style={styles.loadMoreText}>Load More</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.noMoreChaptersText}>No More Chapters</Text>
          )
        }
      />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1},
  light: {
    container: {
      backgroundColor: '#fff',
    },
    title: {
      fontFamily: 'Poppins-Bold',
      fontSize: 22, 
      color: '#333', 
      textAlign: 'center'
    },
    subTitle: {
      fontFamily: 'Poppins-Regular',
      fontSize: 14,
      color: '#666',
      marginBottom: 8,
      textAlign: 'center'
    },
    actionButtonText: {
      fontFamily: 'Poppins-Regular',
      fontSize: 12,
      color: '#333',
      marginLeft: 5
    },
    sectionTitle: {
      fontFamily: 'Poppins-Bold',
      fontSize: 16,
      color: '#333',
      marginBottom: 10,
      
    },
    description: {
      fontFamily: 'Poppins-Light',
      fontSize: 12,
      color: '#333',
    },
    chapterCard: {
      backgroundColor: '#f0f0f0',
      padding: 12,
      borderRadius: 10,
      marginBottom: 10,
    },
    chapterTitle: {
      fontFamily: 'Poppins-Bold',
      fontSize: 13, 
      color: '#454545' 
    },
  },
  dark: {
    container: {
      backgroundColor: '#1e1e1e',
    },
    title: {
      fontFamily: 'Poppins-Bold',
      fontSize: 22, 
      color: '#fff', 
      textAlign: 'center'
    },
    subTitle: {
      fontFamily: 'Poppins-Regular',
      fontSize: 14,
      color: '#ccc',
      marginBottom: 8,
      textAlign: 'center'
    },
    actionButtonText: {
      fontFamily: 'Poppins-Regular',
      fontSize: 12,
      color: '#ccc',
      marginLeft: 5
    },
    sectionTitle: {
      fontFamily: 'Poppins-Bold',
      fontSize: 16,
      color: '#ccc',
      marginBottom: 10,
    },
    description: {
      fontFamily: 'Poppins-Light',
      fontSize: 12,
      color: '#ccc',
    },
    chapterCard: {
      backgroundColor: '#333',
      padding: 12,
      borderRadius: 10,
      marginBottom: 10,
    },
    chapterTitle: {
      fontFamily: 'Poppins-Bold',
      fontSize: 13, 
      color: '#fff' 
    },
  },
  coverImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 16
  },
  cardContainer: {
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  gradient: {
    flex: 1, // Ensure the gradient covers the entire container
    width: '100%', // Full width
    height: '100%', // Full height
  },
  
  metadataContainer: {
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#5b2e99',
  },
  toggleButton: {
    alignItems: 'center',
    marginVertical: 10
  },
  viewMoreBtn: {
    width: '100%',
    alignItems: 'center'
  },
  chapterCard: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  loadMoreButton: {
    backgroundColor: '#5b2e99',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 25,
  },
  loadMoreText: { color: '#FFFFFF' },
  noMoreChaptersText: { color: '#AAAAAA', textAlign: 'center', marginBottom: 16 },
  loadingText: { color: '#AAAAAA', textAlign: 'center', marginBottom: 25 },
});

export default MangaDetails;