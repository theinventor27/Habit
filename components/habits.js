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
  setName,
  goalCount,
  setGoalCount,
  id,
  currentCount,
  currentStreak,
  longestStreak,
  last7dCompletedData,
  contributionGraphData,
  habitTheme,
  textTheme,
  bgTheme,
}) => {
  const navigation = useNavigation();
  const [thisCurrentCount, setThisCurrentCount] = useState(currentCount);
  const [thisCurrentStreak, setThisCurrentStreak] = useState(currentStreak);
  const [thisLongestStreak, setThisLongestStreak] = useState(longestStreak);

  const [_contributionGraphData, setContributionGraphData] = useState(
    contributionGraphData,
  );

  const getThisHabit = () => {
    let habitsCopy = habits;
    //find this habit obj. within the new copy of habits
    let thisHabit = habitsCopy.find(obj => obj.id === id);
    return thisHabit;
  };
  const getDateforContributionGraph = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so we add 1 and pad with '0'.
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
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
      //set contribution graph data
      const dateForContributionGraph = getDateforContributionGraph();

      const dateForContributionGraphPlaceholder = [
        ...thisHabit['contributionGraphData'],
        {date: dateForContributionGraph, count: x},
      ];

      thisHabit['contributionGraphData'] = dateForContributionGraphPlaceholder;
      setContributionGraphData(dateForContributionGraphPlaceholder);
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
    console.log('habit completed function ran');
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
        5;
      }

      //set date to check if completed in a streak.
      const today = getTodaysDate();
      thisHabit['lastCompletedDate'] = today;

      //set copy as official habit
      setHabits(habitsCopy);
      saveHabit();
    }

    //If this habit's current streak is larger than 0 then
    //we need to check if the habit was completed in a streak.
    //If not, set current streak to 0.
    if (thisHabit['currentStreak'] > 0) {
      //create copy of habits
      let habitsCopy = habits;
      //find this habit obj. within the new copy of habits
      let thisHabit = habitsCopy.find(obj => obj.id == id);

      // Get last completed date, today's date, and yesterdays date.
      let lastCompletedDate = thisHabit['lastCompletedDate'];
      let today = getTodaysDate();
      let yesterday = getYesterdaysDate();
      // If habit was last completed yesterday...
      if (compareDates(lastCompletedDate, yesterday)) {
        // Get current streak plus 1.
        let x = thisHabit['currentStreak'] + 1;
        // Add 1 to streak.
        setThisCurrentStreak(x);
        thisHabit['currentStreak'] = x;
        //Now, check if we broke our longest streak record
        if (x > longestStreak) {
          //if so, set to value of x.
          setThisLongestStreak(x);
          thisHabit['longestStreak'] = x;
        }
        //Now set our new last completed date.
        thisHabit['lastCompletedDate'] = getTodaysDate();
        console.log(
          'Last completed date has been overwritten. New date:',
          getTodaysDate(),
        );
        //Else habit not completed in streak. Set to 1.
      } else {
        setThisCurrentStreak(1);
        console.log(
          'habit was not completed in a streak. Current streak set to 1.',
        );
      }

      //set copy as official habit
      setHabits(habitsCopy);
      saveHabit();
    }
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
  //Navigate to habit detail page
  const onPressHabitName = () => {
    navigation.navigate('HabitDetails', {
      habits: habits,
      setHabits: setHabits,
      name: name,
      setName: setName,
      id: id,
      goalCount: goalCount,
      setGoalCount: setGoalCount,
      thisCurrentCount: thisCurrentCount,
      setThisCurrentCount: setThisCurrentCount,
      last7dCompletedData: last7dCompletedData,
      currentStreak: thisCurrentStreak,
      longestStreak: thisLongestStreak,
      setThisLongestStreak: setThisLongestStreak,
      setThisCurrentStreak: setThisCurrentStreak,
      contributionGraphData: contributionGraphData,

      //theme
      bgTheme: bgTheme,
      textTheme: textTheme,
      habitTheme: habitTheme,
    });
  };

  //Touchable opacity method to increase count.
  const onPressAdd = () => {
    increaseCount();
    console.log(thisCurrentCount);
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
      var yesterday = new Date(today);
      //Check if we need to reset streak to 0.
      //If we did not complete this habit the last 2 days. We need to reset the habit.
      const checkIfStreakNeedsToBeSetToZero = () => {
        //check last if completed last two days.
        //the last two days would be the last two numbers of this array.
        let data = thisHabit['last7dCompletedData'];
        console.log(data);
        //check if the goalCount was reached last two days.
        let oneDayAgo = new Date(today);
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        let twoDayAgo = new Date(today);
        twoDayAgo.setDate(twoDayAgo.getDate() - 2);
        if (goalCount == twoDayAgo && goalCount == oneDayAgo) {
          console.log('We do not need to reset streak habit');
        }
      };
      checkIfStreakNeedsToBeSetToZero();
      var daysSinceWeLoggedIn = '';
      //a for loop that checks how many days ago, starting with 7 days ago,
      //the habit was completed. If longer than 7 days shift data 7 days.
      for (let x = 1; x <= 6; x++) {
        yesterday.setDate(yesterday.getDate() - x);
        console.log(
          '--------------------------------- \n',
          yesterday.toDateString(),
        );
        if (lastCompletedDate == yesterday.toDateString()) {
          console.log(yesterday.toDateString(), 'HABIT COMPLETED THIS DAY ^^');
        } else {
          console.log('\t Habit was not completed this day');
        }
        yesterday = new Date(today);
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
