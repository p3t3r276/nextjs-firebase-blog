import Moment from 'moment';
import { DEFAULT_DATE_FORMAT } from './constants';

Moment.locale('en-US')

export const dateTransform = (dateValue: Date, dateFormat: string = DEFAULT_DATE_FORMAT) => {
  if (!dateValue)
    return ''
  return Moment(dateValue).format(dateFormat)
}

export const durationFromNow = (dateValue: Date) => {
  if (!dateValue)
    return ''
  return Moment(dateValue).fromNow()
}