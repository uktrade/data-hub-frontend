const { get } = require('lodash')

const {
  formatDate,
  DATE_FORMAT_FULL,
} = require('../../../../client/utils/date-utils')

const transformResponseToESSInteractionDetails = ({ id, object }) => {
  const formData = get(object, 'dit:directoryFormsApi:Submission:Data')
  const essDetails = {
    id,
    subject: formData.nature_of_enquiry
      ? formData.nature_of_enquiry
      : 'ESS Inbound Enquiry',
    question: formData.aaa_question,
    dateOfInteraction: formatDate(object.published, DATE_FORMAT_FULL),
    countries: formData.countries,
    companyName: formData.company_name,
    enquirer: formData.full_name,
  }
  return essDetails
}

export { transformResponseToESSInteractionDetails }
