import moment from 'moment'

function timeFormat(
  time: string | Date | null | undefined, 
  toFormat: string = 'HH:mm', 
  fromFormat: string = 'HH:mm:ss'
): string | null {
  const timeValue = moment(time, fromFormat)
  if (time && timeValue?.isValid && timeValue.format(toFormat) !== 'Invalid date') {
    return timeValue.format(toFormat)
  }

  return null
}

export default timeFormat
