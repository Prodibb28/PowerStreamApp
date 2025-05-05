import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import COLORS from "../../conts/colors";
import { useFonts } from 'expo-font';

const Button = ({ 
  title, 
  onPress = () => {}, 
  style = {}, 
  textStyle = {},
  height = 45,
  width = '100%'
}) => {
    const [loaded] = useFonts({
        'Onest': require('../../../assets/fonts/Onest.ttf'),
        'OnestSemiBold': require('../../../assets/fonts/OnestSemiBold.ttf'),
    });

    const buttonStyles = {
        height,
        width,
        backgroundColor: COLORS.blue,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
        borderRadius: 5,
        ...style // Sobrescribe los estilos por defecto con los pasados por props
    };

    return (
        <TouchableOpacity 
            onPress={onPress} 
            style={buttonStyles}
        >
            <Text style={{ 
                color: COLORS.white, 
                fontWeight: '600',
                fontFamily: loaded ? 'OnestSemiBold' : 'sans-serif',
                fontSize: 16,
                ...textStyle
            }}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

export default Button;