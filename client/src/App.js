import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './actions';
import { Layout } from 'antd';
import { Redirect } from 'react-router-dom';
import { Helmet } from "react-helmet";

// Templating
import HeaderTemplate from './components/HeaderTemplate';
import LandingTemplate from './components/LandingTemplate';
import DecryptTemplate from './components/DecryptTemplate';
import DashboardTemplate from './components/DashboardTemplate';
import FaqTemplate from './components/FaqTemplate';
import FooterTemplate from './components/FooterTemplate';
import LoginTemplate from './components/LoginTemplate';
import SettingsTemplate from './components/SettingsTemplate';
import RequestResetTemplate from './components/RequestResetTemplate';
import NewPasswordTemplate from './components/NewPasswordTemplate';
import NotFound from './components/NotFound';
import logo from './images/loccit-blue.png';

class App extends Component {

  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    const { auth } = this.props;
    const { Content } = Layout;
    const pathName = window.pathName;

    const PrivateRoute = ({ component: Component, ...props }) => {
      return (
        <Route
          { ...props }
          render={innerProps =>
            auth && auth._id ? 
              <Component { ...innerProps } />
              :
              <Redirect to="/" />
          }
        />
      );
    };

    return (
      <Fragment>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Locc.it</title>
          <meta name="application-name" content="Locc.it" />
          <meta name="description" content="Share passwords safely online." />
          <meta name="author" content="Sam Ayres" />
          <meta name="keywords" content="Share, passwords, online, securely, encrypted" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="robots" content="noindex" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
          <meta theme-color="#4b6cb7" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:title" content="Locc.it" />
          <meta property="og:type" content="website" />
          <meta property="og:description" content="Share passwords safely online." />
          <meta property="og:image" content={ logo } />
          <meta property="og:url" content={ process.env.REACT_APP_SITE_URL } />
          <link rel="apple-touch-icon" href={ logo } />
        </Helmet>
        <Layout>
          <BrowserRouter>
              <HeaderTemplate />
              <Content className="content">   
                <Switch>   
                  <Route location={ pathName } exact path="/" component={ LandingTemplate } />
                  <Route path="/login" exact component={ LoginTemplate } />
                  <PrivateRoute path="/dashboard" exact component={ DashboardTemplate } />
                  <Route path="/faq" exact component={ FaqTemplate } />
                  <PrivateRoute path="/settings" exact component={ SettingsTemplate } />
                  <Route path="/d/:url" exact component={ DecryptTemplate } />
                  <Route path="/reset" exact component={ RequestResetTemplate } />
                  <Route path="/reset/:token" exact component={ NewPasswordTemplate } />
                  <Route path="*" component={ NotFound } />
                </Switch>
              </Content>
              <FooterTemplate />
          </BrowserRouter>
        </Layout>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth } = state;
  return { auth: auth };
};

export default connect(mapStateToProps, actions)(App);