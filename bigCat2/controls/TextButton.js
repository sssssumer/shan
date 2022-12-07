import React, { PureComponent } from 'react';
// import { Text } from 'yes-platform';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Modal } from 'antd-mobile';
import { internationalWrap, ControlWrap as controlWrap } from 'yes';

const styles = StyleSheet.create({
    placeholder: {
        color: 'rgba(0,0,0,0.5)',
    },
    text: {
        flex: 1,
        wordBreak: 'break-all',
    },
});
class TextButton extends PureComponent {
    static contextTypes = {
        onControlClick: PropTypes.func,
        getContextComponentState: PropTypes.func,
    }
    onPress = () => {
        // this.context.onControlClick(this.props.buttonId);
        const btnState = this.context.getContextComponentState(this.props.yigoid);
        const enable= btnState.getIn(["enable"]);
        if (!btnState ) {
            return;
        }
        if(btnState.get('visible') && btnState.get('enable')){
            GridDetailAddModel=true;
            GridDetailAddModelCount=GridDetailAddModelCount+1;
            this.context.onControlClick(this.props.yigoid);
        }
        // this.context.onControlClick(this.props.yigoid);
        // if (btnState.get('visible') && btnState.get('enable')) {
        //     const modal = Modal.alert(this.props.formatMessage('提示'),
        //     this.props.formatMessage('该字段暂时不支持手机上输入，请使用PC版本进行当前任务处理!'), [{
        //         text: this.props.formatMessage('OK'),
        //         onPress: () => modal.close(),
        //     }]);
        // }
    }
    render() {
        const { controlState, placeholder, displayValue } = this.props;
        const btnState = this.context.getContextComponentState(this.props.yigoid);
        let otherStyle = null;
        let dispValue = displayValue;
        if (controlState.get('visible') && controlState.get('enable') && !controlState.get('value')) {
            otherStyle = styles.placeholder;
            dispValue = placeholder;
        }
        return (<TouchableOpacity onPress={this.onPress} style={[this.props.layoutStyles, { flexDirection: 'row' }]}>
            <Text style={[styles.text, this.props.textStyles, otherStyle]}>{dispValue}</Text>
        </TouchableOpacity>);
    }
}
export default controlWrap(internationalWrap(TextButton));