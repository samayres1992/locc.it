import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { Layout, Card, Col, Row } from 'antd';
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
    console.log('fetchlocks', this.props.retrievedData);
  }

  render() {
    const { encryptForm, retrievedData } = this.props;
    const landing = <Fragment><h1>Be safe.</h1><h2>Encrypt your credentials before sharing them online.</h2></Fragment>;

    console.log('retrievedData', retrievedData)
    return (
      <Content style={{ padding: '0 50px' }}>
        <Row gutter={16}>
          { retrievedData ? retrievedData.map(( lock, i ) => 
            {(i % 3) ? { <Row gutter={16}> }
            <Col span={8} key={i}><Card title="Card title" bordered={false}>lock url {lock.url} lock expire date {lock.expiry}</Card></Col>) 
            : <div>You have no locks, add one!</div>
          }
        </Row>
        { encryptForm ? 
          <Passcode passcode={encryptForm.passcode } url={encryptForm.url} /> : <div className="landing">{landing} <EncryptForm /></div> }
      </Content>
    );
  }
}

export default connect(mapStateToProps, actions)(DashboardTemplate);