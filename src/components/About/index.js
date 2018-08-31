import React from 'react'
import { NavLink } from 'react-router-dom'
import cx from './index.scss'

const About = () => (
  <div className={cx('root')}>
    <NavLink to="/" activeClassName={cx('active')}>
      Create Resume
    </NavLink>
    <NavLink to="/about" activeClassName={cx('active')}>
      About us
    </NavLink>
    <a href="https://github.com/js2me/partfol.io">github</a>
  </div>
)

export default About
