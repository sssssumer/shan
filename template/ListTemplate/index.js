import React, { PureComponent } from 'react';
import defaultTemplateMapping from '../defaultTemplateMapping';
import { View, Text as RawText, StyleSheet, ActivityIndicator } from 'react-native';
import { AppDispatcher, Util, DynamicControl } from 'yes';
import { internationalWrap } from 'yes-intf';
import PropTypes from 'prop-types';
import './ListWithQuery';

const styles = StyleSheet.create({
    mask: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(211,211,211,0.5)',
    }
})
class ListTemplate extends PureComponent {
    static contextTypes = {
        createElement: PropTypes.func,
        onControlClick: PropTypes.func,
        getControlProps: PropTypes.func,
        doOpt: PropTypes.func,
    }

    state = {
        refreshing: false,
    }
    onRefresh = async () => {
        this.setState({
            refreshing: true,
        });
        try {
            const { refresh } = this.props;
            if (!refresh || refresh.type === 'form') {
                await this.props.reload();
            }
            if (refresh && refresh.type === 'button') {
                await this.context.onControlClick(refresh.buttonId);
            }
            if (refresh && refresh.type === 'opt') {
                await this.context.doOpt(refresh.optId);
            }
        } catch (ex) {
            console.log(ex);
        } finally {
            this.setState({
                refreshing: false,
            })
        }
        // AppDispatcher.dispatch({
        //     type: 'RELOADFORM',
        //     key: Util.buildFormKey(this.props.formKey, '-1'),
        // });
    }

    render() {
        return this.buildChildren();
    }

    componentDidMount() {
        const { events } = this.props;
        if (events) {
            this.dispatcherId = AppDispatcher.register((action) => {
                const event = events[action.type];
                if (event) {
                    if (event.type === 'button') {
                        setTimeout(() => {
                            this.context.onControlClick(event.yigoid);
                        }, 0);
                        return;
                    }
                    if (event.type === 'opt') {
                        setTimeout(() => {
                            this.context.doOpt(event.yigoid);
                        }, 0);
                        return;
                    }
                }
            });
        }
    }

    componentWillUnmount() {
        this.dispatcherId && AppDispatcher.unregister(this.dispatcherId);
    }

    buildChildren() {
        const { searchBar, filterBlock, list, action, formStatus, error, errorMsg, 
            contentStyle, busying } = this.props;
        //reloading??????????????????????????????
        // if(formStatus!=='ok' || formStatus!=='reloading') {
        //     return (

        //     )
        // }
        let listEle = this.context.createElement(list, {
            onRefresh: this.onRefresh,
            refreshing: this.state.refreshing,
        });
        const foot = this.context.createElement(this.props.foot);
        const head = this.context.createElement(this.props.head);
        let actionButton = this.context.createElement(action);
        if (!React.isValidElement(listEle)) {
            listEle = <DynamicControl
                designPositionBase
                yigoid={list}
                debugStyle={{ flex: 1 }}
                layoutStyles={{ flex: 1 }}
                style={{ flex: 1, marginLeft: 12 }}
                {...this.context.getControlProps(list)}
            />;
            // listEle = this.context.createElement(list);
        }
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                {
                    this.context.createElement(head)
                }
                {
                    filterBlock ? this.context.createElement(filterBlock, { formStatus }) : null
                }
                <View style={[{ flex: 1 }, contentStyle]}>
                    {
                        busying ? <View style={styles.mask}><ActivityIndicator /></View> : null
                    }
                    {listEle}
                </View>
                {
                    foot 
                }
                {
                    actionButton
                }
            </View>
        );
    }
}
const ListWithNavigation = internationalWrap(ListTemplate);

ListWithNavigation.caption = "??????????????????";
defaultTemplateMapping.reg('list', ListWithNavigation);
export default ListWithNavigation;
