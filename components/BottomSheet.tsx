import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';

import AsyncStorage from '@react-native-async-storage/async-storage';

const BottomSheet = ({
  habits,
  setHabits,
  name,
  setName,
  id,
  setId,
  goalCount,
  setGoalCount,
  //themes
  habitTheme,
  textTheme,
  bgTheme,
}) => {
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['38', '38'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  //Use async storage to save habit locally and save it to global object.
  const saveHabit = async () => {
    let randomId = generateRandomId();
    const newHabitItems = [
      ...habits,
      {
        id: randomId,
        name: name,
        goalCount: goalCount,
        currentCount: 0,

        //streaks
        currentStreak: 0,
        longestStreak: 0,
        lastCompletedDate: null,
        last7dCompletedData: [0, 0, 0, 0, 0, 0, 0],
        contributionGraphData: [],
      },
    ];
    setHabits(newHabitItems);
    //Clear text input.
    setGoalCount('');
    setName('');
    try {
      const jsonValue = JSON.stringify(newHabitItems);

      await AsyncStorage.setItem('habitData', jsonValue);
      // console.log(jsonValue, ' = json file')
    } catch (error) {
      console.log(error);
    }
  };

  //!POSSIBLE BUG:
  //!Need to check if the random number generated already exist as an id.
  const generateRandomId = () => {
    //decide whether or not we want a number or letter, then create that, then continue
    let result = '';
    let length = 10;
    let characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    console.log(result);
    return result;
  };
  // renders
  return (
    <BottomSheetModalProvider>
      <TouchableOpacity
        style={[
          styles.addHabitButton,
          {backgroundColor: bgTheme, borderColor: textTheme},
        ]}
        onPress={handlePresentModalPress}>
        <Text style={[styles.addHabitText, {color: textTheme}]}>+</Text>
      </TouchableOpacity>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        enablePanDownToClose
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        style={styles.bottomSheet}
        backgroundStyle={{backgroundColor: habitTheme}}>
        <View
          style={{
            backgroundColor: habitTheme,
            flex: 1,
            paddingTop: 25,
          }}>
          <Text style={[styles.title, {color: bgTheme}]}>Add a Habit:</Text>

          <View style={styles.form}>
            <BottomSheetTextInput
              style={[
                styles.textInput,
                {backgroundColor: bgTheme, color: textTheme},
              ]}
              placeholder="Name"
              placeholderTextColor={textTheme}
              value={name}
              onChangeText={text => setName(text)}
            />
            <BottomSheetTextInput
              style={[
                styles.textInput,
                {backgroundColor: bgTheme, color: textTheme},
              ]}
              keyboardType={'number-pad'}
              placeholder="How many times a day?"
              placeholderTextColor={textTheme}
              value={goalCount}
              onChangeText={text => setGoalCount(text)}
            />
            <TouchableOpacity
              style={[styles.submitHabit, {borderColor: bgTheme}]}
              onPress={() => saveHabit()}>
              <Text style={[styles.submitHabitText, {color: bgTheme}]}>
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
export default BottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSheet: {
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: -40,
    },
    shadowOpacity: 1,
    shadowRadius: 100,

    elevation: 20,
  },

  addHabitButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 100,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'gray',
    shadowOpacity: 1,
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  addHabitText: {
    fontSize: 20,
  },
  form: {
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 5,
    marginTop: -15,
  },
  textInput: {
    marginHorizontal: 70,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 20,
    backgroundColor: '#333',
  },
  submitHabit: {
    paddingHorizontal: 25,
    paddingVertical: 10,

    marginTop: 15,
    borderRadius: 20,
    borderWidth: 1,

    alignSelf: 'center',
  },
  submitHabitText: {},
});
