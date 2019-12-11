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
import LoginTemplate from './components/LoginTemplate';
import SettingsTemplate from './components/SettingsTemplate';

const { Content } = Layout;

class App extends Component {

  componentDidMount() {
    this.props.fetchUser();
  }
  
  render() {
    const pathName = window.pathName;
    return (
      <Layout>
        <BrowserRouter>
            <HeaderTemplate />
            <Content className="content" style={{ padding: '50px' }}>
              <Route location={pathName} exact path="/" component={ LandingTemplate } />
              <Route path="/login" exact component={ LoginTemplate } />
              <Route path="/dashboard" exact component={ DashboardTemplate } />
              <Route path="/faq" exact component={ FaqTemplate } />
              <Route path="/settings" exact component={ SettingsTemplate } />
              <Route path="/d/:url" exact component={ DecryptTemplate } />
            </Content>
            <FooterTemplate />
        </BrowserRouter>
      </Layout>
    );
  }
}

const mapStateToProps = ( state ) => {
  const { auth } = state;
  return { auth };
};

export default connect(mapStateToProps, actions)(App);