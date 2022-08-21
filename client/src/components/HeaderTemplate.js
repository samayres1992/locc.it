import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Layout, Icon, Menu, Dropdown } from 'antd';
import { NavBar } from 'antd-mobile';
import logo from '../images/loccit.svg';
const { Header } = Layout;

class HeaderTemplate extends Component {

  constructor() {
    super();
    this.state = {
      visible: true,
      selected: '',
    };
  }

  onSelect = (opt) => {
    this.setState({
      visible: false,
      selected: opt.props.value,
    });
  };

  handleVisibleChange = (visible) => {
    this.setState({
      visible,
    });
  };

  renderAuthOptions() {
    switch(this.props.auth) {
      // User login status unknown
      case null:
        return;
      // User not logged in
      case false:
        return [
          <Menu.Item key='1'><Link to="/faq">How it works</Link></Menu.Item>,
          <Menu.Item key='2'><Link to="/login">Sign in</Link></Menu.Item>,
        ];
      //  User is logged in
      default:
        return [
          <Menu.Item key='1'><Link to="/dashboard">Dashboard</Link></Menu.Item>,
          <Menu.Item key='2'><Link to="/faq">How it works</Link></Menu.Item>,
          <Menu.Item key='3'><Link to="/settings">Settings</Link></Menu.Item>
        ];
    }
  }

  render() {
    const mobileMenu = (
      <Menu>
        { this.renderAuthOptions() }
      </Menu>
    );

    return (
      <Header>
        <div className="desktop">
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
        </div>
        <div className="mobile">
          <NavBar
            leftContent={
              <Link to='/'>
                <img className='logo' src={logo} alt='locc.it logo' />
              </Link>
            }
            rightContent={
              <Dropdown overlay={mobileMenu} trigger={['click']} placement="bottomRight">
                <button className="ant-dropdown-link burger-menu">
                  <Icon type="menu" />
                </button>
              </Dropdown>
            }
          >
          </NavBar>
        </div>
      </Header>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth } = state;
  return { auth: auth };
}

export default connect(mapStateToProps)(HeaderTemplate);