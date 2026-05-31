import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Collapse } from 'antd';

const { Panel } = Collapse;

class FaqTemplate extends Component {
  render() {
    return (
      <Collapse bordered={false} defaultActiveKey={['1', '2']}>
        <Panel header="What is the purpose of locc.it?" key="1">
          <p>Locc.it allows users to share private login details online while reducing the risk of unwanted eyes seeing any passwords.</p>
        </Panel>
        <Panel header="How does it work?" key="2">
          <p>
            After providing credentials to Locc.it they are encrypted in your browser with a secret passcode before anything is sent to our servers.
            The passcode is provided to you along with a shareable link. Pass both to the intended recipient — they enter the passcode on the link page and the credentials are decrypted locally in their browser.
          </p>
          <p>
            All credentials are one-time use and are deleted from our servers immediately after being unlocked. They also carry an expiry date —
            if the link is not opened in time it is automatically deleted. The passcode is never stored on Locc.it servers; only you and
            the person you choose to share it with can decrypt the credentials.
          </p>
          <p>
            To protect against guessing, decryption is limited to 3 attempts. After 3 incorrect passcodes the link is locked for 15 minutes.
          </p>
        </Panel>
        <Panel header="Where is my information stored?" key="3">
          <p>
            Locc.it uses <a href="https://m.do.co/c/39a1326431a0">Digital Ocean</a> to provide its services. Encrypted credentials are stored in a local SQLite database on the server and are permanently deleted as soon as they are unlocked or expire.
          </p>
        </Panel>
        <Panel header="Disclaimer" key="4">
          <p>
            You accept sole liability for using Locc.it to share your credentials online. We will ensure that the service is as secure as possible, 
            but ultimately we are not responsible for any disclosed data. The entire repository of Locc.it is available on <a href="https://github.com/samayres1992/loccit-react">Github</a>. If you notice an issue 
            please raise it on our <a href="https://github.com/samayres1992/loccit-react/issues">issues page</a>.
          </p>
        </Panel>
      </Collapse>
    );
  }
}

export default connect()(FaqTemplate);