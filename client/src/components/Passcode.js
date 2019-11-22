import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Skeleton } from 'antd';
import * as actions from '../actions';
import Clipboard from 'react-clipboard.js';

class Passcode extends Component {

  // TODO: Implement notification feedback for users when they click copy

  notifyUser = (message) => {
    console.log("i was called");
  }

  render() {
    const { url, passcode} = this.props;
    const fullUrl = url ? process.env.REACT_APP_SITE_URL + 'decrypt/' + url : <Skeleton paragraph={{ rows: 0 }} />;
    
    const passToCopy = passcode ? passcode : <Skeleton paragraph={{ rows: 0 }} />;

    return (
      <div>
        <div className="check">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
            <circle className="path circle" fill="none" stroke="#fff" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
            <polyline className="path check" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
          </svg>
          <span className="success">Share the password with details below.</span>
        </div>
        <div className="input-effect">
          <span className="fancy-input passcodeInfo url">
            { fullUrl }
            <Clipboard className="button copy" data-clipboard-text={fullUrl}><Icon type="copy" /><span className="copy-to-clipboard">Copy</span></Clipboard>
          </span>
        </div>
        <div className="input-effect">
          <span className="fancy-input passcodeInfo passcode">
            {passToCopy}
            <Clipboard className="button copy" data-clipboard-text={passcode}><Icon type="copy" /><span className="copy-to-clipboard">Copy</span></Clipboard>
          </span>    
        </div>
      </div>
    );
  }
}

export default connect(null, actions)(Passcode);