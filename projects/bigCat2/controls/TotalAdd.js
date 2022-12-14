import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Modal } from 'antd-mobile';
import XiexinIcon from 'yes-framework/font';
import { openForm, openModal } from 'yes-framework/util/navigateUtil';

const styles = StyleSheet.create({
    entrycontainer: {

    },
    entrytitle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 8,
    },
    entrylist: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    entry: {
        flexDirection: 'row',
        width: '50%',
        paddingTop: 8,
        paddingBottom: 8,
    },
    titleIcon: {
        paddingRight: 8,
    },
    entryicon: {
        fontSize: 24
    }
});

class Entry extends PureComponent {
    onPress = () => {
        this.props.onPress(this.props);
    }
    render() {
        const { text, icon, iconColor } = this.props;
        return (
            <TouchableOpacity style={styles.entry} onPress={this.onPress}>
                <View style={{ flex: 1 }}>
                    {
                        icon ? <XiexinIcon style={styles.entryicon} color={iconColor} name={icon} /> : null
                    }
                    <Text>{text}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

class EntryList extends PureComponent {
    render() {
        const { title, entries, icon, iconColor } = this.props;
        return (
            <View>
                {title ?
                    <View style={styles.entrytitle}>
                        <XiexinIcon name={icon} color={iconColor} style={styles.titleIcon} />
                        <Text>{title}</Text>
                    </View> : null
                }
                <View style={styles.entrylist}>
                    {
                        entries.map((entry) => {
                            return <Entry onPress={this.props.onPress} {...entry} />;
                        })
                    }
                </View>
            </View>
        )
    }
}

const entryList = [
    {
        title: '????????????',
        icon: 'icon-wodebaoxiaodan',
        entries: [
            {
                text: '????????????1',
                formKey: 'MM_PurchaseOrderQuery',
                oid: "-1",
                status: 'EDIT',
                iconColor: '#008DF5',
                icon: 'icon-FSSC_HospitalityReimbursement',
            },
            {
                text: '????????????2',
                formKey: '',
                oid: "new",
                status: 'NEW',
                iconColor: '#008DF5',
                icon: 'icon-FSSC_TravelReimbursement',
            },
            {
                text: '????????????3',
                formKey: '',
                oid: "new",
                status: 'NEW',
                iconColor: '#008DF5',
                icon: 'icon-FSSC_SubsidyReimbursement',
            },
            {
                text: '????????????4',
                formKey: '',
                oid: "new",
                status: 'NEW',
                iconColor: '#008DF5',
                icon: 'icon-FSSC_GeneralReimbursement',
            }
        ]
    }, {
        title: '??????',
        icon: 'icon-more',
        entries: [
            {
                text: '??????1',
                formKey: '',
                oid: "new",
                icon: 'icon-chuchashenqingdan',
                status: 'NEW',
                iconColor: '#008DF5'
            },
            {
                text: '??????2',
                formKey: '',
                modal: true,
                oid: "-1",
                icon: 'icon-myaccount',
                iconColor: '#42A5F5',
                status: 'EDIT',
            },
            {
                text: '??????3',
                formKey: '',
                modal: true,
                oid: "-1",
                icon: 'icon-FSSC_LoanBill',
                iconColor: '#42A5F5',
                status: 'EDIT',
            },
            {
                text: '??????4',
                formKey: '',
                modal: true,
                oid: "-1",
                icon: 'icon-FSSC_RepaymentBill',
                iconColor: '#42A5F5',
                status: 'EDIT',
            }
        ]
    }, {
        title: '??????',
        icon: 'icon-more',
        entries: [
            {
                text: '??????1',
                formKey: '',
                oid: "new",
                icon: 'icon-chuchashenqingdan',
                status: 'NEW',
                iconColor: '#008DF5'
            },
            {
                text: '??????2',
                formKey: '',
                modal: true,
                oid: "-1",
                icon: 'icon-myaccount',
                iconColor: '#42A5F5',
                status: 'EDIT',
            },
            {
                text: '??????3',
                formKey: '',
                modal: true,
                oid: "-1",
                icon: 'icon-FSSC_LoanBill',
                iconColor: '#42A5F5',
                status: 'EDIT',
            },
            {
                text: '??????4',
                formKey: '',
                modal: true,
                oid: "-1",
                icon: 'icon-FSSC_RepaymentBill',
                iconColor: '#42A5F5',
                status: 'EDIT',
            }
        ]
    },
]

export default class TotalAdd extends PureComponent {
    onClose = () => {
        this.props.onClose();
    }
    onCancel = () => {
        this.props.onClose();
    }
    onPress = (entry) => {
        const { formKey, oid, status, modal } = entry;
        this.props.onClose();
        if (modal) {
            openModal(formKey, oid, status);
            return;
        }
        openForm(formKey, oid, status);
    }
    render() {
        return (
            <Modal
                visible
                popup={true}
                animationType={'slide-up'}
                transparent
                maskClosable={true}
                onClose={this.onClose}
                title="??????"
                footer={[{
                    text: '??????',
                    onPress: this.onCancel,
                }]}>
                <View>
                    {
                        entryList.map(entry => {
                            return <EntryList onPress={this.onPress} {...entry} />
                        })
                    }
                </View>
            </Modal>
        )
    }
}
