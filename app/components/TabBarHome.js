
'use strict';

import React, { Component } from 'react';
import { StyleSheet, Image, Platform } from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import HomeFragment from '../pages/HomeFragment';
import ApplicationFragment from '../pages/ApplicationFragment';
import Contact from '../pages/Contact';
import px2dp from '../utils/px2dp';
import { VectorIcon, Config } from 'c2-mobile';
import Global from '../utils/GlobalStorage';
import MessageFragment from '../pages/MessageFragment';
import { C2AmapApi } from 'c2-mobile-amap';
export default class TabBarHome extends Component {
    static defaultProps = {
        selectedColor: 'rgb(26,178,10)',
        normalColor: '#a9a9a9',
    };
    constructor(props) {
        super(props);
        this.state = {
            // selectedTab: 'msg',
            tabName: ['首页', '合同', '考勤', '我的'],
            tabName1: ['招聘', '合同', '我的'],
            tabName2: ['审核', '我的'],
            badge: '',
            position: '',
            identity: '',

        }
        Global.getValueForKey('shouyeSettings').then((ret) => {
            if (ret) {
                this.setState({ selectedTab: ret });
            } else {
                this.setState({ selectedTab: "msg" });
            }
        })
    }
    componentDidMount() {

        if (Platform.OS == 'android') {
            C2AmapApi.initService({
                apiKey: 'f1e98431de6fcdbfb9071b9e8cc56061'
            }, () => {
                C2AmapApi.getCurrentLocation()
                    .then((result) => {
                        this.setState({
                            position: JSON.stringify(result.info.street)
                        })
                    })
                    .catch(() => {

                    })
            });
        } else {
            C2AmapApi.initService({
                apiKey: '2a79d9bfda5534d33c3eb959fc805569'
            }, () => {
                C2AmapApi.getCurrentLocation()
                    .then((result) => {
                        this.setState({
                            position: JSON.stringify(result.info.street)
                        })
                    })
                    .catch(() => {

                    })
            });
        }
    }


