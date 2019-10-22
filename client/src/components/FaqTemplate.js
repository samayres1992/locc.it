import React from 'react';
import { connect } from 'react-redux';
import { Collapse } from 'antd';

const { Panel } = Collapse;

class FaqTemplate extends React.Component {
  render() {
    return (
      <Collapse bordered={false} defaultActiveKey={['1']}>
        <Panel header="This is panel header 1" key="1">
          1
        </Panel>
        <Panel header="This is panel header 2" key="2">
          2
        </Panel>
        <Panel header="This is panel header 3" key="3">
          3
        </Panel>
      </Collapse>
    );
  }
}

export default connect()(FaqTemplate);