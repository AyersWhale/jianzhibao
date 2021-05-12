'use strict'

//系统组件
import React, { Component } from 'react';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ListView,
    ScrollView,
    StyleSheet,
    Platform,
    Dimensions,
} from 'react-native';

//第三方依赖组件
import * as PortalEventDeal from './PortalRouteJumpP';
import {
    Icon
} from 'react-native-elements'
import { Config, Fetch,VectorIcon } from 'c2-mobile'

var screenW = Dimensions.get('window').width;



export default class C2Portal extends Component {

    constructor(props) {
        super(props);

        this._getRow = this._getRow.bind(this);
        this.onScrollAnimationEnd = this.onScrollAnimationEnd.bind(this);
        this._itemOnPressBlock = this._itemOnPressBlock.bind(this);
         this.state = {
             activePage:0
        }

    }

    _itemOnPressBlock(indexPath,itemData){

        PortalEventDeal.portalRouteJump(this.props.navigator,itemData,this.props.components);
        
    }

    _getRow(pp, ii, rowData) {
        var indexPath = { page: pp, secetion: ii }
        var itemTemp = [];
        for (var nn = 0; nn < this.props.lineItemNum; nn++) {
            if (rowData[nn]) {
                let data = rowData[nn]
                itemTemp.push(
                    <TouchableOpacity key={pp - ii - nn} style={{ flex: 1, marginTop: 10, paddingLeft: 10, marginBottom: 10, paddingRight: 10, height: 72 }} onPress={()=>this._itemOnPressBlock(indexPath,data)}>
                        <View  style={{alignSelf:'center'}}>
                            {/*<VectorIcon name={rowData[nn].iconname} size={18} color="#900" />*/}
                            <Icon
                                reverse
                                name={rowData[nn].iconname}
                                hideIcon = {true}
                                reverseColor='#ffffff'
                                color={rowData[nn].iconcolor}
                                size={18}
                                containerStyle={{
                                }}
                                />
                        </View>
                        <Text allowFontScaling={false} style={{ flex: 1, textAlign: 'center', color: rowData[nn].fontcolor, fontSize: 12 }}>{rowData[nn].title}</Text>
                    </TouchableOpacity>
                )
                continue;
            }
            itemTemp.push(
                <View key={pp - ii - nn} style={{ flex: 1, paddingLeft: 10, paddingRight: 10, height: 50 }} />
            )
        }
        return (
            <View key={pp - ii} style={{ flexDirection: 'row' }}>
                {itemTemp}
            </View>
        );

    }

    _getPageView(pp, dataBlob) {
        var LineViewTemp = [];
        for (var ii = 0; ii < Math.ceil(dataBlob.length / this.props.lineItemNum); ii++) {
            var curCount = ii * this.props.lineItemNum;
            var itemTemp = [];
            for (var tt = 0; tt < Math.min(this.props.lineItemNum, dataBlob.length - curCount); tt++) {
                itemTemp.push(dataBlob[curCount + tt]);
            }
            LineViewTemp.push(this._getRow(pp, ii, itemTemp));
        }

        return (
            <View key={pp} style={styles.collectionContainer}>
                {LineViewTemp}
            </View>
        );
    }

    _getPageGroupView() {
        var pageViewTemp = [];
        for (var pp = 0; pp < this.props.itemDataSource.length; pp++) {
            pageViewTemp.push(
                this._getPageView(pp, this.props.itemDataSource[pp])
            )
        }
        return pageViewTemp;
    }

    _getPageControl(count: number, selected: number) {

        var controlItem = [];
        for (var kk = 0; kk < count; kk++) {
            controlItem.push(
           
                 <VectorIcon key={'page-' + kk} name={kk == selected ? 'radio_button_checked' : 'radio_button_unchecked'} style={{ color: '#757575', textAlign: 'center', fontSize: 12 }} />
            )
        }
        return controlItem

    }

    // 当一帧滚动结束的时候调用
    onScrollAnimationEnd(e){
        // 计算当前页码
        
        var currentPage = Math.floor(parseInt(e.nativeEvent.contentOffset.x) / parseInt(screenW) );
        // 更新状态机
        this.setState({
             activePage:currentPage,
        })
       
    }

    render() {
        return (
            <View>
                <ScrollView style={styles.scrollContainer} 
                horizontal={true} 
                pagingEnabled={true} 
                onMomentumScrollEnd={this.onScrollAnimationEnd}
                showsHorizontalScrollIndicator={false}>
                    {this._getPageGroupView()}
                </ScrollView>
                <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 5, paddingBottom: 5, backgroundColor: 'rgba(52,52,52,0)', }}>
                    {this._getPageControl(this.props.itemDataSource.length, this.state.activePage)}
                </View>
            </View>
        )
    }

}

C2Portal.defaultProps = {
    lineItemNum: 4,
    components:{}
}

let styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'ios' ? 64 : 64,
        backgroundColor: 'rgba(52,52,52,0)',
    },
    scrollContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(52,52,52,0)',
    },
    collectionContainer: {
        flex: 1,
        width: Dimensions.get('window').width,
        backgroundColor: 'rgba(52,52,52,0)',
    },
})