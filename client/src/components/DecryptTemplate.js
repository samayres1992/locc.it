import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Moment from 'moment';
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
      });
    }
  }

  render() {
    const { decryptForm } = this.props; 
    const whichIcon = decryptForm && !decryptForm.attempts && !decryptForm.locked && decryptForm.decryptedData ? unlockIcon : lockIcon;
    var whichMessage = decryptForm && !decryptForm.attempts && !decryptForm.locked && decryptForm.decryptedData ? "Thank you for using our service, your decrypted details are below." : "Please enter the passcode you were provided.";
    var attemptsMessage = '';

    if (decryptForm && decryptForm.attempts) {
      let attemptPhrasing = "attempt";
      if (decryptForm.attempts === 1) {
        attemptPhrasing = "attempts";
      }
      attemptsMessage = 'Wrong passcode, ' +  (3 - decryptForm.attempts) + ' ' + attemptPhrasing + ' remaining.';
    }
    else if (decryptForm && decryptForm.locked) {
      var currentTime = Moment();
      var lockTime = Moment(decryptForm.locked);
      var lockDuration = lockTime.diff(currentTime, 'minutes');
      attemptsMessage = 'These credentials are locked for ' + lockDuration + ' minutes due to 3 failed attempts.';
    }

    return (
      <Fragment>
        <div className="check">
          <img src={whichIcon} alt="unlock" />
          <span className="success">{attemptsMessage ? attemptsMessage : whichMessage}</span>
        </div>
        { decryptForm && !decryptForm.attempts && !decryptForm.locked && decryptForm.decryptedData ? <DecryptedData /> : <DecryptForm /> }
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { decryptForm } = state;
  return { decryptForm: decryptForm };
}

export default connect(mapStateToProps, actions)(DecryptTemplate);