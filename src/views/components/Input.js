import React from 'react';
import { View,Text, StyleSheet, TextInput } from 'react-native';
import COLORS from '../../conts/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useFonts } from 'expo-font';

const Input = ({label, iconName, error, password, onFocus = ()=>{}, ...props}) => {
     const [loaded] = useFonts({
            'Onest': require('../../../assets/fonts/Onest.ttf'),
          });
        const [isFocused, setIsFocused] = React.useState(false);

    return (<View style = {{marginBottom: 10}}>
        <Text style={style.label}>{label}</Text>
        <View style={[style.inputContainer, 
        { 
            borderColor: error 
            ? COLORS.red 
            : isFocused 
            ? COLORS.darkBlue 
            : COLORS.light, 
            alignItems: 'center',
            }
            
        ]}>
        <Icon
            name={iconName}
            style={{color: COLORS.darkBlue, fontSize: 22, marginHorizontal: 7}}
        />
        <TextInput 
            autoCorrect={false}
            onFocus={()=>{
                onFocus();
                setIsFocused(true);
            }}
            onBlur={() => {
                setIsFocused(false)
            }}
            style={{color:COLORS.black, flex:1, fontFamily:"OnestSemiBold" }}
            placeholderTextColor={COLORS.grey}
            {...props}
        />
        </View>
        {error && (
        <Text style = {{color: COLORS.red, fontSize:12, fontFamily:'OnestSemiBold'}}>{error}</Text>
        )}
    </View>
    );
}

const style = StyleSheet.create({
    label:{
        marginVertical: 2,
        fontSize: 14,
        fontFamily:"OnestBold",
        color: COLORS.blue
    },
    inputContainer:{
        height: 45,
        backgroundColor:COLORS.light,
        flexDirection:'row',
        borderWidth:0.5,
        borderRadius:5,
        borderColor: COLORS.grey,
        alignItems:'center'
    }
})

export default Input;