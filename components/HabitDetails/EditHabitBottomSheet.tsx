import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  TouchableOpacity,
} from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const EditHabitBottomSheet = ({
  isEditing,
  setIsEditing,
  habits,
  setHabits,

  //Habit Details
  id,
  setGoalCount,
  setName,
  name,
  currentCount,
  setCurrentCount,

  //Themes
  habitTheme,
  textTheme,
  bgTheme,
}) => {
  const navigation = useNavigation();

  const [thisGoalCount, setThisGoalCount] = useState();
  const [thisName, setThisName] = useState();

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['35%', '35%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const openModel = () => {
    if (isEditing) {
      handlePresentModalPress();
      setIsEditing(false);
    }
  };

  //Submit changes to habit
  const onSubmitHabits = () => {
    let habitsCopy = habits;
    //find this habit obj. within the new copy of habits
    let thisHabit = habitsCopy.find(obj => obj.id === id);

    thisHabit['goalCount'] = thisGoalCount;
    setGoalCount(thisGoalCount);
    thisHabit['name'] = thisName;
    setName(thisName);
    //Check if current count is larger than goal count, if so, decrease current count
    //to goal count. This way, when we decrease the goal count, the current count does not get
    //stuck at a higher number than possible.
    if (currentCount > thisGoalCount) {
      thisHabit['currentCount'] = thisGoalCount;
      setCurrentCount(thisGoalCount);
    }
    setHabits(habitsCopy);
    saveHabit();
  };
  //Save habit to async storage
  const saveHabit = async () => {
    try {
      const jsonValue = JSON.stringify(habits);
      console.log(jsonValue);
      await AsyncStorage.setItem('habitData', jsonValue);
      // console.log(jsonValue, ' = json file')
      navigation.navigate('Home', {});
    } catch (error) {
      console.log(error);
    }
  };

  //Open bottom sheet
  useEffect(() => {
    openModel();
  }, [isEditing]);

  // renders
  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
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
            <Text style={[styles.title, {color: bgTheme}]}>Edit Habit:</Text>
            <View style={styles.contentContainer}>
              <TextInput
                placeholder="Habit Name"
                placeholderTextColor={textTheme}
                value={thisName}
                onChangeText={text => setThisName(text)}
                style={[
                  styles.textInput,
                  {backgroundColor: bgTheme, color: textTheme},
                ]}
              />
              <TextInput
                placeholder="How many times a day?"
                placeholderTextColor={textTheme}
                keyboardType="number-pad"
                value={thisGoalCount}
                onChangeText={text => setThisGoalCount(text)}
                style={[
                  styles.textInput,
                  {backgroundColor: bgTheme, color: textTheme},
                ]}
              />
              <TouchableOpacity
                style={[styles.button, {borderColor: bgTheme}]}
                onPress={() => onSubmitHabits()}>
                <Text style={[styles.buttonText, {color: bgTheme}]}>
                  Save Changes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
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

  contentContainer: {
    flex: 1,
    marginLeft: 15,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
  },
  button: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 15,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: '300',
    marginBottom: 20,
    marginTop: -15,
  },
  variableContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  textInput: {
    fontWeight: '300',
    marginVertical: 10,
    paddingVertical: 10,
    width: 250,
    borderRadius: 8,
    textAlign: 'center',
  },
});
export default EditHabitBottomSheet;
