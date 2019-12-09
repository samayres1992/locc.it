import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import DecryptForm from './DecryptForm';
import DecryptedData from './DecryptedData';
import unlockIcon from '../images/unlock.svg';
import lockIcon from '../images/lock.svg';

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
      <Fragment>
        <div className="check">
          <img src={whichIcon} alt="unlock" />
          <span className="success">{whichMessage}</span>
        </div>
        { decryptForm ? <DecryptedData /> : <DecryptForm /> }
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

export default connect(mapStateToProps, actions)(DecryptTemplate);