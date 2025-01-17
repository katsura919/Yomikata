import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, TextInput, Text, Image, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';

const SearchResults = ({ route, navigation }) => {
  const { query: initialQuery, results } = route.params;
  const [searchQuery, setSearchQuery] = useState(initialQuery || ''); // Initialize with the query passed from homepage
  const [mangaResults, setMangaResults] = useState(results || []);

  useEffect(() => {
    if (initialQuery) {
      searchManga(initialQuery); // Perform search when the screen loads with the initial query
    }
  }, [initialQuery]);

  const getCoverImageUrl = (manga) => {
    const coverRelation = manga.relationships.find((rel) => rel.type === 'cover_art');
    if (coverRelation) {
      const fileName = coverRelation.attributes.fileName;
      return `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.512.jpg`;
    }
    return null;
  };

  const searchManga = async (query) => {
    if (!query) return;
    try {
      const response = await axios.get('https://api.mangadex.org/manga', {
        params: { title: query, limit: 20, includes: ['cover_art'] },
      });
      setMangaResults(response.data.data); // Update the results with new search
    } catch (error) {
      console.error('Error searching manga:', error);
    }
  };

  const handleSearch = () => {
    searchManga(searchQuery); // Trigger the search with the updated query
    navigation.setParams({ query: searchQuery }); // Update the query in the route params for navigation
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery} // Bind the input to searchQuery state
          onChangeText={setSearchQuery} // Update searchQuery as the user types
          placeholder="Search manga..."
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity onPress={handleSearch}>
            <Image source={require('../assets/search.png')} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={mangaResults}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => {
          const imageUrl = getCoverImageUrl(item);
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Details', { manga: item })}
            >
              {imageUrl && <Image source={{ uri: imageUrl }} style={styles.cover} />}
              <Text style={styles.title} numberOfLines={2}>
                {item.attributes.title.en || 'No Title Available'}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  searchIcon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
    marginLeft: 10,
  },
  grid: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
  },
  cover: {
    width: 100,
    height: 150,
    borderRadius: 5,
  },
  title: {
    marginTop: 5,
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
});

export default SearchResults;
