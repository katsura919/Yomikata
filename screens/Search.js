import React, { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, Image, StyleSheet, Animated } from 'react-native';
import { useTheme } from './themes/themeContext';
import { searchManga } from './api/api';

const Search = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { isDarkMode } = useTheme();

  const themeStyles = isDarkMode ? styles.dark : styles.light;

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const results = await searchManga(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching for manga:', error);
    }
  };

  const getCoverImageUrl = (manga) => {
    if (manga && manga.relationships) {
      const coverRelation = manga.relationships.find((rel) => rel.type === 'cover_art');
      if (coverRelation) {
        return `https://uploads.mangadex.org/covers/${manga.id}/${coverRelation.attributes.fileName}.512.jpg`;
      }
    }
    return null;
  };

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Animated.View style={[styles.searchBar, themeStyles.searchBar]}>
        <TextInput
          style={styles.input}
          placeholder="Search manga..."
          placeholderTextColor={isDarkMode ? '#ccc' : '#666'}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
      </Animated.View>
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        numColumns={2}
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
    padding: 10,
    paddingBottom:  80,
  },
  searchBar: {
    marginTop: 30,
    marginBottom: 15,
    borderRadius: 5,
    overflow: 'hidden',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  input: {
    height: 45,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    color: '#333',
    elevation: 10, // For shadow on Android
    borderWidth: 1,
  },
  grid: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
    backgroundColor: '#5b2e99',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    transform: [{ scale: 1 }],
    transition: 'transform 0.2s', // Adds animation on hover
  },
  cardHover: {
    transform: [{ scale: 1.05 }],
  },
  cover: {
    width: '100%',
    height: 240,
    borderRadius: 10,
  },
  title: {
    padding: 5,
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
  },
  light: {
    container: {
      backgroundColor: '#fff',
    },
    searchBar: {
      backgroundColor: '#fff',
      borderColor: '#5b2e99',
    },
  },
  dark: {
    container: {
      backgroundColor: '#333',
    },
    searchBar: {
      borderColor: '#5b2e99',
    },
  },
});

export default Search;
