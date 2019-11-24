import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { Layout } from 'antd';
import EncryptForm from './EncryptForm';
import Passcode from './Passcode';

const { Content } = Layout;

const mapStateToProps = (state) => {
  return {
    state,
    ...state
  };
}

class LandingTemplate extends Component {

  render() {
    const { encryptForm } = this.props;
    const landing = <Fragment><h1>Be safe.</h1><h2>Encrypt your credentials before sharing them online.</h2></Fragment>;
    return (
      <Content style={{ padding: '0 50px' }}>
        { encryptForm ? 
          <Passcode passcode={encryptForm.passcode } url={encryptForm.url} /> :  <div className="landing">{landing} <EncryptForm /></div> }
      </Content>
    );
  }
}

export default connect(mapStateToProps, actions)(LandingTemplate);