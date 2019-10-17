import React, { Component } from 'react';
import { Layout, Menu } from 'antd';

const { Header } = Layout;

class HeaderTemplate extends Component {
  render() {
    return (
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="1">
            <a href="/auth/google">Login</a>
          </Menu.Item>
          <Menu.Item key="2">Register</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
      </Header>
    );
  }
}

export default HeaderTemplate;