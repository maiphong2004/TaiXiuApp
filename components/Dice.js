import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const diceImages = {
     1: require('../assets/dice1.png'),
     2: require('../assets/dice2.png'),
     3: require('../assets/dice3.png'),
     4: require('../assets/dice4.png'),
     5: require('../assets/dice5.png'),
     6: require('../assets/dice6.png'),
};

const Dice = ({ value }) => { // Loại bỏ prop 'rolling'
     // Xóa khối if (rolling) này
     // if (rolling) {
     //      return (
     //           <View style={styles.diceContainer}>
     //                <Image source={require('../assets/dice_roll.gif')} style={styles.diceImage} />
     //           </View>
     //      );
     // }
     return (
          <View style={styles.diceContainer}>
               <Image source={diceImages[value]} style={styles.diceImage} />
          </View>
     );
};

const styles = StyleSheet.create({
     diceContainer: {
          width: 90, // Điều chỉnh kích thước xúc xắc và vùng chứa
          height: 90,
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 5,
          backgroundColor: '#fff',
          borderRadius: 15,
          elevation: 5, // Đổ bóng cho Android
          shadowColor: '#000', // Đổ bóng cho iOS
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
     },
     diceImage: {
          width: 70, // Kích thước ảnh xúc xắc bên trong
          height: 70,
          resizeMode: 'contain',
     },
});

export default Dice;