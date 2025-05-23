import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#F7F7F7', // Nền sáng hơn
          alignItems: 'center',
          justifyContent: 'flex-start', // Bắt đầu từ trên xuống
          paddingTop: 60,
     },
     title: {
          fontSize: 40,
          fontWeight: 'bold',
          marginBottom: 30,
          color: '#333',
          textShadowColor: 'rgba(0, 0, 0, 0.1)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 2,
     },
     diceContainer: {
          flexDirection: 'row',
          marginBottom: 30,
     },
     rollButton: {
          backgroundColor: '#6200EE', // Màu tím Material Design
          paddingVertical: 15,
          paddingHorizontal: 50,
          borderRadius: 35,
          marginTop: 30,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
     },
     rollButtonText: {
          color: 'white',
          fontSize: 24,
          fontWeight: 'bold',
          textTransform: 'uppercase',
     },
     messageText: {
          fontSize: 20,
          marginTop: 15,
          fontWeight: 'bold',
          textAlign: 'center',
          paddingHorizontal: 20,
     },
     winMessage: {
          color: '#28a745', // Màu xanh lá cây đậm
     },
     loseMessage: {
          color: '#dc3545', // Màu đỏ đậm
     },
     neutralMessage: {
          color: '#6c757d', // Màu xám
     }
});

export default globalStyles;