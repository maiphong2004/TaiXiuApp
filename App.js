import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
  FlatList,
  ScrollView,
} from 'react-native';
import { Provider as PaperProvider, Button, Card, Title, Paragraph } from 'react-native-paper';
// import LottieView from 'lottie-react-native'; // Xóa dòng này
import AsyncStorage from '@react-native-async-storage/async-storage';

import Dice from './components/Dice';
import ResultDisplay from './components/ResultDisplay';
import globalStyles from './styles/globalStyles'; // Import global styles

// Các styles riêng cho App.js
const appStyles = StyleSheet.create({
  bettingTabs: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#E0E0E0',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  bettingTabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  bettingTabButtonLast: {
    borderRightWidth: 0,
  },
  selectedTab: {
    backgroundColor: '#6200EE', // Màu tím Material Design
  },
  bettingTabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedTabText: {
    color: 'white',
  },
  bettingOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  bettingOptionButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ccc',
    margin: 5,
    minWidth: 100, // Đảm bảo nút đủ rộng
    alignItems: 'center',
  },
  selectedBettingOption: {
    backgroundColor: '#03DAC6', // Màu xanh lam Material Design
    borderColor: '#03DAC6',
  },
  bettingOptionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedBettingOptionText: {
    color: 'white',
  },
  betAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  betAmountInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: 120,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
  },
  adjustBetButton: {
    backgroundColor: '#BB86FC', // Màu tím nhạt Material Design
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    marginHorizontal: 5,
    elevation: 2,
  },
  adjustBetButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  balanceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50', // Màu xanh lá cây
    marginBottom: 15,
  },
  historyCard: {
    marginTop: 20,
    width: '95%',
    maxHeight: 220,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  historyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  historyItem: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderLeftWidth: 5,
  },
  winItem: {
    borderColor: '#28a745',
  },
  loseItem: {
    borderColor: '#dc3545',
  },
  neutralItem: {
    borderColor: '#6c757d',
  },
  historyText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 3,
  },
  historyOutcomeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestampText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  // confettiAnimation: { // Xóa style này
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   zIndex: 1000,
  //   pointerEvents: 'none',
  // },
});

