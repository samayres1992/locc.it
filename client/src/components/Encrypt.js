import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { formValueSelector } from 'redux-form';
import Crypto from 'crypto';

class Encrypt extends Component {
	
	// Generate the decryption key for user
	codeGen (len, charSet) {
	    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	    var randomString = '';
	    for (var i = 0; i < len; i++) {
	        var randomPoz = Math.floor(Math.random() * charSet.length);
	        randomString += charSet.substring(randomPoz,randomPoz+1);
	    }
	    return randomString;
	}

	encrypt () {
		const form = formValueSelector('form');
		const values = form('emailUsername', 'password', 'node');
		const key = this.codeGen(5);
		// Let's take the value and encrypt it with 
		const cipher = Crypto.createCipher('aes-256-cbc', key);
		console.log('form', form.state);
		console.log('values', values);
		// Encrypt the details using our new cipher
		cipher.update(values, 'utf8', 'base64');

		// remove this before prod
		var encryptedPassword = cipher.final('base64');
		console.log('encryptedPassword', encryptedPassword);
		console.log('key', key);
	
		this.setState({
			'encrypt': key
		});

		console.log('stateEncrypt', this.state.encrypt);
	}
}

function mapStateToProps({ key }) {
  return {
		encrypt: key || null
	};
}

export default connect(mapStateToProps, actions)(Encrypt);