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
import EditHabitBottomSheet from '../components/HabitDetails/EditHabitBottomSheet';

const HabitDetails = ({route}) => {
  const [currentCount, setCurrentCount] = useState(
    route.params.thisCurrentCount,
  );
  const [thisCurrentStreak, setCurrentStreak] = useState(
    route.params.currentStreak,
  );
  const [thisCurrentLongestStreak, setThisCurrentLongestStreak] = useState(
    route.params.longestStreak,
  );

  const [goalCount, setGoalCount] = useState(route.params.goalCount);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(route.params.name);
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
      let thisHabit = habitsCopy.find(obj => obj.id == route.params.id);

      setCurrentCount(currentCount + 1);
      route.params.setThisCurrentCount(currentCount + 1);
      var x = currentCount + 1;
      thisHabit['currentCount'] = x;
      thisHabit['last7dCompletedData'][
        route.params.last7dCompletedData.length - 1
      ] = x;
      route.params.setHabits(habitsCopy);
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
    let thisHabit = habitsCopy.find(obj => obj.id == route.params.id);

    //If currentStreak is 0 then we do not check if it was completed yesterday.
    if (thisHabit['currentStreak'] == 0) {
      //Set streaks to 1.
      thisHabit['currentStreak'] = 1;
      route.params.setThisCurrentStreak(1);
      setCurrentStreak(1);
      //check if longestStreak is 0 if so, set to 1.
      if (route.params.longestStreak == 0) {
        thisHabit['longestStreak'] = 1;
        route.params.setThisLongestStreak(1);
        setThisCurrentLongestStreak(1);
      }

      //set date to check if completed in a streak
      thisHabit['lastCompletedDate'] = getTodaysDate();
      //set copy as official habit
      route.params.setHabits(habitsCopy);
      saveHabit();
    }
    if (thisHabit['currentStreak'] > 0) {
      //create copy of habits
      let habitsCopy = route.params.habits;
      //find this habit obj. within the new copy of habits
      let thisHabit = habitsCopy.find(obj => obj.id == route.params.id);

      //Get last completed date and todays date and split them into an array to compare
      //each elements of the array. All elements should be the same except for the day.
      //The day should be 1 more than the last completed day.
      const lastCompletedDate = thisHabit['lastCompletedDate'];
      const todaysDate = getCurrentDate();

      const lastCompletedDateParts = lastCompletedDate.split('-');
      const todaysDateParts = todaysDate.split('-');

      const lastCompletedMonth = parseInt(lastCompletedDateParts[0], 10);
      const lastCompletedDay = parseInt(lastCompletedDateParts[1], 10);
      const lastCompletedYear = parseInt(lastCompletedDateParts[2], 10);

      const todaysMonth = parseInt(todaysDateParts[0], 10);
      const todaysDay = parseInt(todaysDateParts[1], 10);
      const todaysYear = parseInt(todaysDateParts[2], 10);

      const lastCompleted = new Date(
        lastCompletedYear,
        lastCompletedMonth - 1,
        lastCompletedDay,
      );
      const yesterday = new Date(todaysYear, todaysMonth - 1, todaysDay - 1);

      if (
        lastCompleted.getFullYear() == yesterday.getFullYear() &&
        lastCompleted.getMonth() == yesterday.getMonth() &&
        lastCompleted.getDate() == yesterday.getDate()
      ) {
        // Increase streak by 1
        const currentStreak = thisHabit['currentStreak'] + 1;
        thisHabit['currentStreak'] = currentStreak;

        // Check if currentStreak is longer than longestStreak
        if (currentStreak > route.params.longestStreak) {
          route.params.setThisLongestStreak(currentStreak);
          setThisCurrentLongestStreak(currentStreak);
          thisHabit['longestStreak'] = currentStreak;
        }

        route.params.setThisCurrentStreak(currentStreak);
        setCurrentStreak(currentStreak);

        // Set today's date as the last completed date
        thisHabit['lastCompletedDate'] = todaysDate;

        route.params.setHabits(habitsCopy);
        saveHabit();
      } else {
        route.params.setThisCurrentStreak(1);
        setCurrentStreak(1);
      }
    }
  };
  const decreaseCount = () => {
    // Make sure current count is not 0.
    if (currentCount !== 0) {
      // Create a copy of habits
      let habitsCopy = [...route.params.habits];
      // Find this habit obj. within the new copy of habits
      let thisHabit = habitsCopy.find(obj => obj.id == route.params.id);

      setCurrentCount(currentCount - 1);
      route.params.setThisCurrentCount(currentCount - 1);
      let x = currentCount - 1;
      thisHabit.currentCount = x;
      thisHabit.last7dCompletedData[
        route.params.last7dCompletedData.length - 1
      ] = x;

      /* 
      If we are at the goal for today check if streak is greater than 1. If it is,
      that means we can revert last completed day to yesterday. 
      If streak is not larger than 1, then we need to set last completed date to null
      and set streak to 0 because it was not completed yesterday.
     */
      let lastCompletedDate = thisHabit.lastCompletedDate;
      let today = getTodaysDate();
      if (currentCount == goalCount) {
        if (thisCurrentStreak > 1) {
          // If completed today already, re-write date to yesterday.
          if (compareDates(lastCompletedDate, today)) {
            thisHabit['lastCompletedDate'] = getYesterdaysDate();
            let x = thisHabit['currentStreak'] - 1;

            thisHabit['currentStreak'] = x;
            route.params.setThisCurrentStreak(x);
            setCurrentStreak(x);
          }
        } else if (thisCurrentStreak <= 1) {
          thisHabit['currentStreak'] = 0;
          route.params.setThisCurrentStreak(0);
          setCurrentStreak(0);
        }
      }

      route.params.setHabits(habitsCopy);
      saveHabit();
    }
  };

  //Touchable opacity method to increase count.
  const onPressAdd = () => {
    increaseCount();
  };

  //Touchable opacity method to decrease count.
  const onPressSubtract = () => {
    decreaseCount();
  };
  //returns current date formatted m-d-yyyy
  const getCurrentDate = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    // console.log(month + '-' + date + '-' + year);
    return month + '-' + date + '-' + year;
  };

  //*Date Functions
  // Get today's date and split it into an array.
  const getTodaysDate = () => {
    let today = new Date();
    today.setDate(today.getDate());
    today = today.toDateString().split(' ');
    return today;
  };
  // Get tomorrow's date and split it into an array.
  const getYesterdaysDate = () => {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday = yesterday.toDateString().split(' ');
    return yesterday;
  };
  // Function used to compare two dates.
  const compareDates = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  const deleteThisHabit = () => {
    let habitsCopy = route.params.habits;
    //find this habit obj. within the new copy of habits
    let thisHabitIndex = habitsCopy.findIndex(obj => obj.id == route.params.id);
    let newHabits = habitsCopy.splice(thisHabitIndex, 1);
    console.log(thisHabitIndex, '------');

    route.params.setHabits(newHabits);

    saveHabit();
    navigation.navigate('Home');
  };
  const onPressEditHabit = () => {
    console.log('pressed');

    setIsEditing(true);
  };
  const ListHeader = () => (
    <>
      <View style={styles.titleWrapper}>
        <Text style={[styles.appTitle, {color: route.params.textTheme}]}>
          {name}
        </Text>
        <TouchableOpacity
          style={[
            styles.editHabitTouchableOpacity,
            {borderColor: route.params.habitTheme},
          ]}
          onPress={() => onPressEditHabit()}>
          <Text
            style={[styles.editHabitText, {color: route.params.habitTheme}]}>
            Edit Habit
          </Text>
        </TouchableOpacity>
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
            <Text style={styles.habitCountController}>↑</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onPressSubtract()}>
            <Text style={styles.habitCountController}>↓</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.componenetDivider} />

      <HabitStats
        goalCount={route.params.goalCount}
        last7dCompletedData={route.params.last7dCompletedData}
        currentStreak={thisCurrentStreak}
        longestStreak={thisCurrentLongestStreak}
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
      <EditHabitBottomSheet
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        habits={route.params.habits}
        setHabits={route.params.setHabits}
        habitUpdated={route.params.habitUpdated}
        setHabitUpdated={route.params.setHabitUpdated}
        //Habit Details
        id={route.params.id}
        name={name}
        setName={setName}
        currentCount={currentCount}
        setCurrentCount={route.params.setThisCurrentCount}
        setGoalCount={route.params.setGoalCount}
        goalCount={route.params.goalCount}
        //Themes
        bgTheme={route.params.bgTheme}
        textTheme={route.params.textTheme}
        habitTheme={route.params.habitTheme}
      />
    </SafeAreaView>
  );
};

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
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editHabitTouchableOpacity: {
    borderWidth: 1,
    borderRadius: 50,
    marginRight: 15,
  },
  editHabitText: {
    paddingHorizontal: 10,
    paddingVertical: 2,
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
  habitCountController: {
    fontSize: 50,
    color: 'white',
  },
  arrowContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 30,
    width: 120,
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
export default HabitDetails;
