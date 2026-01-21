import moment from 'moment'

function dateFormat(
  date: string | Date | null | undefined, 
  toFormat: string = 'DD/MM/YYYY', 
  fromFormat: string | null = null
): string | null {
  const dateValue = moment(date, fromFormat || undefined)
  if (date && dateValue?.isValid && dateValue.format(toFormat) !== 'Invalid date') {
    return dateValue.format(toFormat)
  }

  return null
}

export default dateFormat
