import JsPDF from 'jspdf'
import _ from 'lodash'

export const makePDF = (rawPdfData, options) => {
  const pdf = new JsPDF(options)
  const lines = _.map(rawPdfData.split('\n'), line => line.trim()).filter(
    line => line
  )

  console.log(lines)
  _.forEach(lines, line => {
    let [type, , data, , options = {}] = line.split(/(<|>)/)
    options = parseOptions(options)
    switch (type) {
      case 'text':
        pdf.setFontSize(options.fontSize || 16)
        if (options.color) {
          const { r, g, b } = options.color
          pdf.setTextColor(r, g, b)
        }
        pdf.text(
          data,
          options.x,
          options.y,
          options.flags,
          options.angle,
          options.align
        )
        pdf.setTextColor(1, 1, 1)
        break
      case 'lstext':
        pdf.setFontSize(options.fontSize || 16)
        if (options.color) {
          const { r, g, b } = options.color
          pdf.setTextColor(r, g, b)
        }
        pdf.lstext(data, options.x, options.y, options.space)
        pdf.setTextColor(1, 1, 1)
        break
      case 'line':
        if (options.color) {
          const { r, g, b } = options.color
          console.log(r, g, b)
          pdf.setDrawColor(r, g, b)
        }
        if (options.width) {
          pdf.setLineWidth(options.width)
        }
        pdf.lines(
          JSON.parse(data),
          options.x,
          options.y,
          options.scale,
          options.style,
          options.closed
        )
        pdf.setFillColor(1, 1, 1, 1)
        pdf.setDrawColor(1, 1, 1, 1)
        pdf.setLineWidth(0.2)
        break
      case 'rect':
        if (options.color) {
          const { r, g, b } = options.color
          pdf.setDrawColor(r, g, b)
        }
        if (options.fill) {
          const { r, g, b } = options.fill
          pdf.setFillColor(r, g, b)
        }
        pdf.rect(
          data,
          options.x,
          options.y,
          options.w,
          options.h,
          options.style
        )
        pdf.setFillColor(1, 1, 1, 1)
        pdf.setDrawColor(1, 1, 1, 1)
        break
      default:
        break
    }
  })

  // pdf.output('save')
  var blob = pdf.output('blob')
  window.open(URL.createObjectURL(blob))
}

function parseOptions(rawOptions) {
  const [, , optionsList] = rawOptions.split(/(\(|\))/)
  return _.reduce(
    _.split(optionsList, ','),
    (options, option) => {
      const [key, value] = option.split('=')
      if (key === 'color' || key === 'fill') {
        options[key] = hexToRgb(value)
      } else if (key === 'scale') {
        options[key] = value
          .replace(/\|/g, ',')
          .replace(/(\[|\])/g, '')
          .split(',')
          .map(parseFloat)
      } else options[key] = _.isNaN(+value) ? value : parseFloat(value)
      return options
    },
    {}
  )
}

function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b
  })

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}
