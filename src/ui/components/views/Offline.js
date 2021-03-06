/* @flow */

import React, { Component } from 'react';
import Radium from 'radium';
import shallowEqual from 'shallowequal';
import Colors from '../../Colors';
import Page from './Page';

const styles = {
	container: {
		padding: 16,
		backgroundColor: Colors.primary,
	},
	image: {
		marginLeft: 16,
		marginRight: 16,
		marginTop: 48,
		marginBottom: 48,
	},
	header: {
		color: Colors.white,
		fontSize: 20,
	},
	footer: {
		color: Colors.white,
	},
};

type Props = {
	style?: any;
}

class Offline extends Component<void, Props, void> {
	static propTypes = {
		style: Page.propTypes.style,
	};

	shouldComponentUpdate(nextProps: Props): boolean {
		return !shallowEqual(this.props, nextProps);
	}

	render() {
		return (
			<Page {...this.props} style={[ styles.container, this.props.style ]}>
				<div style={styles.header}>Network unavailable!</div>
				<img style={styles.image} src={require('../../../../assets/astronaut.png')} />
				<div style={styles.footer}>Waiting for connection…</div>
			</Page>
		);
	}
}

export default Radium(Offline);
