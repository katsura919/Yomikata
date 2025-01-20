import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from './context/themeContext';
import Ionicons from 'react-native-vector-icons/Ionicons'
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
      <Ionicons 
              name="arrow-back" 
              size={25} 
              color={isDarkMode ? '#ccc' : '#666'} 
              onPress={() => navigation.goBack()}
              style={{padding: 5}} 
      />
      <View style={[styles.cardContainer, themeStyles.cardContainer]}>
        <View style={styles.headerSection}>
          <Image source={{ uri: getCoverImageUrl() }} style={styles.cover} />
          <View style={styles.metadataSection}>
            <Text style={themeStyles.title}>{manga.attributes.title.en || 'No Title Available'}</Text>
            <Text style={themeStyles.author}>by {manga.attributes.author || 'Unknown Author'}</Text>
            <View style={styles.tagsContainer}>
              <Text style={themeStyles.tag}>Action</Text>
              <Text style={themeStyles.tag}>Adventure</Text>
              <Text style={themeStyles.tag}>Fantasy</Text>
            </View>
          </View>
        </View>

        <Text
          style={[themeStyles.description, { textAlign: 'justify' }]}
          numberOfLines={isExpanded ? 0 : 3}>
          {manga.attributes.description.en || 'No Description Available'}
        </Text>
        <TouchableOpacity onPress={toggleDescription} style={styles.toggleButton}>
          <Text style={themeStyles.toggleText}>{isExpanded ? 'See Less' : 'See More'}</Text>
        </TouchableOpacity>
      </View>

     
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
            <View style={themeStyles.chapterCard}>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e1e1e', padding: 5 },
  light: {
    container: {
      backgroundColor: '#fff',
    },
    title: {
      fontFamily: 'Poppins-Bold',
      fontSize: 20, 
      color: '#333', 
      marginBottom: 8 
    },
    author: { 
      fontFamily: 'Poppins-Light',
      fontSize: 12, 
      color: '#333', 
      marginBottom: 8 
    },
    tag: {
      fontFamily: 'Poppins-Light',
      color: '#333',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      fontSize: 12,
      marginRight: 8,
      marginBottom: 8,
    },
    description: { 
      fontFamily: 'Poppins-Light',
      fontSize: 12, 
      color: '#333', 
      marginBottom: 8 
    },
    toggleText: { 
      fontFamily: 'Poppins-Bold', 
      color: '#333', 
      fontSize: 12 
    },
    chapterCard: {
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
      backgroundColor: '#333',
    },
    title: {
      fontFamily: 'Poppins-Bold',
      fontSize: 20, 
      color: '#fff', 
      marginBottom: 8 
    },
    author: { 
      fontFamily: 'Poppins-Light',
      fontSize: 12, 
      color: '#fff', 
      marginBottom: 8 
    },
    tag: {
      fontFamily: 'Poppins-Light',
      color: '#fff',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      fontSize: 12,
      marginRight: 8,
      marginBottom: 8,
    },
    description: { 
      fontFamily: 'Poppins-Light',
      fontSize: 12, 
      color: '#fff', 
      marginBottom: 8 
    },
    toggleText: { 
      fontFamily: 'Poppins-Bold', 
      color: '#fff', 
      fontSize: 12 
    },
    chapterCard: {
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
  cardContainer: {
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
  },
  headerSection: { flexDirection: 'row', marginBottom: 16 },
  cover: { width: 120, height: 180, borderRadius: 10, marginRight: 16 },
  metadataSection: { flex: 1 },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20, 
    color: '#FFFFFF', 
    marginBottom: 8 
  },
  tagsContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap' },
  toggleButton: { 
    alignSelf: 'flex-start' 
  },
  actionButton: {
    backgroundColor: '#FF6F61',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  actionButtonText: { fontFamily: 'Poppins-Light', color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },


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
