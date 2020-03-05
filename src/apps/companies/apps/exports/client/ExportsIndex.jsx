import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Details from '@govuk-react/details'
import Link from '@govuk-react/link'
import { H3 } from '@govuk-react/heading'
import { SummaryTable } from 'data-hub-components'

import SecondaryButton from '../../../../../client/components/SecondaryButton'
import urls from '../../../../../lib/urls'

const StyledSummaryTable = styled(SummaryTable)`
  margin-top: 0;
`

const ExportsIndex = ({
  isArchived,
  exportWinCategory,
  greatProfile,
  exportPotential,
  exportCountriesInformation,
  exportPotentials,
  companyId,
  companyNumber,
}) => {
  return (
    <>
      <SummaryTable caption="Exports">
        <SummaryTable.Row
          heading={exportWinCategory.name}
          key={exportWinCategory.name}
        >
          {exportWinCategory.value ? exportWinCategory.value : 'None'}
        </SummaryTable.Row>
        <SummaryTable.Row heading={greatProfile.name} key={greatProfile.name}>
          {greatProfile.value === 'published' ? (
            <Link
              href={urls.external.greatProfile(companyNumber)}
              target="_blank"
              aria-label="opens in a new tab"
            >
              "Find a supplier" profile
            </Link>
          ) : greatProfile.value === 'unpublished' ? (
            'Profile not published'
          ) : (
            'No profile'
          )}
        </SummaryTable.Row>
        <SummaryTable.Row
          heading={exportPotential.name}
          key={exportPotential.name}
        >
          {exportPotential.value ? exportPotential.value : 'No score given'}
        </SummaryTable.Row>
      </SummaryTable>

      <Details summary="What is export potential">
        The export potential score is a prediction of a company's likelihood of
        exporting, and was originally created for the{' '}
        <Link
          href={urls.external.findExporters()}
          target="_blank"
          aria-label="opens in a new tab"
        >
          Find Exporters tool
        </Link>
        . DIT's data science team compared all HMRC export information with the
        features of all UK companies to find patterns; they then repeatedly
        tested their model against a subset of known-good data to improve it.
        The scores are as follows:
        <ol>
          {exportPotentials.map((category) => (
            <li key={category.text}>
              <strong>{category.text}</strong> - {category.description}
            </li>
          ))}
        </ol>
        <br />
        We are continuing to improve the algorithm so please do share your
        feedback or let us know of any anomalies through the{' '}
        <a href={urls.support()}>support channel</a>.
      </Details>

      <H3>Export countries information</H3>
      <Link href={urls.companies.exports.history.index(companyId)}>
        View full export countries history
      </Link>
      <StyledSummaryTable>
        {exportCountriesInformation.map(({ name, values }) => (
          <SummaryTable.Row heading={name} key={name}>
            <>
              {values?.length
                ? values.map(({ id, name }, i) => {
                    const isLastItem = i === values.length - 1
                    return (
                      <React.Fragment key={id}>
                        <Link
                          href={urls.companies.exports.history.country(
                            companyId,
                            id
                          )}
                        >
                          {name}
                        </Link>
                        {isLastItem ? null : ', '}
                      </React.Fragment>
                    )
                  })
                : 'None'}
            </>
          </SummaryTable.Row>
        ))}
      </StyledSummaryTable>

      {isArchived ? null : (
        <SecondaryButton
          as={Link}
          href={urls.companies.exports.edit(companyId)}
          data-test-id="editExportCountriesButton"
        >
          Edit export countries
        </SecondaryButton>
      )}

      <H3>Export wins</H3>
      <p>
        <Link
          data-test-id="exportWinsLink"
          href={urls.external.exportWins()}
          target="_blank"
          aria-label="opens in a new tab"
        >
          Record your win
        </Link>{' '}
        on our Export Wins site
      </p>
    </>
  )
}

ExportsIndex.propTypes = {
  isArchived: PropTypes.bool.isRequired,
  exportWinCategory: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  greatProfile: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  exportPotential: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  exportCountriesInformation: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          id: PropTypes.string,
        })
      ),
    })
  ).isRequired,
  exportPotentials: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
  companyId: PropTypes.string.isRequired,
  companyNumber: PropTypes.string,
}

ExportsIndex.defaultProps = {
  companyNumber: null,
}

export default ExportsIndex
