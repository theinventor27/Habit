import {StyleSheet, View} from 'react-native';
import React from 'react';
import {ContributionGraph} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';

const ContributionGraphComponent = ({habitTheme, contributionGraphData}) => {
  // Get width of screen
  const windowWidth = Dimensions.get('window').width;
  const getColorForCount = count => {
    if (count == 0) {
      return 'gray'; // Set to gray if count is 0
    } else if (count > 1) {
      return habitTheme; // Set to habitTheme color if count is greater than 1
    } else {
      return 'white'; // Set to white for any other cases
    }
  };

  // Fake Data for graph
  const commitsData = [
    {date: '2023-07-01', count: 7},
    {date: '2023-01-01', count: 1},
    {date: '2023-02-01', count: 5},
    {date: '2023-08-06', count: 2},
    {date: '2023-05-01', count: 3},
    {date: '2023-03-01', count: 7},
    {date: '2023-04-01', count: 5},
  ];

  return (
    <View style={styles.container}>
      <ContributionGraph
        values={contributionGraphData}
        endDate={new Date('2023-06-30')}
        numDays={181}
        width={windowWidth}
        height={150}
        chartConfig={{
          backgroundGradientFrom: '#e26a00',
          backgroundGradientFromOpacity: 0,
          backgroundGradientToOpacity: 0,
          color: (opacity = 1) => `rgba(225, 225, 225, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(225,225,225, ${opacity})`,
        }}
        style={{marginVertical: 10}}
        squareSize={11.5}
      />
      <ContributionGraph
        values={contributionGraphData}
        endDate={new Date('2023-12-31')}
        numDays={184}
        width={windowWidth}
        height={150}
        chartConfig={{
          backgroundGradientFrom: '#e26a00',
          backgroundGradientFromOpacity: 0,
          backgroundGradientToOpacity: 0,
          color: (opacity = 1) => `rgba(225, 225, 225, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(225,225,225, ${opacity})`,
        }}
        style={{marginVertical: 10}}
        squareSize={11.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    marginRight: 10,
  },
});

export default ContributionGraphComponent;
