import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Animated,
    Platform,
    StatusBar,
} from 'react-native';
import { SectionView } from '../../components/Sections';
import { Card } from '../../components/Card';
import homeIcon from '../../assets/homeIcon.jpeg';
import { useSelector } from 'react-redux';
import { colors } from '../../styles/globalStyles';
import fetch from 'react-native-fetch-polyfill';
import { windowHeight, windowWidth } from '../../constants';

const DebitCardScreen = (props: { navigation: any }) => {
    let activeStatus = 'active';

    const weeklySpendingLimit = useSelector(state => {
        return state.spendingLimit;
    });

    const apiHost = Platform.OS === 'ios' ? 'localhost' : '10.0.2.2';

    const switchSpendingLimit = () => {
        console.log('switchSpendingLimit');
    };

    const [cardDetails, setCardDetails] = useState({
        id: 1,
        cardNumber: '',
        cardOwnerName: '',
        cvv: '',
        startDate: '',
        amountSpent: '',
        availableBalance: '',
    });

    const switchFreezeCard = () => {
        console.log('switchFreezeCard');
    };

    const navigation = props.navigation;

    useEffect(() => {
        fetch(`http://${apiHost}:3000/cardDetails/1`, { method: 'GET' })
            .then(results => results.json())
            .then(data => {
                setCardDetails(data);
            });
    }, []);

    const sectiondata: [
        {
            key: string;
            heading: string;
            subHeading: string;
            iconName: any;
            iconType: string;
            isSwitchEnabled: boolean;
            onSwitchClick?: void;
        },
    ] = [
            {
                key: '0',
                heading: 'Top-up account',
                subHeading: 'Deposit money to your account to use with card',
                iconName: 'upload',
                iconType: 'antdesign',
                isSwitchEnabled: false,
            },
            {
                key: '1',
                heading: 'Weekly spending Limit',
                subHeading: `Your weekly spending limit is ${weeklySpendingLimit}`,
                iconName: 'dashboard',
                iconType: 'antdesign',
                isSwitchEnabled: true,
                onSwitchClick: switchSpendingLimit(),
            },
            {
                key: '2',
                heading: 'Freeze card',
                subHeading: `Your debit card is currently ${activeStatus}`,
                iconName: 'snowflake',
                iconType: 'fontisto',
                isSwitchEnabled: true,
                onSwitchClick: switchFreezeCard(),
            },
            {
                key: '3',
                heading: 'Get a new card',
                subHeading: 'This deactivates your current debit card',
                iconName: 'creditcard',
                iconType: 'antdesign',
                isSwitchEnabled: false,
            },
            {
                key: '4',
                heading: 'Deactivated Cards',
                subHeading: 'Your previously deactivated cards',
                iconName: 'prohibited',
                iconType: 'foundation',
                isSwitchEnabled: false,
            },
        ];

    return (
        <>
            <StatusBar backgroundColor={colors.secondary} barStyle="light-content" />
            <View style={styles.total}>
                <ScrollView stickyHeaderIndices={[0]}>
                    <View style={styles.box}>
                        <View
                            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.header}>Debit Card</Text>
                            <Image
                                source={homeIcon}
                                style={{ width: 40, height: 40, right: 40 }}
                            />
                        </View>
                        <View style={styles.balanceSection}>
                            <Text style={styles.subHeader}>Available Balance</Text>
                            <Text style={styles.header}>{cardDetails.availableBalance}</Text>
                        </View>
                    </View>
                    <View style={styles.cardPosition}>
                        <Card
                            number={cardDetails.cardNumber}
                            name={cardDetails.cardOwnerName}
                            cvv={cardDetails.cvv}
                            startDate={cardDetails.startDate}
                        />
                    </View>
                    <View style={styles.overlay}>
                        <View style={styles.textData}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    width: windowWidth - 40,
                                }}>
                                <Text style={styles.spendingLimit}>
                                    Debit Card Spending Limit
                                </Text>
                                <View
                                    style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <Text style={{ color: colors.primary }}>
                                        {cardDetails.amountSpent}
                                    </Text>
                                    <Text style={{ color: 'gray' }}> | $</Text>
                                    <Text style={{ color: 'gray' }}>{weeklySpendingLimit}</Text>
                                </View>
                            </View>
                            <View style={styles.progressBar}>
                                <Animated.View
                                    style={[
                                        StyleSheet.absoluteFill,
                                        {
                                            backgroundColor: colors.primary,
                                            borderRadius: 20,
                                            width: '40%',
                                            borderTopRightRadius: 0,
                                        },
                                    ]}
                                />
                            </View>
                        </View>
                        {sectiondata.map(item => {
                            if (item.isSwitchEnabled) {
                                return (
                                    <SectionView
                                        index={item.key}
                                        navigation={navigation}
                                        heading={item.heading}
                                        subHeading={item.subHeading}
                                        name={item.iconName}
                                        type={item.iconType}
                                        onSwitchClick={item.onSwitchClick}
                                        isSwitchEnabled
                                    />
                                );
                            } else {
                                return (
                                    <SectionView
                                        index={item.key}
                                        navigation={navigation}
                                        heading={item.heading}
                                        subHeading={item.subHeading}
                                        name={item.iconName}
                                        type={item.iconType}
                                    />
                                );
                            }
                        })}
                    </View>
                </ScrollView>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    total: {
        flex: 1,
        backgroundColor: colors.secondary,
    },
    box: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        left: 20,
        paddingTop: 40,
        paddingBottom: 70,
    },
    overlay: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        zIndex: 22,
    },
    textData: {
        marginTop: 170,
        left: 20,
    },
    header: {
        color: colors.white,
        fontSize: 22,
        fontWeight: '700',
    },
    subHeader: {
        color: colors.white,
        fontSize: 12,
    },
    balanceSection: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    cardPosition: {
        zIndex: 44,
        position: 'absolute',
        top: 130,
        left: 20,
        width: windowWidth - 40,
    },
    progressBar: {
        height: 14,
        flexDirection: 'row',
        width: windowWidth - 40,
        backgroundColor: '#E8FCE8',
        borderRadius: 20,
        marginTop: 10,
        marginBottom: 20,
    },
    spendingLimit: {
        fontSize: 13,
        color: 'black',
    },
});

export default DebitCardScreen;
