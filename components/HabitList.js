import {StyleSheet, View, FlatList} from 'react-native';
import React, {useEffect} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Habits from './habits';

const HabitList = ({theme, habits, setHabits, resetHabits, setResetHabits}) => {
  const getHabit = async () => {
    try {
      const jsonValue = JSON.parse(await AsyncStorage.getItem('habitData'));
      setHabits(jsonValue);
      console.log('Habit list componenet retrieved:', jsonValue);
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };

  useEffect(() => {
    console.log('Habits has been updated!');
    getHabit();
  }, []);

  return (
    <View style={styles.habitContainer}>
      <FlatList
        columnWrapperStyle={{
          flexGrow: 1,
          paddingBottom: 5,
          justifyContent: 'space-around',
        }}
        data={habits}
        extraData={habits}
        numColumns={2}
        renderItem={({item}) => (
          <Habits
            habits={habits}
            setHabits={setHabits}
            resetHabits={resetHabits}
            setResetHabits={setResetHabits}
            theme={theme}
            id={item.id}
            name={item.name}
            goalCount={item.goalCount}
            currentCount={item.currentCount}
            currentStreak={item.currentStreak}
            longestStreak={item.longestStreak}
            lastCompletedDate={item.lastCompletedDate}
            last7dCompletedData={item.last7dCompletedData}
          />
        )}
      />
    </View>
  );
};

export default HabitList;

const styles = StyleSheet.create({
  habitContainer: {},
});
