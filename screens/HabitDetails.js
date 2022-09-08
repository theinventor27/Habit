import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CircularProgress from 'react-native-circular-progress-indicator';
import LineChart7d from '../components/HabitDetails/LineChart7d';
import HabitStats from '../components/HabitDetails/HabitStats';
const HabitDetails = ({route}) => {
  const [currentCount, setCurrentCount] = useState(
    route.params.thisCurrentCount,
  );
  const [goalCount, setGoalCount] = useState(route.params.goalCount);

  const saveHabit = async () => {
    try {
      const jsonValue = JSON.stringify(route.params.habits);
      console.log(jsonValue);
      await AsyncStorage.setItem('habitData', jsonValue);
      // console.log(jsonValue, ' = json file')
    } catch (error) {
      console.log(error);
    }
  };

  //Increases the count of the habit if count has not reached countGoal.
  const increaseCount = () => {
    if (goalCount > currentCount) {
      //create copy of habits
      let habitsCopy = route.params.habits;
      //find this habit obj. within the new copy of habits
      let thisHabit = habitsCopy.find(obj => obj.id === route.params.id);

      setCurrentCount(currentCount + 1);
      route.params.setThisCurrentCount(currentCount + 1);
      let x = currentCount + 1;
      thisHabit['currentCount'] = x;
      thisHabit['last7dCompletedData'][
        route.params.last7dCompletedData.length - 1
      ] = x;
      route.params.setHabits(habitsCopy);
      console.log(currentCount);
      saveHabit();
    }
  };

  //Decreases the count of the habit if count is not equal to 0.
  const decreaseCount = () => {
    if (currentCount != 0) {
      //create copy of habits
      let habitsCopy = route.params.habits;
      //find this habit obj. within the new copy of habits
      let thisHabit = habitsCopy.find(obj => obj.id === route.params.id);

      setCurrentCount(currentCount - 1);
      route.params.setThisCurrentCount(currentCount - 1);
      let x = currentCount - 1;
      thisHabit['currentCount'] = x;
      thisHabit['last7dCompletedData'][
        route.params.last7dCompletedData.length - 1
      ] = x;

      route.params.setHabits(habitsCopy);
      console.log(currentCount);
      saveHabit();
    }
  };

  //Touchable opacity method to increase count.
  const onPressAdd = () => {
    increaseCount();
    console.log(currentCount);
  };

  //Touchable opacity method to decrease count.
  const onPressSubtract = () => {
    decreaseCount();
  };

  const ListHeader = () => (
    <>
      <View style={styles.titleWrapper}>
        <Text style={styles.appTitle}>{route.params.name}</Text>
      </View>
      <View style={styles.divider} />
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ListHeader />
      <View style={styles.habitCountWrapper}>
        <View style={styles.circularProgressExample}>
          <CircularProgress
            value={currentCount}
            maxValue={goalCount}
            radius={80}
            inActiveStrokeColor={'black'}
            activeStrokeColor={route.params.habitTheme}
            progressValueColor={route.params.habitTheme}
            inActiveStrokeOpacity={0.2}
          />
        </View>
        <View style={styles.arrowContainer}>
          <TouchableOpacity onPress={() => onPressAdd()}>
            <Image
              style={styles.arrowImg}
              source={require('../Assets/arrow.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onPressSubtract()}>
            <Image
              style={[styles.arrowImg, styles.downArrow]}
              source={require('../Assets/arrow.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.componenetDivider} />
      <HabitStats
        goalCount={route.params.goalCount}
        last7dCompletedData={route.params.last7dCompletedData}
        currentStreak={route.params.currentStreak}
        longestStreak={route.params.longestStreak}
      />
      <View style={styles.componenetDivider} />

      <LineChart7d
        theme={route.params.theme}
        last7dCompletedData={route.params.last7dCompletedData}
      />
      <View style={styles.push} />
      <View style={styles.deleteWrapper}>
        <TouchableOpacity>
          <Text style={styles.deleteText}>DELETE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HabitDetails;

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#A9ABB1',
    marginHorizontal: 16,
    marginTop: 16,
  },
  componenetDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#A9ABB1',
    marginHorizontal: 16,
    marginTop: 30,
    marginBottom: 10,
  },
  container: {
    flex: 1,
  },
  appTitle: {
    fontSize: 20,
    marginLeft: 15,
  },

  habitCountWrapper: {
    flexDirection: 'row',
    marginTop: 30,
  },
  amount: {
    fontSize: 125,
    marginLeft: 10,
  },
  arrowImg: {
    height: 35,
    width: 55,
    opacity: 0.8,
    backgroundColor: 'transparent',
  },
  arrowContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 40,
    width: 140,
  },
  downArrow: {
    transform: [{rotate: '180deg'}],
  },
  circularProgressExample: {
    marginLeft: 10,
  },

  push: {
    flex: 1,
  },
  deleteWrapper: {
    height: 25,
    alignSelf: 'center',
  },
  deleteText: {
    fontSize: 15,
    color: 'red',
  },
});
