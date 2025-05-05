// src/views/screens/ProfileScreen.js
import React, { useContext, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Keyboard,
  Alert 
} from 'react-native';
import COLORS from '../../conts/colors';
import { AuthContext } from '../../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Loader from '../components/Loader';

const ProfileScreen = () => {
  const { userData, updateUser } = useContext(AuthContext);
  const [inputs, setInputs] = useState({
    name: '',
    phone: '',
    address: '',
    nic: '',
    socialstratum: ''
  });
  
  const [initialData, setInitialData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Inicializar datos cuando userData cambie
  useEffect(() => {
    if (userData) {
      const initialValues = {
        name: userData.nombre || '',
        phone: userData.telefono || '',
        address: userData.direccion || '',
        nic: userData.nic || '',
        socialstratum: userData.estrato?.toString() || ''
      };
      setInputs(initialValues);
      setInitialData(initialValues);
    }
  }, [userData]);

  // Verificar cambios en los inputs
  useEffect(() => {
    if (initialData.name !== undefined) {
      const changesDetected = (
        inputs.name !== initialData.name ||
        inputs.phone !== initialData.phone ||
        inputs.address !== initialData.address ||
        inputs.socialstratum !== initialData.socialstratum
      );
      setHasChanges(changesDetected);
    }
  }, [inputs, initialData]);

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
      if (!hasChanges) {
        Alert.alert(
          'Información',
          'No has realizado ningún cambio en tus datos',
          [{ text: 'OK' }]
        );
        return;
      }
      updateProfile();
    }
  };

  const updateProfile = async () => {   
    setLoading(true);
    
    const updatedData = {
      nic: inputs.nic,
      nombre: inputs.name,
      direccion: inputs.address,
      estrato: parseInt(inputs.socialstratum),
      telefono: inputs.phone,
    };

    try {
      const response = await fetch(`http://52.67.106.144/api/usuarios/${userData.nic}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      
      console.log('Response status:', response.status);
      
      const contentType = response.headers.get('content-type');
      let responseData;
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const textResponse = await response.text();
        console.log('Respuesta no JSON:', textResponse);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: El servidor respondió con formato inesperado`);
        }
        
        responseData = { success: true };
      }
      
      if (!response.ok) {
        const errorMessage = responseData.message || `Error ${response.status} al actualizar datos`;
        throw new Error(errorMessage);
      }
      
      // Actualizar el contexto con los nuevos datos
      updateUser({
        ...userData,
        ...updatedData
      });
      
      // Actualizar initialData para reflejar los nuevos cambios
      setInitialData(inputs);
      setHasChanges(false);
      
      Alert.alert(
        'Éxito', 
        'Tus datos se han actualizado correctamente',
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      console.error('Error completo al actualizar:', error);
      
      let errorMessage = error.message;
      
      if (error instanceof SyntaxError && error.message.includes('JSON Parse error')) {
        errorMessage = 'Error en el formato de respuesta del servidor';
      }
      
      Alert.alert(
        'Error',
        errorMessage || 'No se pudieron actualizar los datos. Verifica tu conexión e intenta nuevamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };

  const handleError = (errorMessage, input) => {
    setErrors(prevState => ({...prevState, [input]: errorMessage}));
  };

  return (
    <SafeAreaView style={{ paddingTop:50, backgroundColor: COLORS.white, flex: 1 }}>
      <Loader visible={loading}/>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Datos Personales</Text>
        <Text style={styles.subtitle}>
          Aquí puedes ver y actualizar tu información personal. 
          Recuerda guardar los cambios si modificas algún dato.
        </Text>
        <Input 
          placeholder="Nombre completo"
          label="Nombres y Apellidos"
          iconName="account-outline"
          value={inputs.name}
          error={errors.name}
          onChangeText={(text) => handleOnChange(text, 'name')}
          onFocus={() => handleError(null, 'name')}
        />
        
        <Input 
          keyboardType="numeric"
          placeholder="Número de celular"
          label="Celular"
          iconName="phone"
          value={inputs.phone}
          error={errors.phone}
          onChangeText={(text) => handleOnChange(text, 'phone')}
          onFocus={() => handleError(null, 'phone')}
        />
        
        <Input 
          placeholder="Dirección"
          label="Dirección"
          iconName="google-maps"
          value={inputs.address}
          error={errors.address}
          onChangeText={(text) => handleOnChange(text, 'address')}
          onFocus={() => handleError(null, 'address')}
        />
        
        <Input 
          keyboardType="numeric"
          placeholder="Número de contrato"
          label="NIC"
          iconName="checkbook"
          value={inputs.nic}
          error={errors.nic}
          onChangeText={(text) => handleOnChange(text, 'nic')}
          onFocus={() => handleError(null, 'nic')}
          editable={false}
        />
        
        <Input 
          keyboardType="numeric"
          placeholder="Estrato"
          label="Estrato de la casa"
          iconName="home-city"
          value={inputs.socialstratum}
          error={errors.socialstratum}
          onChangeText={(text) => handleOnChange(text, 'socialstratum')}
          onFocus={() => handleError(null, 'socialstratum')}
        />
        <Button 
          title="Actualizar datos" 
          onPress={validate}
        />
       
      </ScrollView>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontFamily: 'OnestBold', 
    fontSize:30,
    color:COLORS.blue,
    marginBottom: 10
  },
  subtitle: {
    fontFamily: 'OnestSemiBold',
    fontSize: 14,
    color: '#646464',
    marginBottom: 25,
    lineHeight: 20
  }
});

export default ProfileScreen;