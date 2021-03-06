/* @flow */

import React, { Component } from 'react';
import ReactNative from 'react-native';
import shallowEqual from 'shallowequal';
import Colors from '../../Colors';
import Icon from './Icon';

const {
	StyleSheet,
} = ReactNative;

const styles = StyleSheet.create({
	icon: {
		margin: 16,
		color: Colors.white,
	},
});

type Props = {
	style?: any;
}

export default class AppbarIcon extends Component<void, Props, void> {
	static propTypes = {
		style: Icon.propTypes.style,
	};

	shouldComponentUpdate(nextProps: Props): boolean {
		return !shallowEqual(this.props, nextProps);
	}

	render() {
		return (
			<Icon
				{...this.props}
				style={[ styles.icon, this.props.style ]}
				size={24}
			/>
		);
	}
}
