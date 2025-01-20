import React, { useState, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { fetchPopularMangas, fetchUpdatedChapters } from './api/api';
import { lightTheme, darkTheme } from './context/themes';
import { useTheme } from './context/themeContext';
import { Ionicons } from '@expo/vector-icons';
import Slider from './components/Slider';
import LottieView from 'lottie-react-native';
import NetInfo from '@react-native-community/netinfo';  // Import NetInfo

const Home = ({ navigation }) => {
  const [popularMangas, setPopularMangas] = useState([]);
  const [updatedMangas, setUpdatedMangas] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingUpdated, setLoadingUpdated] = useState(true);
  const [isConnected, setIsConnected] = useState(true);  // Track internet connection
  const { isDarkMode } = useTheme();
  const scrollViewRef = useRef(null);
  const themeStyles = isDarkMode ? styles.dark : styles.light;
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    // Check internet connection status
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();  // Unsubscribe when component is unmounted
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPopular(true);
        setLoadingUpdated(true);

        const popularMangasData = await fetchPopularMangas();
        setPopularMangas(popularMangasData);
        setLoadingPopular(false);

        const updatedMangasData = await fetchUpdatedChapters();
        setUpdatedMangas(updatedMangasData);
        setLoadingUpdated(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoadingPopular(false);
        setLoadingUpdated(false);
      }
    };

    if (isConnected) {
      fetchData();  // Only fetch data if there's an internet connection
    }
  }, [isConnected]);

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

  const renderMangaList = (data, title, loading) => (
    <View style={styles.sectionContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
        <LottieView
          style={{
            width: 20,
            height: 20,
          }}
          source={require('../assets/icons/update.json')}
          autoPlay
          loop
        />
        <Text style={themeStyles.popularText}>{title}</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} style={styles.spinner} />
      ) : (
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
              <Text style={themeStyles.cardTitle} numberOfLines={2}>
                {item.attributes.title.en || 'No Title'}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );

  if (!isConnected) {
    return (
      <View style={[styles.container, themeStyles.container]}>
        <View style={styles.header}>
        <Text style={themeStyles.headerText}>Yomikata</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color={isDarkMode ? '#fff' : '#333'} onPress={() => navigation.navigate('Search')} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconSpacing}>
            <Ionicons name="settings" size={24} color={isDarkMode ? '#fff' : '#333'} onPress={() => navigation.navigate('Settings')} />
          </TouchableOpacity>
        </View>
      </View>
        <Text style={themeStyles.noInternetText}>No Internet</Text>
      </View>
    );
  }

  return (
    <ScrollView ref={scrollViewRef} style={[styles.container, themeStyles.container]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#1e1e1e' : '#fff'}
      />
      <View style={styles.header}>
        <Text style={themeStyles.headerText}>Yomikata</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color={isDarkMode ? '#fff' : '#333'} onPress={() => navigation.navigate('Search')} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconSpacing}>
            <Ionicons name="settings" size={24} color={isDarkMode ? '#fff' : '#333'} onPress={() => navigation.navigate('Settings')} />
          </TouchableOpacity>
        </View>
      </View>

      <Slider items={popularMangas} getImageUrl={getCoverImageUrl} navigation={navigation} />
      {renderMangaList(updatedMangas, 'Updated Manga', loadingUpdated)}

      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
        <LottieView
          style={{
            width: 20,
            height: 20,
          }}
          source={require('../assets/icons/hot.json')}
          autoPlay
          loop
        />
        <Text style={themeStyles.popularText}>Popular Manga</Text>
      </View>
      <View style={styles.popularContainer}>
        {loadingPopular ? (
          <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} style={styles.spinner} />
        ) : (
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
                  style={styles.gridcard}
                  onPress={() => navigation.navigate('Details', { manga: item })}
                >
                  {imageUrl && <Image source={{ uri: imageUrl }} style={styles.gridcover} />}
                  <Text style={themeStyles.gridTitle} numberOfLines={1}>
                    {item.attributes.title.en || 'No Title Available'}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconSpacing: {
    marginLeft: 16,
  },
  light: {
    container: {
      backgroundColor: '#fff',
    },
    headerText: {
      fontFamily: 'Knewave-Regular',
      color: '#333',
      fontSize: 27,
      marginLeft: 5,
    },
    popularText: {
      fontFamily: 'Poppins-Bold',
      fontSize: 16,
      color: '#333',
      marginLeft: 5,
      marginTop: 3,
      width: 500,
    },
    cardTitle: {
      fontFamily: 'Poppins-Light',
      padding: 5,
      fontSize: 12,
      color: '#333',
      textAlign: 'center',
    },
    gridTitle: {
      fontFamily: 'Poppins-Light',
      fontSize: 12,
      color: '#333',
      marginTop: 5,
    },
    noInternetText: {
     
      fontFamily: 'Poppins-Light',
      fontSize: 15,
      color: '#333',
      textAlign: 'center',
      marginTop: 20,
      justifyContent: 'center',
      alignItems: 'center',

    },
  },
  dark: {
    container: {
      backgroundColor: '#1e1e1e',
    },
    headerText: {
      fontFamily: 'Knewave-Regular',
      color: '#fff',
      fontSize: 27,
      marginLeft: 5,
    },
    popularText: {
      fontFamily: 'Poppins-Bold',
      fontSize: 16,
      color: '#fff',
      marginLeft: 10,
      marginTop: 3,
      width: 500,
    },
    cardTitle: {
      fontFamily: 'Poppins-Light',
      padding: 5,
      fontSize: 12,
      color: '#fff',
      textAlign: 'center',
    },
    gridTitle: {
      fontFamily: 'Poppins-Light',
      fontSize: 12,
      color: '#fff',
      marginTop: 5,
    },
    noInternetText: {
      fontFamily: 'Poppins-Light',
      fontSize: 15,
      color: '#fff',
      textAlign: 'center',
      marginTop: 20,
      justifyContent: 'center',
      alignItems: 'center'
    },
  },
  sectionContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  horizontalList: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  card: {
    width: 120,
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cover: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
  spinner: {
    marginVertical: 20,
  },
  grid: {
    marginTop: 10,
    paddingBottom: 20,
  },
  gridcard: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  gridcover: {
    width: '100%',
    height: 170,
    borderRadius: 5,
  },
  popularContainer: {},

});

export default Home;