export default function App() {
  const [diceValues, setDiceValues] = useState([1, 1, 1]);
  const [totalScore, setTotalScore] = useState(3);
  const [resultType, setResultType] = useState('');
  const [isRolling, setIsRolling] = useState(false);
  const [betAmount, setBetAmount] = useState('100'); // Lưu trữ là chuỗi
  const [balance, setBalance] = useState(5000); // Số dư ban đầu
  const [currentBet, setCurrentBet] = useState(null); // 'Tài', 'Xỉu', hoặc null
  const [specificBetValue, setSpecificBetValue] = useState(null); // Giá trị khi cược tổng điểm
  const [currentBetType, setCurrentBetType] = useState('TaiXiu'); // 'TaiXiu', 'SpecificTotal', 'Triple'
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('neutral'); // 'win', 'lose', 'neutral'

  // Ref cho Lottie // Xóa dòng này
  // const [showConfetti, setShowConfetti] = useState(false); // Xóa dòng này
  // const confettiRef = useRef(null); // Xóa dòng này

  const [gameHistory, setGameHistory] = useState([]);

  // --- Load/Save Game History ---
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem('gameHistory');
        if (storedHistory) {
          setGameHistory(JSON.parse(storedHistory));
        }
        const storedBalance = await AsyncStorage.getItem('playerBalance');
        if (storedBalance !== null) {
          setBalance(parseFloat(storedBalance));
        }
      } catch (error) {
        console.error('Error loading game history or balance:', error);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    const saveBalance = async () => {
      try {
        await AsyncStorage.setItem('playerBalance', balance.toString());
      } catch (error) {
        console.error('Error saving balance:', error);
      }
    };
    saveBalance();
  }, [balance]);

  // --- Game Logic ---
  const rollSingleDice = () => {
    return Math.floor(Math.random() * 6) + 1;
  };

  const analyzeResult = (dices) => {
    const total = dices[0] + dices[1] + dices[2];
    const isTriple = (dices[0] === dices[1] && dices[1] === dices[2]);

    let type = '';
    if (isTriple) {
      type = 'Bộ ba đồng nhất!'; // Đặc biệt: Nhà cái thắng trừ khi cược đúng Triple
    } else if (total >= 4 && total <= 10) {
      type = 'Xỉu';
    } else if (total >= 11 && total <= 17) {
      type = 'Tài';
    } else {
      type = 'Lỗi'; // Should not happen
    }

    return { type, total, isTriple, numbers: dices };
  };

  const getSpecificTotalPayout = (betValue) => {
    // Tỷ lệ trả thưởng cho cược tổng điểm cụ thể
    if (betValue === 4 || betValue === 17) return 50;
    if (betValue === 5 || betValue === 16) return 18;
    if (betValue === 6 || betValue === 15) return 14;
    if (betValue === 7 || betValue === 14) return 12;
    if (betValue === 8 || betValue === 13) return 8;
    if (betValue === 9 || betValue === 12) return 6;
    if (betValue === 10 || betValue === 11) return 6;
    return 1; // Trường hợp không xác định
  };

  const getTriplePayout = () =>
    30; // Tỷ lệ trả thưởng cho cược Bộ ba đồng nhất bất kỳ

  const getSpecificTriplePayout = () =>
    180; // Tỷ lệ trả thưởng cho cược Bộ ba đồng nhất cụ thể (ví dụ 1-1-1)

  const handleRollDice = () => {
    if (isRolling) return;

    const parsedBetAmount = parseInt(betAmount || '0');

    // Validation tiền cược
    if (isNaN(parsedBetAmount) || parsedBetAmount <= 0) {
      Alert.alert('Lỗi cược', 'Số tiền cược phải là một số dương!');
      return;
    }
    if (parsedBetAmount > balance) {
      Alert.alert('Không đủ tiền', 'Bạn không đủ tiền để đặt cược. Vui lòng nạp thêm!');
      return;
    }

    // Validation loại cược
    if (currentBetType === 'TaiXiu' && currentBet === null) {
      Alert.alert('Chưa đặt cược', 'Vui lòng chọn Tài hoặc Xỉu để đặt cược!');
      return;
    }
    if (currentBetType === 'SpecificTotal' && specificBetValue === null) {
      Alert.alert('Chưa đặt cược', 'Vui lòng chọn tổng điểm để đặt cược!');
      return;
    }
    if (currentBetType === 'Triple' && specificBetValue === null && currentBet !== 'AnyTriple') {
      Alert.alert('Chưa đặt cược', 'Vui lòng chọn loại Bộ ba đồng nhất để đặt cược!');
      return;
    }

    setIsRolling(true);
    setMessage('');
    setMessageType('neutral');
    setTotalScore(0);
    setResultType('');

    // const rollDuration = 1500; // Xóa dòng này
    // let rollInterval; // Xóa dòng này
    // let rollCount = 0; // Xóa dòng này
    // const maxRollCount = 10; // Xóa dòng này

    // Xóa khối setInterval này
    // rollInterval = setInterval(() => {
    //   const tempDice1 = rollSingleDice();
    //   const tempDice2 = rollSingleDice();
    //   const tempDice3 = rollSingleDice();
    //   setDiceValues([tempDice1, tempDice2, tempDice3]);
    //   rollCount++;
    //   if (rollCount >= maxRollCount) {
    //     clearInterval(rollInterval);
    //   }
    // }, 100);

    setTimeout(() => {
      // clearInterval(rollInterval); // Xóa dòng này
      const newDiceValues = [rollSingleDice(), rollSingleDice(), rollSingleDice()];
      setDiceValues(newDiceValues);
      const { type, total, isTriple, numbers } = analyzeResult(newDiceValues);
      setTotalScore(total);
      setResultType(type);
      setIsRolling(false);
      handleBetResult(type, total, isTriple, numbers, parsedBetAmount);
      // Reset cược sau mỗi ván
      setCurrentBet(null);
      setSpecificBetValue(null);
    }, 500); // Giảm thời gian chờ để hiển thị kết quả nhanh hơn
  };

  const handleBetResult = async (actualResultType, actualTotal, actualIsTriple, actualNumbers, usedBetAmount) => {
    let newBalance = balance;
    let winMessage = '';
    let isWin = false;
    let payoutMultiplier = 1; // Tỉ lệ trả thưởng
    let balanceChange = -usedBetAmount; // Mặc định là thua

    if (currentBetType === 'TaiXiu') {
      if (actualIsTriple) {
        // Bộ ba đồng nhất, nhà cái thắng với cược Tài/Xỉu
        winMessage = `Bạn thua! Kết quả là ${actualResultType} (${actualTotal} điểm). Bộ ba đồng nhất, nhà cái thắng.`;
      } else if (currentBet === actualResultType) {
        isWin = true;
        balanceChange = usedBetAmount * payoutMultiplier;
        winMessage = `Bạn thắng! Kết quả là ${actualResultType} (${actualTotal} điểm).`;
      } else {
        winMessage = `Bạn thua! Kết quả là ${actualResultType} (${actualTotal} điểm).`;
      }
    } else if (currentBetType === 'SpecificTotal') {
      if (actualIsTriple) {
        // Bộ ba đồng nhất, nhà cái thắng với cược tổng điểm
        winMessage = `Bạn thua! Kết quả là ${actualResultType} (${actualTotal} điểm). Bộ ba đồng nhất, nhà cái thắng.`;
      } else if (specificBetValue === actualTotal) {
        isWin = true;
        payoutMultiplier = getSpecificTotalPayout(specificBetValue);
        balanceChange = usedBetAmount * payoutMultiplier;
        winMessage = `Bạn thắng! Kết quả là ${actualTotal} điểm. (x${payoutMultiplier} tiền cược)`;
      } else {
        winMessage = `Bạn thua! Kết quả là ${actualTotal} điểm.`;
      }
    } else if (currentBetType === 'Triple') {
      if (currentBet === 'AnyTriple') { // Cược bất kỳ Bộ ba đồng nhất
        if (actualIsTriple) {
          isWin = true;
          payoutMultiplier = getTriplePayout();
          balanceChange = usedBetAmount * payoutMultiplier;
          winMessage = `Bạn thắng! Kết quả là ${actualResultType}. (x${payoutMultiplier} tiền cược)`;
        } else {
          winMessage = `Bạn thua! Kết quả không phải Bộ ba đồng nhất.`;
        }
      } else { // Cược Bộ ba đồng nhất cụ thể (ví dụ 1-1-1)
        const targetTriple = specificBetValue; // specificBetValue lúc này là số (ví dụ 1 cho 1-1-1)
        if (actualIsTriple && actualNumbers[0] === targetTriple) {
          isWin = true;
          payoutMultiplier = getSpecificTriplePayout();
          balanceChange = usedBetAmount * payoutMultiplier;
          winMessage = `Bạn thắng! Kết quả là ${targetTriple}-${targetTriple}-${targetTriple}. (x${payoutMultiplier} tiền cược)`;
        } else {
          winMessage = `Bạn thua! Kết quả không phải ${targetTriple}-${targetTriple}-${targetTriple}.`;
        }
      }
    }

    if (isWin) {
      newBalance += balanceChange;
      // setShowConfetti(true); // Xóa dòng này
      // confettiRef.current?.play(); // Xóa dòng này
      // setTimeout(() => setShowConfetti(false), 3000); // Xóa dòng này
      setMessageType('win');
    } else {
      newBalance += balanceChange; // balanceChange đã là số âm
      setMessageType('lose');
    }

    setBalance(newBalance);
    setMessage(winMessage);

    const newEntry = {
      id: Date.now().toString(),
      dice: actualNumbers,
      total: actualTotal,
      result: actualResultType,
      betType: currentBetType,
      betValue: currentBetType === 'TaiXiu' ? currentBet : specificBetValue,
      outcome: isWin ? 'Thắng' : 'Thua',
      balanceChange: balanceChange,
      balanceAfter: newBalance,
      timestamp: new Date().toLocaleString(),
    };

    const updatedHistory = [newEntry, ...gameHistory].slice(0, 15); // Giới hạn 15 ván gần nhất
    setGameHistory(updatedHistory);

    try {
      await AsyncStorage.setItem('gameHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving game history:', error);
    }
  };

  // --- Render UI ---
  return (
    <PaperProvider>
      <SafeAreaView style={globalStyles.container}>
        {/* Xóa khối này */}
        {/* {showConfetti && (
          <LottieView
            ref={confettiRef}
            source={require('./assets/animations/confetti.json')}
            autoPlay={false}
            loop={false}
            style={appStyles.confettiAnimation}
          />
        )} */}

        <Text style={globalStyles.title}>TÀI XỈU</Text>

        <Text style={appStyles.balanceText}>Số dư: ${balance.toLocaleString()}</Text>

        <View style={globalStyles.diceContainer}>
          <Dice value={diceValues[0]} rolling={isRolling} />
          <Dice value={diceValues[1]} rolling={isRolling} />
          <Dice value={diceValues[2]} rolling={isRolling} />
        </View>

        {!isRolling && totalScore > 0 && (
          <ResultDisplay total={totalScore} type={resultType} />
        )}

        {message ? (
          <Text
            style={[
              globalStyles.messageText,
              messageType === 'win' && globalStyles.winMessage,
              messageType === 'lose' && globalStyles.loseMessage,
              messageType === 'neutral' && globalStyles.neutralMessage,
            ]}
          >
            {message}
          </Text>
        ) : null}

        {/* Betting Tabs */}
        <View style={appStyles.bettingTabs}>
          <TouchableOpacity
            style={[appStyles.bettingTabButton, currentBetType === 'TaiXiu' && appStyles.selectedTab]}
            onPress={() => { setCurrentBetType('TaiXiu'); setCurrentBet(null); setSpecificBetValue(null); }}
          >
            <Text style={[appStyles.bettingTabText, currentBetType === 'TaiXiu' && appStyles.selectedTabText]}>Tài/Xỉu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[appStyles.bettingTabButton, currentBetType === 'SpecificTotal' && appStyles.selectedTab]}
            onPress={() => { setCurrentBetType('SpecificTotal'); setCurrentBet(null); setSpecificBetValue(null); }}
          >
            <Text style={[appStyles.bettingTabText, currentBetType === 'SpecificTotal' && appStyles.selectedTabText]}>Tổng điểm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[appStyles.bettingTabButton, appStyles.bettingTabButtonLast, currentBetType === 'Triple' && appStyles.selectedTab]}
            onPress={() => { setCurrentBetType('Triple'); setCurrentBet(null); setSpecificBetValue(null); }}
          >
            <Text style={[appStyles.bettingTabText, currentBetType === 'Triple' && appStyles.selectedTabText]}>Bộ ba</Text>
          </TouchableOpacity>
        </View>

        {/* Betting Options based on Tab */}
        {currentBetType === 'TaiXiu' && (
          <View style={appStyles.bettingOptionsContainer}>
            <TouchableOpacity
              style={[
                appStyles.bettingOptionButton,
                currentBet === 'Tài' && appStyles.selectedBettingOption,
              ]}
              onPress={() => setCurrentBet('Tài')}
            >
              <Text
                style={[
                  appStyles.bettingOptionText,
                  currentBet === 'Tài' && appStyles.selectedBettingOptionText,
                ]}
              >
                Tài
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                appStyles.bettingOptionButton,
                currentBet === 'Xỉu' && appStyles.selectedBettingOption,
              ]}
              onPress={() => setCurrentBet('Xỉu')}
            >
              <Text
                style={[
                  appStyles.bettingOptionText,
                  currentBet === 'Xỉu' && appStyles.selectedBettingOptionText,
                ]}
              >
                Xỉu
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {currentBetType === 'SpecificTotal' && (
          <View style={appStyles.bettingOptionsContainer}>
            {[4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(num => (
              <TouchableOpacity
                key={num}
                style={[
                  appStyles.bettingOptionButton,
                  specificBetValue === num && appStyles.selectedBettingOption,
                ]}
                onPress={() => setSpecificBetValue(num)}
              >
                <Text style={[appStyles.bettingOptionText, specificBetValue === num && appStyles.selectedBettingOptionText]}>
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {currentBetType === 'Triple' && (
          <View style={appStyles.bettingOptionsContainer}>
            <TouchableOpacity
              style={[
                appStyles.bettingOptionButton,
                currentBet === 'AnyTriple' && appStyles.selectedBettingOption,
              ]}
              onPress={() => { setCurrentBet('AnyTriple'); setSpecificBetValue(null); }}
            >
              <Text style={[appStyles.bettingOptionText, currentBet === 'AnyTriple' && appStyles.selectedBettingOptionText]}>
                Bộ ba bất kỳ
              </Text>
            </TouchableOpacity>
            {[1, 2, 3, 4, 5, 6].map(num => (
              <TouchableOpacity
                key={num}
                style={[
                  appStyles.bettingOptionButton,
                  specificBetValue === num && appStyles.selectedBettingOption,
                ]}
                onPress={() => { setCurrentBet(null); setSpecificBetValue(num); }}
              >
                <Text style={[appStyles.bettingOptionText, specificBetValue === num && appStyles.selectedBettingOptionText]}>
                  {num}-{num}-{num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Bet Amount Input */}
        <View style={appStyles.betAmountContainer}>
          <Text style={appStyles.bettingOptionText}>Đặt cược:</Text>
          <TextInput
            style={appStyles.betAmountInput}
            keyboardType="numeric"
            value={betAmount}
            onChangeText={text => setBetAmount(text.replace(/[^0-9]/g, ''))} // Chỉ cho phép số
            placeholder="Số tiền"
          />
          <TouchableOpacity onPress={() => setBetAmount(prev => String(parseInt(prev || '0') + 50))}>
            <Text style={appStyles.adjustBetButton}>
              <Text style={appStyles.adjustBetButtonText}>+50</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setBetAmount(prev => String(Math.max(0, parseInt(prev || '0') - 50)))}>
            <Text style={appStyles.adjustBetButton}>
              <Text style={appStyles.adjustBetButtonText}>-50</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          mode="contained"
          onPress={handleRollDice}
          disabled={isRolling}
          style={globalStyles.rollButton}
          labelStyle={globalStyles.rollButtonText}
        >
          {isRolling ? 'Đang xóc...' : 'XÓC'}
        </Button>

        {/* Game History */}
        <Card style={appStyles.historyCard}>
          <Card.Content>
            <Title style={appStyles.historyTitle}>Lịch sử các ván:</Title>
            <FlatList
              data={gameHistory}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
                  style={[
                    appStyles.historyItem,
                    item.outcome === 'Thắng' && appStyles.winItem,
                    item.outcome === 'Thua' && appStyles.loseItem,
                    item.outcome === 'Nhà cái thắng' && appStyles.neutralItem,
                  ]}
                >
                  <Text style={appStyles.historyText}>Xúc xắc: {item.dice.join('-')} | Tổng: {item.total} | {item.result}</Text>
                  <Text style={appStyles.historyText}>
                    Cược: {item.betType === 'TaiXiu' ? item.betValue : (item.betType === 'SpecificTotal' ? `Tổng ${item.betValue}` : `Bộ ba ${item.betValue === 'AnyTriple' ? 'bất kỳ' : `${item.betValue}-${item.betValue}-${item.betValue}`}`)}
                  </Text>
                  <Text style={[appStyles.historyOutcomeText, item.outcome === 'Thắng' ? appStyles.winText : appStyles.loseText]}>
                    {item.balanceChange > 0 ? `+${item.balanceChange.toLocaleString()}` : `-${Math.abs(item.balanceChange).toLocaleString()}`}
                  </Text>
                  <Text style={appStyles.historyText}>Số dư: ${item.balanceAfter.toLocaleString()}</Text>
                  <Text style={appStyles.timestampText}>{item.timestamp}</Text>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          </Card.Content>
        </Card>
      </SafeAreaView>
    </PaperProvider>
  );
}