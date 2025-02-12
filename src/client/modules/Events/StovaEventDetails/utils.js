import { isEmpty } from 'lodash'

export const isEmptyWithDefault = (obj, emptyDefault = 'Not set') => {
  return isEmpty(obj) ? emptyDefault : obj
}
