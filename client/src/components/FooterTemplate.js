import React from 'react';
import { Icon } from 'antd';

const FooterTemplate = () => {
  return (
    <footer>
      <span className="plug">
        Made with <Icon type="heart" theme="filled" /> by <a href="https://5am.dev" target="_blank" rel="noopener noreferrer">Sam Ayres</a>
      </span>
    </footer>
  );
}

export default FooterTemplate;