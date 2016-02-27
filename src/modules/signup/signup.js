/* @flow */

import { bus, cache, config, Constants } from '../../core-server';
import jwt from 'jsonwebtoken';
import merge from 'lodash/merge';
import winston from 'winston';
// sign with default (HMAC SHA256)

const TOKEN_VALIDITY = 604800, // seven days
	ISSUER = config.host,
	AUDIENCE = config.host,
	KEY = config.session.private_key;

function getIdentitiesFromJWT(token) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, KEY, { aud: AUDIENCE }, (err, decoded) => {
			if (err) {
				reject(err);
			} else {
				resolve(decoded.sub);
			}
		});
	});
}

function generateSignedIdentities(identities) {
	return new Promise((resolve) => {
		jwt.sign({
			iss: ISSUER, sub: identities, aud: AUDIENCE,
			iat: Math.floor((new Date()).getTime() / 1000),
			exp: Math.floor((new Date()).getTime() / 1000) + TOKEN_VALIDITY // seven days
		}, KEY, {
			algorithm: 'HS256',
			type: 'JWS'
		}, (session) => {
			resolve(session);
		});
	});
}

function signuphandler(changes, next) {
	let signup = {};

	if (changes.auth && changes.auth.signup) {
		getIdentitiesFromJWT(changes.auth.signup.signedIdentities)
		.then((identities) => {
			changes.auth.signup.identities = identities;
			delete changes.auth.signup.signedIdentities;

			cache.getEntity(changes.auth.signup.id, (err, entity) => {
				if (err) return next(err);
				if (entity) return next(new Error('USER_ALREADY_EXIST'));
				changes.state = (changes.state || {}).user = changes.auth.signup.id;
				((changes.response = (changes.response || {})).state || {}).user = changes.auth.signup.id;
				(changes.entities = changes.entities || {})[changes.auth.signup.id] = changes.auth.signup;
				winston.info('okay its a sign up.', changes.entities);
				return next();
			});
		})
		.catch(next);
	} else if (changes.auth && changes.auth.signin) {
		signup = merge(changes.auth.signin, signup);
		changes.response = changes.response || {};
		changes.response.state = changes.response.state || {};
		changes.response.state.signup = signup;

		generateSignedIdentities(signup.identities).then((session) => {
			signup.signedIdentities = session;
			next();
		});
	} else {
		next();
	}
}

bus.on('change', signuphandler, Constants.APP_PRIORITIES.AUTHENTICATION_SIGNUP);
winston.info('signup module ready...');
