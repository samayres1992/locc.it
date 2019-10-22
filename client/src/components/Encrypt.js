import React from 'react'
import Crypto from 'crypto';

class EncryptDetails extends React.Component {
	// Generate the decryption key for user
	codeGen(len, charSet) {
	    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	    var randomString = '';
	    for (var i = 0; i < len; i++) {
	        var randomPoz = Math.floor(Math.random() * charSet.length);
	        randomString += charSet.substring(randomPoz,randomPoz+1);
	    }
	    return randomString;
	}

	encrypt (values) {
		const key = this.codeGen(5);
		// Let's take the value and encrypt it with 
		const cipher = Crypto.createCipher('aes-256-cbc', key);

		// Encrypt the details using our new cipher
		cipher.update(values, 'utf8', 'base64');

		// remove this before prod
		var encryptedPassword = cipher.final('base64');
		console.log(encryptedPassword);
		console.log(key);

		return key;
	}
}


export default EncryptDetails;