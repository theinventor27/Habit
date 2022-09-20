import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useState, useEffect} from 'react';

//Progress Bar Componenets
import CircularProgress from 'react-native-circular-progress-indicator';

//Navigation Componenets
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const habits = ({
  habits,
  setHabits,
  resetHabits,
  setResetHabits,
  name,
  goalCount,
  id,
  currentCount,
  currentStreak,
  longestStreak,
  last7dCompletedData,
  habitTheme,
  textTheme,
  bgTheme,
}) => {
  const navigation = useNavigation();
  const [thisCurrentCount, setThisCurrentCount] = useState(currentCount);
  const [thisCurrentStreak, setThisCurrentStreak] = useState(currentStreak);
  const [thisLongestStreak, setThisLongestStreak] = useState(longestStreak);
  const getThisHabit = () => {
    let habitsCopy = habits;
    //find this habit obj. within the new copy of habits
    let thisHabit = habitsCopy.find(obj => obj.id === id);
    return thisHabit;
  };
  //Increases the count of the habit if count has not reached countGoal.
  //Check if habit has been completed.
  const increaseCount = () => {
    if (goalCount > thisCurrentCount) {
      //create copy of habits
      let habitsCopy = habits;
      //find this habit obj. within the new copy of habits
      let thisHabit = habitsCopy.find(obj => obj.id === id);

      //increase count state by 1
      var x = thisCurrentCount + 1;
      setThisCurrentCount(thisCurrentCount + 1);
      //set count of copied obj.
      thisHabit['currentCount'] = x;
      //set todays current count in 7dCompletedData
      thisHabit['last7dCompletedData'][last7dCompletedData.length - 1] = x;
      //set copy as official habit
      console.log(habitsCopy);
      setHabits(habitsCopy);
      saveHabit();
    }
    if (goalCount == x) {
      // console.log('habit', name, 'completed.');
      habitCompleted();
    }
  };
  const habitCompleted = () => {
    //create copy of habits
    let habitsCopy = habits;
    //find this habit obj. within the new copy of habits
    let thisHabit = habitsCopy.find(obj => obj.id === id);

    //If currentStreak is 0 then we do not check if it was completed yesterday.
    if (thisHabit['currentStreak'] == 0) {
      //Set streaks to 1.
      thisHabit['currentStreak'] = 1;
      setThisCurrentStreak(1);
      //check if longestStreak is 0 if so, set to 1.
      if (longestStreak == 0) {
        thisHabit['longestStreak'] = 1;
        setThisLongestStreak(1);
      }

      //set date to check if completed in a streak.
      const today = new Date();
      thisHabit['lastCompletedDate'] = today.toDateString();

      //set copy as official habit
      setHabits(habitsCopy);
      saveHabit();
    }
    if (thisHabit['currentStreak'] > 0) {
      //create copy of habits
      let habitsCopy = habits;
      //find this habit obj. within the new copy of habits
      let thisHabit = habitsCopy.find(obj => obj.id === id);

      //Get last completed date and todays date and split them into an array to compare
      //each elements of the array. All elements should be the same except for the day.
      //The day should be 1 more than the last completed day.
      let lastCompletedDate = thisHabit['lastCompletedDate'];
      const today = new Date();
      const yesterday = new Date(today);
      //Get yesterday's date.
      yesterday.setDate(yesterday.getDate() - 1);

      //check if lastCompletedDate was yesterday, if so, add 1 to streak
      if (lastCompletedDate == yesterday.toDateString()) {
        //increase streak by 1.
        let x = thisHabit['currentStreak'] + 1;
        thisHabit['currentStreak'] = x;
        //check if currentStreak is longer than longestStreak
        if (x > longestStreak) {
          setThisLongestStreak(x);
          thisHabit['longestStreak'] = x;
        }
        setThisCurrentStreak(x);
        //set date to check later if completed in a streak.
        thisHabit['lastCompletedDate'] = today.toDateString();
        //set copy as official habit
        setHabits(habitsCopy);
        saveHabit();
        //Else, habit was not completed yesterday
      } else {
        setThisCurrentStreak(1);
      }
    } else {
      setThisCurrentStreak(1);
    }
  };

  //returns current date formatted d-m-yyyy
  // const getCurrentDate = () => {
  //   var date = new Date().getDate();
  //   var month = new Date().getMonth() + 1;
  //   var year = new Date().getFullYear();

  //   // console.log(month + '-' + date + '-' + year);
  //   // You can turn it in to your desired format
  //   return month + '-' + date + '-' + year; //format: d-m-y;
  // };

  //Navigate to habit detail page
  const onPressHabitName = () => {
    navigation.navigate('HabitDetails', {
      habitTheme: habitTheme,
      habits: habits,
      setHabits: setHabits,
      name: name,
      id: id,
      goalCount: goalCount,
      thisCurrentCount: thisCurrentCount,
      setThisCurrentCount: setThisCurrentCount,
      last7dCompletedData: last7dCompletedData,
      currentStreak: thisCurrentStreak,
      longestStreak: thisLongestStreak,
      setThisLongestStreak: setThisLongestStreak,
      setThisCurrentStreak: setThisCurrentStreak,

      //theme
      bgTheme: bgTheme,
      textTheme: textTheme,
    });
  };

  //Touchable opacity method to increase count.
  const onPressAdd = () => {
    increaseCount();
    // console.log(thisCurrentCount);
  };

  //Touchable opacity method to decrease count.
  const onPressSubtract = () => {
    decreaseCount();
  };

  const saveHabit = async () => {
    try {
      const jsonValue = JSON.stringify(habits);
      console.log(jsonValue);
      await AsyncStorage.setItem('habitData', jsonValue);
      // console.log('saved', jsonValue);
    } catch (error) {
      console.log(error);
    }
  };
  //! UseEffect is causing my calculations to act weird. I need to figure out 
  //! another way to check how many days ago we logged in, probably without using a for loop.
  const newDay = () => {
    if (resetHabits) {
      console.log('--------------- \n new day');
      let habitsCopy = habits;
      let thisHabit = habitsCopy.find(obj => obj.id === id);
      //Set habit current count to 0.
      thisHabit['currentCount'] = 0;
      setThisCurrentCount(0);
      //get last completed date
      let lastCompletedDate = thisHabit['lastCompletedDate'];
      //Check how many days its been since we logged in.
      //We only have to check if the habit was completed within the last 7 days.
      const today = new Date();
      const yesterday = new Date(today);

      var daysSinceWeLoggedIn;
      //a for loop that checks how many days ago, starting with 7 days ago,
      //the habit was completed. If longer than 7 days shift data 7 days.
      for (let x = 0; x >= 7; x++) {
        yesterday.setDate(yesterday.getDate() - x);
        console.log('--------------------- \n', yesterday.toDateString());
        if (lastCompletedDate == yesterday.toDateString()) {
          daysSinceWeLoggedIn = x;
        } else {
          console.log('++++++++ \n', yesterday.toDateString());
        }
      }
      //Remove farthest day and add new day to 7dCompletedData
      thisHabit['last7dCompletedData'].shift();
      thisHabit['last7dCompletedData'].push(0);

      setHabits(habitsCopy);
      saveHabit();
      setResetHabits(false);
    }
  };
  useEffect(() => {
    newDay();
  }, [resetHabits]);

  return (
    <View style={[styles.habitsContainer, {backgroundColor: bgTheme}]}>
      <View style={[styles.habit, {backgroundColor: bgTheme}]}>
        <TouchableOpacity onPress={() => onPressAdd()} style={styles.add}>
          <View style={styles.streakWrapper}>
            {/* if bgTheme is black, set white streak img */}
            {bgTheme == '#222324' ? (
              <Image
                style={styles.streakImage}
                source={require('../Assets/streak_white.png')}
              />
            ) : (
              // else set black img
              <Image
                style={styles.streakImage}
                source={require('../Assets/streak_black.png')}
              />
            )}
            <Text style={[styles.currentStreakText, {color: textTheme}]}>
              {thisCurrentStreak}
            </Text>
          </View>
          <CircularProgress
            value={thisCurrentCount}
            maxValue={goalCount}
            radius={70}
            inActiveStrokeColor={textTheme}
            activeStrokeColor={habitTheme}
            progressValueColor={habitTheme}
            inActiveStrokeOpacity={0.2}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.pressHabitName}
          onPress={onPressHabitName}>
          <View style={styles.habitText}>
            <Text style={[styles.habitName, {color: textTheme}]}>{name}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default habits;

const styles = StyleSheet.create({
  habitsContainer: {
    flex: 1,
    marginVertical: 5,
  },

  habit: {
    width: 200,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: 'white',
    marginTop: 10,
  },

  habitName: {
    textAlign: 'center',
    fontSize: 15,
    marginTop: 10,
  },
  add: {},
  streakWrapper: {
    flexDirection: 'row',
    textAlign: 'center',
    marginLeft: -20,
    marginBottom: -16,
  },
  streakImage: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 15,
    height: 15,
    backgroundColor: 'transparent',
  },
  currentStreakText: {
    alignSelf: 'center',
    marginLeft: 0,
    fontSize: 15,
  },
});
