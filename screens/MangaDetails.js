// MangaDetails.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const MangaDetails = ({ route, navigation }) => {
  const { manga } = route.params;
  const [chapters, setChapters] = useState([]);
  const [page, setPage] = useState(1); // Start at page 1 for the first 10 chapters
  const [loading, setLoading] = useState(false);
  const [hasMoreChapters, setHasMoreChapters] = useState(true); // Track if there are more chapters

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
          limit: 10, // Limit to 10 chapters per request
          translatedLanguage: ['en'],
          order: { chapter: 'asc' },
          offset: (page - 1) * 10, // Calculate offset for each page
        },
      });

      const newChapters = response.data.data;

      if (newChapters.length === 0) {
        setHasMoreChapters(false); // No more chapters left
      } else {
        setChapters((prevChapters) => [...prevChapters, ...newChapters]);
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMoreChapters) {
      setPage(page + 1); // Increment the page to fetch the next set of chapters
    }
  };

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString); // Create a Date object
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month and pad with leading zero if needed
    const day = String(date.getDate()).padStart(2, '0'); // Get the day and pad with leading zero if needed
    const year = date.getFullYear(); // Get the year
    
    return `${month}-${day}-${year}`; // Return the formatted date as MM-DD-YYYY
  };
  
  useEffect(() => {
    fetchChapters();
  }, [page]); // Re-fetch chapters whenever the page number changes

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
            <Text
            style={styles.description}
            numberOfLines={isExpanded ? 0 : 5} // Show all if expanded, otherwise limit to 5 lines
          >
            {manga.attributes.description.en || 'No Description Available'}
          </Text>

          <TouchableOpacity onPress={toggleDescription}>
            <Text style={styles.toggleText}>
              {isExpanded ? 'See Less' : 'See More'}
            </Text>
          </TouchableOpacity>
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
        keyExtractor={(item, index) => `${item.id}-${page}-${index}`} // Ensure unique keys
        renderItem={({ item }) => (
        
        <TouchableOpacity
        onPress={() => navigation.navigate('Reader', { 
          chapters, 
          initialChapter: item.id 
        })}
        >
          <View style={styles.chapterCard}>
              <Text style={styles.chapterTitle}>
                Chapter {Math.ceil(parseFloat(item.attributes.chapter))}: {item.attributes.title || 'No Title'}
              </Text>
              <Text style={styles.chapterDate}>
               {item.attributes.publishAt ? formatDate(item.attributes.publishAt) : 'No Date'}
              </Text>
          </View>

          </TouchableOpacity>
        )}
        ListFooterComponent={
          loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : hasMoreChapters ? ( // Only show the button if there are more chapters
            <TouchableOpacity style={styles.loadMoreButton} onPress={loadMore}>
              <Text style={styles.loadMoreText}>Load More</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.noMoreChaptersText}>No More Chapters</Text>
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
  description: { fontSize: 14, color: '#ddd',},
  toggleText: {
    color: '#fff', // Button color for toggling
    fontSize: 14,
  },
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
    flexDirection: 'column',
    justifyContent: 'flex-start',
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
    marginBottom: 15,
  },
  loadMoreText: { color: '#fff' },
  noMoreChaptersText: { 
    color: '#aaa', 
    textAlign: 'center', 
    padding: 10,
    marginBottom: 15,
  },
  loadingText: { textAlign: 'center', color: '#aaa' },
});

export default MangaDetails;
