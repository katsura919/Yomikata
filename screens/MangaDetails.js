import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from './context/themeContext';
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
      <View style={[styles.cardContainer, themeStyles.cardContainer]}>
        <View style={styles.headerSection}>
          <Image source={{ uri: getCoverImageUrl() }} style={styles.cover} />
          <View style={styles.metadataSection}>
            <Text style={styles.title}>{manga.attributes.title.en || 'No Title Available'}</Text>
            <Text style={styles.author}>by {manga.attributes.author || 'Unknown Author'}</Text>
            <View style={styles.tagsContainer}>
              <Text style={styles.tag}>Action</Text>
              <Text style={styles.tag}>Adventure</Text>
              <Text style={styles.tag}>Fantasy</Text>
            </View>
          </View>
        </View>

        <Text
          style={[styles.description, { textAlign: 'justify' }]}
          numberOfLines={isExpanded ? 0 : 3}>
          {manga.attributes.description.en || 'No Description Available'}
        </Text>
        <TouchableOpacity onPress={toggleDescription} style={styles.toggleButton}>
          <Text style={styles.toggleText}>{isExpanded ? 'See Less' : 'See More'}</Text>
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
            <View style={styles.chapterCard}>
              <Text style={styles.chapterTitle}>
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
  container: { flex: 1, backgroundColor: '#1e1e1e', padding: 16 },
  light: {
    container: {
      backgroundColor: '#fff',
    },
   cardContainer:{
    backgroundColor: '#2A2A2A',
    borderWidth: 3
   }
  },
  dark: {
    container: {
      backgroundColor: '#333',
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
  author: { 
    fontFamily: 'Poppins-Light',
    fontSize: 14, 
    color: '#CCCCCC', 
    marginBottom: 8 },
  tagsContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap' },
  tag: {
    fontFamily: 'Poppins-Light',
    backgroundColor: '#3A3A3A',
    color: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  description: { 
    fontFamily: 'Poppins-Light',
    fontSize: 14, 
    color: '#CCCCCC', 
    marginBottom: 8 },
  toggleButton: { alignSelf: 'flex-start' },
  toggleText: { fontFamily: 'Poppins-Light', color: '#FFFFFF', fontSize: 14 },
  actionButton: {
    backgroundColor: '#FF6F61',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  actionButtonText: { fontFamily: 'Poppins-Light', color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  chapterCard: {
    backgroundColor: '#333333',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  chapterTitle: { fontFamily: 'Poppins-Light',
    fontSize: 14, color: '#FFFFFF' },
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
