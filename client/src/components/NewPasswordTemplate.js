import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actions from '../actions';
import { Col, Row, Icon, Input, Popover } from 'antd';
import classNames from 'classnames';
import Recaptcha from 'react-google-invisible-recaptcha';
import { Form, Field } from 'react-final-form';

class NewPasswordTemplate extends Component {

  constructor (props) {
    super();
    const token = window.location.pathname.split('/')[2];
    console.log("called", token);
    this.state = {
      token: token,
      password: '',
      recaptcha: true
    }
  }

  passwordRender = (passwordField) => (
    <Input.Password {...passwordField.input} name={passwordField.name} className={classNames({"has-content": passwordField.meta.dirty, "fancy-input": !passwordField.dirty})} placeholder="" type="password" required />
  );

  verifyPasswordSubmission = ({ password }) => {
    // We need to make sure it's not a bot.
    this.setState({
      password: password
    });
    this.recaptcha.execute('new-password');
  }

  verifiedPasswordSubmit = () => {
    const { token, password } = this.state;
    this.props.clearErrors();
    this.props.anonResetNewPassword({ token, password });
  }

  render() {
    const { auth, errors } = this.props;
    const requirement = "Password requires 8 or more characters, which include a symbol, uppercase letter, and number.";

    if (auth && !errors ) {
      return <Redirect to='/'/>;
    }
    return (
      <div className="settings new-password">
        <Row gutter={16} type="flex" justify="center">
          <Col span={18}>
            <h1>Set your new password</h1>
            <div className="update">
              <Form 
                onSubmit={this.verifyPasswordSubmission}
                render={({ handleSubmit }) => (
                  <form onSubmit={ handleSubmit } action="new-password">
                    <Popover width={"300px"} content={requirement} title="Password requirements" trigger="hover">
                      <Icon type="info-circle" />
                    </Popover>
                    <div className="input-effect">
                      <Field type="password" component={this.passwordRender} placeholder="Password" name="password" />
                      <label><Icon type="user" /> Password</label>
                      <span className="focus-border">
                        <i></i>
                      </span>
                    </div>
                    { errors && errors.password ? <span className="error-form">{ errors.password }</span> : null }
                    <button className="button fancy-button">
                      Confirm new password
                      <span className="focus-border"><i></i></span>
                    </button>
                    <Recaptcha
                      ref={ ref => this.recaptcha = ref }
                      sitekey={process.env.REACT_APP_GOOGLE_SITE_KEY}
                      onResolved={this.verifiedPasswordSubmit}
                      badge={"bottomright"}
                    />
                  </form>
                )}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth, errors  } = state;
  return { auth: auth, errors: errors  };
}

export default connect(mapStateToProps, actions)(NewPasswordTemplate);