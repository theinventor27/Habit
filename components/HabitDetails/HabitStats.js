import {StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {THEME_COLOR} from '../GLOBAL';

const HabitStats = ({
  last7dCompletedData,
  currentStreak, // Add this line to receive the prop
  longestStreak,
  goalCount,
  //theme
  bgtheme,
  textTheme,
}) => {
  const calculate7dCompletion = () => {
    console.log(currentStreak, 'current streak');
    console.log(longestStreak, 'longest streak');
    let x = 0;
    for (let i = 0; i < last7dCompletedData.length; i++) {
      if (last7dCompletedData[i] == goalCount) {
        x++;
      }
    }
    let placeholder = (x / 7) * 100;
    return placeholder.toFixed(0);
  };
  useEffect(() => {
    calculate7dCompletion();
  }, []);

  return (
    <View>
      <View style={styles.statsWrapper}>
        <View style={styles.statsDisplay}>
          <Text style={[styles.statsNum, {color: textTheme}]}>
            {calculate7dCompletion()}%
          </Text>
          <Text style={[styles.statsCategory, {color: textTheme}]}>
            7d Completition
          </Text>
        </View>
        <View style={styles.statsDisplay}>
          <Text style={[styles.statsNum, {color: textTheme}]}>
            {currentStreak}
          </Text>
          <Text style={[styles.statsCategory, {color: textTheme}]}>
            Current Streak
          </Text>
        </View>
        <View style={styles.statsDisplay}>
          <Text style={[styles.statsNum, {color: textTheme}]}>
            {longestStreak}
          </Text>
          <Text style={[styles.statsCategory, {color: textTheme}]}>
            Longest Streak
          </Text>
        </View>
      </View>
    </View>
  );
};

export default HabitStats;

const styles = StyleSheet.create({
  title: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: 15,
  },
  statsWrapper: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 0,
  },
  statsDisplay: {
    flexDirection: 'column',

    width: '33%',
  },
  statsCategory: {
    textAlign: 'center',
    fontSize: 11,
  },
  statsNum: {
    fontWeight: '600',
    fontSize: 22,
    textAlign: 'center',
  },
});
