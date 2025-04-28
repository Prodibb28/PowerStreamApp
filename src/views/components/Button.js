import React from "react";
import { TouchableOpacity, Text } from "react-native";
import COLORS from "../../conts/colors";
import { useFonts } from 'expo-font';


const Button = ({title, onPress = () => { }}) => {
    const [loaded] = useFonts({
        'Onest': require('../../../assets/fonts/Onest.ttf'),
    });
    return(
    <TouchableOpacity 
        onPress={onPress} 
        style = {{
            height:45,
            width: '100%',
            backgroundColor: COLORS.blue,
            justifyContent: 'center',
            alignItems:'center',
            marginVertical:10,
            borderRadius:5
            }}>
                <Text style={{ color: COLORS.white, fontWeight: '600',fontFamily:'Onest', fontSize: 16}}>{title}</Text>
        
    </TouchableOpacity>
    );
}

export default Button;