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
            After providing credentials to Locc.it they are encrypted with a secret passcode that is generated in user's browser. You can share
            them with a link that is generated for you along with a secret passcode is exclusive to you and whomever you share it with. 
            All encryptions are one time use and will be deleted immediately after use, they also have an expiration date that will result 
            in automatic deletion if not redeemed in time.
          </p>
          <p>
            Not only are all encryptions single-use, there is a time-sensitive expiration. Whether or not the passcode was used, it will be deleted in a user-set amount of time automatically.
          </p>
        </Panel>
        <Panel header="Where is my information stored?" key="3">
          <p>
            Locc.it uses <a href="https://m.do.co/c/39a1326431a0">Digital Ocean</a> to provide its services, along with a third party cloud database. (<a href="https://www.mongodb.com/cloud/atlas">MongoDB Atlas</a>) 
            to store your encrypted credentials.
          </p>
        </Panel>
        <Panel header="Disclaimer" key="4">
          <p>
            You accept sole liability for using Locc.it to share your credentials online. We will ensure that the service is as secure as possible, 
            but ultimately we are not responsible for any disclosed data. The entire repository of Locc.it is available on 
            <a href="https://github.com/samayres1992/loccit-react">Github</a>. If you notice an issue please raise it on our <a href="https://github.com/samayres1992/loccit-react/issues">issues page</a>.
          </p>
        </Panel>
      </Collapse>
    );
  }
}

export default connect()(FaqTemplate);