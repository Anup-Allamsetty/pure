/* @flow */

import React, { Component, PropTypes } from 'react';
import debounce from 'lodash/debounce';
import ReactNative from 'react-native';
import Colors from '../../../Colors';
import AppText from '../AppText';
import PageLoading from '../PageLoading';
import PageEmpty from '../PageEmpty';
import Icon from '../Icon';
import TouchFeedback from '../TouchFeedback';
import AppTextInput from '../AppTextInput';
import ActionSheet from '../ActionSheet';
import ActionSheetItem from '../ActionSheetItem';
import GCMPreferences from '../../../modules/GCMPreferences';
import type { User } from '../../../../lib/schemaTypes';

const {
	StyleSheet,
	ScrollView,
	View,
	PixelRatio,
	Switch,
} = ReactNative;

const styles = StyleSheet.create({
	settings: {
		alignItems: 'stretch',
	},
	section: {
		marginBottom: 8,
		backgroundColor: Colors.white,
		borderColor: Colors.separator,
		borderTopWidth: 1 / PixelRatio.get(),
		borderBottomWidth: 1 / PixelRatio.get(),
	},
	header: {
		fontSize: 12,
		lineHeight: 18,
		marginHorizontal: 16,
		marginTop: 12,
		marginBottom: 4,
		fontWeight: 'bold',
		color: Colors.grey,
	},
	icon: {
		color: Colors.grey,
		marginVertical: 16,
		marginHorizontal: 8,
	},
	inputContainer: {
		flexDirection: 'row',
		marginHorizontal: 8,
		paddingBottom: 2,
		borderColor: Colors.separator,
		borderBottomWidth: 1 / PixelRatio.get(),
	},
	growing: {
		flex: 1,
	},
	input: {
		paddingVertical: 8,
		marginHorizontal: 8,
	},
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		borderColor: Colors.separator,
		borderBottomWidth: 1 / PixelRatio.get(),
		padding: 16,
	},
	itemLabel: {
		flex: 1,
	},
	itemText: {
		color: Colors.darkGrey,
	},
	itemValueText: {
		fontSize: 12,
		lineHeight: 18,
	},
});

type Props = {
	user: { type: 'loading' } | User | null;
	saveUser: () => void;
	saveParams: () => void;
	signOut: () => void;
	onNavigation: () => void;
}

type State = {
	GCMEnabled: boolean;
	frequencySheetVisible: boolean;
}

const PUSH_NOTIFICATION_ENABLED_KEY = 'enabled';

export default class Account extends Component<void, Props, State> {
	static propTypes = {
		user: PropTypes.oneOfType([
			PropTypes.oneOf([ 'loading' ]),
			PropTypes.shape({
				id: PropTypes.string,
				meta: PropTypes.object,
				params: PropTypes.object,
			}),
		]),
		saveUser: PropTypes.func.isRequired,
		saveParams: PropTypes.func.isRequired,
		signOut: PropTypes.func.isRequired,
		onNavigation: PropTypes.func.isRequired,
	};

	state: State = {
		GCMEnabled: true,
		frequencySheetVisible: false,
	};

	componentWillMount() {
		this._updateGCMValue();
	}

	_saveUser: Function = debounce(user => this.props.saveUser(user), 1000);

	_updateGCMValue: Function = async (): Promise<void> => {
		let value = true;

		try {
			value = await GCMPreferences.getPreference(PUSH_NOTIFICATION_ENABLED_KEY);
		} catch (e) {
			// Ignore
		}

		this.setState({
			GCMEnabled: value !== 'false',
		});
	};

	_handleMetaItemChange: Function = (key: string, value: string) => {
		const {
			user,
		} = this.props;

		const meta = user && user.meta ? { ...user.meta } : {};

		meta[key] = value;

		this._saveUser({ ...this.props.user, meta });
	};

	_handleStatusChange: Function = (description: string) => {
		this._handleMetaItemChange('description', description);
	};

	_handleOccupationChange: Function = (occupation: string) => {
		this._handleMetaItemChange('occupation', occupation);
	};

	_handleNameChange: Function = (name: string) => {
		this._saveUser({ ...this.props.user, name });
	};

	_handleGCMChange: Function = (value: boolean) => {
		GCMPreferences.setPreference(PUSH_NOTIFICATION_ENABLED_KEY, value ? 'true' : 'false');

		this.setState({
			GCMEnabled: value,
		});
	};

