import React, { Component } from 'react'
// import JsPDF from 'jspdf'
// import pdfMake from 'pdfmake/build/pdfmake.min'
// import pdfFonts from 'pdfmake/build/vfs_fonts'
import _ from 'lodash'
import cx from './index.scss'
// pdfMake.vfs = pdfFonts.pdfMake.vfs
import { makePDF } from '../../helpers/pdf_helpers'

const defaultFieldData = (name, placeholder) => ({
  label: _.startCase(name),
  placeholder: placeholder || `Enter your ${_.lowerCase(name)}`,
})

let saveResumeTimer = null
const fields = {
  email: { ...defaultFieldData('email'), type: 'email' },
  zipCode: defaultFieldData('postCode', 'Enter your zip/post code'),
}
class Resume extends Component {
  state =
    // localStorage.saved_resume
    //   ? JSON.parse(localStorage.saved_resume)
    //   :
    {
      mainInfo: {
        firstName: '',
        lastName: '',
        position: '',
      },
      contactInfo: {
        country: '',
        city: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        zipCode: '',
      },
    }

  createField = (value, name, onChange) => {
    const fieldData = fields[name] || defaultFieldData(name)
    return (
      <div
        className={cx(
          'field',
          {
            empty: !value,
          },
          fieldData.className
        )}
        key={name}
      >
        {fieldData.label && <label>{fieldData.label}</label>}
        {fieldData.render ? (
          fieldData.render(value, name, onChange)
        ) : (
          <input
            type={fieldData.type || 'input'}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={fieldData.placeholder}
          />
        )}
      </div>
    )
  }

  onChangeField = (subName, name) => e => {
    this.setState(
      {
        ...this.state,
        [subName]: { ...this.state[subName], [name]: e.target.value },
      },
      () => {
        if (saveResumeTimer) {
          clearTimeout(saveResumeTimer)
        }
        saveResumeTimer = setTimeout(() => {
          localStorage.setItem('saved_resume', JSON.stringify(this.state))
        }, 200)
      }
    )
  }

  handleCreateResume = e => {
    e.preventDefault()
    const {
      mainInfo: { firstName, lastName, position },
      contactInfo: { address, city, country, email, phone, website, zipCode },
    } = this.state
    // TODO слева от фио и должности вставлять фотку
    const titleColor = 'color=#222222'
    const contentColor = 'color=#393939'
    const titleFontSize = 'fontSize=12'
    const contentFontSize = 'fontSize=10'
    const setTitleText = text =>
      text
        .toUpperCase()
        .split('')
        .join(' ')
    const commonAddress = _.compact([city, country])
    makePDF(`
      text>${setTitleText(
        firstName || 'SERGEI'
      )}<(x=20,y=40,fontSize=43,${titleColor});
      text>${setTitleText(
        lastName || 'VOLKOV'
      )}<(x=20,y=57,fontSize=43,${titleColor});
      //text>05.09.1996<(x=20,y=58,fontSize=12,${contentColor});
      text>${setTitleText(
        position || 'FRONTEND DEVELOPER'
      )}<(x=20,y=68,fontSize=15,color=#838383);
      //rect><(x=20,y=75,w=1,h=2,color=#1c1c1c,fill=#1c1c1c)
      line>[[0,0],[170,0]]<(x=20,y=74,color=#d3d3d3,width=0.5)
      line>[[0,0],[0,205]]<(x=76,y=74,color=#d3d3d3,width=0.5)
      text>C O N T A C T<(x=20,y=83,fontSize=14,${titleColor});
      line>[[0,0],[10,0]]<(x=20,y=88,${titleColor},width=0.8)
      text>ADDRESS<(x=20,y=98,${titleFontSize},${titleColor});
      text>${
        address
          ? address + (commonAddress.length ? ',' : '')
          : '123 Street Name,'
      }<(x=20,y=103,${contentFontSize},${contentColor});
      text>${commonAddress.join(', ')}${commonAddress.length &&
      zipCode &&
      ','}<(x=20,y=107,${contentFontSize},${contentColor});
      text>${zipCode}<(x=20,y=111,${contentFontSize},${contentColor});
      text>PHONE<(x=20,y=121,${titleFontSize},${titleColor});
      text>028 1234 5678<(x=20,y=126,${contentFontSize},${contentColor});
      text>EMAIL<(x=20,y=136,${titleFontSize},${titleColor});
      text>my.email@email.com<(x=20,y=141,${contentFontSize},${contentColor});
      text>WEBSITE<(x=20,y=151,${titleFontSize},${titleColor});
      text>www.mysite.com<(x=20,y=156,${contentFontSize},${contentColor});
      text>I N T E R E S T S<(x=20,y=170,fontSize=14,${titleColor});
      line>[[0,0],[10,0]]<(x=20,y=176,${titleColor},width=0.8)
    `)
    // console.log('JsPDF', JsPDF)

    // resume.save(`${mainInfo.lastName}-${mainInfo.firstName}.pdf`)
  }

  render() {
    const { mainInfo, contactInfo } = this.state
    return (
      <div className={cx('root')}>
        <form noValidate onSubmit={this.handleCreateResume}>
          <div className={cx('toast')}>
            <h3 className={cx('title')}>Main</h3>
            {_.map(mainInfo, (value, key) =>
              this.createField(value, key, this.onChangeField('mainInfo', key))
            )}
          </div>
          <div className={cx('toast')}>
            <h3 className={cx('title')}>Contact</h3>
            {_.map(contactInfo, (value, key) =>
              this.createField(
                value,
                key,
                this.onChangeField('contactInfo', key)
              )
            )}
          </div>

          <button type="submit" className={cx('submit-button')}>
            create my Resume
          </button>
        </form>
      </div>
    )
  }
}

export default Resume
