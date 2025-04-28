import React from 'react';
import { StyleSheet, useWindowDimensions, View, Text } from 'react-native';
import COLORS from '../../conts/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from "../components/Button";

import { useFonts } from 'expo-font';

const AdBox = ({visible = true, iconName,buttonMessage,message , onPress = () => { }}) => {
     const [loaded] = useFonts({
                'Onest': require('../../../assets/fonts/Onest.ttf'),
    });
    const {height, width} = useWindowDimensions();
    return visible && <View style={[style.container, {height, width}]}>
        <View style={style.loader}>
        <View style ={{flexDirection:'row', marginVertical:10}}>
        <Icon
            name={iconName}
            style={{color: COLORS.darkBlue, fontSize: 22, marginHorizontal: 0}}
        />
            <Text style={{marginHorizontal:5, fontSize:16,fontWeight:'600',color:COLORS.blue, fontFamily:"Onest"}}> {message}</Text>
        </View>
        <Button title={buttonMessage} onPress={onPress}/>
        </View>
    </View>
}

const style = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
    },
    loader: {
        height: 130,
        backgroundColor: COLORS.white,
        marginHorizontal:35,
        borderRadius: 5,
        flexDirection: 'column',
        justifyContent:'center',
        alignItems: 'center',
        paddingHorizontal:30,

    }
});
export default AdBox;