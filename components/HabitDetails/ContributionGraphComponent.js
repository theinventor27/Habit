import {StyleSheet, View} from 'react-native';
import React from 'react';
import {ContributionGraph} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';

const ContributionGraphComponent = ({habitTheme}) => {
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
    {date: '2022-07-01', count: 1},
    {date: '2022-07-02', count: 1},
    {date: '2022-07-03', count: 2},
    {date: '2022-07-04', count: 0},
    {date: '2022-07-05', count: 4},
    {date: '2022-07-06', count: 0},
    {date: '2022-07-07', count: 1},
    {date: '2022-07-08', count: 0},
    {date: '2022-07-09', count: 3},
    {date: '2022-07-10', count: 2},
    {date: '2022-07-11', count: 0},
    {date: '2022-07-12', count: 0},
    {date: '2022-07-13', count: 0},
    {date: '2022-07-14', count: 1},
    {date: '2022-07-15', count: 5},
    {date: '2022-07-16', count: 0},
    {date: '2022-07-17', count: 0},
    {date: '2022-07-18', count: 2},
    {date: '2022-07-19', count: 1},
    {date: '2022-07-20', count: 0},
    {date: '2022-07-21', count: 0},
    {date: '2022-07-22', count: 3},
    {date: '2022-07-23', count: 1},
    {date: '2022-07-24', count: 2},
    {date: '2022-07-25', count: 0},
    {date: '2022-07-26', count: 0},
    {date: '2022-07-27', count: 0},
    {date: '2022-07-28', count: 4},
    {date: '2022-07-29', count: 0},
    {date: '2022-07-30', count: 0},
  ];

  // Modify the data by adding the color property for each data point
  const modifiedData = commitsData.map(item => ({
    ...item,
    color: getColorForCount(item.count),
  }));

  return (
    <View style={styles.container}>
      <ContributionGraph
        values={modifiedData}
        endDate={new Date('2022-07-30')}
        numDays={180}
        width={windowWidth}
        height={150}
        chartConfig={{
          backgroundGradientFrom: '#e26a00',
          backgroundGradientFromOpacity: 0,
          backgroundGradientToOpacity: 0,
          color: (opacity = 1) => `rgba(225, 225, 225, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(225,225,225, ${opacity})`,
          // The following extra prop allows us to customize individual square colors
          extra: {
            squareColor: ({count}) => getColorForCount(count),
          },
        }}
        style={{marginVertical: 10}}
        squareSize={12}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
});

export default ContributionGraphComponent;
