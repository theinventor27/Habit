import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React, {useState} from 'react';
import Carousel from 'react-native-reanimated-carousel';
import ContributionGraphComponent from './ContributionGraphComponent';
import LineChart7d from './LineChart7d';

const GraphCarousel = ({
  last7dCompletedData,
  bgTheme,
  textTheme,
  habitTheme,
  contributionGraphData,
}) => {
  const [carouselIndex, setCarouselIndex] = useState(1);

  const width = Dimensions.get('window').width;
  const Dot = ({backgroundColor}) => {
    return <View style={[styles.dot, {backgroundColor}]} />;
  };

  const changeDotIndex = index => {
    setCarouselIndex(index);
    console.log('index has been set:', index);
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.dotContainer}>
        <Dot backgroundColor={carouselIndex === 0 ? 'white' : 'gray'} />
        <Dot backgroundColor={carouselIndex === 1 ? 'white' : 'gray'} />
      </View>
      <Carousel
        width={width}
        height={350}
        autoPlay={false}
        data={[...new Array(2).keys()]}
        scrollAnimationDuration={200}
        onSnapToItem={index => changeDotIndex(index)}
        renderItem={({index}) => (
          <View style={styles.carouselItem}>
            {index % 2 === 0 ? (
              <ContributionGraphComponent
                contributionGraphData={contributionGraphData}
                habitTheme={habitTheme}
              />
            ) : (
              <LineChart7d
                last7dCompletedData={last7dCompletedData}
                textTheme={textTheme}
              />
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Add this line to center items horizontally
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 10,
    marginHorizontal: 5,
  },
});

export default GraphCarousel;
