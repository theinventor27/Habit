import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Switch,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
//Progress Bar Componenets
import CircularProgress from 'react-native-circular-progress-indicator';

const Settings = ({route, navigation}) => {
  const [exampleColor, setExampleColor] = useState(route.params.habitTheme);
  const [randomValue, setRandomValue] = useState(5);
  const [textTheme, setTextTheme] = useState(route.params.textTheme);
  const [bgTheme, setBgTheme] = useState(route.params.bgTheme);

  //Switch states
  const [isEnabled, setIsEnabled] = useState(getSwitchState);

  //Runs when dark mode switch is toggled
  const toggleSwitch = async () => {
    var _isEnabled = !isEnabled;
    setIsEnabled(previousState => !previousState);

    var scheme = '';

    if (_isEnabled) {
      scheme = 'dark';
      route.params.setBgTheme('#222324');
      setBgTheme('#222324');
      route.params.setTextTheme('#fff');
      setTextTheme('#fff');
      console.log(_isEnabled);
    } else {
      scheme = 'light';
      route.params.setBgTheme('#fff');
      setBgTheme('#fff');
      route.params.setTextTheme('#000000');
      setTextTheme('#000000');
      console.log(_isEnabled);
    }
    //save either 'dark' or 'light' as scheme in asyncstorage
    try {
      await AsyncStorage.setItem('Scheme', scheme);
    } catch (error) {
      console.log(error);
    }
    //Save switch state to async storage
    try {
      console.log('save', _isEnabled);
      await AsyncStorage.setItem('themeSwitchState', _isEnabled.toString());
    } catch (error) {
      console.log(error);
    }
  };

  //Get switch state from asyncstorage
  const getSwitchState = async () => {
    try {
      const switchState = await AsyncStorage.getItem('themeSwitchState');
      if (switchState == 'true') {
        setIsEnabled(true);
      } else {
        setIsEnabled(false);
      }
      console.log('from asyncstorage', switchState);
    } catch (error) {
      console.log(error);
    }
  };

  const ListHeader = () => (
    <>
      <View style={styles.titleWrapper}>
        <Text style={[styles.appTitle, {color: textTheme}]}>Settings</Text>
      </View>
      <View style={styles.divider} />
    </>
  );

  //Save habit to local storage
  const saveHabit = async habits => {
    try {
      const jsonValue = JSON.stringify(habits);
      console.log('habits have been saved to local storage \n', jsonValue);
      await AsyncStorage.setItem('habitData', jsonValue);
      // console.log('saved', jsonValue);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAllHabits = async () => {
    console.log('All habits have been deleted');
    let emptyHabits = [];
    route.params.setHabits(emptyHabits);
    saveHabit(emptyHabits);
  };

  const onClickColor = color => {
    //uses route to set theme globally
    route.params.setHabitTheme(color);

    //sets example progress bar color
    setExampleColor(color);
    saveColor(color);
    //assign random number between 1 and 10 for animation effect.
    setRandomValue(Math.floor(Math.random() * 10) + 1);
    console.log('Color has been changed to', color);
  };

  colorDataLightMode = [
    '#FF4040', // Bright Red
    '#FF8C78', // Bright Tomato
    '#FFC040', // Bright Orange
    '#FFD700', // Readable Yellow
    '#00FF40', // Bright Green
    '#40FF9C', // Bright Spring Green
    '#B4D8DC', // Bright Light Teal
    '#60E7D8', // Bright Lighter Teal
    '#40FFFF', // Bright Cyan
    '#8980B3', // Bright Light Indigo
    '#D88FC0', // Bright Lighter Purple
    '#FF40FF', // Bright Magenta
    '#FF80B8', // Bright Brighter Pink
    '#F08080', // Coral
  ];
  colorDataDarkMode = [
    '#FF0000', // Red
    '#FF6347', // Tomato
    '#FFA500', // Orange
    '#FFFF00', // Yellow
    '#FFD700', // Lighter Gold
    '#00FF00', // Green
    '#00FF7F', // Spring Green
    '#AFEEEE', // Light Teal
    '#40E0D0', // Lighter Teal
    '#00FFFF', // Cyan
    '#7B68EE', // Light Indigo
    '#BA55D3', // Lighter Purple
    '#FF00FF', // Magenta
    '#FF69B4', // Brighter Pink
  ];

  const saveColor = async color => {
    try {
      await AsyncStorage.setItem('habitTheme', color);
    } catch (error) {
      console.log(error);
    }
  };

  const ColorView = ({colorData}) => (
    <>
      <View style={styles.colorPicker}>
        <TouchableOpacity
          onPress={() => {
            onClickColor(colorData);
          }}>
          <View style={[styles.color, {backgroundColor: colorData}]} />
        </TouchableOpacity>
      </View>
    </>
  );
  const FlatListWithColors = () => (
    <>
      <FlatList
        columnWrapperStyle={{justifyContent: 'space-around'}}
        numColumns={Math.ceil(colorDataDarkMode.length / 2)}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        data={isEnabled ? colorDataDarkMode : colorDataLightMode}
        renderItem={({item}) => <ColorView colorData={item} />}
      />
    </>
  );

  useEffect(() => {
    getSwitchState();
  }, []);

  return (
    <SafeAreaView style={[styles.screen, {backgroundColor: bgTheme}]}>
      <View style={styles.screen}>
        <ListHeader />

        <View style={styles.circularProgressExample}>
          <CircularProgress
            value={randomValue}
            maxValue={10}
            radius={70}
            inActiveStrokeColor={textTheme}
            activeStrokeColor={exampleColor}
            progressValueColor={exampleColor}
            inActiveStrokeOpacity={0.2}
          />
        </View>
        <FlatListWithColors />
        <View style={styles.darkModeWrapper}>
          <Text style={[styles.darkModeText, {color: textTheme}]}>
            Dark Mode:
          </Text>

          <Switch
            trackColor={{false: '#fff', true: '#000000'}}
            thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor="#a3a3a3"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <TouchableOpacity onPress={() => deleteAllHabits()}>
          <Text style={[styles.deleteAllHabits]}>DELETE ALL HABITS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
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
  darkModeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginTop: 15,
    marginBottom: 350,
  },

  darkModeText: {
    marginRight: 15,
  },

  colorPicker: {
    marginTop: 10,
    justifyContent: 'space-around',
  },

  color: {
    height: 40,
    width: 40,
    borderRadius: 50,
    borderWidth: 1,
  },

  circularProgressExample: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 25,
    marginBottom: 10,
  },

  deleteAllHabits: {
    textAlign: 'center',
    color: 'red',
  },
});
