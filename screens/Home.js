import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet from '../components/BottomSheet';
import {useNavigation} from '@react-navigation/native';
import HabitList from '../components/HabitList';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const navigation = useNavigation();
  const [habits, setHabits] = useState(['']);

  //habits states
  const [name, setName] = useState('');
  const [goalCount, setGoalCount] = useState('');
  const [id, setId] = useState('');

  //Time States
  const [resetHabits, setResetHabits] = useState(false);

  //Theme
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [habitTheme, setHabitTheme] = useState('red');
  const [textTheme, setTextTheme] = useState('#fff');
  const [bgTheme, setBgTheme] = useState('#000000');

  const checkTime = async () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    // console.log(month + '-' + date + '-' + year);
    // You can turn it in to your desired format
    let currentDate = [month, date, year]; //format: m-d-y;
    try {
      var lastOnlineDate = await AsyncStorage.getItem('lastOnlineDate');
      lastOnlineDate = lastOnlineDate;
      console.log('last logged in:', lastOnlineDate);
      if (lastOnlineDate == null) {
        console.log('we have no data.');
      }
      if (lastOnlineDate == currentDate) {
        console.log('You last logged in today!');
      }
      if (lastOnlineDate != currentDate) {
        //reset habits
        setResetHabits(true);
        console.log('The last time we logged in was not today');
      }
    } catch (e) {
      // error reading value
      console.log(e);
    }
    try {
      await AsyncStorage.setItem('lastOnlineDate', currentDate.toString());
      console.log(
        'Saving lastOnlineDate to AsyncStorage:',
        currentDate.toString(),
      );
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
              isDarkMode: isDarkMode,
              textTheme: textTheme,
              setTextTheme: setTextTheme,
              bgTheme: bgTheme,
              setBgTheme: setBgTheme,
            });
          }}>
          <Image
            style={styles.settingsIcon}
            source={{
              uri: 'https://icons.iconarchive.com/icons/icons8/ios7/512/Very-Basic-Settings-icon.png',
            }}
          />
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
      const darkMode = await AsyncStorage.getItem('darkMode');
      setIsDarkMode(darkMode);
      console.log('dark mode:', darkMode);
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };
  useEffect(() => {
    checkTime();
    getTheme();
  }, [resetHabits]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
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
    marginBottom: 10,
  },

  settingsIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
});