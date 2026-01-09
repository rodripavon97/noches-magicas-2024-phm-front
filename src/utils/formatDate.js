import moment from 'moment'

function dateFormat(date, toFormat = 'DD/MM/YYYY', fromFormat = null) {
  const dateValue = moment(date, fromFormat)
  if (date && dateValue?.isValid && dateValue.format(toFormat) !== 'Invalid date') {
    return dateValue.format(toFormat)
  }

  return null
}

export default dateFormat
