import moment from 'moment'

function timeFormat(time, toFormat = 'HH:mm', fromFormat = 'HH:mm:ss') {
  const timeValue = moment(time, fromFormat)
  if (time && timeValue?.isValid && timeValue.format(toFormat) !== 'Invalid date') {
    return timeValue.format(toFormat)
  }

  return null
}

export default timeFormat
