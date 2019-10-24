import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { Layout } from 'antd';

// Templating
import HeaderTemplate from './HeaderTemplate';
import LandingTemplate from './LandingTemplate';
import DashboardTemplate from './DashboardTemplate';
import FaqTemplate from './FaqTemplate';
import FooterTemplate from './FooterTemplate';

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
            <div className="content">
              <Route exact path="/" component={LandingTemplate} />
              <Route path="/dashboard" component={DashboardTemplate} />
              <Route path="/faq" component={FaqTemplate} />
            </div>
            <FooterTemplate />
          </div>
        </BrowserRouter>
      </Layout>
    );
  }
}

export default connect(mapStateToProps, actions)(App);