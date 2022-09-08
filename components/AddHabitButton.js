import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import BottomSheet from './BottomSheet'

const AddHabitButton = () => {
    
    
    return (
        <SafeAreaView>
            <TouchableOpacity style={styles.addHabitButton}
                
            >
            <Text styles={styles.addHabitText}>+</Text>
            </TouchableOpacity>
           
        </SafeAreaView>

    
  )
}

export default AddHabitButton

const styles = StyleSheet.create({
    addHabitButton:{
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 100,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',

        shadowColor: 'gray',
        shadowOpacity: .6,
       
    },
    addHabitText:{

        fontSize: 20,
    },

})