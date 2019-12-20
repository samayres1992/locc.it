import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, notification } from 'antd';
import * as actions from '../actions';
import Clipboard from 'react-clipboard.js';

class DecryptedData extends Component {

  openNotificationWithIcon = (type, action) => {
    switch (action) {
      case 'clipboard':
        notification[type]({
          message: 'Copied to clipboard successful.',
          description: 'Your details have been copied to your clipboard.',
          placement: 'bottomLeft'
        });
        break;
      default:
        break;
    }
  };

  render() {
    const { title, emailUsername, password, note } = this.props.decryptForm.decryptedData;
    return (
      <div className="decrypted-data">
        <div className="input-effect">
          <span className="fancy-input passcodeInfo title">
            <span className="data-to-copy">{ title }</span>
            <Clipboard className="button copy" data-clipboard-text={title} onSuccess={() => this.openNotificationWithIcon('success', 'clipboard') }><Icon type="copy" /><span className="copy-to-clipboard">Copy</span></Clipboard>
          </span>
        </div>
        <div className="input-effect">
          <span className="fancy-input passcodeInfo username">
          <span className="data-to-copy">{ emailUsername }</span>
            <Clipboard className="button copy" data-clipboard-text={emailUsername} onSuccess={() => this.openNotificationWithIcon('success', 'clipboard') }><Icon type="copy" /><span className="copy-to-clipboard">Copy</span></Clipboard>
          </span>
        </div>
        <div className="input-effect">
          <span className="fancy-input passcodeInfo password">
            <span className="data-to-copy">{password}</span>
            <Clipboard className="button copy" data-clipboard-text={password} onSuccess={() => this.openNotificationWithIcon('success', 'clipboard')} ><Icon type="copy" /><span className="copy-to-clipboard">Copy</span></Clipboard>
          </span>    
        </div>
        <div className="input-effect">
          <span className="fancy-input passcodeInfo note">
            <span className="data-to-copy"> {note} </span>
            <Clipboard className="button copy" data-clipboard-text={note} onSuccess={() => this.openNotificationWithIcon('success', 'clipboard')}><Icon type="copy" /><span className="copy-to-clipboard">Copy</span></Clipboard>
          </span>    
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { decryptForm } = state;
  return { decryptForm: decryptForm };
}

export default connect(mapStateToProps, actions)(DecryptedData);