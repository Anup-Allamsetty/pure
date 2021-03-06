/* @flow */

import React, { Component, PropTypes } from 'react';
import ReactNative from 'react-native';
import shallowEqual from 'shallowequal';
import Colors from '../../Colors';
import AppText from './AppText';

const {
	StyleSheet,
	Animated,
	View,
} = ReactNative;

const styles = StyleSheet.create({
	badge: {
		height: 24,
		width: 24,
		borderRadius: 12,
		paddingVertical: 4,
		backgroundColor: Colors.accent,
	},
	count: {
		color: Colors.white,
		fontWeight: 'bold',
		fontSize: 10,
		lineHeight: 15,
		textAlign: 'center',
	},
});

type Props = {
	count: number;
	style?: any;
}

type State = {
	scaleAnim: Animated.Value
}

export default class NotificationBadge extends Component<void, Props, State> {
	static propTypes = {
		count: PropTypes.number.isRequired,
		style: Animated.View.propTypes.style,
	};

	state: State = {
		scaleAnim: new Animated.Value(0),
	};

	componentDidMount() {
		if (this.props.count > 0) {
			this._scaleIn();
		}
	}

	shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
		return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
	}

	componentWillUpdate(nextProps: Props) {
		if (nextProps.count > 0) {
			if (this.props.count === 0) {
				this._scaleIn();
			} else {
				this._bounce();
			}
		} else {
			if (this.props.count > 0) {
				this._scaleOut();
			}
		}
	}

	_bounce: Function = () => {
		Animated.timing(this.state.scaleAnim, {
			toValue: 0.5,
			duration: 100,
		}).start(() => {
			Animated.timing(this.state.scaleAnim, {
				toValue: 1,
				duration: 100,
			}).start();
		});
	};

	_scaleIn: Function = () => {
		Animated.spring(this.state.scaleAnim, {
			toValue: 1,
		}).start();
	};

	_scaleOut: Function = () => {
		Animated.spring(this.state.scaleAnim, {
			toValue: 0,
		}).start();
	};

	render(): ?React.Element {
		const { count } = this.props;

		if (!count) {
			return null;
		}

		return (
			<Animated.View {...this.props} style={[ { transform: [ { scale: this.state.scaleAnim } ] }, styles.badge, this.props.style ]}>
				<AppText style={styles.count}>
					{count < 100 ? count : '99+'}
				</AppText>
			</Animated.View>
		);
	}
}
