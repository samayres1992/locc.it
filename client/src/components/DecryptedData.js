import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import * as actions from '../actions';
import Clipboard from 'react-clipboard.js';
import unlock from '../images/unlock.svg';

const mapStateToProps = (state) => {
  return {
    ...state,
    state
  };
}

class DecryptedData extends Component {

  render() {
    // console.log('this.props.decryptForm', this.props);
    const { emailUsername, password, note } = this.props.decryptForm.decryptedData;
    console.log('decrypteddata.js', this.props);
    return (
      <Fragment>
        <div className="check">
          <img className='unlock' src={unlock} alt='lock' />
          <span className="success">Thank you for using our service.</span>
        </div>
        <div className="input-effect">
          <span className="fancy-input passcodeInfo url">
            { emailUsername }
            <Clipboard className="button copy" data-clipboard-text={emailUsername}><Icon type="copy" /><span className="copy-to-clipboard">Copy</span></Clipboard>
          </span>
        </div>
        <div className="input-effect">
          <span className="fancy-input passcodeInfo passcode">
            {password}
            <Clipboard className="button copy" data-clipboard-text={password}><Icon type="copy" /><span className="copy-to-clipboard">Copy</span></Clipboard>
          </span>    
        </div>
        <div className="input-effect">
          <span className="fancy-input passcodeInfo passcode">
            {note}
            <Clipboard className="button copy" data-clipboard-text={note}><Icon type="copy" /><span className="copy-to-clipboard">Copy</span></Clipboard>
          </span>    
        </div>
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, actions)(DecryptedData);