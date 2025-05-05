// components/Card.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../../conts/colors';

const Card = ({ title, comp, compUnit, price, priceUnit, icon, status }) => {
  // Determinar el color de fondo según el status
  const getBackgroundColor = () => {
    if (!status) return "#FBFBFB"; // Color por defecto si no hay status
    
    if (status >= 80) return COLORS.lightRed; // Rojo para >80%
    if (status >= 55) return COLORS.lightOrange; // Naranja para >55%
    return COLORS.lightGreen; // Verde para <55%
  };

  return (
    <View style={[styles.cardContainer, { backgroundColor: getBackgroundColor() }]}>
      <View style={styles.cardHeader}>
        <Icon name={icon} size={15} color={COLORS.dark} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardValue}>{comp}</Text>
        <Text style={styles.cardUnit}>{compUnit}</Text>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.cardPrice}>{price}</Text>
        <Text style={styles.cardPriceUnit}>{priceUnit}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.light,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'OnestSemiBold',
    color: COLORS.dark,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 18,
    fontFamily: 'OnestBold',
    color: COLORS.dark,
  },
  cardUnit: {
    marginLeft: 5,
    fontSize: 12,
    color: COLORS.black,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  cardPrice: {
    fontSize: 14,
    fontFamily: 'OnestSemiBold',
    color: COLORS.dark,
  },
  cardPriceUnit: {
    marginLeft:5,
    fontSize: 10,
    color: COLORS.black,
  },
});

export default Card;