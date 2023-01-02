import React from 'react';
import "./leetcode_logo_style.css";
// @ts-ignore
import leetcode_logo from '../assets/leetcode_logo.png';

const ImageLink = () => (
  <a href="https://leetcode.com/" target="_blank" rel="noopener noreferrer" className='test'>
    <img src={leetcode_logo} className="App-logo" alt="logo" />
  </a>
);

export default ImageLink;
