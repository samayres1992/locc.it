import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import Recaptcha from 'react-google-invisible-recaptcha';
import { Form, Field } from 'react-final-form';
import { Alert, Input, Icon } from 'antd';
import classNames from 'classnames';
import * as actions from '../actions';
import '../css/login.css';

class LoginTemplate extends Component {

  constructor (props) {
    super();
    this.state = {
      login: false,
      email: '',
      password: '',
      recaptcha: true
    }
  }

  emailRender = (emailInput) => (
    <input {...emailInput.input} name={emailInput.name} className={classNames({"has-content": emailInput.meta.dirty, "fancy-input": !emailInput.dirty})} placeholder="" type="text" required />
  );

  passwordRender = (passwordField) => (
    <Input.Password {...passwordField.input} name={passwordField.name} className={classNames({"has-content": passwordField.meta.dirty, "fancy-input": !passwordField.dirty})} placeholder="" type="password" required />
  );

  loginSwitch = () => {
    this.setState(prevState => ({
      login: !prevState.login
    }));
  }

  verifyUserSubmission = ({ email, password }) => {
    // We need to make sure it's not a bot.
    this.setState({
      email: email,
      password: password
    });
    this.recaptcha.execute();
  }

  verifiedLoginSubmit = () => {
    const { email, password } = this.state;
    this.props.loginUser({ email, password });
    console.log("login called and submitted");
  }

  verifiedRegisterSubmit = () => {
    const { email, password } = this.state;
    this.props.registerUser({ email, password });
  }

  renderRedirect = () => {
    if (this.props.auth) {
      return <Redirect to='/dashboard' />
    }
  }

  render() {
    const { login } = this.state;
    const { auth } = this.props;
    const urlParams = window.location.search;
    const activationAlert = <Alert
      message="Activation success."
      description="Thank you for activating your account, please login to continue."
      type="success"
      showIcon
    />;

    if (auth) {
      return <Redirect to='/dashboard'/>;
    }

    return (
      <Fragment>
        { urlParams ? activationAlert : false  }
        <div  className={classNames({"container login": !login, "container login right-panel-active": login })} id="container">
          <div className="form-container sign-up-container">
          <Form 
            onSubmit={this.verifyUserSubmission}
            render={({ handleSubmit }) => (
              <form onSubmit={ handleSubmit } action="register">
                <h1>Sign up.</h1>
                <div className="input-effect">
                  <Field type="email" component={this.emailRender} placeholder="Email" name="email" />
                  <label><Icon type="user" /> Email</label>
                  <span className="focus-border">
                    <i></i>
                  </span>
                </div>
                <div className="input-effect" style={{ marginBottom: '15px' }}>
                  <Field type="password" component={this.passwordRender} placeholder="Password" name="password" />
                  <label><Icon type="lock" /> Password</label>
                  <span className="focus-border">
                    <i></i>
                  </span>
                </div>
                <div className="notice">
                  <span>Check password before continuing.</span>
                </div>
                <button className="button fancy-button">
                  Sign up
                  <span className="focus-border"><i></i></span>
                </button>
                <Recaptcha
                  ref={ ref => this.recaptcha = ref }
                  sitekey={process.env.REACT_APP_GOOGLE_SITE_KEY}
                  onResolved={this.verifiedRegisterSubmit}
                  badge={"bottomright"}
                />
              </form>
            )}
          />
          </div>
          <div className="form-container sign-in-container">
          <Form 
            onSubmit={this.verifyUserSubmission}
            render={({ handleSubmit }) => (
              <form onSubmit={ handleSubmit } action="login">
                <h1>Sign in.</h1>
                <div className="input-effect">
                  <Field type="email" component={this.emailRender} placeholder="Email" name="email" />
                  <label><Icon type="user" /> Email</label>
                  <span className="focus-border"><i></i></span>
                </div>
                <div className="input-effect" style={{ marginBottom: '15px' }}>
                  <Field type="password" component={this.passwordRender} placeholder="Password" name="password" />
                  <label><Icon type="lock" /> Password</label>
                  <span className="focus-border"><i></i></span>
                </div>
                <div className="forgot">
                  <a href="/forgot">Forgot your password?</a>
                </div>
                <button className="button fancy-button">
                  Sign in
                  <span className="focus-border"><i></i></span>  
                </button>
                <Recaptcha
                  ref={ ref => this.recaptcha = ref }
                  sitekey={process.env.REACT_APP_GOOGLE_SITE_KEY}
                  onResolved={this.verifiedLoginSubmit}
                  badge={"bottomright"}
                />
              </form>
            )}
          />
          </div>
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h2>Welcome back.</h2>
                <p>Sign in to view your dashboard.</p>
                <button onClick={this.loginSwitch} className="button fancy-button ghost">
                  Sign in
                  <span className="focus-border"><i></i></span>
              </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h2>Need an account?</h2>
                <p>Keep track of your shared credentials for free.</p>
                <button onClick={this.loginSwitch} className="button fancy-button ghost">
                  Sign up
                  <span className="focus-border"><i></i></span>
                </button>
              </div>
            </div>
          </div>
          <div className="social-container">
            <span>Or {login ? "sign up" : "sign in"} with</span>
            <div className="oauth">
              <a href="/auth/facebook" className="social"><Icon type="facebook" /></a>
              <a href="/auth/github" className="social"><Icon type="github" /></a>
              <a href="/auth/google" className="social"><Icon type="google" /></a>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth } = state;
  return { auth };
};

export default connect(mapStateToProps, actions)(LoginTemplate);