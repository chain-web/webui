import { Button, message } from 'antd';
import React from 'react';
import './index.scss';

export default function Devtool() {
  return (
    <div className="devtool-box">
      <h3>devtools</h3>
      <div className="tool-group">
        <Button
          onClick={() => {
            indexedDB.databases().then((res) => {
              res.forEach((ele) => {
                indexedDB.deleteDatabase(ele.name as string);
              });
              message.success('cleared indexedDB');
            });
          }}
        >
          清除缓存(indexedDB)
        </Button>
        <Button
          onClick={() => {
            localStorage.clear();
            message.success('cleared localStorage');
          }}
        >
          清除缓存(localStorage)
        </Button>
      </div>
    </div>
  );
}
