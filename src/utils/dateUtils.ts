import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from './constants';

moment.locale('en-US')

export const dateTransform = (dateValue: Date, dateFormat: string = DEFAULT_DATE_FORMAT) => {
  if (!dateValue)
    return ''
  return moment(dateValue).format(dateFormat)
}

export const durationFromNow = (dateValue: Date) => {
  if (!dateValue)
    return ''
  return moment(dateValue).fromNow()
}

export const getUTCNow = () => {
  return moment.utc().toDate()
}