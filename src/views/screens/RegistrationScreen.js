import React from "react";
import { SafeAreaView, ScrollView, View, Keyboard, Text } from "react-native";
import COLORS from '../../conts/colors';
import Input from "../components/Input";
import Button from "../components/Button";
import Loader from "../components/Loader";
import AdBox from "../components/AdBox";
import { useFonts } from 'expo-font';

const RegistrationScreen = ({ navigation }) => {
    const [loaded] = useFonts({
        'BoogalooRegular': require('../../../assets/fonts/BoogalooRegular.ttf'),
        'Onest': require('../../../assets/fonts/Onest.ttf'),
    });

    const [inputs, setInputs] = React.useState({
        name: '',
        phone: '',
        address: '',
        nic: '', 
        socialstratum: '' 
    });

    const [errors, setErrors] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [showSuccessModal, setShowSuccessModal] = React.useState(false);

    const validate = () => {
        Keyboard.dismiss();
        let isValid = true;
        
        if(!inputs.name){
            handleError("Por favor ingresa tu nombre y apellido", 'name');
            isValid = false;
        }
        if(!inputs.phone){
            handleError("Por favor ingresa tu numero de celular", 'phone');
            isValid = false;
        }
        if(!inputs.address){
            handleError("Por favor ingresa tu direccion", 'address');
            isValid = false;
        }
        if(!inputs.nic){
            handleError("Por favor ingresa tu NIC", 'nic');
            isValid = false;
        }
        if(!inputs.socialstratum){
            handleError("Por favor ingresa el estrato de tu casa", 'socialstratum');
            isValid = false;
        }

        if (isValid) {
            register();
        }
    };

    const register = () => {   
        setLoading(true);
        
        const userData = {
            nic: inputs.nic,
            nombre: inputs.name,
            direccion: inputs.address,
            estrato: parseInt(inputs.socialstratum),
            telefono: inputs.phone,
        };
    
        fetch('http://52.67.106.144/api/usuarios/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then(response => {
            setLoading(false);
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            setShowSuccessModal(true); // Mostrar modal de éxito
            resetForm();
        })
        .catch(error => {
            setLoading(false);
            alert('Error al registrar: ' + error.message);
        });
    };

    const resetForm = () => {
        setInputs({
            name: '',
            phone: '',
            address: '',
            nic: '', 
            socialstratum: '' 
        });
        setErrors({});
    };

    const handleOnChange = (text, input) => {
        setInputs(prevState => ({...prevState, [input]: text}));
    };

    const handleError = (errorMessage, input) => {
        setErrors(prevState => ({...prevState, [input]: errorMessage}));
    };

    const handleModalContinue = () => {
        setShowSuccessModal(false);
        navigation.navigate('LoginScreen');
    };

    return (
        <SafeAreaView style={{ paddingVertical:30, backgroundColor: COLORS.white, flex: 1 }}>
            <Loader visible={loading}/>
            
            {/* Modal de éxito */}
            <AdBox 
                visible={showSuccessModal}
                iconName="account-check-outline"
                buttonMessage="Continuar"
                message="Registro Exitoso!"
                onPress={handleModalContinue}
            />
            
            <ScrollView contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 20 }}>
                <Text style={{ 
                    color: COLORS.blue, 
                    fontSize: 35, 
                    fontWeight:'900', 
                    marginHorizontal:15, 
                    alignSelf:'flex-start',
                }}>Power Stream</Text>
               
                <Text style={{ 
                    color: '#646464', 
                    fontSize: 14,
                    marginVertical:10,
                    marginHorizontal:15,
                    alignSelf: 'baseline',
                    fontFamily:'Onest',  
                }}>Registrate en la Aplicacion ingresando los siguientes campos:
                </Text>
                
                <View style={{marginVertical: 10, marginHorizontal:15}}>
                    <Input 
                        placeholder="Escribe tu primer nombre y apellido"
                        label="Nombres y Apellidos"
                        iconName="account-outline"
                        error={errors.name}
                        onFocus={() => handleError(null, 'name')}
                        onChangeText={(text) => handleOnChange(text, 'name')} 
                        value={inputs.name}
                    />
                    
                    <Input 
                        keyboardType="numeric"
                        placeholder="Escribe tu Numero de Celular"
                        label="Celular"
                        iconName="phone"
                        error={errors.phone}
                        onFocus={() => handleError(null, 'phone')}
                        onChangeText={(text) => handleOnChange(text, 'phone')}
                        value={inputs.phone}
                    />
                    
                    <Input 
                        placeholder="Escribe tu direccion" 
                        label="Direccion"
                        iconName="google-maps"
                        onFocus={() => handleError(null, 'address')}
                        onChangeText={(text) => handleOnChange(text, 'address')}
                        error={errors.address}
                        value={inputs.address}
                    />
                    
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
                    
                    <Input 
                        keyboardType="numeric"
                        placeholder="Escribe el estrato de la casa" 
                        label="Estrato de la casa"
                        iconName="home-city"
                        onFocus={() => handleError(null, 'socialstratum')}
                        onChangeText={(text) => handleOnChange(text, 'socialstratum')}
                        error={errors.socialstratum}
                        value={inputs.socialstratum}
                    />
                    
                    <Button title="Registrar" onPress={validate}/>
                    
                    <Text 
                        onPress={() => navigation.navigate('LoginScreen')} 
                        style={{
                            color: COLORS.black, 
                            alignSelf: 'center', 
                            fontSize: 12,
                            fontFamily: 'Onest',
                            fontWeight: '500', 
                            marginVertical: 10
                        }}>
                        ¿Ya estás registrado? Inicia Sesión
                    </Text>
                </View> 
            </ScrollView>
        </SafeAreaView>
    );
};

export default RegistrationScreen;