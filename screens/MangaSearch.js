import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, FlatList, Image, Text, TouchableOpacity, StatusBar } from 'react-native';
import axios from 'axios';

const MangaSearch = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [popularMangas, setPopularMangas] = useState([]);

  useEffect(() => {
    const fetchPopularMangas = async () => {
      try {
        const response = await axios.get('https://api.mangadex.org/manga', {
          params: {
            limit: 51,
            includes: ['cover_art'],
            order: { rating: 'desc' },
          },
        });
        setPopularMangas(response.data.data);
      } catch (error) {
        console.error('Error fetching popular mangas:', error);
      }
    };

    fetchPopularMangas();
  }, []);

  const searchManga = async () => {
    if (!query) return;
    try {
      const response = await axios.get('https://api.mangadex.org/manga', {
        params: { title: query, limit: 20, includes: ['cover_art'] },
      });
      navigation.navigate('Results', { results: response.data.data });
    } catch (error) {
      console.error('Error searching manga:', error);
    }
  };

  const getCoverImageUrl = (manga) => {
    const coverRelation = manga.relationships.find((rel) => rel.type === 'cover_art');
    if (coverRelation) {
      return `https://uploads.mangadex.org/covers/${manga.id}/${coverRelation.attributes.fileName}.512.jpg`;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#1e2026" />
        <TextInput
          style={styles.input}
          placeholder="Search Manga..."
          value={query}
          onChangeText={setQuery}
        />
        <Button title="Search" onPress={searchManga} />
      </View>
      <FlatList
        data={popularMangas}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Details', { manga: item })}
          >
            <Image
              source={{ uri: getCoverImageUrl(item) }}
              style={styles.cover}
              resizeMode="cover"
            />
            <Text style={styles.title} numberOfLines={2}>
              {item.attributes.title.en || 'No Title'}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 10, 
    backgroundColor: '#1e1e1e',
  },
  searchContainer: { flexDirection: 'row', marginBottom: 15 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  grid: { paddingBottom: 20 },
  card: { flex: 1, margin: 5, alignItems: 'center' },
  cover: { width: 100, height: 150, borderRadius: 5 },
  title: {
    marginTop: 5,
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
});

export default MangaSearch;
