import React, { PureComponent } from 'react';
import { CustomBillForm, ListComponents, Image } from 'yes-comp-react-native-web';
import wode from '../res/wode.png';
import head from '../res/3.png';
import { StyleSheet, ScrollView, View, ImageBackground, TouchableOpacity, Text } from 'react-native';
import AwesomeFontIcon from 'react-native-vector-icons/FontAwesome';
import { History } from 'yes-web';
import ListText from 'yes-framework/controls/Yigo/Text/ListText';
import SplitText from 'yes-framework/controls/Yigo/Text/SplitText';
import LoginBG from '../res/login_bg.png';
import {getUserInfo } from 'yes-core';

const styles = StyleSheet.create({
    image: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 220,
    },
    personalCard: {
        justifyContent: 'center',
        height: 200,
        paddingLeft: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 20,
        paddingRight: 16,
    },
    cardImage: {

    },
    cardContent: {
        flexDirection: 'column',
        flex: 1,
    },
    funcionList: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    avatar: {
        width: 80,
        height: 80,
    },
    page: {
        flex: 1
    },
    text: {
        color: 'white',
    },
    textBig: {
        fontSize: 18,
    },
    textMiddle: {
        fontSize: 12,
    },
    textSmall: {
        fontSize: 8,
    },
    textName: {
        paddingTop: 20,
        paddingBottom: 20,
    },
    funcText: {
        color: 'rgba(51,51,51,1)',
        paddingLeft: 28,
        fontSize: 20,
    },
    funcContainer: {
        flexDirection: 'row',
        height: 68,
        alignItems: 'center',
    },
    icon: {
        paddingLeft: 28,
    },
    seperator: {
        height: 20,
        backgroundColor: '#F7F7F7',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});

const functionList = [
    {
        label: '??????',
        path: 'Setting',
        icon: 'cog',
    },
    {
        label: '????????????',
        component: '',
        icon: 'cog',
    },
    {
        seperator: true,
    },
    {
        label: '????????????',
        component: '',
        icon: 'cog',
    },
]

class MyFunction extends PureComponent {
    onPress = () => {
        const { path } = this.props;
        History.push(path);
    }
    render() {
        const { label, icon } = this.props;
        return (
            <TouchableOpacity onPress={this.onPress}>
                <View style={styles.funcContainer}>
                    <AwesomeFontIcon style={styles.icon} color="#246FB1" name={icon} size={20} />
                    <Text style={styles.funcText}>{label}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const Seperator = () =>
    <View style={styles.seperator}>

    </View>;
class MyInfo extends PureComponent {
    render() {
        return (
            <View style={styles.page}>
                <ImageBackground style={styles.image} source={wode} />
                {/* <CustomBillForm formKey="FSSC_PersonMsg" oid="-1" status="EDIT"> */}
                    <View style={styles.personalCard}>
                        <View style={styles.cardContent}>
                            <Text style={[styles.textBig, styles.text]}>welcome BokeERP</Text>
                            <Text style={[styles.textBig, styles.text, styles.textName]}>???????????????{getUserInfo().name} </Text>
                            {/* <ListText yigoid="Name" style={[styles.textBig, styles.text, styles.textName]} />
                            <View style={[styles.row, { alignItems: 'center'}]}>
                                <ListText yigoid="DeptID" style={[styles.text, styles.textMiddle]} />
                                <Text style={styles.text}> ??? </Text>
                                <SplitText showIndex={1} yigoid="TitleID" style={[styles.text, styles.textMiddle]} />
                            </View> */}
                        </View>
                        <View style={styles.avatar}>
                           <ImageBackground style={styles.avatar} source={head} />
                           {/*//?????????????????? <Image avatar  source={this.getAvatorUrl()} imageStyle={styles.avatar}/> */}
                        </View>
                    </View>
                {/* </CustomBillForm> */}
                <ScrollView style={styles.funcionList}>
                    {
                        functionList.map((item) => {
                            if (item.seperator) {
                                return <Seperator />
                            }
                            return <MyFunction {...item} />
                        })
                    }
                </ScrollView>
            </View>
        )
    }
}

export default MyInfo;
