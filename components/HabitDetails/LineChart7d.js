import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React, {useState, useEffect} from 'react';
import {LineChart} from 'react-native-chart-kit';

const LineChart7d = ({theme, last7dCompletedData, textTheme, bgTheme}) => {
  const [last7Days, setLast7Days] = useState([]);

  const returnLast7Days = () => {
    const daysOfTheWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];
    let last7Days = [];
    var dayOfWeekDigit = new Date().getDay();
    last7Days.push(daysOfTheWeek[dayOfWeekDigit]);
    for (dayOfWeekDigit !== 0; dayOfWeekDigit--; ) {
      last7Days.push(daysOfTheWeek[dayOfWeekDigit]);
    }
    for (let x = 6; last7Days.length != 7; x--) {
      last7Days.push(daysOfTheWeek[x]);
    }
    last7Days = last7Days.reverse();
    setLast7Days(last7Days);
  };
  useEffect(() => {
    returnLast7Days();
  }, []);

  return (
    <View style={styles.chartWrapper}>
      <LineChart
        data={{
          labels: last7Days,
          datasets: [
            {
              data: last7dCompletedData,
            },
          ],
        }}
        width={Dimensions.get('window').width} // from react-native
        height={300}
        yAxisLabel=""
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          strokeWidth: 1.5,
          backgroundColor: '#0000ffff',
          backgroundGradientToOpacity: 0,
          backgroundGradientFromOpacity: 0,
          backgroundGradientFrom: '#0000ffff',
          backgroundGradientTo: '#0000ffff',

          decimalPlaces: 2, // optional, defaults to 2dp
          propsForBackgroundLines: {
            strokeWidth: 0,
          },
          color: (opacity = 0.3) => textTheme,
          labelColor: (opacity = 0.2) => textTheme,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '3',
            strokeWidth: '2',
            stroke: theme,
          },
        }}
        bezier
      />
    </View>
  );
};

export default LineChart7d;

const styles = StyleSheet.create({
  chartWrapper: {
    marginTop: 40,
  },
  chartTitle: {
    textAlign: 'center',
    fontSize: 15,
    marginTop: 5,
    marginBottom: 10,
  },
});
