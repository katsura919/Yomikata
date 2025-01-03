// MangaDetails.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
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

  return (
    <ScrollView>
    <View style={styles.container}>
      <Image source={{ uri: getCoverImageUrl() }} style={styles.cover} />
      <Text style={styles.title}>{manga.attributes.title.en || 'No Title Available'}</Text>
      <Text style={styles.description}>
        {manga.attributes.description.en || 'No Description Available'}
      </Text>
      <Text style={styles.sectionTitle}>Chapters:</Text>
      <FlatList
        data={chapters}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <TouchableOpacity
            style={styles.chapterCard}
            onPress={() => navigation.navigate('Reader', { chapterId: item.id })}
            >
            <Text style={styles.chapterTitle}>
                Chapter {item.attributes.chapter}: {item.attributes.title || 'No Title'}
            </Text>
            </TouchableOpacity>
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

    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  cover: { width: '100%', height: 300, marginBottom: 10, borderRadius: 5 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  chapterCard: { padding: 10, backgroundColor: '#f9f9f9', borderRadius: 5, marginBottom: 10 },
  chapterTitle: { fontSize: 16, fontWeight: 'bold' },
});

export default MangaDetails;
