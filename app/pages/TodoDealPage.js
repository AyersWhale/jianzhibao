import React from 'react';
import { Text, View } from 'react-native';
import { List, Radio } from 'antd-mobile-rn';
const RadioItem = Radio.RadioItem;

export default class BasicRadioExample extends React.Component<any, any> {
    state = {
        shownum: 1,
    };

    render() {
        return (
            <View>
                <List style={{ marginTop: 120 }}>
                    <RadioItem
                        checked={this.state.shownum === 1}
                        onChange={(event) => {
                            if (event.target.checked) {
                                this.setState({ shownum: 1 });
                            }
                        }}>海洋</RadioItem>
                    <RadioItem
                        checked={this.state.shownum === 2}
                        onChange={(event) => {
                            if (event.target.checked) {
                                this.setState({ shownum: 2 });
                            }
                        }}>天空</RadioItem>
                    <RadioItem
                        checked={this.state.shownum === 3}
                        onChange={(event) => {
                            if (event.target.checked) {
                                this.setState({ shownum: 3 });
                            }
                        }}>科技</RadioItem>
                </List>
            </View>
        );
    }
}