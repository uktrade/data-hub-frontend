import { transformValueForAPI } from '../../../utils/date'
import { transformRadioOptionToBool } from '../../Investments/Projects/transformers'

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
  target_date: transformValueForAPI(target_date),
  company: company,
  has_blocker: transformRadioOptionToBool(has_blocker),
  blocker_description,
  progress: parseInt(progress),
})
