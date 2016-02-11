'use strict';

import { config } from '../../core';

let nodemailer = require('nodemailer'),
	log = require('winston'),
	transport;

function send(from, to, sub, html) {

	let email = {
		from: from,
		to: to,
		subject: sub,
		html: html,
		bcc: config && config.bcc || ''
	};
	console.log(email);
	transport.sendMail(email, (e) => {
		if (e) {
				log.log('error in sending email: ', e, 'retrying...');
				setTimeout(() => {
					send(email.from, email.to, email.subject, email.html);
				}, 300000);
			} else log.info('Email sent successfully to ', email.to);
	});
}

module.exports = () => {
	transport = nodemailer.createTransport('SMTP', {
		host: 'email-smtp.us-east-1.amazonaws.com',
		secureConnection: true,
		port: 465,
		auth: config && config.auth
	});
	return send;
};