    render() {
        const { selectedColor } = this.props;
        const { tabName, tabName1, tabName2 } = this.state;
        if (this.props.identity == 'student') {
            return (
                <TabNavigator
                    hidesTabTouch={true}
                    tabBarStyle={styles.tabbar}
                    sceneStyle={{ paddingBottom: styles.tabbar.height }}>

                    <TabNavigator.Item
                        tabStyle={styles.tabStyle}
                        title={tabName[0]}
                        badgeText={this.state.badge}
                        selected={this.state.selectedTab === 'msg'}
                        selectedTitleStyle={{ color: '#3E7EFE' }}
                        renderIcon={() => <Image source={require('../image/position1.png')} style={{ height: 25, width: 25 }} />}
                        renderSelectedIcon={() => <Image source={require('../image/position2.png')} style={{ height: 25, width: 25 }} />}
                        onPress={() => this.setState({ selectedTab: 'msg' })}>
                        {<HomeFragment navigator={this.props.navigator} identity={this.props.identity} />}
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        tabStyle={styles.tabStyle}
                        title={tabName[1]}
                        selected={this.state.selectedTab === 'contacts'}
                        selectedTitleStyle={{ color: '#3E7EFE' }}
                        renderIcon={() => <Image source={require('../image/contract1.png')} style={{ height: 25, width: 25 }} />}
                        renderSelectedIcon={() => <Image source={require('../image/contract2.png')} style={{ height: 25, width: 25 }} />}
                        onPress={() => this.setState({ selectedTab: 'contacts' })}>
                        {<Contact navigator={this.props.navigator} identity={this.props.identity} />}
                    </TabNavigator.Item>

                    <TabNavigator.Item
                        tabStyle={styles.tabStyle}
                        title={tabName[2]}
                        badgeText={this.state.badge}
                        selected={this.state.selectedTab === 'faxian'}
                        selectedTitleStyle={{ color: '#3E7EFE' }}
                        renderIcon={() => <Image source={require('../image/attendence1.png')} style={{ height: 25, width: 25 }} />}
                        renderSelectedIcon={() => <Image source={require('../image/attendence2.png')} style={{ height: 25, width: 25 }} />}
                        onPress={() => this.setState({ selectedTab: 'faxian' })}>
                        {<MessageFragment navigator={this.props.navigator} position={this.state.position} identity={this.props.identity} />}
                    </TabNavigator.Item>

                    <TabNavigator.Item
                        tabStyle={styles.tabStyle}
                        title={tabName[3]}
                        selected={this.state.selectedTab === 'me'}
                        selectedTitleStyle={{ color: '#3E7EFE' }}
                        renderIcon={() => <Image source={require('../image/person1.png')} style={{ height: 25, width: 25 }} />}
                        renderSelectedIcon={() => <Image source={require('../image/person2.png')} style={{ height: 25, width: 25 }} />}
                        onPress={() => this.setState({ selectedTab: 'me' })}>
                        {<ApplicationFragment navigator={this.props.navigator} identity={this.props.identity} />}
                    </TabNavigator.Item>
                </TabNavigator>
            );
        } else if (this.props.identity == 'platform') {
            return (
                <TabNavigator
                    hidesTabTouch={true}
                    tabBarStyle={styles.tabbar}
                    sceneStyle={{ paddingBottom: styles.tabbar.height }}>

                    <TabNavigator.Item
                        tabStyle={styles.tabStyle}
                        title={tabName2[0]}
                        badgeText={this.state.badge}
                        selected={this.state.selectedTab === 'msg'}
                        selectedTitleStyle={{ color: '#3E7EFE' }}
                        renderIcon={() => <Image source={require('../image/position1.png')} style={{ height: 25, width: 25 }} />}
                        renderSelectedIcon={() => <Image source={require('../image/position2.png')} style={{ height: 25, width: 25 }} />}
                        onPress={() => this.setState({ selectedTab: 'msg' })}>
                        {<HomeFragment navigator={this.props.navigator} identity={this.props.identity} />}
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        tabStyle={styles.tabStyle}
                        title={tabName2[1]}
                        selected={this.state.selectedTab === 'me'}
                        selectedTitleStyle={{ color: '#3E7EFE' }}
                        renderIcon={() => <Image source={require('../image/person1.png')} style={{ height: 25, width: 25 }} />}
                        renderSelectedIcon={() => <Image source={require('../image/person2.png')} style={{ height: 25, width: 25 }} />}
                        onPress={() => this.setState({ selectedTab: 'me' })}>
                        {<ApplicationFragment navigator={this.props.navigator} identity={this.props.identity} />}
                    </TabNavigator.Item>
                </TabNavigator>
            );
        }
        else {
            return (
                <TabNavigator
                    hidesTabTouch={true}
                    tabBarStyle={styles.tabbar}
                    sceneStyle={{ paddingBottom: styles.tabbar.height }}>

                    <TabNavigator.Item
                        tabStyle={styles.tabStyle}
                        title={tabName1[0]}
                        badgeText={this.state.badge}
                        selected={this.state.selectedTab === 'msg'}
                        selectedTitleStyle={{ color: '#3E7EFE' }}
                        renderIcon={() => <Image source={require('../image/position1.png')} style={{ height: 25, width: 25 }} />}
                        renderSelectedIcon={() => <Image source={require('../image/position2.png')} style={{ height: 25, width: 25 }} />}
                        onPress={() => this.setState({ selectedTab: 'msg' })}>
                        {<HomeFragment navigator={this.props.navigator} identity={this.props.identity} />}
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        tabStyle={styles.tabStyle}
                        title={tabName1[1]}
                        selected={this.state.selectedTab === 'contacts'}
                        selectedTitleStyle={{ color: '#3E7EFE' }}
                        renderIcon={() => <Image source={require('../image/contract1.png')} style={{ height: 25, width: 25 }} />}
                        renderSelectedIcon={() => <Image source={require('../image/contract2.png')} style={{ height: 25, width: 25 }} />}
                        onPress={() => this.setState({ selectedTab: 'contacts', identity: 'boss' })}>
                        {<Contact navigator={this.props.navigator} identity={this.props.identity} />}
                    </TabNavigator.Item>

                    {/* <TabNavigator.Item
                        tabStyle={styles.tabStyle}
                        title={tabName1[2]}
                        badgeText={this.state.badge}
                        selected={this.state.selectedTab === 'faxian'}
                        selectedTitleStyle={{ color: '#3E7EFE' }}
                        renderIcon={() => <Image source={require('../image/attendence1.png')} style={{ height: 30, width: 30 }} />}
                        renderSelectedIcon={() => <Image source={require('../image/attendence2.png')} style={{ height:35, width: 35 }} />}
                        onPress={() => this.setState({ selectedTab: 'faxian',identity:'boss' })}>
                        {<MessageFragment navigator={this.props.navigator} position={this.state.position} identity={this.props.identity}/>}
                    </TabNavigator.Item> */}

                    <TabNavigator.Item
                        tabStyle={styles.tabStyle}
                        title={tabName1[2]}
                        selected={this.state.selectedTab === 'me'}
                        selectedTitleStyle={{ color: '#3E7EFE' }}
                        renderIcon={() => <Image source={require('../image/person1.png')} style={{ height: 30, width: 30 }} />}
                        renderSelectedIcon={() => <Image source={require('../image/person2.png')} style={{ height: 35, width: 35 }} />}
                        onPress={() => this.setState({ selectedTab: 'me', identity: 'boss' })}>
                        {<ApplicationFragment navigator={this.props.navigator} identity={this.props.identity} />}
                    </TabNavigator.Item>
                </TabNavigator>
            );
        }

    }

}

const styles = StyleSheet.create({
    tabbar: {
        height: px2dp(60),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    tabStyle: {
        padding: px2dp(3)
    },
    tab: {
        width: px2dp(22),
        height: px2dp(22),
    }
});