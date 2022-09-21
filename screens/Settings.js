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

const Settings = ({route}) => {
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
    console.log(colorData);

    //uses route to set theme globally
    route.params.setHabitTheme(color);

    //sets example progress bar color
    setExampleColor(color);
    saveColor(color);
    //assign random number between 1 and 10 for animation effect.
    setRandomValue(Math.floor(Math.random() * 10) + 1);
    console.log('Color has been changed to', color);
  };

  colorData = [
    '#72FFFF',
    '#0CECDD',
    '#00FFAB',
    '#FFF338',
    '#49FF00',
    '#3EC70B',
    '#FF67E7',
    '#C400FF',
    '#D61C4E',
    '#1A4D2E',
    '#000D6B',
    '#000000',
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
        numColumns={Math.ceil(colorData.length / 2)}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        data={colorData}
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
        <Text style={[styles.themeText, {color: textTheme}]}>
          Choose Theme:
        </Text>
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

        <TouchableOpacity onPress={() => deleteAllHabits()}>
          <Text style={[styles.deleteAllHabits]}>DELETE ALL HABITS</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.signiture}>Johan</Text>
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
    marginLeft: 10,
    marginTop: 25,
  },
  darkModeText: {
    marginRight: 15,
  },
  themeText: {
    fontSize: 15,
    marginTop: 20,
    marginLeft: 10,
  },
  colorPicker: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    marginTop: 10,
    marginBottom: 10,
  },
  signiture: {
    color: 'gray',
    fontSize: 10,
    fontFamily: 'AppleSDGothicNeo-Thin',
    justifyContent: 'center',
    textAlign: 'center',
    height: 9,
  },
  deleteAllHabits: {
    textAlign: 'center',
    color: 'red',
  },
});
