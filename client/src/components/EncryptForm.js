import React, { Component } from 'react';
import { connect } from 'react-redux';
import Recaptcha from 'react-google-invisible-recaptcha';
import { Form, Field } from 'react-final-form';
import { DatePicker, Icon } from 'antd';
import Moment from 'moment';
import classNames from 'classnames';
import * as actions from '../actions';
import CryptoJS from 'crypto-js';
import randomString from 'shortid';

class EncryptForm extends Component {

  constructor (props) {
    super();
    this.state = {
      title: '',
      emailUsername: '',
      password: '',
      note: '',
      expiry: {}
    }
  }

  inputRender = (inputField) => (
    <input {...inputField.input} name={inputField.name} className={classNames({"has-content": inputField.meta.dirty, "fancy-input": !inputField.dirty})} placeholder="" type="text" required />
  );

  passwordRender = (passwordField) => (
    <input {...passwordField.input} name={passwordField.name} className={classNames({"has-content": passwordField.meta.dirty, "fancy-input": !passwordField.dirty})}  placeholder="" type="password" required />
  );

  textareaRender = (text) => (
    <textarea {...text.input} name={text.name} className={classNames({"has-content": text.meta.dirty, "fancy-input": !text.dirty})} placeholder="" type="text" />
  );

  datePickerRender = ({ input, ...rest }) => {
    const { disableInputs } = this.state;
    console.log("state", this.state);
    console.log("datepicker", input);
    console.log("datepicker rest", rest);
    return <DatePicker disabled={disableInputs} {...input} {...rest} style={{ width: '34%' }} defaultValue={Moment()} value={input.value !== '' ? input.value : Moment().add(7, 'days')} placeholder="Set expiry date for password" format={"[Expires on] MMMM Do, YYYY"} disabledDate={(current) => { return Moment().add(-1, 'days')  >= current; }} required />
  };

  checkSubmit = ({ title, emailUsername, password, expiry, note }) => {
    // We need to make sure it's not a bot.
    this.setState({
      title: title,
      emailUsername: emailUsername,
      password: password,
      expiry: expiry,
      note: note,
    });
    this.recaptcha.execute('encrypt');
  }

  onSubmit = () => {
    this.encryptData();
  }

	encryptData = () => {
    // Deconstruct the data we wish to encrypt
    const { title, emailUsername, password, expiry, note } = this.state;
    const { _id: userId } = this.props.auth;

    // Let's take the value and encrypt it with
    // Generate a key for the user to use for decryption
    let passcode = randomString.generate();
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify({ 
      emailUsername: emailUsername, 
      password: password, 
      note: note
    }), passcode);

    // Pass over the data to the action, if user doesn't specify a date, default to a week.
    this.props.encrypt({ 
      userId: userId ? userId : null,
      title: title,
      encryptedData: encryptedData,
      expiry: expiry ? expiry.format('YYYY-MM-DD') : Moment().add(7, 'days').format('YYYY-MM-DD')
    });

    this.props.generatedPasscode({
      'passcode': passcode
    });
	}

  render() {
    return (
      <Form 
        onSubmit={this.checkSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} action="encrypt">
            <div className="input-effect">
              <Field name="title" component={this.inputRender} />
                <label><Icon type="pushpin" /> Title *</label>
                <span className="focus-border">
                  <i></i>
                </span>
            </div>
            <div className="input-effect">
              <Field name="emailUsername" component={this.inputRender} />
                <label><Icon type="user" /> Email/Username *</label>
                <span className="focus-border">
                  <i></i>
                </span>
            </div>
            <div className="input-effect">
              <Field name="password" component={this.passwordRender} />
              <label><Icon type="lock" /> Password *</label>
              <span className="focus-border">
                <i></i>
              </span>
              <Field name="expiry" component={this.datePickerRender} required />
            </div>
            <div className="input-effect">
              <Field name="note" component={this.textareaRender} />
                <label><Icon type="form" /> Note</label>
                <span className="focus-border">
                  <i></i>
                </span>
            </div>
            <p>* Indicates a required field.</p>
            <button className="submit button fancy-button">
              Encrypt
              <span className="focus-border">
                <i></i>
              </span>
            </button>
            <Recaptcha
              ref={ ref => this.recaptcha = ref }
              sitekey={process.env.REACT_APP_GOOGLE_SITE_KEY}
              onResolved={this.onSubmit}
            />
          </form>
        )}
      />
    );
  }
}

export default connect(null, actions)(EncryptForm);