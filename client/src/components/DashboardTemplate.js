import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';

class DashboardTemplate extends Component {

  render() {
    return (
      <Row>
        <Col span={12}>col-12</Col>
        <Col span={12}>col-12</Col>
      </Row>
    );
  }
}

export default connect()(DashboardTemplate);