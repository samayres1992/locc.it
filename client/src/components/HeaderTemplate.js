import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import Payments from './Payments'; // For the future
import { Layout, Menu } from 'antd';
import logo from '../images/loccit.svg';
const { Header } = Layout;

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
          <Menu.Item key='2'><a href="https://buymeacoffee.com/aQJ2U8H" target="_blank" rel="noopener noreferrer">Support us</a></Menu.Item>,
          <Menu.Item key='3'><Link to="/login">Sign in</Link></Menu.Item>,
        ];
      //  User is logged in
      default:
        return [
          <Menu.Item key='1'><Link to="/dashboard">Dashboard</Link></Menu.Item>,
          <Menu.Item key='2'><Link to="/faq">How it works</Link></Menu.Item>,
          <Menu.Item key='3'><a href="https://buymeacoffee.com/aQJ2U8H" target="_blank" rel="noopener noreferrer">Support us</a></Menu.Item>,
          <Menu.Item key='4'><a href="/api/logout">Sign out</a></Menu.Item>
        ];
    }
  }

  render() {
    return (
      <Header>
        <Link to='/'>
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

const mapStateToProps = ( state ) => {
  const { auth } = state;
  return {
    auth: auth
  };
}

export default connect(mapStateToProps)(HeaderTemplate);