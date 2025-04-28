import React from 'react';
import { StyleSheet, useWindowDimensions,ActivityIndicator, View, Text } from 'react-native';
import COLORS from '../../conts/colors';
import { useFonts } from 'expo-font';

const Loader = ({visible = true, message}) => {
    const [loaded] = useFonts({
                'Onest': require('../../../assets/fonts/Onest.ttf'),
              });
    const {height, width} = useWindowDimensions();
    return visible && <View style={[style.container, {height, width}]}>
        <View style={style.loader}>
            <ActivityIndicator size="large" color={COLORS.blue}/> 
            <Text style={{marginHorizontal:10, fontSize:15, fontFamily:'Onest'}}>{message}</Text>
        </View>
    </View>
}

const style = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
    },
    loader: {
        height: 70,
        backgroundColor: COLORS.white,
        marginHorizontal:35,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal:20,

    }
});
export default Loader;