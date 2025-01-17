import React, { useState, useEffect } from 'react';
import { View, TextInput, Image, Text, TouchableOpacity, FlatList, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchPopularMangas, fetchUpdatedChapters, searchManga } from './api/api';  
import {lightTheme, darkTheme} from './themes/themes';
import { useTheme } from './themes/themeContext';
import Slider from './components/Slider';
const MangaSearch = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [popularMangas, setPopularMangas] = useState([]);
  const [updatedMangas, setUpdatedMangas] = useState([]);
  const {isDarkMode, toggleTheme } = useTheme(); 

  const themeStyles = isDarkMode ? darkTheme : lightTheme;
 
  useFocusEffect(
    React.useCallback(() => {
      setQuery('');
      setIsSearchActive(false);
    }, [])
  );

  useEffect(() => {
    StatusBar.setHidden(true);
    const fetchData = async () => {
      try {
        const popularMangasData = await fetchPopularMangas();
        setPopularMangas(popularMangasData);

        const updatedMangasData = await fetchUpdatedChapters();
        setUpdatedMangas(updatedMangasData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    try {
      const results = await searchManga(query);
      navigation.navigate('Results', { query, results });
    } catch (error) {
      console.error('Error searching manga:', error);
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
  

  const renderMangaList = (data, title) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        scrollEnabled={data.length > 0}
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
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.attributes.title.en || 'No Title'}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );


 
  return (
    <ScrollView style={[styles.container, themeStyles.container]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"}   backgroundColor={isDarkMode ? "#333" : "#fff"} 
      />

      <View style={styles.searchContainer}>
        <View>
          <Image
            source={require('../assets/app-logo.png')} // Replace with your logo's path
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Search Manga..."
          placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch} // This triggers the search when Enter is pressed
          returnKeyType="search" // Optional: Change the "return" key to "search"
        />
        
        <TouchableOpacity style={styles.circleButton} onPress={() => navigation.navigate('Settings')}>
          <Image 
            source= {require("../assets/icons/settings.png")}
            style={styles.settingsIcon}
          />
        </TouchableOpacity>
      </View>

      <Slider 
        items={popularMangas} 
        getImageUrl={getCoverImageUrl} 
      />
      <FlatList
        ListHeaderComponent={
          <>
            {renderMangaList(updatedMangas, 'Updated Manga')}
          </>
        }
        contentContainerStyle={styles.listContainer}
        scrollEnabled={false}
      />

      <Text style={styles.sectionTitle}>Popular Manga</Text>
      <FlatList
        data={popularMangas}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
        scrollEnabled={false}
        renderItem={({ item }) => {
          const imageUrl = getCoverImageUrl(item);
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Details', { manga: item })}
            >
              {imageUrl && <Image source={{ uri: imageUrl }} style={styles.cover} />}
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.attributes.title.en || 'No Title Available'}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  headerBackground: {
    width: '100%',
    height: 180,
  },
  headerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    position: 'absolute',
    flexDirection: 'row',
    padding: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  
  },
  input: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 20, 
  },
  searchIcon: {
    width: 25,
    height: 25,
    marginLeft: 10,
    tintColor: '#fff',
  },
  sectionContainer: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginHorizontal: 10,
  },
  horizontalList: {
    paddingHorizontal: 10,
    
  },
  card: {
    width: 120,
    marginRight: 10,
    backgroundColor: '#5b2e99',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  
  },
  cover: {
    width: '100%',
    height: 180,
  },
  cardTitle: {
    padding: 5,
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },

  grid: {
    paddingBottom: 20,
  },
  circleButton: {
    width: 30,
    height: 30,
    borderRadius: 35, // Half the width/height to make it a perfect circle
    backgroundColor: '#5b2e99',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  settingsIcon: {
    width: 20,
    height: 20, // Adjust size to fit nicely within the circle
    tintColor: '#FFFFFF', // Optional: Adjust icon color if needed
  },
});

export default MangaSearch;