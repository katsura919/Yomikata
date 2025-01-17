import React, { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
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
      <TextInput
        style={styles.input}
        placeholder="Search manga..."
        placeholderTextColor={isDarkMode ? '#ccc' : '#666'}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
      />
      <FlatList
              data={searchResults}
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
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: '#5b2e99',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#000',
  },
  grid: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
    backgroundColor: '#5b2e99',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  cover: {
    width: "100%",
    height: 150,
    borderRadius: 5,
  },
  title: {
    padding: 5,
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  light: {
    container: {
      backgroundColor: '#fff',
    },
  },
  dark: {
    container: {
      backgroundColor: '#333',
    },
  },
});

export default Search;
