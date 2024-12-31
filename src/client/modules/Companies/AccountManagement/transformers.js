import { transformDateStringToDateObject } from '../../../transformers'
import { formatDateWithYearMonth } from '../../../utils/date'
import {
  transformBoolToRadioOption,
  transformRadioOptionToBool,
} from '../../Investments/Projects/transformers'

export const transformFormValuesForAPI = ({
  company,
  subject,
  detail,
  target_date,
  has_blocker,
  blocker_description,
  progress,
}) => ({
  subject,
  detail,
  target_date: formatDateWithYearMonth(target_date),
  company,
  has_blocker: transformRadioOptionToBool(has_blocker),
  blocker_description,
  progress: parseInt(progress),
})

export const transformAPIValuesForForm = ({
  id,
  company,
  subject,
  detail,
  target_date,
  has_blocker,
  blocker_description,
  progress,
}) => ({
  id,
  subject,
  detail,
  target_date: transformDateStringToDateObject(target_date),
  company,
  has_blocker: transformBoolToRadioOption(has_blocker),
  blocker_description,
  progress: `${progress}`,
})
