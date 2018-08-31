import React, { Component } from 'react'
import ResumeOptions from './ResumeOptions'
import cx from './index.scss'

export default class Modals extends Component {
  constructor(props) {
    super(props)
    Modals.showModal = Modals.showModal.bind(this)
  }

  state = {
    show: false,
    name: null,
  }

  modals = {
    ResumeOptions: ResumeOptions,
  }

  static showModal(name, show = true, props = null) {
    this.setState({
      name,
      show,
    })
  }

  render() {
    const { show, name } = this.state
    const Modal = this.modals[name]
    return <div className={cx('root', { show })}>{show && <Modal />}</div>
  }
}
