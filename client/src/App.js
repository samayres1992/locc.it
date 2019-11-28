import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Collapse } from 'antd';
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
import LoginTemplate from './components/LoginTemplate';

const { Content } = Layout;

const mapStateToProps = (state) => {
  const { auth } = state;
  return { auth };
};

class App extends Component {

  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    const { auth } = this.props;
    const pathName = window.pathName;
    return (
      <Layout>
        <BrowserRouter>
            <HeaderTemplate />
            <Content className="content" style={{ padding: '50px' }}>
              <Route location={pathName} exact path="/" component={LandingTemplate} />
              <Route exact path="/login" component={LoginTemplate} />
              <Route path="/decrypt/:url" component={DecryptTemplate} />
              <Route path="/dashboard" component={auth ? DashboardTemplate : LandingTemplate} />
              <Route path="/faq" component={FaqTemplate} />
            </Content>
            <FooterTemplate />
        </BrowserRouter>
      </Layout>
    );
  }
}

export default connect(mapStateToProps, actions)(App);