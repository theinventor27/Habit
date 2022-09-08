import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
//Progress Bar Componenets
import CircularProgress from 'react-native-circular-progress-indicator';

const Settings = ({route}) => {
  const [exampleColor, setExampleColor] = useState(route.params.theme);
  const [randomValue, setRandomValue] = useState(5);
  const ListHeader = () => (
    <>
      <View style={styles.titleWrapper}>
        <Text style={styles.appTitle}>Settings</Text>
      </View>
      <View style={styles.divider} />
    </>
  );

  const deleteAllHabits = async () => {
    console.log('All habits have been deleted');
    route.params.setHabits([]);
  };
  const onClickColor = color => {
    console.log(colorData);

    //uses route to set theme globally
    route.params.setTheme(color);

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
      await AsyncStorage.setItem('theme', color);
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

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.screen}>
        <ListHeader />
        <Text style={styles.themeText}>Choose Theme:</Text>
        <View style={styles.circularProgressExample}>
          <CircularProgress
            value={randomValue}
            maxValue={10}
            radius={70}
            inActiveStrokeColor={'black'}
            activeStrokeColor={exampleColor}
            progressValueColor={exampleColor}
            inActiveStrokeOpacity={0.2}
          />
        </View>
        <FlatListWithColors />
        <TouchableOpacity onPress={() => deleteAllHabits()}>
          <Text>DELETE ALL HABITS</Text>
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
  inputNameWrapper: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 10,
  },
  inputNameText: {
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 15,
  },
  nameInput: {
    height: 40,
    width: 200,
    marginLeft: 10,
    marginTop: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
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
    height: 12,
  },
});
