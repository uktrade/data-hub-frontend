import React, { Fragment } from 'react'
import { Link, Table } from 'govuk-react'
import styled from 'styled-components'
import { FONT_SIZE, FONT_WEIGHTS } from '@govuk-react/constants'
import { connect } from 'react-redux'
import { kebabCase } from 'lodash'

import { companies, investments } from '../../../../../lib/urls'
import Tag, { TAG_COLOURS } from '../../../../components/Tag'
import { companyProjectsState2props } from './state'
import { BLUE, GREY_2 } from '../../../../utils/colours'
import { buildCellContents } from './transformers'
import { StyledSummaryTable, StyledTableRow } from './components'

const StyledActiveInvestmentSubject = styled('h3')`
  font-size: ${FONT_SIZE.SIZE_20};
  font-weight: ${FONT_WEIGHTS.bold};
  line-height: ${FONT_SIZE.SIZE_24};
  margin-top: 10px;
  margin-bottom: 0;
  & > a:link,
  a:visited,
  a:hover,
  a:active {
    text-decoration: none;
    color: ${BLUE};
  }
`

const StyledTableCell = styled(Table.Cell)`
  border: 0;
  padding-bottom: 0;
`

const StyledActiveInvestmentHeadingTableCell = styled(Table.Cell)`
  border: 0;
  padding-top: 0;
  padding-bottom: 10px;
`

const StyledActiveInvestmentHeadingTableCellHeader = styled(Table.CellHeader)`
  border: 0;
  padding-top: 0px;
  padding-bottom: 0px;
  font-weight: 400;
`

const StyledActiveInvestmentTableCell = styled(Table.Cell)`
  border: 0;
  padding-top: 0px;
  padding-bottom: 0px;
`

const StyledActiveInvestmentTableBottomRow = styled(Table.Row)`
  border-bottom: 1px solid ${GREY_2};
  padding-bottom: 50px;
  margin-bottom: 50px;
`

const StyledActiveInvestmentHeadingTableBottomCellHeader = styled(
  Table.CellHeader
)`
  border: 0;
  padding-top: 0px;
  font-weight: 400;
`

const StyledActiveInvestmentTableBottomCell = styled(Table.Cell)`
  border: 0;
  padding-top: 0px;
`

const EditLink = styled(Link)`
  float: right;
`

const LIKELIHOOD_TO_LAND_TO_COLOUR_MAP = {
  High: TAG_COLOURS.GREEN,
  Medium: TAG_COLOURS.ORANGE,
  Low: TAG_COLOURS.RED,
}

const LikelihoodToLand = ({ likelihood, investmentId, investmentName }) => (
  <>
    <Tag colour={LIKELIHOOD_TO_LAND_TO_COLOUR_MAP[likelihood]}>
      {likelihood}
    </Tag>
    <EditLink
      href={`${investments.projects.editDetails(
        investmentId
      )}?autoscroll=likelihood_to_land`}
      data-test={`active-investment-edit-${kebabCase(investmentName)}-link`}
    >
      Edit
    </EditLink>
  </>
)

const ActiveInvestmentList = ({ upcomingActiveInvestments, companyId }) =>
  upcomingActiveInvestments.map((activeInvestment) => (
    <Fragment key={activeInvestment.id}>
      <StyledTableRow>
        <StyledActiveInvestmentHeadingTableCell colSpan={2}>
          <StyledActiveInvestmentSubject>
            <Link
              href={investments.projects.details(activeInvestment.id)}
              data-test={`active-investment-page-${kebabCase(
                activeInvestment.name
              )}-link`}
            >
              {activeInvestment.name}
            </Link>
          </StyledActiveInvestmentSubject>
        </StyledActiveInvestmentHeadingTableCell>
      </StyledTableRow>
      <StyledTableRow>
        <StyledActiveInvestmentHeadingTableCellHeader
          colSpan={1}
          data-test={`estimated-land-date-${kebabCase(
            activeInvestment.name
          )}-header`}
        >
          Estimated land date
        </StyledActiveInvestmentHeadingTableCellHeader>
        <StyledActiveInvestmentTableCell colSpan={1}>
          {new Date(activeInvestment.estimated_land_date).toLocaleDateString(
            'en-GB',
            { month: 'long', year: 'numeric' }
          )}
        </StyledActiveInvestmentTableCell>
      </StyledTableRow>
      <StyledTableRow>
        <StyledActiveInvestmentHeadingTableCellHeader
          colSpan={1}
          data-test={`likelihood-of-landing-${kebabCase(
            activeInvestment.name
          )}-header`}
        >
          Likelihood of landing
        </StyledActiveInvestmentHeadingTableCellHeader>
        <StyledActiveInvestmentTableCell colSpan={1}>
          {buildCellContents(
            activeInvestment.likelihood_to_land,
            <LikelihoodToLand
              investmentId={activeInvestment.id}
              investmentName={activeInvestment.name}
              likelihood={activeInvestment.likelihood_to_land?.name}
            />
          )}
        </StyledActiveInvestmentTableCell>
      </StyledTableRow>
      <StyledActiveInvestmentTableBottomRow>
        <StyledActiveInvestmentHeadingTableBottomCellHeader
          colSpan={1}
          data-test={`last-interaction-date-${kebabCase(
            activeInvestment.name
          )}-header`}
        >
          Last interaction date
        </StyledActiveInvestmentHeadingTableBottomCellHeader>
        <StyledActiveInvestmentTableBottomCell colSpan={1}>
          {buildCellContents(
            activeInvestment.latest_interaction,
            <Link
              href={companies.interactions.detail(
                companyId,
                activeInvestment.latest_interaction?.id
              )}
              data-test={`last-interaction-${kebabCase(
                activeInvestment.name
              )}-link`}
            >
              {new Date(
                activeInvestment.latest_interaction?.date
              ).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Link>
          )}
        </StyledActiveInvestmentTableBottomCell>
      </StyledActiveInvestmentTableBottomRow>
    </Fragment>
  ))

const ActiveInvestmentProjectsCard = ({
  upcomingActiveInvestments,
  stageList,
  companyId,
}) => (
  <StyledSummaryTable
    caption="Active investment projects"
    data-test="activeInvestmentProjectsContainer"
  >
    {stageList?.active ? (
      <ActiveInvestmentList
        upcomingActiveInvestments={upcomingActiveInvestments}
        companyId={companyId}
      />
    ) : (
      <StyledTableRow>
        <StyledTableCell colSpan={2}>
          There are no active investments
        </StyledTableCell>
      </StyledTableRow>
    )}

    <StyledTableRow>
      <StyledTableCell colSpan={2}>
        {stageList?.active ? (
          <Link
            href={companies.investments.companyInvestmentProjectsWithSearch(
              companyId
            )}
            data-test="active-investments-page-link"
          >
            {stageList?.active <= 3 && 'View all investments'}
            {stageList?.active === 4 &&
              `View ${
                stageList.active - upcomingActiveInvestments.length
              } more active investment`}
            {stageList?.active > 4 &&
              `View ${
                stageList.active - upcomingActiveInvestments.length
              } more active investments`}
          </Link>
        ) : (
          <Link
            href={companies.investments.companyInvestmentProjectsWithSearch(
              companyId
            )}
            data-test="investments-page-link"
          >
            View all investments
          </Link>
        )}
      </StyledTableCell>
    </StyledTableRow>
  </StyledSummaryTable>
)

export default connect(companyProjectsState2props)(ActiveInvestmentProjectsCard)
