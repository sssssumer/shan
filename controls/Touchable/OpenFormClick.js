import React, { PureComponent } from 'react';
import { openForm, openModal } from 'yes-framework/util/navigateUtil';
import { ActionSheet } from 'antd-mobile';
import { BackHandler } from 'yes-intf';
import { History } from 'yes-web';
import PropTypes from 'prop-types';

export default class OpenFormClick extends PureComponent {
    static contextTypes = {
        createElement: PropTypes.func,
    }
    static defaultProps = {
        status: 'EDIT',
        modal: false,
        multiple: false,
    }
    openForm = () => {
        this._openForm(this.props);
    }
    _openForm = (item) => {
        const { formKey, oid, status, modal } = item;
        if (modal) {
            openModal(formKey, oid, status);
            return;
        }
        openForm(formKey, oid, status);
    }
    onPress = ()=> {
        const { multiple } = this.props;
        if(!multiple) {
            this.openForm();
            return;
        }
        this.onActionClick();
    }
    onButtonClick = (index) => {
        const { items } = this.props;
        const item = items[index];
        this.backHandler();
        if (item) {
            this._openForm(item);
        }
    }
    onActionClick = () => {
        const { items } = this.props;
        const itms = items.map(item => item.text);
        itms.push('取消');
        ActionSheet.showActionSheetWithOptions({
            options: itms,
            cancelButtonIndex: itms.length - 1,
            message: null,
            maskClosable: true,
        }, this.onButtonClick);
        History.push(`#ActionSheet`, false);
        this.backHandler = BackHandler.addPreEventListener(() => {
            ActionSheet.close();
            this.backHandler();
            return false;
        });
        return;
    }
    render() {
        // const { style, multiple } = this.props;
        // if (!multiple) {
        //     return (
        //         <ActionButton onPress={this.openForm} style={style} />
        //     )
        // }
        // return (
        //     <ActionButton onPress={this.onActionClick} style={style} />
        // )
        const { element, children } = this.props;
        const child = this.context.createElement(element || children);
        return React.cloneElement(child, {
            onPress: this.onPress,
        });
    }
}
