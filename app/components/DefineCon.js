'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ProgressBarAndroid,Alert
} from 'react-native';
import { FileManager, Config,  } from 'c2-mobile';
export default class DefineCon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transparent: true,
            statusTitle: '更新进度:',
            statusProgress: 0,
            progress: 0
        }

        this.currProgress = 0;
        this.currBuffer = 0;
    }

    componentWillMount() {
        var params = {
            source: { uri: this.props.uri },
            dirMode: FileManager.DirMode.cache,
            progress: (events) => {
                let percent = events.completedUnitCount / events.totalUnitCount 
                    this.setState({
                        statusProgress:percent,
                    })
            },
            header: {},
        }

        FileManager.downloadFile(params, FileManager.DirMode.cache,
            (events) => {

            }).then((respones) => {
                this.props.hides();
                if (respones) {
                    FileManager.openFile(respones)
                        .then((response) => {
                        })
                        .catch((e) => {
                            Alert.alert('温馨提示:', '更新失败！', [{ text: '确定' },]);
                        })
                }
            }).catch((e) => {
                console.log(e);
            })
    }



    render() {
        return (
            <View style={[styles.conMid]}>
                <ProgressBarAndroid color={Config.C2NavigationBarTintColor} styleAttr='Horizontal' progress={this.state.statusProgress}
                    indeterminate={false} style={{ height: 50, flex: 1, }} />
         </View>
        )
    }

    hides(){
        this.refs.dAlert.hide();
    }
}

function makeCancelable(promise) {
    let hasCanceled_ = false;
    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then((val) =>
            hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)
        );
        promise.catch((error) =>
            hasCanceled_ ? reject({ isCanceled: true }) : reject(error)
        );
    });

    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled_ = true;
        },
    };
}

const styles = StyleSheet.create({
    conMid: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})