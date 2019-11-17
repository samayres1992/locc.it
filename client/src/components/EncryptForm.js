import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';
import classNames from 'classnames';
import * as actions from '../actions';

class EncryptForm extends Component {

  inputRender = (field) => (
    <input {...field.input} name={field.name} className={classNames({"has-content": field.meta.dirty, "fancy-input": !field.dirty})} type={field.type} placeholder="" type="text" required />
  );

  passwordRender = (field) => (
    <input {...field.input} name={field.name} className={classNames({"has-content": field.meta.dirty, "fancy-input": !field.dirty})} type={field.type} placeholder="" type="password" required />
  );

  textareaRender = (field) => (
    <textarea {...field.input} name={field.name} className={classNames({"has-content": field.meta.dirty, "fancy-input": !field.dirty})} type={field.type} placeholder="" type="text" required />
  );

  // onSubmit = (values) => {
  //   alert(JSON.stringify(values));
    // e.preventDefault();
    // const formValues = formValueSelector('encryptForm');
    // let valuesToEncrypt = formValues(this.state, 'emailUsername', 'password', 'note');
    // // console.log('this.state.form', this.state.form);
    // let passcode = this.props.encrypt(valuesToEncrypt);
    // console.log('key', passcode);
    // this.setState({
    //   key: passcode
    // });
  // }


  onSubmit = values => {
    let passcode = this.props.encrypt(values);
    console.log(values);
    console.log('key', passcode);
    this.setState({
      key: passcode
    });
  }

  render() {
    const { pristine, submitting} = this.props;

    return (
      <Form 
        onSubmit={this.onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="input-effect">
              <Field name="title" component={this.inputRender} />
                <label>Title</label>
                <span className="focus-border">
                  <i></i>
                </span>
            </div>
            <div className="input-effect">
              <Field name="emailUsername" component={this.inputRender} />
                <label>Email/Username</label>
                <span className="focus-border">
                  <i></i>
                </span>
            </div>
            <div className="input-effect">
              <Field name="password" component={this.passwordRender} />
                <label>Password</label>
                <span className="focus-border">
                  <i></i>
                </span>
            </div>
            <div className="input-effect">
              <Field name="note" component={this.textareaRender} />
                <label>Note</label>
                <span className="focus-border">
                  <i></i>
                </span>
            </div>
            <button className="submit button fancy-button" disabled={pristine || submitting}>
              Encrypt
              <span className="focus-border">
                <i></i>
              </span>
            </button>
          </form>
        )}
      />
    );
  }
}

// const onSubmit = values => {
//   // console.log('this.state.form', this.state.form);
//   // let passcode = this.props.encrypt(values);
//   // console.log(values);
//   // console.log('key', passcode);
//   // this.setState({
//   //   key: passcode
//   // });
//   alert(JSON.stringify(1, values));
// }

function mapStateToProps({ key }) {
  return {
    key: key || null,
  };
}

export default connect(mapStateToProps, actions)(EncryptForm);