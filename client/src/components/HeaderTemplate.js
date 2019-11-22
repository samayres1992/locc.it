import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Payments from './Payments';
import { Layout, Menu } from 'antd';
import logo from '../images/loccit.svg';
const { Header } = Layout;

const mapStateToProps = (state) => {
  const { auth } = state;
  return {
    auth: auth
  };
}

class HeaderTemplate extends Component {

  renderAuthOptions() {
    switch(this.props.auth) {
      // User login status unknown
      case null:
        return;
      // User not logged in
      case false:
        return [
          <Menu.Item key='1'><Link to="/faq">How it works</Link></Menu.Item>,
          <Menu.Item key='2'><a href="/auth/google">Login</a></Menu.Item>,
          <Menu.Item key='3'><a href="/api/register">Register</a></Menu.Item>
        ];
      //  User is logged in
      default:
        return [
          <Menu.Item key='1'>{this.props.auth.membership} Member</Menu.Item>,
          <Menu.Item key='2'><Payments /></Menu.Item>,
          <Menu.Item key='3'><Link to="/faq">FAQ</Link></Menu.Item>,
          <Menu.Item key='4'><a href="/api/logout">Logout</a></Menu.Item>
        ];
    }
  }

  render() {
    return (
      <Header>
        <Link to={this.props.auth ? '/dashboard' : '/' }>
          <img className='logo' src={logo} alt='locc.it logo' />
        </Link>
        <Menu
          mode='horizontal'
          defaultSelectedKeys={['2']}
          style={{ lineHeight: '64px', float: 'right' }}
        >
          {this.renderAuthOptions()}
        </Menu>
      </Header>
    );
  }
}

export default connect(mapStateToProps)(HeaderTemplate);