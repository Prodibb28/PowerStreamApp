import React, { useContext } from "react";
import { SafeAreaView, Text, View, Keyboard, Alert } from "react-native";
import COLORS from '../../conts/colors';
import Input from '../components/Input';
import Button from "../components/Button";
import Loader from "../components/Loader";
import { AuthContext } from "../../context/AuthContext";

const LoginScreen = ({ navigation }) => {
    // Obtener la función login del AuthContext
    const { login: authLogin } = useContext(AuthContext);
    
    const [inputs, setInputs] = React.useState({
        nic: ''
    });
    const [errors, setErrors] = React.useState({});
    const [loading, setLoading] = React.useState(false);

    const validate = () => {
        Keyboard.dismiss();
        let isValid = true;
        if (!inputs.nic) {
            handleError("Por favor ingresa tu NIC", 'nic');
            isValid = false;
        } else if (!/^\d+$/.test(inputs.nic)) {
            handleError("El NIC debe contener solo números", 'nic');
            isValid = false;
        }
        if (isValid) {
            handleLogin();
        }
    }

    const handleLogin = async () => {   
        setLoading(true);
        try {
            const response = await fetch(`http://52.67.106.144/api/usuarios/${inputs.nic}`);
            
            if (!response.ok) {
                throw new Error('Usuario no encontrado');
            }
            
            const userData = await response.json();
            
            // Guardar sesión usando el AuthContext
            await authLogin(userData);
            
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            Alert.alert(
                'Error',
                error.message || 'No se pudo iniciar sesión. Verifica tu NIC.',
                [{ text: 'OK' }]
            );
        } finally {
            setLoading(false);
        }
    }

    const handleOnChange = (text, input) => {
        setInputs(prevState => ({...prevState, [input]: text}));
    }

    const handleError = (errorMessage, input) => {
        setErrors(prevState => ({...prevState, [input]: errorMessage}));
    }

    return (
        <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
            <Loader visible={loading} message={"Iniciando sesion"}/>
            <View style={{ paddingTop: 70, paddingHorizontal: 20 }}>
                <Text style={{
                    color: COLORS.blue,
                    fontSize: 35,
                    fontWeight: '900',
                    marginHorizontal: 15,
                    marginTop: 95,
                    alignSelf: 'center'
                }}>
                    Power Stream
                </Text>
                <Text style={{ 
                    color: '#646464', 
                    fontSize: 14,
                    marginTop: 20,
                    marginHorizontal: 15,
                    alignSelf: 'baseline',
                    fontFamily: 'Onest',  
                }}>
                    Ingresa a la Aplicacion con el numero de contrato de tu factura de electricidad (NIC)
                </Text>
                <View style={{marginHorizontal: 15, marginVertical: 30}}>
                    <Input 
                        keyboardType="numeric"
                        placeholder="Escribe el Numero de contrato" 
                        label="NIC"
                        iconName="checkbook"  
                        onFocus={() => handleError(null, 'nic')}
                        onChangeText={(text) => handleOnChange(text, 'nic')}
                        error={errors.nic}
                        value={inputs.nic}
                    />
                    <Button title="Ingresar" onPress={validate}/>
                    <Text 
                       onPress={() => navigation.navigate('RegistrationScreen')} 
                        style={{
                            color: COLORS.black, 
                            alignSelf: 'center', 
                            fontSize: 12,
                            fontFamily: 'Onest',
                            fontWeight: '500', 
                            marginVertical: 10
                    }}>
                        No estas registrado? Registrate aquí
                    </Text>
                    <Text 
                        style={{
                            color: "#646464", 
                            alignSelf: 'center', 
                            fontSize: 12,
                            fontFamily: 'Onest',
                            fontWeight: '500', 
                            marginVertical: 140
                    }}>
                        By Jaider Hoyos
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default LoginScreen;