import React, { useState, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, TextInput, Image, Text, TouchableOpacity, FlatList, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { fetchPopularMangas, fetchUpdatedChapters, searchManga } from './api/api';  
import {lightTheme, darkTheme} from './context/themes';
import { useTheme } from './context/themeContext';
import Slider from './components/Slider';

const Home = ({ navigation }) => {
  const [popularMangas, setPopularMangas] = useState([]);
  const [updatedMangas, setUpdatedMangas] = useState([]);
  const {isDarkMode, toggleTheme } = useTheme(); 
  const scrollViewRef = useRef(null);

  const themeStyles = isDarkMode ? styles.dark : styles.light;


  useEffect(() => {
   
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

   // Reset FlatList scroll position when the screen is focused
   useFocusEffect(
    React.useCallback(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: false });
      }
    }, [])
  );
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
      <Text style={themeStyles.popularText}>{title}</Text>
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
    <ScrollView 
      ref={scrollViewRef}
      style={[styles.container, themeStyles.container]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"}   backgroundColor={isDarkMode ? "#333" : "#fff"} 
      />
      <View style={styles.header}>
        <View>
         <Text style={themeStyles.headerText}>Home</Text>
        </View>
      </View>
   

      <Slider 
        items={popularMangas} 
        getImageUrl={getCoverImageUrl} 
        navigation={navigation}
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

      <Text style={themeStyles.popularText}>Popular Manga</Text>

      <View style={styles.popularContainer}>
      <FlatList
       
        data={popularMangas}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        scrollEnabled={false}
        renderItem={({ item }) => {
          const imageUrl = getCoverImageUrl(item);
          return (
            <TouchableOpacity
              style={styles.gridcard}
              onPress={() => navigation.navigate('Details', { manga: item })}
            >
              {imageUrl && <Image source={{ uri: imageUrl }} style={styles.gridcover} />}
              <Text style={styles.gridTitle} numberOfLines={2}>
                {item.attributes.title.en || 'No Title Available'}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 50,
  },
  header:{
    height: 40,
    paddingLeft: 10,
    backgroundColor: '#5b2e99',
    justifyContent: 'center'
  },
  light: {
    container: {
      backgroundColor: '#fff',
    },
    headerText: {
      fontFamily: 'Poppins-Bold',
      color: '#fff', // Dark mode color for title
      fontSize: 20,
    },
    popularText: {
      fontFamily: 'Poppins-Bold',
      fontSize: 18,
      color: '#333',
      marginHorizontal: 10,
    },
    
  },
  dark: {
    container: {
      backgroundColor: '#1e1e1e',
    },
    headerText: {
      fontFamily: 'Poppins-Bold',
      color: '#fff', // Dark mode color for title
      fontSize: 20,
    },
    popularText: {
      fontFamily: 'Poppins-Bold',
      fontSize: 18,
      color: '#fff',
      marginHorizontal: 10,
    },
  },

  sectionContainer: {
    marginTop: 10,
  },
  horizontalList: {
    paddingHorizontal: 10,
    marginTop: 10,
    
  },
  card: {
    width: 120,
    marginRight: 10,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    overflow: 'hidden',
  },
  cover: {
    width: '100%',
    height: 180,
  },
  cardTitle: {
    fontFamily: 'Poppins-Light',
    padding: 5,
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  popularContainer:{
    marginHorizontal: 5,
    marginBottom: 20,
  },
  grid: {
    paddingBottom: 20,
  },
  gridcard: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  gridcover: {
    width: "100%",
    height: 240,
    borderRadius: 5,
  },
  gridTitle: {
    fontFamily: 'Poppins-Light',
    padding: 5,
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
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

export default Home;