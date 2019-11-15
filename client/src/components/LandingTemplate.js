import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import EncryptForm from './EncryptForm';

class LandingTemplate extends Component {

  constructor(props) {
    super();
    this.state = {
      passcode: null
    };
  }

  componentDidUpdate(prevState, prevProps) {
    if (prevState.passcode !== prevProps.passcode) {
      this.setState({
        passcode: this.props.passcode
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.passcode !== this.state.passcode);
  }

  render() {
    const { passcode } = this.state;
    const Display = passcode ? passcode : EncryptForm;

    return (
      <div>
        <Display />
      </div>
    );
  }
}

export default connect(null, actions)(LandingTemplate);