import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import classNames from 'classnames';
import * as actions from '../actions';
import '../css/login.css';

class LoginTemplate extends Component {

  constructor (props) {
    super();
    this.state = {
      login: false
    }
  }

  loginSwitch = () => {
    this.setState(prevState => ({
      login: !prevState.login
    }));
  }

  render() {
    const { login } = this.state;
    const social = <div className="social-container">
      <a href="#" className="social"><Icon type="facebook" /></a>
      <a href="/auth/google" className="social"><Icon type="google" /></a>
      <a href="#" className="social"><Icon type="twitter" /></a>
    </div>;
    return (
      <div  className={classNames({"container login": !login, "container login right-panel-active": login })} id="container">
        <div className="form-container sign-up-container">
          <form action="#">
            <h1>Register</h1>
            <span>or use your email for registration</span>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button>Sign Up</button>
            { social }
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form action="#">
            <h1>Login</h1>
            <span>or use your account</span>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <a href="#">Forgot your password?</a>
            <button>Sign In</button>
            { social }
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h2>Welcome Back</h2>
              <p>Login to view your dashboard.</p>
              <button onClick={this.loginSwitch} className="ghost">Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h2>Need an account?</h2>
              <p>Keep track of your shared credentials for free.</p>
              <button onClick={this.loginSwitch} className="ghost">Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, actions)(LoginTemplate);