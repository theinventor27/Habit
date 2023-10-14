import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet from '../components/BottomSheet';
import {useNavigation} from '@react-navigation/native';
import HabitList from '../components/HabitList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';

const App = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  //habits states
  const [habits, setHabits] = useState(['']);

  const [name, setName] = useState('');
  const [goalCount, setGoalCount] = useState('');
  const [id, setId] = useState('');

  //Time States
  const [resetHabits, setResetHabits] = useState(false);

  //Theme
  const [habitTheme, setHabitTheme] = useState('red');
  const [textTheme, setTextTheme] = useState('#fff');
  const [bgTheme, setBgTheme] = useState('#333');

  const getHabit = async () => {
    try {
      const jsonValue = JSON.parse(await AsyncStorage.getItem('habitData'));
      setHabits(jsonValue);
      console.log('getHabit() from home has run', jsonValue);
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };

  const checkTime = async () => {
    const today = new Date();
    const yesterday = new Date(today);
    //Get yesterday's date.
    yesterday.setDate(yesterday.getDate() - 1);

    try {
      var lastOnlineDate = await AsyncStorage.getItem('lastOnlineDate');
      // console.log('last logged in:', lastOnlineDate);
      if (lastOnlineDate == null) {
        // console.log('we have no data.');
      }
      if (lastOnlineDate == today.toDateString()) {
        console.log('You last logged in today!');
      }
      if (lastOnlineDate != today.toDateString()) {
        //reset habits
        setResetHabits(true);
        console.log('The last time we logged in was not today');
      }
    } catch (e) {
      // error reading value
      console.log(e);
    }
    try {
      await AsyncStorage.setItem('lastOnlineDate', today.toDateString());
      // console.log(
      //   'Saving lastOnlineDate to AsyncStorage:',
      //   currentDate.toString(),
      // );
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };

  const ListHeader = () => (
    <>
      <View style={styles.titleWrapper}>
        <Text style={[styles.appTitle, {color: textTheme}]}>Habit Tracker</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Settings', {
              setHabitTheme: setHabitTheme,
              habitTheme: habitTheme,
              habits: habits,
              setHabits: setHabits,
              //themes
              textTheme: textTheme,
              setTextTheme: setTextTheme,
              bgTheme: bgTheme,
              setBgTheme: setBgTheme,
            });
          }}>
          {bgTheme == '#222324' ? (
            <Image
              style={styles.settingsIcon}
              source={require('../Assets/settings_white.png')}
            />
          ) : (
            // else set black img
            <Image
              style={styles.settingsIcon}
              source={require('../Assets/settings_black.png')}
            />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
    </>
  );
  const getTheme = async () => {
    try {
      const habitThemeColor = await AsyncStorage.getItem('habitTheme');
      setHabitTheme(habitThemeColor);
    } catch (e) {
      // error reading value
      console.log(e);
    }
    try {
      const scheme = await AsyncStorage.getItem('Scheme');
      if (scheme == 'dark') {
        setTextTheme('#fff');
        setBgTheme('#222324');
        // console.log('theme is dark');
      }
      if (scheme == 'light') {
        setTextTheme('#000000');
        setBgTheme('#fff');
        // console.log('theme is light');
      }
    } catch (e) {
      // error reading value
      console.log(e);
    }
    console.log('isFocused status', isFocused);
  };

  

  useEffect(() => {
    getHabit();
    checkTime();
    getTheme();
  }, [resetHabits, isFocused]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      {/* if bgTheme is black, set white status bar */}
      {bgTheme == '#222324' ? (
        <StatusBar barStyle={'light-content'} />
      ) : (
        // else set status bar black
        <StatusBar barStyle={'dark-content'} />
      )}
      <SafeAreaView style={[styles.screen, {backgroundColor: bgTheme}]}>
        <ListHeader />
        <HabitList
          habits={habits}
          setHabits={setHabits}
          resetHabits={resetHabits}
          setResetHabits={setResetHabits}
          name={name}
          setName={setName}
          id={id}
          goalCount={goalCount}
          setGoalCount={setGoalCount}
          habitTheme={habitTheme}
          //themes
          textTheme={textTheme}
          bgTheme={bgTheme}
        />
        <BottomSheet
          //Habit states
          habits={habits}
          setHabits={setHabits}
          id={id}
          setId={setId}
          name={name}
          setName={setName}
          goalCount={goalCount}
          setGoalCount={setGoalCount}
          //Themes
          habitTheme={habitTheme}
          textTheme={textTheme}
          bgTheme={bgTheme}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleWrapper: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  appTitle: {
    fontSize: 20,
    marginLeft: 15,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#A9ABB1',
    marginHorizontal: 16,
    marginTop: 16,
  },

  settingsIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
});
