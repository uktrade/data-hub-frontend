const { get } = require('lodash')
const { formatLongDate } = require('../../../../client/utils/date')

const transformResponseToESSInteractionDetails = ({ id, object }) => {
  const formData = get(object, 'dit:directoryFormsApi:Submission:Data')
  const nature_of_enquiry = formData.nature_of_enquiry
  const essDetails = {
    id,
    subject: nature_of_enquiry,
    question: formData.aaa_question,
    dateOfInteraction: formatLongDate(object.published),
    countries: formData.countries,
  }
  return essDetails
}

export { transformResponseToESSInteractionDetails }
