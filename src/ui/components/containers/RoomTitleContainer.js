/* @flow */

import React, { PropTypes } from 'react';
import Connect from '../../../modules/store/Connect';
import AppbarTitle from '../views/AppbarTitle';

const RoomTitleContainer = (props: any) => (
	<Connect
		mapSubscriptionToProps={{
			title: {
				key: {
					type: 'entity',
					id: props.room
				},
				transform: room => room && room.name ? room.name : 'Loading…'
			}
		}}
		passProps={props}
		component={AppbarTitle}
	/>
);

RoomTitleContainer.propTypes = {
	room: PropTypes.string.isRequired
};

export default RoomTitleContainer;
