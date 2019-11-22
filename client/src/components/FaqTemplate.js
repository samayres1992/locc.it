import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Collapse } from 'antd';

const { Content } = Layout;
const { Panel } = Collapse;

class FaqTemplate extends Component {
  render() {
    return (
      <Content style={{ padding: '0 50px' }}>
        <Collapse bordered={false} defaultActiveKey={['1']}>
          <Panel header="What is the purpose of locc.it?" key="1">
            <p>Locc.it allows users to share private login details online and help reduce risk of unwanted eyes finding the password.</p>
          </Panel>
          <Panel header="How does it work?" key="2">
            <p>
              The user provides the details they would like to share. Before being saved a secret passcode is generated and is used 
              to encrypt the credentials, these details are then stored.
            </p>
            <p>
              After being encrypted, without the passcode the details are completely unreadable and can only be accessed after being decrypted.
            </p>
            <p>
              You will be provided with a link and passcode after encrypting, you can then send this to the person 
              you wish to receive the details. After they have redeemed the details, the credentials will then be deleted immediately.
            </p>
          </Panel>
          <Panel header="Where is my information stored?" key="3">
            <p>
              Locc.it uses <a href="https://m.do.co/c/39a1326431a0">Digital Ocean</a> to provide it's service along with 
              a third party cloud database service of <a href="https://www.mongodb.com/cloud/atlas">MongoDB Atlas</a> 
              to store your encrypted credentials.
            </p>
          </Panel>
          <Panel header="Disclaimer" key="4">
            <p>
              You accept sole liability for using the locc.it service to share credentials online.  We will ensure the service is as secure as
              possible but ultimately we are not responsible for any data you disclose online.  The entire repository of the locc.it is available
              on <a href="https://github.com/samayres1992/loccit-react">Github</a>.  If you notice an issue please 
              raise it on our <a href="https://github.com/samayres1992/loccit-react/issues">issues page</a>.
            </p>
          </Panel>
        </Collapse>
      </Content>
    );
  }
}

export default connect()(FaqTemplate);