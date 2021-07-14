import React from 'react';
import { render } from 'react-dom';
import './App.global.css';
import 'antd/dist/antd.css';
import App from './app/pages';
import { RecoilRoot } from 'recoil';

render(
  <RecoilRoot>
    <App />
  </RecoilRoot>
, document.getElementById('root'));
