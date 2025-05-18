import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, RefreshControl, ScrollView, ActivityIndicator, Modal, Alert, Keyboard } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import COLORS from '../../conts/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// Importa el componente necesario
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

import { useFonts } from 'expo-font';
import Loader from '../components/Loader';

const HomeScreen = ({ navigation }) => {
  const { logout, userData } = useContext(AuthContext);
  const { setElectricalData } = useContext(AuthContext);
  const [loaded] = useFonts({
    'OnestSemiBold': require('../../../assets/fonts/OnestSemiBold.ttf'),
    'OnestBlack': require('../../../assets/fonts/OnestBlack.ttf'),
    'OnestBold': require('../../../assets/fonts/OnestBlack.ttf'),
  });
 const [dateIndex, setDateIndex] = useState(0); // índice para el slice en sortedDates
const [sortedDates, setSortedDates] = useState([]); // guardaremos todas las fechas ordenadas para control
const [dailyConsumption, setDailyConsumption] = useState({}); // para tener acceso a datos completos

  
  // Estados para el consumo
  const [totalConsumption, setTotalConsumption] = useState(0);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados para la planificación
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [inputs, setInputs] = useState({
    rate: '960',
    monthly_kwh: ''
  });
  const [errors, setErrors] = useState({});
  const [savingPlan, setSavingPlan] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);

  // Obtener la última planificación del usuario
  const fetchLatestUserPlan = async (nic) => {
    try {
      const response = await fetch('http://52.67.106.144/api/planificaciones/');
      if (!response.ok) throw new Error('Error al obtener planificaciones');
      
      const allPlans = await response.json();
      // Filtrar por usuario y ordenar por fecha (anio y mes) descendente
      const userPlans = allPlans
        .filter(plan => plan.usuario === nic.toString())
        .sort((a, b) => {
          if (a.anio !== b.anio) return b.anio - a.anio;
          return b.mes - a.mes;
        });
      
      return userPlans.length > 0 ? userPlans[0] : null;
    } catch (error) {
      console.error('Error fetching user plans:', error);
      return null;
    }
  };
  const consumptionPercentage = currentPlan 
  ? (totalConsumption / currentPlan.meta_mensual_kwh) * 100 
  : 0;

  const [chartData, setChartData] = useState([]);

const fetchData = async () => {
  try {
    setIsLoading(true);

    const consumptionResponse = await fetch('http://52.67.106.144/api/mediciones/');
    if (!consumptionResponse.ok) throw new Error(`Error al obtener consumo: ${consumptionResponse.status}`);

    const consumptionData = await consumptionResponse.json();

    const dailyData = {};
    const latestMeasurement = consumptionData[consumptionData.length - 1]; // o usar sort por fecha si necesario

if (latestMeasurement) {
  setElectricalData({
    voltaje: latestMeasurement.voltaje || 0,
    corriente: latestMeasurement.corriente || 0,
    potenciaActiva: latestMeasurement.potencia_activa || 0,
    consumo: latestMeasurement.consumo_energetico || 0,
    factorDePotencia: latestMeasurement.factor_de_potencia || 0
  });
}
    consumptionData.forEach(item => {
      const date = new Date(item.fecha).toISOString().split('T')[0];
      if (!dailyData[date]) dailyData[date] = 0;
      dailyData[date] += item.consumo_energetico || 0;
    });

    const dates = Object.keys(dailyData).sort((a, b) => new Date(b) - new Date(a)); // más recientes primero
    setSortedDates(dates);
    setDailyConsumption(dailyData);

    setDateIndex(0);

    updateChartData(dates, dailyData, 0);

    const sortedDates = Object.keys(dailyConsumption).sort((a, b) => new Date(b) - new Date(a));
    const latest7 = sortedDates.slice(0, 6).reverse(); // Últimos 7, en orden cronológico

    const labels = latest7.map(date => date.slice(5)); // mm-dd
    const values = latest7.map(date => parseFloat(dailyConsumption[date].toFixed(2)));

    setChartData({ labels, datasets: [{ data: values }] });
     console.log(sortedDates)

    // Total
    const allConsumption = Object.values(dailyConsumption).reduce((sum, value) => sum + value, 0);
    setTotalConsumption(allConsumption);

    const latestPlan = await fetchLatestUserPlan(userData.nic);
    if (latestPlan) {
      setCurrentPlan(latestPlan);
      setEstimatedCost(latestPlan.meta_mensual_kwh * latestPlan.tarifa_kwh);
      setInputs({
        rate: latestPlan.tarifa_kwh.toString(),
        monthly_kwh: latestPlan.meta_mensual_kwh.toString()
      });
    } else {
      setCurrentPlan(null);
      setEstimatedCost(0);
      setInputs({ rate: '', monthly_kwh: '' });
    }

    setError(null);
  } catch (err) {
    console.error('Error fetching data:', err);
    setError(err.message);
  } finally {
    setIsLoading(false);
    setRefreshing(false);
  }
};
const handlePrevious = () => {
  // Ir 6 días más atrás: aumenta index, pero no más allá del final del array
  if (dateIndex + 6 < sortedDates.length) {
    const newIndex = dateIndex + 6;
    setDateIndex(newIndex);
    updateChartData(sortedDates, dailyConsumption, newIndex);
  }
};

