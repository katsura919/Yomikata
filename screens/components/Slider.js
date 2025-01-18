import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';

const Slider = ({ items, getImageUrl, navigation }) => {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <ImageBackground
      source={{ uri: getImageUrl(items[currentPage]) }}
      style={styles.backgroundImage}
      blurRadius={10}
    >
      <View style={styles.overlay}>
        <PagerView
          style={styles.pagerView}
          initialPage={0}
          onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        >
          {items.slice(0, 8).map((item, index) => (
            <View style={styles.pagerItem} key={index}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Details', { manga: item })}
              >
                <Image
                  source={{ uri: getImageUrl(item) }}
                  style={styles.pagerImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          ))}
        </PagerView>
        <View style={styles.dotsContainer}>
          {items.slice(0, 8).map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentPage === index && styles.activeDot]}
            />
          ))}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    height: 380,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagerView: {
    height: 380,
    width: '100%',
    
  },
  pagerItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagerImage: {
    marginTop: 60,
    width: 210,
    height: 300,
    borderRadius: 20,
   
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#CCC',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#5b2e99',
  },
});

export default Slider;
