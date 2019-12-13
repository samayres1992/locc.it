import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';

class NotFound extends Component {
  componentDidMount() {
    this.props.history.push("/404");
  }

  render() {
    return (
      <div className="settings">
        <Row gutter={16} type="flex" justify="center">
          <Col span={18}>
            <h1>404.</h1>
            <div className="update">
              <h2>Not found.</h2>
              <p>The page you requested can't be found, if you think there is an issue or have any questions please <a href="mailto:hello@locc.it">contact us</a>.</p>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(NotFound);


