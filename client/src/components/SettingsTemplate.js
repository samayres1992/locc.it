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

  inputRender = (inputField) => (
    <input {...inputField.input} name={inputField.name} className={classNames({"has-content": inputField.meta.dirty, "fancy-input": !inputField.dirty})} placeholder="" type="text" required />
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
        // Update props to reflect user logout
        this.props.fetchUser();
      }
      else {
        this.openFailureNotificationWithIcon('error', 'delete_failed');
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
      console.log('res.status', res.data);
      if(res.data === 'OK') {
        this.openNotificationWithIcon('success', 'update_password');
      }
      else {
        this.openFailureNotificationWithIcon('error', 'update_failed');
      }
    });
  }

  openNotificationWithIcon = ( type, action ) => {
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
      default:
        break;
    }
  };

  openFailureNotificationWithIcon = ( type, action ) => {
    switch (action) {
      case 'update_failed':
        notification[type]({
          message: 'Update failed.',
          description: 'Something went wrong, please try again.',
          placement: 'bottomLeft'
        });
        break;
      case 'delete_failed':
          notification[type]({
            message: 'Delete failed.',
            description: 'Something went wrong, please try again.',
            placement: 'bottomLeft'
          });
          break;
      default:
        break;
    }
  };

  render() {
    const { auth } = this.props;

    return (
      <div className="settings">
        { auth ? null : <Redirect to='/' /> }
        <Row gutter={16}>
          <Col span={24}>
            <h1>Manage your account.</h1>
            <div className="update">
              <h2>Update password.</h2>
              <Form 
                onSubmit={this.updatePassword}
                render={({ handleSubmit }) => (
                  <form onSubmit={handleSubmit} action="deleteAccount">
                    <div className="input-effect">
                      <Field name="password" component={this.inputRender} />
                        <label><Icon type="lock" /> Password</label>
                        <span className="focus-border">
                          <i></i>
                        </span>
                    </div>
                    <button className="submit button fancy-button" onClick={ this.deleteWarning }>
                      Update
                      <span className="focus-border"><i></i></span>
                    </button>
                  </form>
                )}
              />
            </div>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <div className="logout">
              <h2>User logout.</h2>
              <p>Logout of your account on your current browser.</p>
              <a className="button fancy-button" href="/auth/logout">
                Logout
                <span className="focus-border"><i></i></span>
              </a>
            </div>
          </Col>
          <Col span={12}>
            <div className="delete">
              <h2>Account deletion.</h2>
              <p>Delete your account and all credentials you have encrypted.</p>
              <button className="button fancy-button" onClick={this.deleteWarning}>
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

const mapStateToProps = ( state ) => {
  return {
    state,
    ...state
  };
}

export default connect(mapStateToProps, actions)(SettingsTemplate);