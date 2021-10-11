import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import urls from '../../../../../lib/urls'
import { currencyGBP } from '../../../../../client/utils/number-utils'
import LocalHeader from '../../../../../client/components/LocalHeader/LocalHeader'
import LocalHeaderDetails from '../../../../../client/components/LocalHeaderDetails'
import { state2props } from '../Details/state'

const OpportunityDetailsHeader = ({
  opportunity: {
    id,
    status: { label: statusLabel },
    detailsFields: {
      createdOn,
      name,
      ukRegions,
      assetClasses,
      opportunityValue,
    },
  },
  currentPath,
}) => {
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
      value: (
        <span>
          {statusLabel}
          {' - '}
          <a href={urls.investments.opportunities.status(id)}>change</a>
        </span>
      ),
    },
    {
      label: 'Valuation',
      value: opportunityValue.value
        ? currencyGBP(opportunityValue.value)
        : 'Not yet valued',
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

  const getCurrentTab = (currentPath) =>
    currentPath.includes('/interactions') ? 'Interactions' : 'Details'

  const breadcrumbs = [
    { link: urls.dashboard(), text: 'Home' },
    { link: urls.investments.index(), text: 'Investments' },
    { link: urls.investments.opportunities.index(), text: 'UK opportunities' },
    { link: urls.investments.opportunities.details(id), text: name },
    { text: getCurrentTab(currentPath) },
  ]

  return (
    <LocalHeader breadcrumbs={breadcrumbs} heading={name}>
      <LocalHeaderDetails items={itemCollection} />
    </LocalHeader>
  )
}

OpportunityDetailsHeader.propTypes = {
  opportunity: PropTypes.shape({
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
}

export default connect(state2props)(OpportunityDetailsHeader)
