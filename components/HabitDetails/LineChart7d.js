import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {LineChart, YAxis} from 'react-native-svg-charts';

const LineChart7d = ({habitTheme, last7dCompletedData, textTheme}) => {
  const [last7Days, setLast7Days] = useState([]);

  useEffect(() => {
    const daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDate = new Date();

    // Calculate the last 7 days, starting from today
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() - i);
      const dayOfWeek = date.getDay();
      last7Days.push(daysOfTheWeek[dayOfWeek]);
    }

    setLast7Days(last7Days);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        <YAxis
          data={last7dCompletedData}
          contentInset={{top: 20, bottom: 20}}
          svg={{
            fill: textTheme,
            fontSize: 12,
          }}
          numberOfTicks={1}
          formatLabel={value => `${value}`}
        />
        <LineChart
          style={{flex: 1, marginLeft: 16}}
          data={last7dCompletedData}
          svg={{stroke: habitTheme}}
          contentInset={{top: 20, bottom: 20}}
        />
      </View>
      <View style={styles.xAxis}>
        {last7Days.map((day, index) => (
          <Text key={index} style={styles.xAxisLabel}>
            {day}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center', // Center the chart and X-axis labels horizontally
    height: 300,
    width: 300,
  },
  chartWrapper: {
    flexDirection: 'row',
    height: 280,
    alignItems: 'center', // Center the Y-axis and chart horizontally
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Center the X-axis labels horizontally
  },
  xAxisLabel: {
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
});

export default LineChart7d;