const handleNext = () => {
  // Ir 6 días hacia adelante (más recientes), mínimo 0
  if (dateIndex - 6 >= 0) {
    const newIndex = dateIndex - 6;
    setDateIndex(newIndex);
    updateChartData(sortedDates, dailyConsumption, newIndex);
  } else if (dateIndex > 0) {
    setDateIndex(0);
    updateChartData(sortedDates, dailyConsumption, 0);
  }
};


const updateChartData = (dates, dailyData, index) => {
  // Coger 6 días a partir del índice (ordenados cronológicamente)
  const sliceDates = dates.slice(index, index + 6).reverse(); // invertir para que queden del más antiguo al más reciente

  const labels = sliceDates.map(date => date.slice(5)); // mm-dd
  const values = sliceDates.map(date => parseFloat(dailyData[date].toFixed(2)));

  setChartData({ labels, datasets: [{ data: values }] });
};

  
  useEffect(() => {
    fetchData();
  }, []);

  // Manejar cambios en los inputs
  const handleOnChange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };

  const handleError = (errorMessage, input) => {
    setErrors(prevState => ({...prevState, [input]: errorMessage}));
  };

  // Validar formulario
  const validatePlan = () => {
    Keyboard.dismiss();
    let isValid = true;
    setErrors({});
    
    if(!inputs.rate || isNaN(inputs.rate) || parseFloat(inputs.rate) <= 0){
      handleError("Ingresa una tarifa válida", 'rate');
      isValid = false;
    }
    
    if(!inputs.monthly_kwh || isNaN(inputs.monthly_kwh) || parseFloat(inputs.monthly_kwh) <= 0){
      handleError("Ingresa un consumo mensual válido", 'monthly_kwh');
      isValid = false;
    }

    if (isValid) {
      saveEnergyPlan();
    }
  };

  // Función para guardar la planificación (solo POST)
  const saveEnergyPlan = async () => {
    try {
      setSavingPlan(true);
      
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const rateValue = parseFloat(inputs.rate);
      const monthlyKwh = parseFloat(inputs.monthly_kwh).toFixed(2);
      
      // Calcular metas semanales y diarias
      const weeklyKwh = parseFloat((monthlyKwh / 4).toFixed(2));
      const dailyKwh = parseFloat((monthlyKwh / 30).toFixed(2));
      
      // 1. Primero verificar si ya existe una planificación para este mes
      const existingPlans = await fetchUserPlansByMonth(userData.nic, currentYear, currentMonth);
      const existingPlan = existingPlans.length > 0 ? existingPlans[0] : null;
  
      let responseData;
      
      if (existingPlan) {
        // 2. Si existe, actualizamos la planificación existente (PUT)
        const updatedPlan = {
          ...existingPlan,
          tarifa_kwh: rateValue,
          meta_mensual_kwh: monthlyKwh,
          meta_semanal_kwh: weeklyKwh,
          meta_diaria_kwh: dailyKwh
        };
  
        const updateResponse = await fetch(`http://52.67.106.144/api/planificaciones/${existingPlan.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(updatedPlan)
        });
  
        if (!updateResponse.ok) {
          throw new Error('Error al actualizar la planificación existente');
        }
  
        responseData = await updateResponse.json();
      } else {
        // 3. Si no existe, creamos una nueva planificación (POST)
        const newPlan = {
          anio: currentYear,
          mes: currentMonth,
          tarifa_kwh: rateValue,
          meta_mensual_kwh: monthlyKwh,
          meta_semanal_kwh: weeklyKwh,
          meta_diaria_kwh: dailyKwh,
          usuario: userData.nic.toString()
        };
  
        const createResponse = await fetch('http://52.67.106.144/api/planificaciones/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(newPlan)
        });
  
        if (!createResponse.ok) {
          throw new Error('Error al crear nueva planificación');
        }
  
        responseData = await createResponse.json();
      }
  
      // Actualizar el estado con la planificación más reciente
      const latestPlan = await fetchLatestUserPlan(userData.nic);
      setCurrentPlan(latestPlan);
      setEstimatedCost(monthlyKwh * rateValue);
      setShowPlanModal(false);
      
      Alert.alert(
        'Éxito',
        existingPlan ? 'Planificación actualizada correctamente' : 'Planificación creada correctamente',
        [{ text: 'OK' }]
      );
      
    } catch (err) {
      console.error('Error saving plan:', err);
      Alert.alert(
        'Error',
        `No se pudo guardar la planificación: ${err.message}`,
        [{ text: 'OK' }]
      );
    } finally {
      setSavingPlan(false);
    }
  };
  
  // Nueva función auxiliar para buscar planificaciones por mes
  const fetchUserPlansByMonth = async (nic, year, month) => {
    try {
      const response = await fetch('http://52.67.106.144/api/planificaciones/');
      if (!response.ok) throw new Error('Error al obtener planificaciones');
      
      const allPlans = await response.json();
      return allPlans.filter(plan => 
        plan.usuario === nic.toString() && 
        plan.anio === year && 
        plan.mes === month
      );
    } catch (error) {
      console.error('Error fetching plans by month:', error);
      return [];
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const formatNumber = (num, decimals = 2) => {
    const number = parseFloat(num) || 0;
    return number.toLocaleString('es-ES', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  if (!loaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.blue} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{paddingTop: 50, backgroundColor: COLORS.white, flex: 1}}>
      <View style={styles.headerApp}>
        <Text style={{fontSize:15, fontFamily:'OnestSemiBold', alignSelf:'center', color:COLORS.black}}>
          Bienvenido, {userData?.nombre}!
        </Text>
        <Icon
          name="exit-to-app"
          style={{color: COLORS.dark, fontSize: 25}}
          onPress={logout}
        />
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.blue]}
          />
        }
      >
        <View style={{ marginVertical:20, paddingVertical:15, 
                     marginHorizontal:10, borderRadius:15, 
                     backgroundColor:"#ffffff", borderWidth:1, 
                     borderColor:COLORS.light}}>
          <Text style={{paddingHorizontal:18, fontSize:15, fontFamily:'OnestBold', color:COLORS.blue}}>
            Consumo energético mes actual
          </Text>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.blue} />
              <Text style={{marginTop: 10, fontFamily:'OnestSemiBold'}}>Cargando datos...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle" size={30} color={COLORS.red} />
              <Text style={styles.errorText}>Error al cargar los datos</Text>
              <Text style={styles.errorSubText}>{error}</Text>
              <Button
                title="Reintentar"
                onPress={fetchData}
                style={{marginTop: 10, paddingHorizontal: 20}}
              />
            </View>
          ) : (
            <>
              <View style={{flexDirection:'row', paddingHorizontal:10, paddingTop:15, justifyContent:'space-between'}}>
                <Card
                  title="Consumo actual"
                  comp={formatNumber(totalConsumption, 3)}
                  compUnit="KW"
                  price={formatNumber(totalConsumption * parseFloat(inputs.rate || 960))}
                  priceUnit="COP"
                  status={consumptionPercentage}
                  icon="lightning-bolt"
                />
                <Card
                  title="Consumo Planif."
                  comp={currentPlan ? formatNumber(currentPlan.meta_mensual_kwh, 3) : '0'}
                  compUnit="KW"
                  price={currentPlan ? formatNumber(currentPlan.meta_mensual_kwh * currentPlan.tarifa_kwh) : '0'}
                  priceUnit="COP"
                  icon="lightning-bolt"
                />
              </View>
              
              <View style={{paddingHorizontal: 10, marginTop: 0}}>
                <Button
                  title="Planificar consumo"
                  onPress={() => setShowPlanModal(true)}
                  style={{backgroundColor: COLORS.blue}}
                  textStyle={{color: COLORS.white, fontSize:14}}
                />
              </View>
            </>
          )}
        </View>
        
        <Text style={{paddingHorizontal:18, paddingTop:20, paddingBottom:15,fontSize:15, fontFamily:'OnestBold', color:COLORS.blue}}>
            Consumo energético mes actual (kWh)
          </Text>
          <View style={styles.chartContainer}>
  {chartData?.labels?.length > 0 ? (
    <BarChart
      data={chartData}
      width={Dimensions.get('window').width - 40}
      height={220}
      fromZero
      showValuesOnTopOfBars
      withInnerLines={false}
      flatColor={true}
        chartConfig={{
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 2,
    color: () => '#007AFF',
    labelColor: () => '#000000',
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      stroke: '#e3e3e3',
      strokeDasharray: '', // Líneas sólidas
    },
    barPercentage: 0.9, // Controla el ancho de las barras
  }}
      
      style={{
        borderRadius: 16,
        marginVertical: 10,
      }}
    />
  ) : (
    <Text style={{ textAlign: 'center', marginVertical: 10 }}>No hay datos suficientes para mostrar el gráfico.</Text>
  )}
</View>

 <View style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 35,
    paddingVertical: 0,
  }}>
      <Button
        title={"Anterior"}
        onPress={handlePrevious}
        width={'48%'}
        style={{ backgroundColor: COLORS.blue }}
        textStyle={{ color: COLORS.white }}
      />
      <Button
        title={"Siguiente"}
        width={'48%'}
        onPress={handleNext}
        style={{ backgroundColor: COLORS.blue }}
        textStyle={{ color: COLORS.white }}
      />
    </View>
      </ScrollView>
      

     
      <Modal
        visible={showPlanModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => !savingPlan && setShowPlanModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Planificar Consumo Mensual</Text>
            
            <Input 
              keyboardType="numeric"
              placeholder="Tarifa por kWh (COP)"
              label="Tarifa eléctrica"
              iconName="cash"
              value={inputs.rate}
              error={errors.rate}
              onChangeText={(text) => handleOnChange(text, 'rate')}
              onFocus={() => handleError(null, 'rate')}
            />
            
            <Input 
              keyboardType="numeric"
              placeholder="Consumo mensual (kWh)"
              label="Consumo Mensual"
              iconName="lightning-bolt"
              value={inputs.monthly_kwh}
              error={errors.monthly_kwh}
              onChangeText={(text) => handleOnChange(text, 'monthly_kwh')}
              onFocus={() => handleError(null, 'monthly_kwh')}
            />
            <Text style={{paddingVertical:5, fontFamily:'OnestSemiBold'}}>
                  Costo mensual estimado: {' '}
                  {inputs.rate && inputs.monthly_kwh
                    ? (parseFloat(inputs.rate) * parseFloat(inputs.monthly_kwh)).toFixed(2) + ' COP'
                    : 'N/A'}
                </Text>
           <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => !savingPlan && setShowPlanModal(false)}
                width={'50%'}
                disabled={savingPlan}
                style={{backgroundColor: COLORS.grey, flex: 1, marginRight: 10}}
                textStyle={{color: COLORS.dark}}
              />
              
              <Button
                title={savingPlan ? "Guardando..." : "Guardar"}
                onPress={validatePlan}
                width={'50%'}
                disabled={savingPlan}
                style={{backgroundColor: COLORS.blue, flex: 1}}
                textStyle={{color: COLORS.white}}
              />
               </View>
          </View>
        </View>
        <Loader visible={savingPlan}/>
        
      </Modal>

    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  headerApp: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  chartContainer: {
    marginHorizontal: 0,
    marginTop: 10,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorText: {
    color: COLORS.red,
    fontFamily: 'OnestBold',
    marginTop: 10
  },
  errorSubText: {
    color: COLORS.dark,
    fontFamily: 'OnestSemiBold',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'OnestBold',
    color: COLORS.blue,
    marginBottom: 20,
    textAlign: 'center'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0
  }
});

export default HomeScreen;