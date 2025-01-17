import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ImageBackground } from 'react-native';
import PagerView from 'react-native-pager-view';

const Slider = ({ items, getImageUrl }) => {
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
              <Image
                source={{ uri: getImageUrl(item) }}
                style={styles.pagerImage}
                resizeMode="contain"
              />
            </View>
          ))}
        </PagerView>
        <View style={styles.dotsContainer}>
          {items.slice(0, 8).map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentPage === index && styles.activeDot,
              ]}
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
    marginTop: 70,
    height: 300,
    width: '100%',
   
  },
  pagerItem: {
    justifyContent: 'center',
    alignItems: 'center',
  
   
  },
  pagerImage: {
    width: 200,
    height: 285,
    borderRadius: 20, 
  },
  pagerText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
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
