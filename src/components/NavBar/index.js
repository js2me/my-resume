import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { NavLink, withRouter } from 'react-router-dom'
import cx from './index.scss'

const navLinks = [
  { to: '/', label: 'Resume' },
  { to: '/about', label: 'About us' },
  { to: 'https://github.com/js2me/partfol.io', label: 'github', isRaw: true },
]

const NavBar = ({ location }) => (
  <div className={cx('root')}>
    {_.sortBy(navLinks, link => location.pathname !== link.to).map(
      ({ isRaw, label, to }) =>
        isRaw ? (
          <a href={to} key={to}>
            <span>{label}</span>
          </a>
        ) : (
          <NavLink activeClassName={cx('active')} key={to} to={to} exact>
            <span>{label}</span>
          </NavLink>
        )
    )}
  </div>
)

NavBar.propTypes = {
  location: PropTypes.object,
}

export default withRouter(NavBar)
