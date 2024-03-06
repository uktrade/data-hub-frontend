import React from 'react'
import styled from 'styled-components'
import Details from '@govuk-react/details'
import { H2 } from '@govuk-react/heading'
import { SPACING, LEVEL_SIZE } from '@govuk-react/constants'
import InsetText from '@govuk-react/inset-text'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom-v5-compat'

import { CollectionList, Metadata } from '../../../../components'
import { state2props } from './state'
import {
  EXPORTS_HISTORY__LOADED,
  EXPORTS_HISTORY__SELECT_PAGE,
} from '../../../../actions'
import {
  CompanyResource,
  CountriesResource,
} from '../../../../components/Resource'
import CompanyLayout from '../../../../components/Layout/CompanyLayout'
import urls from '../../../../../lib/urls'
import DefaultLayoutBase from '../../../../components/Layout/DefaultLayoutBase'
import { listSkeletonPlaceholder } from '../../../../components/SkeletonPlaceholder'

const StyledDetails = styled(Details)`
  margin: ${SPACING.SCALE_3} 0 0 0;
`

const metadataRenderer = (metadata) => {
  return metadata && metadata.length > 4 ? (
    <StyledDetails summary="View details">
      <Metadata rows={metadata} />
    </StyledDetails>
  ) : (
    <Metadata rows={metadata} />
  )
}

const getCountry = (id) => (
  <CountriesResource id={id}>
    {(countries) => {
      const country = countries.find((country) => country.id === id)
      return `${country.name} exports history`
    }}
  </CountriesResource>
)

const ExportsHistory = ({
  count,
  results,
  onPageClick,
  activePage,
  isComplete,
}) => {
  const { companyId, countryId } = useParams()

  const collectionListTask = {
    name: 'Exports history',
    id: 'exportsHistory',
    progressMessage: 'loading Exports History',
    renderProgress: listSkeletonPlaceholder(),
    startOnRender: {
      payload: { companyId, countryId, activePage },
      onSuccessDispatch: EXPORTS_HISTORY__LOADED,
    },
  }

  const countryName = countryId
    ? getCountry(countryId)
    : 'Export countries history'

  return (
    <DefaultLayoutBase>
      <CompanyResource id={companyId}>
        {(company) => (
          <CompanyLayout
            company={company}
            breadcrumbs={[
              {
                link: urls.companies.exports.index(company.id),
                text: 'Exports',
              },
              { text: countryName },
            ]}
            pageTitle="Export countries history"
          >
            <InsetText>
              You can only see the history of countries that were added or
              edited after 6th February 2020
            </InsetText>
            <H2 size={LEVEL_SIZE[3]}>{countryName}</H2>
            <CollectionList
              taskProps={collectionListTask}
              items={results}
              count={count}
              onPageClick={onPageClick}
              activePage={activePage}
              isComplete={isComplete}
              metadataRenderer={metadataRenderer}
            />
          </CompanyLayout>
        )}
      </CompanyResource>
    </DefaultLayoutBase>
  )
}

export default connect(state2props, (dispatch) => ({
  onPageClick: (page) => {
    dispatch({
      type: EXPORTS_HISTORY__SELECT_PAGE,
      page,
    })
  },
}))(ExportsHistory)
