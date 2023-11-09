import { Timestamp } from 'firebase/firestore';
import Moment from 'moment';

Moment.locale('en-US')

export const dateTransform = (dateValue: Timestamp) => {
  if (!dateValue)
    return ''
  return Moment(dateValue.toDate()).format('DD/MM/yyyy')
}

export const durationFromNow = (dateValue: Timestamp) => {
  if (!dateValue)
    return ''
  return Moment(dateValue.toDate()).fromNow()
}