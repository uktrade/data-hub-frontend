import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import urls from '../../../../../lib/urls'
import { currencyGBP } from '../../../../../client/utils/number-utils'
import LocalHeader from '../../../../../client/components/LocalHeader/LocalHeader'
import LocalHeaderDetails from '../../../../../client/components/LocalHeaderDetails'
import { state2props } from '../Details/state'

const OpportunityDetailsHeader = ({ details }) => {
  const { createdOn, name, ukRegions, assetClasses, opportunityValue } =
    details.detailsFields
  const { status } = details

  const oppValue = !opportunityValue.value
    ? 'Not yet valued'
    : `${currencyGBP(opportunityValue.value)}`

  const getArrayFieldValue = (arrayData) => {
    if (!arrayData.length) {
      return 'Not yet defined'
    } else if (arrayData.length == 1) {
      return arrayData[0].label
    } else {
      return 'Multiple'
    }
  }

  const itemCollection = [
    {
      label: 'Status',
      value: status.label || 'Unassigned',
    },
    {
      label: 'Valuation',
      value: oppValue,
    },
    {
      label: 'UK location',
      value: getArrayFieldValue(ukRegions),
    },
    {
      label: 'Asset class',
      value: getArrayFieldValue(assetClasses),
    },
    {
      label: 'Created on',
      value: createdOn,
    },
  ]
  const breadcrumbs = [
    { link: urls.dashboard(), text: 'Home' },
    { link: urls.investments.index(), text: 'Investments' },
    { link: urls.investments.opportunities.index(), text: 'UK opportunities' },
    { text: name },
  ]

  return (
    <LocalHeader breadcrumbs={breadcrumbs} heading={name}>
      <LocalHeaderDetails items={itemCollection} />
    </LocalHeader>
  )
}

OpportunityDetailsHeader.propTypes = {
  opportunityDetails: PropTypes.shape({
    details: PropTypes.shape({
      status: PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
      }).isRequired,
      detailsFields: PropTypes.shape({
        createdOn: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        ukRegions: PropTypes.arrayOf(
          PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string,
          })
        ).isRequired,
        assetClasses: PropTypes.arrayOf(
          PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string,
          })
        ).isRequired,
        opportunityValue: PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string,
        }).isRequired,
      }),
    }),
  }),
}

export default connect(state2props)(OpportunityDetailsHeader)
