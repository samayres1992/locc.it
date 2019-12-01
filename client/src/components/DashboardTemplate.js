import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { chunk } from 'lodash';
import Moment from 'moment';
import * as actions from '../actions';
import { Alert, Card, Col, Row, Icon, Popconfirm, notification, DatePicker, Empty } from 'antd';
import EncryptForm from './EncryptForm';
import Clipboard from 'react-clipboard.js';
import Passcode from './Passcode';

const mapStateToProps = (state) => {
  return {
    state,
    ...state
  };
}

class DashboardTemplate extends Component {
  componentDidMount() {
    this.props.fetchLocks(this.props.auth._id);
  }

  deleteLock = (lockId) => {
    let result = '';

    try {
      let result = this.props.deleteSelectedLock(lockId);
    } catch ( e ) {
      console.log("Error", e);
      return;
    }

    // Update locks on user dashboard
    this.openNotificationWithIcon('success', 'delete');
    this.props.fetchLocks(this.props.auth._id);
  }

  updateExpiry(date, dateString, lockId) {
    let expiry = Moment(date).endOf('day').format('YYYY-MM-DD H:mm:ss').toString();
    console.log("expirychange", expiry);
    this.props.updateLockExpiry({ lockId, expiry });
    this.openNotificationWithIcon('success', 'expiry_update');
  }

  openNotificationWithIcon = (type, action) => {
    switch (action) {
      case 'clipboard':
          notification[type]({
            message: 'Copied to clipboard successful.',
            description: 'Your details have been copied to your clipboard.',
            placement: 'bottomLeft'
          });
        break;
      case 'expiry_update':
          notification[type]({
            message: 'Expiry update successful.',
            description: 'Your expiry date has been updated.',
            placement: 'bottomLeft'
          });
        break;
      case 'delete':
        notification[type]({
          message: 'Delete successful.',
          description: 'Your encrypted credentials were deleted.',
          placement: 'bottomLeft'
        });
      default:
        break;
    }
  };

  render() {
    const { encryptForm, retrievedData, auth } = this.props;
    const landing = <Fragment><h1>Be safe.</h1><h2>Encrypt your credentials before sharing them online.</h2></Fragment>;
    const dashboard = <Fragment><h1>Dashboard.</h1><h2>Allows full control over your shared credentials.</h2></Fragment>;
    const activationMessage = auth.activated ? null : <Alert
      message="Activation notice."
      description="Currently your account is not verified, please check your email. Unverified accounts are automatically
      deleted after 1 week."
      type="info"
      showIcon
    />;
    const chunkedLocks = chunk(retrievedData, 2);
    const domain = process.env.REACT_APP_SITE_URL;
    let i = 0;
    console.log("chunkedlocks", chunkedLocks);
    return (
      <Row gutter={12}>
        { activationMessage }
        <Col span={24}>
        { dashboard }
        {
          chunkedLocks.length ? 
            chunkedLocks.map(chunk => (
              <Row gutter={16} key={i++}>
              {chunk.map(lock => (
                <Col key={lock._id} span={12} className="dashCard">
                  <Card title={lock.title} bordered={false} extra={
                    <Popconfirm placement="top" title={"Are you sure you want to delete?"} onConfirm={() => this.deleteLock(lock._id)} okText="Yes" cancelText="No">
                      <Icon type="close-circle" />
                    </Popconfirm>}>
                    <div className="input-effect">
                      <span className="fancy-input passcodeInfo url">
                        {domain + lock.url}
                        <Clipboard className="button copy" data-clipboard-text={domain + lock.url} onSuccess={() => this.openNotificationWithIcon('success', 'clipboard')}><Icon type="copy" /></Clipboard>
                      </span>    
                    </div>
                    <DatePicker style={{"width": "100%"}} onChange={(date, dateString) => this.updateExpiry(date, dateString, lock._id)} defaultValue={Moment(lock.expiry)} format={"[Expires on] MMMM Do, YYYY"} disabledDate={(current) => { return Moment().add(-1, 'days')  >= current; }} required />
                  </Card>
                </Col>
              ))}
            </Row>
            ))
          : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span className='no-data'>No encrypted details, create one below.</span>} />
        }
      </Col>
        <Col span={24}>
          { encryptForm ? 
            <Passcode passcode={encryptForm.passcode } url={encryptForm.url} /> : <div className="landing">{landing} <EncryptForm /></div> 
          }
        </Col>
      </Row>
    );
  }
}

export default connect(mapStateToProps, actions)(DashboardTemplate);