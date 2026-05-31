import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import classNames from 'classnames';
import * as actions from '../actions';

class DecryptForm extends Component {

  constructor(props) {
    super(props);
    const path = window.location.pathname.split('/')[2];
    this.state = { path: path };
  }

  componentDidMount() {
    // Zero-knowledge flow: fetch the ciphertext from the server now,
    // then run the AES decrypt locally when the recipient enters the passcode.
    // The passcode never leaves the browser.
    const { path } = this.state;
    this.props.fetchSecret(path);
  }

  inputRender = (inputField) => (
    <input { ...inputField.input } name={ inputField.name } className={ classNames({ "has-content": inputField.meta.dirty, "fancy-input": !inputField.dirty })} placeholder="" type="text" required />
  );

  onSubmit = ({ passcode }) => {
    const { path } = this.state;
    const { decryptForm } = this.props;
    if (!decryptForm || !decryptForm.ciphertext) return;
    // Check if still locked out.
    if (decryptForm.locked && new Date() < new Date(decryptForm.locked)) return;
    this.props.tryClientDecrypt(decryptForm.ciphertext, passcode, path);
  }

  render() {
    const { decryptForm, errors } = this.props;

    // The fetchSecret action hasn't responded yet — render nothing while the
    // ciphertext is in flight. Avoids a flash of the form against a missing
    // payload.
    const fetchInFlight = decryptForm === null;

    // The server told us this URL is unreachable (404 / 410 / network error).
    // The fetchSecret action set a user-facing error; bounce to /404.
    const fetchFailed = !fetchInFlight
      && decryptForm
      && !decryptForm.ciphertext
      && !decryptForm.lockId
      && !decryptForm.locked
      && errors
      && errors.user;

    if (fetchInFlight) return null;
    if (fetchFailed) return <Redirect to='/404' />;

    return (
      <Fragment>
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
            </form>
          )}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { decryptForm, errors } = state;
  return { decryptForm, errors };
}

export default connect(mapStateToProps, actions)(DecryptForm);
