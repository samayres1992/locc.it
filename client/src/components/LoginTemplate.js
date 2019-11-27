import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import classNames from 'classnames';
import * as actions from '../actions';
import '../css/login.css';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '../fonts/iconfont.js',
});

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
    return (
      <div  className={classNames({"container login": !login, "container login right-panel-active": login })} id="container">
        <div className="form-container sign-up-container">
          <form action="/auth/local">
            <h1>Sign up</h1>
            <span>or use your email for registration</span>
            <input type="email" placeholder="Email" name="email" />
            <input type="password" placeholder="Password" name="password" />
            <button>Sign Up</button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form action="#">
            <h1>Sign in</h1>
            <span>or use your account</span>
            <input type="email" placeholder="Email" name="email" />
            <input type="password" placeholder="Password" name="password" />
            <a href="#">Forgot your password?</a>
            <button>Sign In</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h2>Welcome Back</h2>
              <p>Sign in to view your dashboard.</p>
              <button onClick={this.loginSwitch} className="ghost">Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h2>Need an account?</h2>
              <p>Keep track of your shared credentials for free.</p>
              <button onClick={this.loginSwitch} className="ghost">Sign Up</button>
            </div>
          </div>
        </div>
        <div className="social-container">
          <span>Or {login ? "sign up" : "sign in"} with</span>
          <div className="oauth">
            <a href="/auth/facebook" className="social"><IconFont type="facebook" /></a>
            <a href="/auth/github" className="social"><Icon type="github" /></a>
            <a href="/auth/google" className="social"><Icon type="google" /></a>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, actions)(LoginTemplate);