import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const SearchResults = ({ route, navigation }) => {
  const { results } = route.params;

  const getCoverImageUrl = (manga) => {
    const coverRelation = manga.relationships.find((rel) => rel.type === 'cover_art');
    if (coverRelation) {
      const fileName = coverRelation.attributes.fileName;
      return `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.512.jpg`;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const imageUrl = getCoverImageUrl(item);
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Details', { manga: item })}
            >
              {imageUrl && <Image source={{ uri: imageUrl }} style={styles.cover} />}
              <Text style={styles.title}>{item.attributes.title.en || 'No Title Available'}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: { marginBottom: 10, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 5, flexDirection: 'row', alignItems: 'center' },
  cover: { width: 50, height: 75, marginRight: 10, borderRadius: 5 },
  title: { fontSize: 16, fontWeight: 'bold', flex: 1 },
});

export default SearchResults;
