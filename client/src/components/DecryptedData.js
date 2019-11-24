import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import * as actions from '../actions';
import Clipboard from 'react-clipboard.js';

const mapStateToProps = (state) => {
  return {
    ...state,
    state
  };
}

class DecryptedData extends Component {

  render() {
    const { title, emailUsername, password, note } = this.props.decryptForm.decryptedData;
    return (
      <Fragment>
        <div className="input-effect">
          <span className="fancy-input passcodeInfo title">
            { title }
            <Clipboard className="button copy" data-clipboard-text={title}><Icon type="copy" /><span className="copy-to-clipboard">Copy</span></Clipboard>
          </span>
        </div>
        <div className="input-effect">
          <span className="fancy-input passcodeInfo username">
            { emailUsername }
            <Clipboard className="button copy" data-clipboard-text={emailUsername}><Icon type="copy" /><span className="copy-to-clipboard">Copy</span></Clipboard>
          </span>
        </div>
        <div className="input-effect">
          <span className="fancy-input passcodeInfo password">
            {password}
            <Clipboard className="button copy" data-clipboard-text={password}><Icon type="copy" /><span className="copy-to-clipboard">Copy</span></Clipboard>
          </span>    
        </div>
        <div className="input-effect">
          <span className="fancy-input passcodeInfo note">
            {note}
            <Clipboard className="button copy" data-clipboard-text={note}><Icon type="copy" /><span className="copy-to-clipboard">Copy</span></Clipboard>
          </span>    
        </div>
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, actions)(DecryptedData);