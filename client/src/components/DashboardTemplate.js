import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { chunk } from 'lodash';
import Moment from 'moment';
import * as actions from '../actions';
import { Card, Col, Row, Icon, Pagination, Popconfirm, notification, DatePicker, Empty } from 'antd';
import Clipboard from 'react-clipboard.js';

class DashboardTemplate extends Component {

  constructor() {
    super();
    this.state = {
      minItems: 0,
      maxItems: 5
    };
  }

  // TODO: this can be done in a cleaner way?
  componentDidMount() {
    console.log('this.props.auth', this.props.auth);
    if(this.props.auth) {
      this.props.fetchLocks();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.auth !== this.props.auth) {
      this.props.fetchLocks();
    }
  }

  deleteLock = (lockId) => {
    axios({
      method: 'post',
      url: '/api/delete_lock',
      data: {
        lockId: lockId
      }
    }).then((res) => {
      if (res.data.errors) {
        this.openFailureNotificationWithIcon("errors", "updated_expiry_failed", res.data.errors);
      }
      else {
        this.openNotificationWithIcon('success', 'expiry_update');
        // Reload lock list
        this.props.fetchLocks(this.props.auth._id);
      }
    });
  }

  updateExpiry(date, dateString, lockId) {
    let expiry = Moment(date).endOf('day').format('YYYY-MM-DD H:mm:ss').toString();
    axios({
      method: 'post',
      url: '/api/update_expiry',
      data: {
        lockId: lockId,
        expiry: expiry
      }
    }).then((res) => {
      if (res.data.errors) {
        this.openFailureNotificationWithIcon("errors", "updated_expiry_failed", res.data.errors);
      }
      else {
        this.openNotificationWithIcon('success', 'expiry_update');
      }
    });
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
        break;
      default:
        break;
    }
  };

  openFailureNotificationWithIcon = (type, action, description=null) => {
    switch (action) {
      case 'delete':
        notification[type]({
          message: 'Delete failed.',
          description: 'Something went wrong, please try again.',
          placement: 'bottomLeft'
        });
        break;
      case 'updated_expiry_failed':
        notification[type]({
          message: 'Expiry update failed',
          description: description,
          placement: 'bottomLeft'
        });
        break;
      default:
        break;
    }
  };

  paginationChange = (page, pageSize) => {
    this.setState({
      minItems: (page - 1) * pageSize,
      maxItems: page * pageSize
    });
  }

  render() {
    const { dashboard } = this.props;
    const { minItems, maxItems } = this.state;
    const dashboardIntro = <Fragment><h1>Dashboard.</h1><h2>Allows full control over your shared credentials.</h2></Fragment>;
    const chunkedLocks = chunk(dashboard, 2);
    const domain = process.env.REACT_APP_SITE_URL;
    let i = 0;
    
    return (
      <Fragment>
        <Row gutter={ 12 } className="dashboard">
          { dashboardIntro }
          {
            chunkedLocks.length ? 
              chunkedLocks.slice(minItems, maxItems).map(chunk => (
                <Row gutter={16} key={i++}>
                {chunk.map(lock => (
                  <Col key={lock._id} xs={24} sm={24} md={12} xl={12} xxl={12} className="dash-card">
                    <Card title={lock.title} bordered={false} extra={
                      <Popconfirm placement="top" title={"Are you sure you want to delete?"} onConfirm={() => this.deleteLock(lock._id)} okText="Yes" cancelText="No">
                        <Icon type="close-circle" />
                      </Popconfirm>}>
                      <div className="input-effect">
                        <span className="fancy-input passcodeInfo url">
                          <span className="data-to-copy">{domain + lock.url}</span>
                          <Clipboard className="button copy" data-clipboard-text={domain + lock.url} onSuccess={() => this.openNotificationWithIcon('success', 'clipboard')}><Icon type="copy" /> Copy</Clipboard>
                        </span>    
                      </div>
                      <DatePicker style={{"width": "100%"}} onChange={(date, dateString) => this.updateExpiry(date, dateString, lock._id)} defaultValue={Moment(lock.expiry)} format={"[Expires on] MMMM Do, YYYY"} disabledDate={(current) => { return Moment().add(-1, 'days')  >= current; }} required />
                    </Card>
                  </Col>
               ))}
              </Row>
             ))
            : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span className='no-data'>No encrypted credentials, create one below.</span>} />
          } 
        </Row>
        <Row gutter={ 12 } className="pagination">
          <Pagination defaultCurrent={ 1 } total={ chunkedLocks.length } hideOnSinglePage={ true } defaultPageSize={5} onChange={(page, pageSize) => { this.paginationChange(page, pageSize) }} />
        </Row>
      </Fragment>
   );
  }
}

const mapStateToProps = (state) => {
  const { auth, dashboard } = state;
  return { auth: auth, dashboard: dashboard };
}

export default connect(mapStateToProps, actions)(DashboardTemplate);