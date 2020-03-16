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
            After providing credentials to Locc.it they are encrypted with a secret passcode that is generated automatically in your browser. This
            passcode is provided to you along with a link that you can use to share your credentials. 
          </p>
          <p>
            All encryptions are one time use and will be deleted immediately, they also have an expiration date that will result 
            in automatic deletion if not redeemed in time. The passcode is not stored on Locc.it servers, only you and 
            the person you choose to share it with will be able to decrypt the credentials.
          </p>
        </Panel>
        <Panel header="Where is my information stored?" key="3">
          <p>
            Locc.it uses <a href="https://m.do.co/c/39a1326431a0">Digital Ocean</a> to provide it's services with a third party cloud database. (<a href="https://www.mongodb.com/cloud/atlas">MongoDB Atlas</a>).
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