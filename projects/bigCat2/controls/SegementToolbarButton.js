import React, { PureComponent } from 'react';
import { YIUI } from 'yes-core';
import { OperationWrap as operationWrap, Util, BackHandler, AppDispatcher } from 'yes';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { ActionSheet } from 'antd-mobile';
import { History } from 'yes-platform';
import internationalWrap from './InternationalWrap';
import Immutable from 'immutable';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 48,
        backgroundColor: '#2196f3',
    },
    item: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#FFF',
        fontSize: 16,
    },
    seperator: {
        width: 1,
        borderColor: '#DCDCDC',
        borderWidth: 1,
        borderStyle: 'solid',
        marginTop: 10,
        marginBottom: 10,
    },
});
class SegementToolbarButton extends PureComponent {
    static contextTypes = {
        getBillForm: PropTypes.func
    }
    getItems(props) {
        // return props.controlState.get('items');
        const { operations = [], controlState, isSort = false } = props;
        const opts = controlState.get('items') || [];
        if (operations.length == 0 || opts.length == 0) {
            return [];
        }
        let isPushed = {};
        const _filterOpts = (items, filter) => {
            let data = [];
            if (!items) {
                return data;
            }
            items.reduce((pre, value) => {
                let tag = value.get('tag');
                let key = value.get('key');
                let items = value.get('items');
                if (items) {
                    data = data.concat(_filterOpts(items, filter));
                } else if (filter.indexOf(key) != -1 && !isPushed[key]) {
                    data.push(value);
                    isPushed[key] = true;
                } else if (filter.indexOf(tag) != -1 && !isPushed[tag]) {
                    data.push(value);
                    isPushed[tag] = true;
                }
            }, []);
            return data;
        }
        let result = _filterOpts(opts, operations);
        if (isSort) {
            result = result.sort((val1, val2) => {
                let tag1 = val1.get('tag');
                let key1 = val1.get('key');
                let optIndex1 = operations.indexOf(key1);
                optIndex1 = optIndex1 >= 0 ? optIndex1 : operations.indexOf(tag1);
                let tag2 = val2.get('tag');
                let key2 = val2.get('key');
                let optIndex2 = operations.indexOf(key2);
                optIndex2 = optIndex2 >= 0 ? optIndex2 : operations.indexOf(tag2);
                return optIndex1 - optIndex2;
            });
        }
        return result;
    }
    getButtons(props) {
        let btns = [];
        const { buttons = [] } = props;
        if (buttons.length == 0) {
            return [];
        }
        const billform = this.context.getBillForm();
        if (!billform) {
            return [];
        }
        for (let index = 0; index < buttons.length; index++) {
            const item = buttons[index];
            const itemType = typeof (item);
            let key, caption;
            if (itemType === 'string') {
                key = item;
            } else {
                key = item.key;
                caption = item.caption;
            }
            const comp = billform.getComponent(key);
            if (comp == null || comp.type != YIUI.CONTROLTYPE.BUTTON) {
                continue;
            }
            caption = caption || comp.getMetaObj().caption;
            const action = comp.getMetaObj().onClick;
            const visible = comp.getState().get('visible');
            const enable = comp.getState().get('enable');
            btns.push(Immutable.fromJS({ key, action, caption, visible, enable }));
        }
        return btns;
    }
    onMoreMenuPressed = (index) => {
        const action = this.state.moreItems[index];
        this.onMenuItemPressed(action);
        this.backHandler && this.backHandler();
    }

    onMenuItemPressed = (caption) => {
        const action = this.state.actions[caption];
        this.el.focus();//以后看看有没有其他处理方案
        if (caption === this.props.formatMessage('More')) {
            setTimeout(() => {
                ActionSheet.showActionSheetWithOptions({
                    options: this.state.moreItems,
                    cancelButtonIndex: this.state.moreItems.length - 1,
                    message: null,
                    maskClosable: true,
                }, this.onMoreMenuPressed);
                History.push(`#ActionSheet`, false);
                this.backHandler = BackHandler.addPreEventListener(() => {
                    ActionSheet.close();
                    this.backHandler();
                    return false;
                });
            }, 0);
        }
        if (action) {
            // Util.waitBlurExec(() => {
            console.log('toolbar pressed');
            Util.safeExec(async () => {
                await Util.waitBlur();
                AppDispatcher.dispatch({
                    type: 'STOPEVENT',
                });
                this.props.onClick(action);
                AppDispatcher.dispatch({
                    type: 'ENABLEEVENT',
                });
            });
            // });
        }
    }

    renderItems() {
        const result = [];
        const length = this.state.mainItems.length;
        this.state.mainItems.forEach((item, index) => {
            result.push(<TouchableOpacity
                ref={(el) => this.el = el}
                style={styles.item}
                onPress={
                    (event) => {
                        console.log(event);
                        this.onMenuItemPressed(item);
                    }
                }>
                <Text style={styles.text}>{item}</Text>
            </TouchableOpacity>);
            if (index < length - 1) {
                result.push(<View style={styles.seperator} />);
            }
        });
        return result;
    }

    calculateItems(props) {
        const { captions = {} } = this.props;
        const operationItems = this.getItems(props);
        const buttons = this.getButtons(props);
        const items = buttons.concat(operationItems);
        const toolbarItems = [];
        const actions = {};
        let visibleItemLength = 0;
        items.forEach((item) => {
            if (item.get('visible') && item.get('enable')) {
                let tag = item.get('tag');
                let key = item.get('key');
                let caption = captions[key] || captions[tag] || item.get('caption');
                toolbarItems.push(caption);
                actions[caption] = item.get('action');
                // toolbarActions.push(item.get('action'));
                visibleItemLength++;
            }
        });
        let mainItems = null;
        let moreItems = null;
        if (visibleItemLength > 4) {//当超过4个操作的时候，显示前三个，显示一个更多，点击之后以ActionSheet的方式弹出剩余操作
            mainItems = toolbarItems.slice(0, 3);
            mainItems.push(this.props.formatMessage('More'));
            moreItems = toolbarItems.slice(3, toolbarItems.length);
            moreItems.push(this.props.formatMessage('Cancel'));
        } else {
            mainItems = toolbarItems;
        }
        this.setState({
            mainItems,
            moreItems,
            actions,
        });
    }

    componentWillReceiveProps(props) {
        this.calculateItems(props);
    }

    componentWillMount() {
        this.calculateItems(this.props);
    }

    render() {
        const length = this.state.mainItems.length;
        if (length === 0) {
            return null;
        }
        return (
            <View style={[styles.container, this.props.containerStyle]}>
                {this.renderItems()}
            </View>
        );
    }
}

export default operationWrap(internationalWrap(SegementToolbarButton));
