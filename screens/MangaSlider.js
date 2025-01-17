import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { ViewPager } from 'react-native-pager-view';

const { width: screenWidth } = Dimensions.get('window');

const featuredMangas = [
  {
    title: 'One Piece',
    image: 'https://example.com/one-piece-cover.jpg',
    description: 'Join Luffy and the Straw Hat crew on their adventure!',
  },
  {
    title: 'Naruto',
    image: 'https://example.com/naruto-cover.jpg',
    description: 'Follow Naruto’s journey to becoming Hokage.',
  },
  {
    title: 'Attack on Titan',
    image: 'https://example.com/aot-cover.jpg',
    description: 'Humanity’s fight against the Titans.',
  },
];

const MangaSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.container}>
      <ViewPager
        style={styles.viewPager}
        initialPage={0}
        onPageSelected={(e) => setActiveIndex(e.nativeEvent.position)}
      >
        {featuredMangas.map((item, index) => (
          <View style={styles.page} key={index}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Read Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.infoButton]}>
                <Text style={styles.buttonText}>View Info</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ViewPager>

      {/* Indicator */}
      <View style={styles.indicatorContainer}>
        {featuredMangas.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              activeIndex === index && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewPager: {
    width: screenWidth,
    height: 400,
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 10,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#6a51ae',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  infoButton: {
    backgroundColor: '#4a90e2',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: '#6a51ae',
  },
});

export default MangaSlider;
