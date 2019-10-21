import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import ReactStripeCheckout from 'react-stripe-checkout';
import { Button } from 'antd';

class Payments extends Component {
  render () {
    return (
      <ReactStripeCheckout
        name="Premium Subscription"
        description="1 Month"
        amount={500}
        token={token => this.props.handleStripeToken(token)}
        stripeKey={process.env.REACT_APP_STRIPE_KEY}
      >
        <Button type="primary">Premium</Button>
      </ReactStripeCheckout>
    );
  }
}

export default connect(null, actions)(Payments);