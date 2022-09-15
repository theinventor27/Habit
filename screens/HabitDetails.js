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
import {useNavigation} from '@react-navigation/native';

const HabitDetails = ({route}) => {
  const [currentCount, setCurrentCount] = useState(
    route.params.thisCurrentCount,
  );
  const [goalCount, setGoalCount] = useState(route.params.goalCount);
  const navigation = useNavigation();

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
      var x = currentCount + 1;
      thisHabit['currentCount'] = x;
      thisHabit['last7dCompletedData'][
        route.params.last7dCompletedData.length - 1
      ] = x;
      route.params.setHabits(habitsCopy);
      console.log(currentCount);
      saveHabit();
    }
    if (goalCount == x) {
      // console.log('habit', name, 'completed.');
      habitCompleted();
    }
  };
  const habitCompleted = () => {
    //create copy of habits
    let habitsCopy = route.params.habits;
    //find this habit obj. within the new copy of habits
    let thisHabit = habitsCopy.find(obj => obj.id === route.params.id);

    //If currentStreak is 0 then we do not check if it was completed yesterday.
    if (thisHabit['currentStreak'] == 0) {
      //Set streaks to 1.
      thisHabit['currentStreak'] = 1;
      route.params.setThisCurrentStreak(1);
      //check if longestStreak is 0 if so, set to 1.
      if (route.params.longestStreak == 0) {
        thisHabit['longestStreak'] = 1;
        route.params.setThisLongestStreak(1);
      }

      //set date to check if completed in a streak.
      thisHabit['lastCompletedDate'] = getCurrentDate();
      console.log(thisHabit['lastCompletedDate']);
      //set copy as official habit
      route.params.setHabits(habitsCopy);
      saveHabit();
    }
    if (thisHabit['currentStreak'] > 0) {
      //create copy of habits
      let habitsCopy = route.params.habits;
      //find this habit obj. within the new copy of habits
      let thisHabit = habitsCopy.find(obj => obj.id === route.params.id);

      //Get last completed date and todays date and split them into an array to compare
      //each elements of the array. All elements should be the same except for the day.
      //The day should be 1 more than the last completed day.
      let lastCompletedDate = thisHabit['lastCompletedDate'];
      todaysDate = getCurrentDate();
      lastCompletedDate = lastCompletedDate.split('-');
      todaysDate = todaysDate.split('-');

      if (
        //check month
        lastCompletedDate[0] == todaysDate[0] &&
        //check year
        lastCompletedDate[2] == todaysDate[2]
      ) {
        //check if it was completed the day before
        if (lastCompletedDate[1] == todaysDate[1] - 1) {
          //increase string by 1.
          let x = thisHabit['currentStreak'] + 1;
          thisHabit['currentStreak'] = x;
          //check if currentStreak is longer than longestStreak
          if (x > route.params.longestStreak) {
            route.params.setThisLongestStreak(x);
            thisHabit['longestStreak'] = x;
          }
          route.params.setThisCurrentStreak(x);
          //set date to check if completed in a streak.
          thisHabit['lastCompletedDate'] = getCurrentDate();
          //set copy as official habit

          route.params.setHabits(habitsCopy);
          saveHabit();
        } else {
          route.params.setThisCurrentStreak(1);
        }
      } else {
        route.params.setThisCurrentStreak(1);
      }
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
  //returns current date formatted d-m-yyyy
  const getCurrentDate = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    // console.log(month + '-' + date + '-' + year);
    // You can turn it in to your desired format
    return month + '-' + date + '-' + year; //format: d-m-y;
  };

  const deleteThisHabit = () => {
    let habitsCopy = route.params.habits;
    //find this habit obj. within the new copy of habits
    console.log(habitsCopy);
    let thisHabit = habitsCopy.find(obj => obj.id === route.params.id);
    let poppedHabits = habitsCopy.pop(thisHabit);
    console.log(poppedHabits);

    route.params.setHabits(poppedHabits);

    saveHabit();
    navigation.navigate('Home');
    console.log('------------');
    console.log(route.params.habits);
  };

  const ListHeader = () => (
    <>
      <View style={styles.titleWrapper}>
        <Text style={[styles.appTitle, {color: route.params.textTheme}]}>
          {route.params.name}
        </Text>
      </View>
      <View style={styles.divider} />
    </>
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: route.params.bgTheme}]}>
      <ListHeader />
      <View style={styles.habitCountWrapper}>
        <View style={styles.circularProgressExample}>
          <CircularProgress
            value={currentCount}
            maxValue={goalCount}
            radius={80}
            inActiveStrokeColor={route.params.textTheme}
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
        //theme
        bgtheme={route.params.bgTheme}
        textTheme={route.params.textTheme}
      />
      <View style={styles.componenetDivider} />

      <LineChart7d
        theme={route.params.habitTheme}
        last7dCompletedData={route.params.last7dCompletedData}
        //theme
        bgtheme={route.params.bgTheme}
        textTheme={route.params.textTheme}
      />
      <View style={styles.push} />
      <View style={styles.deleteWrapper}>
        <TouchableOpacity onPress={() => deleteThisHabit()}>
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
    justifyContent: 'center',
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
  circularProgressExample: {},

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
