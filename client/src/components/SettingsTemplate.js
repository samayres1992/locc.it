import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';
import { Modal, Icon, notification, Row, Col } from 'antd';
import * as actions from '../actions';
import classNames from 'classnames';
import Axios from 'axios';

class SettingsTemplate extends Component {

  constructor() {
    super();
    this.state = { visible: false };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  hideModal = () => {
    this.setState({
      visible: false,
    });
  };

  emailRender = (emailInput) => (
    <input {...emailInput.input} name={emailInput.name} className={classNames({"has-content": emailInput.meta.dirty, "fancy-input": !emailInput.dirty})} placeholder="" type="email" required />
  );

  passwordRender = (passwordField) => (
    <input {...passwordField.input} name={passwordField.name} className={classNames({"has-content": passwordField.meta.dirty, "fancy-input": !passwordField.dirty})}  placeholder="" type="password" required />
  );

  deleteWarning = () => {
    Modal.warning({
      title: "Please confirm account deletion.",
      content: "Deleting your account results in your account and all your encrypted credentials being deleted.",
      visible: this.state.visible,
      onOk: this.deleteUser,
      okText: "Yes, delete my account",
      onCancel: this.hideModal,
      cancelText: "No, don't delete my account"
    });
  }

  deleteUser = () => {
    const { _id } = this.props.auth;
    Axios.post('/auth/delete_user', {
      data: {
        authId: _id
      }
    }).then(res => {
      if(res.data === 'OK') {
        this.openNotificationWithIcon('success', 'delete_user');
        // Update props to reflect user logout
        this.props.fetchUser();
      }
      else {
        this.openFailureNotificationWithIcon('error', 'delete_user_failed');
      }
    });
  }

  updatePassword = ({ password }) => {
    const { _id } = this.props.auth;
    Axios.post('/auth/update_password', {
      data: {
        authId: _id,
        password: password
      }
    }).then(res => {
      if(res.data.errors) {
        this.openFailureNotificationWithIcon('error', 'password_update_failed');
      }
      else {
        this.openNotificationWithIcon('success', 'update_password');
      }
    });
  }

  updateEmail = ({ email }) => {
    const { _id } = this.props.auth;
    Axios.post('/auth/update_email', {
      data: {
        authId: _id,
        email: email
      }
    }).then(res => {
      if(res.data.errors) {
        this.openFailureNotificationWithIcon('error', 'update_email_failed');
      }
      else {
        this.openNotificationWithIcon('success', 'update_email');
      }
    });
  }

  openNotificationWithIcon = (type, action) => {
    switch (action) {
      case 'delete_user':
          notification[type]({
            message: 'Delete user successful.',
            description: 'Your account has been deleted.',
            placement: 'bottomLeft'
          });
        break;
      case 'update_password':
          notification[type]({
            message: 'Password update successful.',
            description: 'Your account details have been updated.',
            placement: 'bottomLeft'
          });
        break;
      case 'update_email':
          notification[type]({
            message: 'Email update successful.',
            description: 'Your account details have been updated.',
            placement: 'bottomLeft'
          });
        break;
      default:
        break;
    }
  };

  openFailureNotificationWithIcon = (type, action) => {
    switch (action) {
      case 'password_update_failed':
          notification[type]({
            message: 'Update failed.',
            description: 'Password requirements not met.',
            placement: 'bottomLeft'
          });
          break;
      case 'update_email_failed':
        notification[type]({
          message: 'Update email failed.',
          description: 'Something went wrong, please try again.',
          placement: 'bottomLeft'
        });
        break;
      case 'delete_user_failed':
          notification[type]({
            message: 'Delete user failed.',
            description: 'Something went wrong, please try again.',
            placement: 'bottomLeft'
          });
          break;
      default:
        break;
    }
  };

  render() {
    const { auth, errors } = this.props;

    return (
      <div className="settings">
        { auth ? null : <Redirect to='/' /> }
        <h1>Manage your account.</h1>
        <Row type="flex" gutter={16}>
          <Col className="settings-block" xs={24} sm={24} md={12} xl={12} xxl={12}>
            <div className="update">
              <h2>Update Email.</h2>
              <p>You will be emailed an activation link to confirm your account.</p>
              <Row type="flex" align="bottom">
                <Col span={24}>
                  <Form 
                    onSubmit={this.updateEmail}
                    render={({ handleSubmit }) => (
                      <form onSubmit={handleSubmit} action="updateEmail">
                        <div className="input-effect">
                          <Field name="email" component={ this.emailRender } />
                            <label><Icon type="user" /> Email</label>
                            <span className="focus-border">
                              <i></i>
                            </span>
                        </div>
                        <button className="submit button fancy-button" onClick={ this.handleSubmit }>
                          Update
                          <span className="focus-border"><i></i></span>
                        </button>
                      </form>
                    )}
                  />
                </Col>
              </Row>
            </div>
          </Col>
          <Col className="settings-block" xs={24} sm={24} md={12} xl={12} xxl={12} style={{ flexWrap: 'wrap', flex: 1 }}>
            <div className="update">
              <h2>Update password.</h2>
              <p>Password requires 8 or more characters, which include a symbol, uppercase letter, and number.</p>
              <Row type="flex" align="bottom">
                <Col span={24}>
                  <Form 
                    onSubmit={this.updatePassword}
                    render={({ handleSubmit }) => (
                      <form onSubmit={handleSubmit} action="updatePassword">
                        <div className="input-effect">
                          <Field name="password" component={ this.passwordRender } />
                            <label><Icon type="lock" /> Password</label>
                            <span className="focus-border">
                              <i></i>
                            </span>
                        </div>
                        { errors && errors.password ? <span className="error-form">{ errors.password }</span> : null }
                        <button className="submit button fancy-button" onClick={ this.handleSubmit }>
                          Update
                          <span className="focus-border"><i></i></span>
                        </button>
                      </form>
                    )}
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col className="settings-block" xs={24} sm={24} md={12} xl={12} xxl={12}>
            <div className="logout">
              <h2>Sign out.</h2>
              <p>Sign out of your account on your current browser.</p>
              <a className="button fancy-button" href="/auth/logout">
                Sign out
                <span className="focus-border"><i></i></span>
              </a>
            </div>
          </Col>
          <Col xs={24} sm={24} md={12} xl={12} xxl={12}>
            <div className="delete">
              <h2>Account deletion.</h2>
              <p>Delete your account and all credentials you have encrypted.</p>
              <button className="button fancy-button" onClick={ this.deleteWarning }>
                Delete my account
                <span className="focus-border"><i></i></span>
              </button>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth, errors } = state;
  return { auth: auth, errors: errors };
}

export default connect(mapStateToProps, actions)(SettingsTemplate);