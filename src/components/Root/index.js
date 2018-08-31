import { BrowserRouter as Router, Route } from 'react-router-dom'
import React, { Component } from 'react'
import Modals from '../Modals'
import NavBar from '../NavBar'
import Resume from '../Resume'
import About from '../About'
import cx from './index.scss'

export default class Root extends Component {
  render() {
    return (
      <Router forceRefresh={!('pushState' in window.history)}>
        <div className={cx('route-data')}>
          <NavBar />
          <Route exact path="/" component={Resume} />
          <Route exact path="/about" component={About} />
          <Modals />
        </div>
      </Router>
    )
  }
}