	_handleEmailNotificationChange: Function = (value: string) => {
		const {
			user,
		} = this.props;

		const params = user && user.params ? { ...user.params } : {};
		const email = params.email ? { ...params.email } : {};

		email.notifications = value;

		this.props.saveParams({ ...params, email });
	};

	_handleEmailFrequencyChange: Function = (value: string) => {
		const {
			user,
		} = this.props;

		const params = user && user.params ? { ...user.params } : {};
		const email = params.email ? { ...params.email } : {};

		email.frequency = value;

		this.props.saveParams({ ...params, email });
	};

	_getSelectFrequencyHandler: Function = value => {
		return () => this._handleEmailFrequencyChange(value);
	};

	_handleShowFrequencySheet: Function = () => {
		this.setState({
			frequencySheetVisible: true,
		});
	};

	_handleRequestCloseFrequencySheet: Function = () => {
		this.setState({
			frequencySheetVisible: false,
		});
	};

	_handleSignOut: Function = () => {
		this.props.signOut();
	};

	render() {
		const { user } = this.props;

		if (!user) {
			return <PageEmpty label='Failed to load account' image='sad' />;
		}

		if (user && user.type === 'loading') {
			return <PageLoading />;
		}

		let email;

		if (user.params) {
			email = user.params.email;
		}

		return (
			<ScrollView contentContainerStyle={styles.settings}>
				<View style={styles.section}>
					<AppText style={styles.header}>Personal information</AppText>
					<View style={styles.inputContainer}>
						<Icon
							style={styles.icon}
							name='face'
							size={18}
						/>
						<AppTextInput
							style={[ styles.input, styles.growing ]}
							defaultValue={user.name}
							placeholder='Full name'
							autoCapitalize='words'
							onChangeText={this._handleNameChange}
							underlineColorAndroid='transparent'
						/>
					</View>
					<View style={styles.inputContainer}>
						<Icon
							style={styles.icon}
							name='short-text'
							size={18}
						/>
						<AppTextInput
							style={[ styles.input, styles.growing ]}
							defaultValue={user.meta ? user.meta.description : ''}
							placeholder='Status'
							autoCapitalize='sentences'
							onChangeText={this._handleStatusChange}
							underlineColorAndroid='transparent'
							multiline
						/>
					</View>
					<View style={styles.inputContainer}>
						<Icon
							style={styles.icon}
							name='business-center'
							size={18}
						/>
						<AppTextInput
							style={[ styles.input, styles.growing ]}
							defaultValue={user.meta ? user.meta.occupation : ''}
							placeholder='Occupation'
							autoCapitalize='sentences'
							onChangeText={this._handleOccupationChange}
							underlineColorAndroid='transparent'
						/>
					</View>
				</View>
				<View style={styles.section}>
					<AppText style={styles.header}>Notifications</AppText>
					<View style={styles.item}>
						<View style={styles.itemLabel}>
							<AppText style={styles.itemText}>Push notifications</AppText>
						</View>
						<Switch
							value={this.state.GCMEnabled}
							onValueChange={this._handleGCMChange}
						/>
					</View>
					<View style={styles.item}>
						<View style={styles.itemLabel}>
							<AppText style={styles.itemText}>Mention notifications via email</AppText>
						</View>
						<Switch
							value={email ? email.notifications !== false : false}
							onValueChange={this._handleEmailNotificationChange}
						/>
					</View>
					<TouchFeedback onPress={this._handleShowFrequencySheet}>
						<View style={styles.item}>
							<View style={styles.itemLabel}>
								<AppText style={styles.itemText}>Email digest frequency</AppText>
								<AppText style={styles.itemValueText}>
									{email && email.frequency ?
										email.frequency.charAt(0).toUpperCase() + email.frequency.slice(1) :
										'Daily'
									}
								</AppText>
							</View>

							<ActionSheet
								visible={this.state.frequencySheetVisible}
								onRequestClose={this._handleRequestCloseFrequencySheet}
							>
								<ActionSheetItem onPress={this._getSelectFrequencyHandler('daily')}>
									Daily
								</ActionSheetItem>
								<ActionSheetItem onPress={this._getSelectFrequencyHandler('never')}>
									Never
								</ActionSheetItem>
							</ActionSheet>
						</View>
					</TouchFeedback>
				</View>
				<View style={styles.section}>
					<AppText style={styles.header}>Other</AppText>
					<TouchFeedback onPress={this._handleSignOut}>
						<View style={styles.item}>
							<View style={styles.itemLabel}>
								<AppText style={styles.itemText}>Sign out</AppText>
							</View>
						</View>
					</TouchFeedback>
				</View>
			</ScrollView>
		);
	}
}
