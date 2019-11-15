import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
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

  handleSubmit = (e) => {
    e.preventDefault();
    let passcode = this.props.encrypt();
    this.setState({
      key: passcode
    });
  }

  render() {
    const { pristine, submitting } = this.props;

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="input-effect">
          <Field name="title" component={this.inputRender} type="text" />
            <label>Title</label>
            <span className="focus-border">
              <i></i>
            </span>
        </div>
        <div className="input-effect">
          <Field name="emailUsername" component={this.inputRender} type="text" />
            <label>Email/Username</label>
            <span className="focus-border">
              <i></i>
            </span>
        </div>
        <div className="input-effect">
          <Field name="password" component={this.passwordRender} type="password" />
            <label>Password</label>
            <span className="focus-border">
              <i></i>
            </span>
        </div>
        <div className="input-effect">
          <Field name="note" component={this.textareaRender} type="textarea" placeholder="Add a note if you like" />
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
    );
  }
}

function mapStateToProps({ key }) {
  return {
    encrypt: key || null
  };
}

export default reduxForm({
  form: 'form', // a unique identifier for this form
  fields: ['title', 'emailUsername', 'password', 'note'],
})(connect(mapStateToProps, actions)(EncryptForm))