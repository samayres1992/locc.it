import React from 'react';
import { Icon } from 'antd';

const FooterTemplate = () => {
  return (
    <footer>
      <span className="plug">
        Made with <Icon type="heart" /> by <a href="https://5am.dev">Sam Ayres</a>
      </span>
    </footer>
  );
}

export default FooterTemplate;