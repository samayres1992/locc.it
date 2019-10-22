import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import classNames from 'classnames';

import Encrypt from './Encrypt';

const inputRender = (field)  => (
  <input {...field.input} name={field.name} className={classNames({"has-content": field.meta.dirty, "fancy-input": !field.dirty})} type={field.type} placeholder="" type="text" required />
);

const textareaRender = (field)  => (
  <textarea {...field.input} name={field.name} className={classNames({"has-content": field.meta.dirty, "fancy-input": !field.dirty})} type={field.type} placeholder="" type="text" required />
);

const LandingTemplate = (props, { handleSubmit }) => {
	const { label } = props
	return(
		<form onSubmit={handleSubmit}>
			<div className="input-effect">
				<Field name="emailUsername" component={inputRender} type="text" />
		  		<label>Email/Username</label>
		  		<span className="focus-border">
		    		<i></i>
		  		</span>
			</div>
			<div className="input-effect">
				<Field name="password" component={inputRender} type="password" />
			  	<label>Password</label>
			  	<span className="focus-border">
			    	<i></i>
			  	</span>
			</div>
			<div className="input-effect">
				<Field name="note" component={textareaRender} type="textarea" placeholder="" />
			  	<label>Note</label>
			  	<span className="focus-border">
			    	<i></i>
			  	</span>
			</div>
			<button className="submit button fancy-button" disabled={props.pristine || props.submitting}>
				Encrypt
				<span className="focus-border">
			  	<i></i>
				</span>
			</button>
		</form>
	);
}

export default reduxForm({
  form: 'form', // a unique identifier for this form
  fields: ['emailUsername', 'password', 'note'],
})(LandingTemplate)