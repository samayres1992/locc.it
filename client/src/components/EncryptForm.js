import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';
import classNames from 'classnames';
import * as actions from '../actions';
import CryptoJS from 'crypto-js';

class EncryptForm extends Component {

  inputRender = (inputField) => (
    <input {...inputField.input} name={inputField.name} className={classNames({"has-content": inputField.meta.dirty, "fancy-input": !inputField.dirty})} type={inputField.type} placeholder="" type="text" required />
  );

  passwordRender = (passwordField) => (
    <input {...passwordField.input} name={passwordField.name} className={classNames({"has-content": passwordField.meta.dirty, "fancy-input": !passwordField.dirty})} type={passwordField.type} placeholder="" type="password" required />
  );

  textareaRender = (text) => (
    <textarea {...text.input} name={text.name} className={classNames({"has-content": text.meta.dirty, "fancy-input": !text.dirty})} type={text.type} placeholder="" type="text" required />
  );

  onSubmit = values => {
    this.encryptData(values);
  }

  // Generate the decryption key for user
	stringGenerator (len, charSet) {
      if (charSet === 'alphabet') {
        // For URL string
        charSet = 'abcdefghijklmnopqrstuvwxyz';
      }
      else {
        // AlphaNumeric - for passcode - only uppercase
        charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      }

      let randomString = '';
      for (let i = 0; i < len; i++) {
          let randomPoz = Math.floor(Math.random() * charSet.length);
          randomString += charSet.substring(randomPoz,randomPoz+1);
      }
      
	    return randomString;
	}

	encryptData (data) {
    // Deconstruct the data we wish to encrypt
    const { title, emailUsername, password, note } = data;
    // Generate a key for the user to use for decryption
    const passcode = this.stringGenerator(8);
    const url = this.stringGenerator(10, 'alphabet');

    // Let's take the value and encrypt it with
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify({ 
      emailUsername: emailUsername, 
      password: password, 
      note: note
    }), passcode);

    // Decrypt
    let bytes  = CryptoJS.AES.decrypt(encryptedData.toString(), passcode);
    let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    // Pass over the data to the action
    this.props.encrypt({ 
      title: title, 
      encryptedData: encryptedData,
      url: url
    });

    this.props.updatePasscode({
      'passcode': passcode
    });
	
    return { passcode, url };
	}

  render() {
    const { pristine, submitting} = this.props;

    return (
      <Form 
        onSubmit={this.onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="input-effect">
              <Field name="title" component={this.inputRender} />
                <label>Title</label>
                <span className="focus-border">
                  <i></i>
                </span>
            </div>
            <div className="input-effect">
              <Field name="emailUsername" component={this.inputRender} />
                <label>Email/Username</label>
                <span className="focus-border">
                  <i></i>
                </span>
            </div>
            <div className="input-effect">
              <Field name="password" component={this.passwordRender} />
                <label>Password</label>
                <span className="focus-border">
                  <i></i>
                </span>
            </div>
            <div className="input-effect">
              <Field name="note" component={this.textareaRender} />
                <label>Note</label>
                <span className="focus-border">
                  <i></i>
                </span>
            </div>
            <button className="submit button fancy-button" disabled={pristine || submitting}>
              Encrypt
              <span className="focus-border">
                <i></i>
              </span>
            </button>
          </form>
        )}
      />
    );
  }
}

export default connect(null, actions)(EncryptForm);