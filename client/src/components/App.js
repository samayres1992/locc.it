import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { Layout } from 'antd';

// Templating
import HeaderTemplate from './HeaderTemplate';
import LandingTemplate from './LandingTemplate';

const Footer = () => <h2>Footer</h2>;
const Dashboard = () => <h2>Dashboard</h2>;
const NewPass = () => <h2>NewPass</h2>;

const mapStateToProps = (state) => {
  const { auth } = state;

  return { auth };
};

class App extends Component {

  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <Layout>
        <BrowserRouter>
          <div>
            <HeaderTemplate />
              <Route exact path="/" component={LandingTemplate} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/newpass" component={NewPass} />
            <Footer />
          </div>
        </BrowserRouter>
      </Layout>
    );
  }
}

export default connect(mapStateToProps, actions)(App);