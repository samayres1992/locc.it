import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Recaptcha from 'react-google-invisible-recaptcha';
import { Form, Field } from 'react-final-form';
import classNames from 'classnames';
import * as actions from '../actions';

class DecryptForm extends Component {

  constructor() {
    super()
    const path = window.location.pathname.split('/')[2];
    this.state = {
      path: path
    }
  }

  componentDidMount() {
    const { path } = this.state;
    this.props.checkUrl(path);
  }

  inputRender = (inputField) => (
    <input { ...inputField.input } name={ inputField.name } className={ classNames({ "has-content": inputField.meta.dirty, "fancy-input": !inputField.dirty })} placeholder="" type="text" required />
  );
  
  checkSubmit = ({ passcode }) => {
    // We need to make sure it's not a bot.
    this.setState({
      passcode: passcode
    });
    this.recaptcha.execute('decrypt');
  }

  onSubmit = values => {
    this.decryptData(values);
  }

  decryptData (passcode) {
    const { lockId } = this.props.decryptForm;
    this.props.tryUserDecrypt(lockId, passcode);
  }

  render() {
    const { decryptForm } = this.props;
    return (
      <Fragment>
        { decryptForm && !decryptForm.lockId && !decryptForm.locked ? <Redirect to='/404' /> : null }
        <Form 
          onSubmit={this.onSubmit}
          render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} action="decrypt">
            <div className="input-effect">
              <Field name="passcode" component={this.inputRender} />
                <label>Passcode</label>
                <span className="focus-border">
                  <i></i>
                </span>
            </div>
            <button className="submit button fancy-button">
                Decrypt
                <span className="focus-border">
                  <i></i>
                </span>
            </button>
            <Recaptcha
              ref={ ref => this.recaptcha = ref }
              sitekey={process.env.REACT_APP_GOOGLE_SITE_KEY}
              onResolved={this.verifiedRegisterSubmit}
            />
            </form>
          )} 
        />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { decryptForm } = state;
  return { decryptForm: decryptForm };
}

export default connect(mapStateToProps, actions)(DecryptForm);


