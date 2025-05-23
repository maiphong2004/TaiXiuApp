import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ResultDisplay = ({ total, type }) => {
     return (
          <View style={styles.container}>
               <Text style={styles.totalText}>Tổng điểm: {total}</Text>
               <Text style={[styles.typeText, type === 'Tài' ? styles.taiColor : styles.xiuColor, type === 'Bộ ba đồng nhất!' && styles.tripleColor]}>
                    Kết quả: {type}
               </Text>
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          marginTop: 20,
          alignItems: 'center',
          backgroundColor: '#fff',
          paddingVertical: 15,
          paddingHorizontal: 30,
          borderRadius: 15,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
     },
     totalText: {
          fontSize: 26,
          fontWeight: 'bold',
          marginBottom: 8,
          color: '#333',
     },
     typeText: {
          fontSize: 32,
          fontWeight: 'bold',
          paddingHorizontal: 25,
          paddingVertical: 12,
          borderRadius: 10,
          color: 'white',
          textTransform: 'uppercase',
     },
     taiColor: {
          backgroundColor: '#4CAF50', // Màu xanh cho Tài
     },
     xiuColor: {
          backgroundColor: '#F44336', // Màu đỏ cho Xỉu
     },
     tripleColor: {
          backgroundColor: '#FFC107', // Màu vàng cho Bộ ba đồng nhất
          color: '#333',
     }
});

export default ResultDisplay;