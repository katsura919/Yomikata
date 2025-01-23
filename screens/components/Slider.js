import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';

const Slider = ({ items, getImageUrl, navigation }) => {
  const [currentPage, setCurrentPage] = useState(0);


  return (
    <View style={styles.backgroundWrapper}>
    
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
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                <Text style={styles.title}>{items[currentPage]?.title}</Text>
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

    </View>
  );
};

const styles = StyleSheet.create({
  backgroundWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  backgroundImage: {
    height: 350,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  pagerView: {
    height: 350,
    width: '100%',
  },
  pagerItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagerImage: {
    marginTop: 10,
    width: 245,
    height: 350,
    borderRadius: 10,
    backgroundColor: '#fff'
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: '#CCC',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#5b2e99',
  },
});

export default Slider;
