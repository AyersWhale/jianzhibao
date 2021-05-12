import React from 'react';

import {
	Text,
	View,
	Image,
	StyleSheet,
	TouchableOpacity,
	Dimensions, Platform
} from 'react-native';
import { Config } from 'c2-mobile';
const maxHeight = Dimensions.get('window').height;
const maxWidth = Dimensions.get('window').width;

/**
 * Description:
 *		网格列表
 * In Use:
 *	
 */

export default class CustomGrid extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: ''
		}
	}

	/**
	 * 根据不同类型传递点击事件的参数
	 *
	 * @param {any} index
	 * @memberof CustomGrid
	 */
	onClick(index) {
		const { data, type } = this.props;
		if (this.props.onClickHandle) {
			switch (type) {
				case 'location':
					this.props.onClickHandle({ type: type, title: data[index].title, adcode: data[index].adcode });
					break;
				case 'industry':
				case 'local':
					this.props.onClickHandle({ type: type, title: data[index].name, categoryId: data[index].id });
					break;
				case 'zhadui':
					this.props.onClickHandle({ type: type, title: data[index].name, categoryId: data[index].id });
					break;
				case 'hot_news':
					this.props.onClickHandle({ type: type, name: data[index].name, categoryId: data[index].id, url: data[index].url });
					break;
				case 'zhadui_service':
					this.props.onClickHandle({ type: type, name: data[index].name, categoryId: data[index].id, url: data[index].url });
					break;
				case 'redirectDepot':
					this.props.onClickHandle({ title: data[index].tit, id: data[index].id, url: data[index].url });
					break;
				case 'main_stech':
					this.setState({
						id: data[index].id,
					})
					this.props.onClickHandle({ title: data[index].title, id: data[index].id, item: data[index].item });
					break;
				case 'main':
					this.setState({
						id: data[index].id,
					})
					this.props.onClickHandle({ title: data[index].title, id: data[index].id, item: data[index].item });
					break;
			}
		}
	}

	_renderTitle(item, type) {
		switch (type) {
			case 'industry':
			case 'local':
				return (
					<Text style={styles.localItemText} numberOfLines={1}>{item.name}</Text>
				);
				break;
			default:
				return (
					<Text style={styles.localItemText} numberOfLines={1}>{item.title}</Text>
				);
				break;
		}
	}

	/**
	 * 根据每行显示个数渲染
	 *
	 * @param {any} data
	 * @returns
	 * @memberof CustomGrid
	 */
	_grid(data, type) {
		const { columnNum } = this.props;

		let rows = [];
		let dataLength = data.length;

		if (dataLength) {
			let row = Math.ceil(dataLength / columnNum);
			for (let i = 0; i < row; i++) {
				let rowArr = [];
				for (let j = 0; j < columnNum; j++) {
					let itemEl;
					let index = i * columnNum + j;
					if (index >= dataLength) {
						itemEl = (<View style={styles.localFlex} key={index}></View>);
					} else {
						itemEl = (
							<View style={styles.localFlex} key={index}>
								<TouchableOpacity onPress={() => { this.onClick(index) }} >
									<View style={{ alignItems: 'center', width: maxWidth / 4 - 15, height: 75 }}>
										<Image source={{ uri: data[index].icon }} style={{ marginTop: 10, width: 30, height: 30 }} />
										<Text style={{ position: 'absolute', top: 50, textAlign: 'center', fontSize: Config.MainFontSize - 2, color: "#222222", }}>{data[index].name}</Text>
									</View>
								</TouchableOpacity>
							</View>
						);
					}
					rowArr.push(itemEl);
				}
				rows.push(<View style={styles.localFlexItem}>{rowArr}</View>);
			}
		} else {
			return null;
		}

		let result = rows.map((item, index) => {
			return (
				<View key={index}>
					{item}
				</View>
			);
		});

		return result;
	}
	_hot_news(data, type) {
		const { columnNum } = this.props;

		let rows = [];
		let dataLength = data.length;

		if (dataLength) {
			let row = Math.ceil(dataLength / columnNum);
			for (let i = 0; i < row; i++) {
				let rowArr = [];
				for (let j = 0; j < columnNum; j++) {
					let itemEl;
					let index = i * columnNum + j;
					if (index >= dataLength) {
						itemEl = (<View style={{
							flex: 1,
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
						}} key={index}></View>);
					} else {
						itemEl = (
							<View style={{
								flex: 1,
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
							}} key={index}>
								<TouchableOpacity onPress={() => { this.onClick(index) }} >
									<View style={{ justifyContent: 'center', alignItems: 'center', width: maxWidth / 4 - 12, height: 30, flexDirection: 'row', backgroundColor: '#f8f8f8' }}>
										{/* <Image source={data[index].icon} style={{ marginLeft: 3, width: 12, height: 12 }} /> */}
										<Text style={{ marginLeft: 3, textAlign: 'center', fontSize: Config.MainFontSize - 2, color: "#222222", }}>{data[index].name}</Text>
									</View>
								</TouchableOpacity>
							</View>
						);
					}
					rowArr.push(itemEl);
				}
				rows.push(<View style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
					marginTop: 4,
					marginRight: 5
				}}>{rowArr}</View>);
			}
		} else {
			return null;
		}

		let result = rows.map((item, index) => {
			return (
				<View key={index}>
					{item}
				</View>
			);
		});

		return result;
	}
	_grid_zhadui(data, type) {
		const { columnNum } = this.props;

		let rows = [];
		let dataLength = data.length;

		if (dataLength) {
			let row = Math.ceil(dataLength / columnNum);
			for (let i = 0; i < row; i++) {
				let rowArr = [];
				for (let j = 0; j < columnNum; j++) {
					let itemEl;
					let index = i * columnNum + j;
					if (index >= dataLength) {
						itemEl = (<View style={styles.localFlex} key={index}></View>);
					} else {
						itemEl = (
							<View style={styles.localFlex} key={index}>
								<TouchableOpacity onPress={() => { this.onClick(index) }} >
									<View style={{ alignItems: 'center', width: maxWidth / 4 - 15, height: 75 }}>
										<Image source={data[index].icon} style={{ marginTop: 10, width: 30, height: 30 }} />
										<Text style={{ position: 'absolute', top: 50, textAlign: 'center', fontSize: Config.MainFontSize - 2, color: "#222222", }}>{data[index].name}</Text>
									</View>
								</TouchableOpacity>
							</View>
						);
					}
					rowArr.push(itemEl);
				}
				rows.push(<View style={styles.localFlexItem}>{rowArr}</View>);
			}
		} else {
			return null;
		}

		let result = rows.map((item, index) => {
			return (
				<View key={index}>
					{item}
				</View>
			);
		});

		return result;
	}
	_grid_main(data, type) {
		const { columnNum } = this.props;

		let rows = [];
		let dataLength = data.length;
		if (dataLength) {
			let row = Math.ceil(dataLength / columnNum);
			for (let i = 0; i < row; i++) {
				let rowArr = [];
				for (let j = 0; j < columnNum; j++) {
					let itemEl;
					let index = i * columnNum + j;
					if (index >= dataLength) {
						itemEl = (<View style={styles.localFlex} key={index}></View>);
					} else {
						itemEl = (
							<View style={styles.localFlex} key={index}>
								<TouchableOpacity onPress={() => { this.onClick(index) }} >
									<View style={{ margin: 10, flex: 1, alignItems: 'flex-start', width: maxWidth / 8 * 3, borderColor: '#f3f3f3', borderRightWidth: 1, }}>
										<Text style={{ color: (this.state.id == data[index].id) ? '#0998ff' : 'black', fontSize: Config.MainFontSize - 2, marginLeft: 20 }}>{data[index].title}</Text>
									</View>
								</TouchableOpacity>
							</View >
						);
					}
					rowArr.push(itemEl);
				}
				rows.push(<View style={{
					flexDirection: 'row',
					borderColor: '#f3f3f3',
					borderTopWidth: 1,
					borderLeftWidth: 1,
					borderRightWidth: 1
				}}>{rowArr}</View>);
			}
		} else {
			return null;
		}

		let result = rows.map((item, index) => {
			return (
				<View key={index}>
					{item}
				</View>
			);
		});

		return result;
	}
	_grid_main_stech(data, type) {
		const { columnNum } = this.props;

		let rows = [];
		let dataLength = data.length;
		if (dataLength) {
			let row = Math.ceil(dataLength / columnNum);
			for (let i = 0; i < row; i++) {
				let rowArr = [];
				for (let j = 0; j < columnNum; j++) {
					let itemEl;
					let index = i * columnNum + j;
					if (index >= dataLength) {
						itemEl = (<View style={{
							flex: 1,
							flexDirection: 'row',
							justifyContent: 'center', marginBottom: -10
						}} key={index}></View>);
					} else {
						itemEl = (
							<View style={{
								flex: 1,
								flexDirection: 'row',
								justifyContent: 'center', marginBottom: -15, width: maxWidth / 3 - 16,
							}} key={index}>
								<TouchableOpacity onPress={() => { this.onClick(index) }} >
									<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: maxWidth / 3 - 16, backgroundColor: '#f9f9f9', height: 40 }}>
										<Text style={{ position: 'absolute', top: 3, textAlign: "left", width: maxWidth / 3 - 40, color: (this.state.id == data[index].id) ? '#0998ff' : 'black', fontSize: Config.MainFontSize - 2 }} numberOfLines={2}>{data[index].title}</Text>
									</View>
								</TouchableOpacity>
							</View >
						)
					}
					rowArr.push(itemEl);
				}
				rows.push(<View style={{
					flexDirection: 'row', marginTop: 10, marginBottom: 10, marginLeft: 16, marginRight: 15
				}}>{rowArr}</View>);
			}
		} else {
			return null;
		}

		let result = rows.map((item, index) => {
			return (
				<View key={index}>
					{item}
				</View>
			);
		});

		return result;
	}
	render() {
		const { data, type } = this.props;
		if (type == 'zhadui') {
			return (<View>

				{
					this._grid_zhadui(data, type)
				}

			</View>);
		} else if (type == 'main') {
			return (<View>

				{
					this._grid_main(data, type)
				}

			</View>);
		} else if (type == 'main_stech') {
			return (<View>

				{
					this._grid_main_stech(data, type)
				}

			</View>);
		} else if (type == 'hot_news') {
			return (<View>

				{
					this._hot_news(data, type)
				}

			</View>);
		} else if (type == 'redirectDepot') {
			return (<View>

				{
					this._hot_news(data, type)
				}

			</View>);
		} else if (type == 'zhadui_service') {
			return (<View>

				{
					this._hot_news(data, type)
				}

			</View>);
		}
		else {
			return (
				<View>

					{
						this._grid(data, type)
					}

				</View>
			);
		}
	}
}

const styles = StyleSheet.create({
	localFlex: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		margin: 5
	},
	localFlexItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 8,
		marginRight: 5
	},
	localItemView: {
		borderWidth: 1,
		borderColor: '#3e9ce9',
		borderRadius: 3,
		paddingTop: 5,
		paddingBottom: 5,
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	localItemText: {
		color: "#222222",
		fontSize: Config.MainFontSize - 2,
		textAlign: 'center'
	}
});
