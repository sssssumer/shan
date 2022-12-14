import React, { PureComponent } from 'react';
import { ScrollView, View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { getMappedComponentHOC } from 'yes'; // eslint-disable-line import/no-unresolved
import defaultTemplateMapping from '../defaultTemplateMapping';
import CellLayoutTemplate from '../TabTemplate/CellLayoutTemplate';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        flexBasis: 0,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 16,
    }
});

class NormalTemplate extends PureComponent {
    static contextTypes = {
        createElement: PropTypes.func,
        getBillForm: PropTypes.func,
    }
    render() {
        return this.buildChildren();
    }
    buildChildren() {
        const { items, action, error, errorMsg, formStatus } = this.props;
        // const form = this.context.getBillForm();
        // if (form) {
        let actionButton = this.context.createElement(action);
        const foot = this.context.createElement(this.props.foot);
        const head = this.context.createElement(this.props.head);
        if (error) {
            return (<View style={styles.container}>
                {head}
                <View style={styles.errorContainer}>
                    <Text>{errorMsg.message}</Text>
                </View>
            </View>)
        }
        if (formStatus === 'ok') {
            if (this.props.foot || this.props.head) {
                return (<View style={styles.container}>
                    {head}
                    <View style={styles.container}>
                        <ScrollView>
                            <CellLayoutTemplate
                                items={items}
                            />
                        </ScrollView>
                        {actionButton}
                    </View>
                    {foot}
                </View>);
            }
            return (
                <View style={styles.container}>
                    <ScrollView>
                        <CellLayoutTemplate
                            items={items}
                        />
                    </ScrollView>
                    {actionButton}
                </View>);
        }
        return (<View style={styles.container}>
            {head}
            <View style={styles.errorContainer}>
                <ActivityIndicator size="large" color="cadetblue" />
            </View>
        </View>);
    }
}
const WrappedNormalTemplate = getMappedComponentHOC(NormalTemplate);
defaultTemplateMapping.reg('normal', WrappedNormalTemplate);
export default WrappedNormalTemplate;
