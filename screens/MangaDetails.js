// MangaDetails.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const MangaDetails = ({ route, navigation }) => {
  const { manga } = route.params;
  const [chapters, setChapters] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

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
          limit: 100,
          translatedLanguage: ['en'],
          order: { chapter: 'asc' },
          offset: (page - 1) * 100,
        },
      });
      setChapters((prevChapters) => [...prevChapters, ...response.data.data]);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(page + 1);
    fetchChapters();
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerSection}>
        <Image source={{ uri: getCoverImageUrl() }} style={styles.cover} />
        <View style={styles.metadataSection}>
          <Text style={styles.title}>{manga.attributes.title.en || 'No Title Available'}</Text>
          <Text style={styles.author}>By {manga.attributes.author || 'Unknown Author'}</Text>
          <View style={styles.tagsContainer}>
            {/* Example Tags */}
            <Text style={styles.tag}>Action</Text>
            <Text style={styles.tag}>Comedy</Text>
            <Text style={styles.tag}>Ongoing</Text>
          </View>
          <Text style={styles.description}>
            {manga.attributes.description.en || 'No Description Available'}
          </Text>
        </View>
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="play-arrow" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Resume</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="favorite-border" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Like</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Chapters:</Text>
      <FlatList
        data={chapters}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.chapterCard}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Reader', { chapterId: item.id })}
            >
              <Text style={styles.chapterTitle}>
                Chapter {item.attributes.chapter}: {item.attributes.title || 'No Title'}
              </Text>
              <Text style={styles.chapterDate}>{item.attributes.publishAt || 'No Date'}</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="more-vert" size={20} color="#555" />
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : (
            <TouchableOpacity style={styles.loadMoreButton} onPress={loadMore}>
              <Text style={styles.loadMoreText}>Load More</Text>
            </TouchableOpacity>
          )
        }
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e1e1e', padding: 10 },
  headerSection: { flexDirection: 'row', marginBottom: 20 },
  cover: { width: 120, height: 180, borderRadius: 5, marginRight: 10 },
  metadataSection: { flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  author: { fontSize: 16, color: '#bbb', marginBottom: 5 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  tag: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
    fontSize: 12,
  },
  description: { fontSize: 14, color: '#ddd', marginBottom: 20 },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
  },
  actionButtonText: { color: '#fff', marginLeft: 5 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  chapterCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#292929',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  chapterTitle: { fontSize: 16, color: '#fff' },
  chapterDate: { fontSize: 12, color: '#aaa' },
  loadMoreButton: {
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  loadMoreText: { color: '#fff' },
  loadingText: { textAlign: 'center', color: '#aaa' },
});

export default MangaDetails;
