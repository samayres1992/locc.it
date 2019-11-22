import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './actions';
import { Layout } from 'antd';

// Templating
import HeaderTemplate from './components/HeaderTemplate';
import LandingTemplate from './components/LandingTemplate';
import DecryptTemplate from './components/DecryptTemplate';
import DashboardTemplate from './components/DashboardTemplate';
import FaqTemplate from './components/FaqTemplate';
import FooterTemplate from './components/FooterTemplate';

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
              <Route path="/decrypt/:url" component={DecryptTemplate} />
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