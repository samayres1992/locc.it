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
              <Route path="/login" exact component={LoginTemplate} />
              <Route path="/dashboard" exact component={auth ? DashboardTemplate : LandingTemplate} />
              <Route path="/faq" exact component={FaqTemplate} />
              <Route path="/d/:url" exact component={DecryptTemplate} />
            </Content>
            <FooterTemplate />
        </BrowserRouter>
      </Layout>
    );
  }
}

export default connect(mapStateToProps, actions)(App);