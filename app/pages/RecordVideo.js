// import ImagePicker from 'react-native-image-picker';
// import React, { Component } from 'react';
// import {
//     Platform,
//     StyleSheet,
//     Text,
//     View,
//     PixelRatio,
//     TouchableOpacity,
//     Image, ImageBackground
//     , Dimensions
// } from 'react-native';
// import { UUID, Toast, FileManager, Actions, SafeArea, Config, Camera, ActionSheet, VectorIcon, Fetch, UserInfo } from 'c2-mobile';
// const deviceWidth = Dimensions.get('window').width;
// const deviceHeigth = Dimensions.get('window').height;
// const instructions = Platform.select({
//     ios: 'Press Cmd+R to reload,\n' +
//         'Cmd+D or shake for dev menu',
//     android: 'Double tap R on your keyboard to reload,\n' +
//         'Shake or press menu button for dev menu',
// });


// export default class App extends Component {
//     state = {
//         avatarSource: null,
//         videoSource: null
//     };


//     //选择图片
//     selectPhotoTapped() {
//         const options = {
//             title: '选择图片',
//             cancelButtonTitle: '取消',
//             takePhotoButtonTitle: '拍照',
//             chooseFromLibraryButtonTitle: '选择照片',
//             customButtons: [
//                 { name: 'fb', title: 'Choose Photo from Facebook' },
//             ],
//             cameraType: 'back',
//             mediaType: 'photo',
//             videoQuality: 'high',
//             durationLimit: 10,
//             maxWidth: 300,
//             maxHeight: 300,
//             quality: 0.8,
//             angle: 0,
//             allowsEditing: false,
//             noData: false,
//             storageOptions: {
//                 skipBackup: true
//             }
//         };

//         ImagePicker.showImagePicker(options, (response) => {
//             console.log('Response = ', response);

//             if (response.didCancel) {
//                 console.log('User cancelled photo picker');
//             }
//             else if (response.error) {
//                 console.log('ImagePicker Error: ', response.error);
//             }
//             else if (response.customButton) {
//                 console.log('User tapped custom button: ', response.customButton);
//             }
//             else {
//                 let source = { uri: response.uri };

//                 // You can also display the image using data:
//                 // let source = { uri: 'data:image/jpeg;base64,' + response.data };

//                 this.setState({
//                     avatarSource: source
//                 });
//             }
//         });
//     }

//     //选择视频
//     selectVideoTapped() {
//         const options = {

//             title: '选择视频',
//             cancelButtonTitle: '取消',
//             takePhotoButtonTitle: '录制视频',
//             chooseFromLibraryButtonTitle: '选择视频',
//             mediaType: 'video',
//             videoQuality: 'medium'
//         };

//         ImagePicker.showImagePicker(options, (response) => {
//             console.log('Response = ', response);

//             if (response.didCancel) {
//                 console.log('User cancelled video picker');
//             }
//             else if (response.error) {
//                 console.log('ImagePicker Error: ', response.error);
//             }
//             else if (response.customButton) {
//                 console.log('User tapped custom button: ', response.customButton);
//             }
//             else {
//                 this.setState({
//                     videoSource: response.uri
//                 });
//             }
//         });
//     }

//     render() {
//         return (
//             <View>
//             <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
//             <TouchableOpacity onPress={() => Actions.pop({ refresh: { test: UUID.v4() } })} style={{ marginTop: 38, position: 'absolute' }}>
//                 <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
//             </TouchableOpacity>
//             <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
//                 <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>企业认证</Text>
//             </View>
//         </ImageBackground>
//             <View style={styles.container}>

//                 <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
//                     <View style={[styles.avatar, styles.avatarContainer, { marginBottom: 30 }]}>
//                         {this.state.avatarSource === null ? <Text>选择照片</Text> :
//                             <Image style={styles.avatar} source={this.state.avatarSource} />
//                         }
//                     </View>
//                 </TouchableOpacity>

//                 <TouchableOpacity onPress={this.selectVideoTapped.bind(this)}>
//                     <View style={[styles.avatar, styles.avatarContainer]}>
//                         <Text>选择视频</Text>
//                     </View>
//                 </TouchableOpacity>

//                 {this.state.videoSource &&
//                     <Text style={{ margin: 8, textAlign: 'center' }}>{this.state.videoSource}</Text>
//                 }
//             </View>
//             </View>
//         );
//     }

// }

// const styles = StyleSheet.create({
//     container: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#F5FCFF'
//     },
//     avatarContainer: {
//         borderColor: '#9B9B9B',
//         borderWidth: 1 / PixelRatio.get(),
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//     avatar: {
//         borderRadius: 50,
//         width: 100,
//         height: 100
//     }

// });
