import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import CryptoJS from 'crypto-js';
import { parse } from 'flatted/esm';
import { Form, Field } from 'react-final-form';
import classNames from 'classnames';
import * as actions from '../actions';
import lock from '../images/lock.svg';

const mapStateToProps = (state) => {
  return {
    ...state,
    state
  };
}

class DecryptForm extends Component {

  componentDidMount() {
    const path = window.location.pathname.split('/')[2];
    this.props.checkUrl(path);
  }

  inputRender = (inputField) => (
    <input {...inputField.input} name={inputField.name} className={classNames({"has-content": inputField.meta.dirty, "fancy-input": !inputField.dirty})} type={inputField.type} placeholder="" type="text" required />
  );

  decryptData (passcode) {
    // Let's take the value and decrypt it
    const { encryptedData } = this.props.retrievedData;
    const data = parse(encryptedData);

    // Decrypt
    let bytes  = CryptoJS.AES.decrypt(data, passcode.passcode.toString());
    let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    this.props.passcodeDecrypted(decryptedData);
    this.setState({ decryptForm: decryptedData });
	}

  onSubmit = values => {
    this.decryptData(values);
  }

  render() {
    return (
      <Fragment>
        <div className="check">
          <img className='lock' src={lock} alt='lock' />
          <span className="success">Please enter the passcode you were provided.</span>
        </div>
        <Form 
          onSubmit={this.onSubmit}
          render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="input-effect">
              <Field name="passcode" component={this.inputRender} />
                <label>Passcode</label>
                <span className="focus-border">
                  <i></i>
                </span>
            </div>
          </form>
        )} />
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, actions)(DecryptForm);


