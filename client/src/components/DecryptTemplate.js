import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { Layout } from 'antd';
import DecryptForm from './DecryptForm';
import DecryptedData from './DecryptedData';
import unlockIcon from '../images/unlock.svg';
import lockIcon from '../images/lock.svg';

const { Content } = Layout;

const mapStateToProps = (state) => {
  return {
    state,
    ...state
  };
}

class DecryptTemplate extends Component {

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.decryptForm !== this.props.decryptForm) {
      this.setState({
        decryptForm: this.props.decryptForm
      })
    }
  }

  render() {
    const { decryptForm } = this.props; 
    const whichIcon = decryptForm ? unlockIcon : lockIcon;
    const whichMessage = decryptForm ? "Thank you for using our service, your decrypted details are below." : "Please enter the passcode you were provided.";
    return (
      <Content style={{ padding: '0 50px' }}>
        <div className="check">
          <img src={whichIcon} alt="unlock" />
          <span className="success">{whichMessage}</span>
        </div>
        { decryptForm ? <DecryptedData /> : <DecryptForm /> }
      </Content>
    );
  }
}

export default connect(mapStateToProps, actions)(DecryptTemplate);