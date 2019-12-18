import React, { Component } from 'react';
import Axios from 'axios';
import { Col, Row, Icon } from 'antd';
import classNames from 'classnames';
import Recaptcha from 'react-google-invisible-recaptcha';
import { Form, Field } from 'react-final-form';

class RequestResetTemplate extends Component {

  constructor (props) {
    super();
    this.state = {
      email: '',
      sent: false,
      recaptcha: true
    }
  }

  emailRender = (emailInput) => (
    <input {...emailInput.input} name={emailInput.name} className={classNames({"has-content": emailInput.meta.dirty, "fancy-input": !emailInput.dirty})} placeholder="" type="text" required />
  );

  verifyRequestNewPasswordSubmission = ({ email }) => {
    // We need to make sure it's not a bot.
    this.setState({
      email: email
    });
    this.recaptcha.execute('request_new_password');
  }

  verifiedRequestNewPasswordSubmit = () => {
    const { email } = this.state;
    Axios.post('/auth/local/send_reset', {
      data: {
        email: email
      }
    }).then(res => {
      console.log('res.status', res.data);
      if(res.data === 'OK') {
        this.setState({
          sent: true
        });
      }
      else {
        console.log("failed");
      }
    });
  }

  render() {
    const { sent } = this.state;
    return (
      <div className="settings">
        <Row gutter={16} type="flex" justify="center">
          <Col span={18}>
            { !sent ? <h1>Forgot your password?</h1> : <h1>Reset email sent</h1>}
            <div className="update">
              { !sent ? 
                <Form 
                  onSubmit={this.verifyRequestNewPasswordSubmission}
                  render={({ handleSubmit }) => (
                    <form onSubmit={ handleSubmit } action="request_new_password">
                      <div className="input-effect">
                        <Field type="email" component={this.emailRender} placeholder="Email" name="email" />
                        <label><Icon type="user" /> Email</label>
                        <span className="focus-border">
                          <i></i>
                        </span>
                      </div>
                      <button className="button fancy-button">
                        Email me a reset link
                        <span className="focus-border"><i></i></span>
                      </button>
                      <Recaptcha
                        ref={ ref => this.recaptcha = ref }
                        sitekey={process.env.REACT_APP_GOOGLE_SITE_KEY}
                        onResolved={this.verifiedRequestNewPasswordSubmit}
                        badge={"bottomright"}
                      />
                    </form>
                  )}
               /> 
              : 
                <p>Your reset request has been sent successfully, the link will expire after 24 hours. 
                Please allow a few minutes to receive the email and don't forget to check your junk folder.</p>
              }
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default RequestResetTemplate;