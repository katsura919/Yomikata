import React, { useState, useRef } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, Image, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { useTheme } from './context/themeContext';
import { searchManga } from './api/api';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'

const Search = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false); // State to track loading status
  const { isDarkMode } = useTheme();
  const flatListRef = useRef(null); // Reference to the FlatList

  const themeStyles = isDarkMode ? styles.dark : styles.light;

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true); // Set loading state to true when search starts
    try {
      const results = await searchManga(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching for manga:', error);
    } finally {
      setLoading(false); // Set loading state to false after search completes
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

  // Reset FlatList scroll position when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ animated: false, offset: 0 });
      }
    }, [])
  );

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Animated.View style={[styles.searchBar, themeStyles.searchBar]}>
      <Ionicons 
        name="arrow-back" 
        size={22} 
        color={isDarkMode ? '#ccc' : '#666'} 
        onPress={() => navigation.goBack()}
        style={styles.backButton} 
      />
        <TextInput
          style={themeStyles.input}
          placeholder="Type to search manga..."
          placeholderTextColor={isDarkMode ? '#ccc' : '#666'}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
      </Animated.View>

      {/* Show a spinner while loading */}
      {loading ? (
        <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} style={styles.spinner} />
      ) : (
        <>
          {/* Show No Results Found message if there are no search results */}
          {searchResults.length === 0 && query.trim() !== '' && (
            <Text style={themeStyles.noResultsText}>No Results Found</Text>
          )}

          {/* Render FlatList of search results */}
          <FlatList
            ref={flatListRef} // Attach the FlatList to the ref
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
                  <Text style={themeStyles.title} numberOfLines={2}>
                    {item.attributes.title.en || 'No Title Available'}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </>
      )}
    </View>
  );
};

// Styles remain the same as your original code
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 40,
    padding: 5,
  },
  searchBar: {
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    borderBottomWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  grid: {
    paddingBottom: 20,
    margin: 10,
  },
  card: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    transform: [{ scale: 1 }],
    transition: 'transform 0.2s',
  },
  cover: {
    width: '100%',
    height: 240,
    borderRadius: 10,
  },
  spinner: {
    marginTop: 20,
  },
  backButton:{
    marginLeft: 10,
  },
  light: {
    container: {
      backgroundColor: '#fff',
    },
    searchBar: {
      backgroundColor: '#fff',
      borderColor: '#5b2e99',
    },
    headerText: {
      fontFamily: 'Poppins-Bold',
      color: '#fff',
      fontSize: 20,
    },
    title: {
      padding: 5,
      fontSize: 15,
      color: '#333',
      textAlign: 'center',
    },
    input: {
      flex: 1,
      height: 45,
      paddingHorizontal: 5,
      fontSize: 14,
      borderRadius: 20,
      color: '#333',
      fontFamily: 'Poppins-Light',
    },
    noResultsText: {
      fontFamily: 'Poppins-Light',
      fontSize: 15,
      textAlign: 'center',
      marginTop: 20,
      color: '#888',
    },
 
  },
  dark: {
    container: {
      backgroundColor: '#1e1e1e',
    },
    searchBar: {
      borderColor: '#5b2e99',
    },
    headerText: {
      fontFamily: 'Poppins-Bold',
      color: '#fff',
      fontSize: 20,
    },
    title: {
      padding: 5,
      fontSize: 15,
      color: '#fff',
      textAlign: 'center',
    },
    input: {
      height: 45,
      fontSize: 14,
      borderRadius: 20,
      color: '#fff',
      fontFamily: 'Poppins-Light',
      marginLeft: 5,
    },
    noResultsText: {
      fontFamily: 'Poppins-Light',
      fontSize: 15,
      textAlign: 'center',
      marginTop: 20,
      color: '#888',
    },
  },
});

export default Search;
