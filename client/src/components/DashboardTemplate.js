import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { chunk } from 'lodash';
import * as actions from '../actions';
import { Layout, Card, Col, Row, Icon, Popconfirm } from 'antd';
import EncryptForm from './EncryptForm';
import Passcode from './Passcode';

const { Content } = Layout;

const mapStateToProps = (state) => {
  return {
    state,
    ...state
  };
}

class DashboardTemplate extends Component {
  componentDidMount() {
    this.props.fetchLocks();
  }

  deleteLock(lockId) {
    console.log('lockid', lockId);
    this.props.deleteSelectedLock(lockId);
  }

  render() {
    const { encryptForm, retrievedData } = this.props;
    const landing = <Fragment><h1>Be safe.</h1><h2>Encrypt your credentials before sharing them online.</h2></Fragment>;
    const chunkedLocks = chunk(retrievedData, 3);
    let i = 0;

    return (
      <Content style={{ padding: '0 50px' }}>
        {chunkedLocks.map(chunk => (
          <Row gutter={16} key={i++}>
          {chunk.map(lock => (
            <Col key={lock._id} span={8}>
              <Card title={lock.title} bordered={false} extra={
                <Popconfirm placement="top" title={"Are you sure you want to delete?"} onConfirm={this.deleteLock(lock._id)} okText="Yes" cancelText="No">
                  <Icon type="close-circle" />
                </Popconfirm>}>lock url {lock.url} lock expire date {lock.expiry}
              </Card>
            </Col>
          ))}

        </Row>))}
        { encryptForm ? 
          <Passcode passcode={encryptForm.passcode } url={encryptForm.url} /> : <div className="landing">{landing} <EncryptForm /></div> }
      </Content>
    );
  }
}

export default connect(mapStateToProps, actions)(DashboardTemplate);