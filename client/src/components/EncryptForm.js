import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';
import classNames from 'classnames';
import * as actions from '../actions';
import CryptoJS from 'crypto-js';
// import Encrypt from './Encrypt';

class EncryptForm extends Component {

  inputRender = (field) => (
    <input {...field.input} name={field.name} className={classNames({"has-content": field.meta.dirty, "fancy-input": !field.dirty})} type={field.type} placeholder="" type="text" required />
  );

  passwordRender = (field) => (
    <input {...field.input} name={field.name} className={classNames({"has-content": field.meta.dirty, "fancy-input": !field.dirty})} type={field.type} placeholder="" type="password" required />
  );

  textareaRender = (field) => (
    <textarea {...field.input} name={field.name} className={classNames({"has-content": field.meta.dirty, "fancy-input": !field.dirty})} type={field.type} placeholder="" type="text" required />
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
        // AlphaNumeric - for passcode
        charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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
    // This should never be passed to the server
    const key = this.stringGenerator(5);
    const url = this.stringGenerator(10, 'alphabet');

    // Let's take the value and encrypt it with 
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify({ 
      emailUsername: emailUsername, 
      password: password, 
      note: note
    }), key);

    // Pass over the data to the action
    this.props.encrypt({ 
      title: title, 
      encryptedData: encryptedData,
      url: url
    });
	
		this.setState({
			'title': title,
			'encryptedData': encryptedData,
      'key': key,
      'url': url
    });
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

function mapStateToProps({ key }) {
  return {
    key: key || null,
  };
}

export default connect(mapStateToProps, actions)(EncryptForm);