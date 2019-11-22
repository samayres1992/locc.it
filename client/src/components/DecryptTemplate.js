import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { Layout } from 'antd';
import DecryptForm from './DecryptForm';
import DecryptedData from './DecryptedData';

const { Content } = Layout;

const mapStateToProps = (state) => {
  return {
    state,
    ...state
  };
}

class DecryptTemplate extends Component {

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.decryptForm !== this.props.decryptForm) {
      this.setState({
        decryptForm: this.props.decryptForm
      })
    }
  }

  render() {
    const { decryptForm } = this.props; 
    console.log('decryptForm template', decryptForm);
    return (
      <Content style={{ padding: '0 50px' }}>
        { decryptForm ? <DecryptedData /> : <DecryptForm /> }
      </Content>
    );
  }
}

export default connect(mapStateToProps, actions)(DecryptTemplate);