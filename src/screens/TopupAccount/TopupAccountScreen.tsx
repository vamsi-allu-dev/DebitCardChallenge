import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {updateCardDetails} from '../../reducers/DebitCard/actionCreators';
import {colors} from '../../styles/globalStyles';
import {windowWidth, apiHost} from '../../constants';
import fetch from 'react-native-fetch-polyfill';

const TopupAccount = () => {
  const [text, setText] = useState('');
  const dispatch = useDispatch();

  const cardDetails = useSelector(state => {
    return state.cardDetails;
  });

  const updateLimit = () => {
    let limit = Number(text) + cardDetails.availableBalance;
    let updatedCardData = {
      cardNumber: cardDetails.cardNumber,
      cardOwnerName: cardDetails.cardOwnerName,
      cvv: cardDetails.cvv,
      startDate: cardDetails.startDate,
      amountSpent: cardDetails.amountSpent,
      availableBalance: cardDetails.availableBalance,
    };
    updatedCardData.availableBalance = limit;

    fetch(`http://${apiHost}:3000/cardDetails/1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCardData),
    })
      .then(results => results.json())
      .then(() => {
        dispatch(updateCardDetails(updatedCardData));
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.newLimit}
        placeholder="Enter new limit"
        onChangeText={newText => setText(newText)}
        value={text}
      />
      <TouchableOpacity onPress={updateLimit} style={styles.spendingLimitTouch}>
        <Text style={styles.spendingLimitText}>Top up available balance</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    left: 20,
    paddingBottom: 20,
    paddingTop: 10,
    width: windowWidth - 40,
  },
  section: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  heading: {
    fontSize: 13,
    color: 'black',
  },
  subHeading: {
    fontSize: 13,
  },
  spendingLimitTouch: {
    backgroundColor: colors.primary,
    width: windowWidth - 40,
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spendingLimitText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  newLimit: {
    width: windowWidth - 40,
    fontSize: 40,
    borderColor: colors.secondary,
    borderWidth: 1,
  },
});

export default TopupAccount;
