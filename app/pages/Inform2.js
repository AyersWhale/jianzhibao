/**
 * 对话框通知
 * Created by 曾一川.
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions} from 'react-native';
import { Actions,VectorIcon } from 'c2-mobile';
const deviceWidth = Dimensions.get('window').width;
const deviceHeigth = Dimensions.get('window').height;
export default class Inform2 extends Component {
    constructor(props) {
        super(props);
        //name字段必须,其他可有可无

    }

    createchat() {
        Actions.Newclass();
    }
    render() {
        return (
            <View>
             <VectorIcon style={{
                            marginTop:deviceHeigth/4,
                            paddingRight:10,
                            alignSelf:'center'
                            
                        }} name={'c2_im_manage'} color={'#8E8E93'} size={80} />
            <Text style={{color:'#8E8E93',alignSelf:'center',size:30,marginTop:10}}>暂无工作待办</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({

});