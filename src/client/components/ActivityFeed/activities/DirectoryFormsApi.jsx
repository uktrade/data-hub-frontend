import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'

import { Card, CardDetails, CardHeader, CardTable } from './card'
import { ACTIVITY_TYPE, SOURCE_TYPES } from '../constants'
import CardUtils from './card/CardUtils'

const FORM_URL_TO_NAME_MAP = {
  '/contact/export-advice/comment/': 'Export enquiry',
}

const YES = 'Yes'
const NO = 'No'

export default class DirectoryFormsApi extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
  }

  static canRender(activity, filter, isExportEnquiriesEnabled) {
    return (
      CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.DirectoryFormsApi) &&
      isExportEnquiriesEnabled
    )
  }

  render() {
    const { activity, showDetails } = this.props
    const sentDate = get(activity, 'object.published')
    const formData = get(
      activity,
      'object.dit:directoryFormsApi:Submission:Data'
    )
    const formUrl = get(activity, 'object.url')

    return (
      <Card>
        <CardHeader
          subHeading={FORM_URL_TO_NAME_MAP[formUrl]}
          blockText="Great.gov.uk"
          startTime={sentDate}
          sourceType={SOURCE_TYPES.external}
          badge={{ text: 'GREAT.GOV.UK', borderColour: '#006435' }}
        />

        <CardDetails
          summary="View key details for this enquiry"
          showDetails={showDetails}
        >
          <CardTable
            rows={[
              { header: 'Comment', content: formData.comment },
              { header: 'First name', content: formData.first_name },
              { header: 'Last name', content: formData.last_name },
              { header: 'Position', content: formData.position },
              { header: 'Email', content: formData.email },
              { header: 'Phone', content: formData.phone },

              // UK Ltd or UK PLC
              { header: 'Company type', content: formData.company_type },

              // User does not complete this field
              {
                header: 'Companies House number',
                content: formData.companies_house_number,
              },

              // Sole trader, Charity, ..., Other
              {
                header: 'Company type other',
                content: formData.company_type_other,
              },

              {
                header: 'Organisation name',
                content: formData.organisation_name,
              },
              { header: 'Postcode', content: formData.postcode },
              { header: 'Industry', content: formData.industry },

              // If defined the user has manually typed the industry
              { header: 'Industry other', content: formData.industry_other },

              { header: 'Turnover', content: formData.turnover },
              { header: 'Employees', content: formData.employees },

              // User does not complete this field
              {
                header: 'Region office email',
                content: formData.region_office_email,
              },

              {
                header:
                  'I would like to receive additional information by email',
                content:
                  formData.contact_consent && formData.contact_consent[0]
                    ? YES
                    : NO,
              },

              {
                header:
                  'I would like to receive additional information by telephone',
                content:
                  formData.contact_consent && formData.contact_consent[1]
                    ? YES
                    : NO,
              },
            ]}
          />
        </CardDetails>
      </Card>
    )
  }
}
