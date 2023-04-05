import React from 'react'
import { Link, Table } from 'govuk-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SummaryTable } from '../../../../../client/components'
import { FONT_SIZE, FONT_WEIGHTS } from '@govuk-react/constants'
import { companyProjectsState2props } from './state'
import { connect } from 'react-redux'
import urls from '../../../../../lib/urls'
import { BLUE, GREY_2 } from '../../../../../client/utils/colours'

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

const StyledSummaryTable = styled(SummaryTable)`
  margin: 0;
  & > tbody th {
    width: 50%;
  }
`

const StyledTableRow = styled(Table.Row)`
  border: 0;
`

const StyledTableCell = styled(Table.Cell)`
  border: 0;
  padding-bottom: 0;
`

const StyledActiveInvestmentTableRow = styled(Table.Row)`
  border: 0;
`

const StyledActiveInvestmentTableBottomRow = styled(Table.Row)`
  border-bottom: 1px solid ${GREY_2};
`

const StyledActiveInvestmentHeadingTableCell = styled(Table.Cell)`
  border: 0;
  padding: 0;
`

const StyledActiveInvestmentHeadingTableCellHeader = styled(Table.CellHeader)`
  border: 0;
  padding-top: 10px;
  font-weight: 400;
`

const StyledActiveInvestmentTableCell = styled(Table.Cell)`
  border: 0;
`

const ActiveInvestmentList = ({ upcomingActiveInvestments }) => {
  return upcomingActiveInvestments.map((activeInvestment) => {
    return (
      <>
        <StyledActiveInvestmentTableRow>
          <StyledActiveInvestmentHeadingTableCell colSpan={2}>
            <StyledActiveInvestmentSubject>
              <Link
                href={`${urls.investments.projects.details(
                  activeInvestment.id
                )}`}
                data-test="active-investment-page-link"
              >
                {activeInvestment.name}
              </Link>
            </StyledActiveInvestmentSubject>
          </StyledActiveInvestmentHeadingTableCell>
        </StyledActiveInvestmentTableRow>
        <StyledActiveInvestmentTableBottomRow>
          <StyledActiveInvestmentHeadingTableCellHeader
            colSpan={1}
            data-test={`estimated-land-date ${activeInvestment.name}`}
          >
            Estimated land date
          </StyledActiveInvestmentHeadingTableCellHeader>
          <StyledActiveInvestmentTableCell colSpan={1}>
            {new Date(activeInvestment.estimated_land_date).toLocaleDateString(
              'en-GB',
              { month: 'long', year: 'numeric' }
            )}
          </StyledActiveInvestmentTableCell>
        </StyledActiveInvestmentTableBottomRow>
      </>
    )
  })
}

const ActiveInvestmentProjectsCard = ({
  queryString,
  upcomingActiveInvestments,
  stageList,
}) => {
  return (
    <StyledSummaryTable
      caption="Active investment projects"
      data-test="activeInvestmentProjectsContainer"
    >
      {stageList?.active ? (
        <ActiveInvestmentList
          upcomingActiveInvestments={upcomingActiveInvestments}
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
              href={`${queryString}/investments/projects`}
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
              href={`${queryString}/investments/projects`}
              data-test="investments-page-link"
            >
              View all investments
            </Link>
          )}
        </StyledTableCell>
      </StyledTableRow>
    </StyledSummaryTable>
  )
}

ActiveInvestmentProjectsCard.propTypes = {
  investment: PropTypes.object.isRequired,
}

export default connect(companyProjectsState2props)(ActiveInvestmentProjectsCard)
