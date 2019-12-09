import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import EncryptForm from './EncryptForm';
import Passcode from './Passcode';

class LandingTemplate extends Component {

  render() {
    const { encryptForm } = this.props;
    const landing = <Fragment><h1>Be safe.</h1><h2>Encrypt your credentials before sharing them online.</h2></Fragment>;
    return (
      <Fragment>
        { encryptForm ? 
          <Passcode passcode={encryptForm.passcode } /> :  <div className="landing">{landing} <EncryptForm /></div> 
        }
      </Fragment>
    );
  }
}

const mapStateToProps = ( state ) => {
  return {
    state,
    ...state
  };
}

export default connect(mapStateToProps, actions)(LandingTemplate);