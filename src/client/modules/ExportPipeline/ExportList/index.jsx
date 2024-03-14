import React from 'react'
import { useNavigate } from 'react-router-dom'
import { HEADING_SIZES, FONT_SIZE, MEDIA_QUERIES } from '@govuk-react/constants'
import { UnorderedList, ListItem, H2, Link } from 'govuk-react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import qs from 'qs'

import ContentWithHeading from '../../../components/ContentWithHeading'
import { ButtonLink, Pagination } from '../../../components'
import { MID_GREY } from '../../../utils/colours'
import ListItemRenderer from './ItemRenderer'
import Task from '../../../components/Task'
import ExportSelect from './ExportSelect'
import urls from '../../../../lib/urls'
import ExportDate from './ExportDate'
import List from './List'

import {
  ID,
  TASK_GET_EXPORT_PIPELINE_LIST,
  TASK_GET_EXPORT_PIPELINE_METADATA,
  state2props,
} from './state'

import {
  EXPORT__PIPELINE_LIST_LOADED,
  EXPORT__PIPELINE_METADATA_LOADED,
} from '../../../actions'

const StyledHeader = styled(H2)({
  marginTop: 0,
  fontWeight: 'normal',
  fontSize: HEADING_SIZES.MEDIUM,
  marginBottom: 0,
})

const StyledResultCount = styled('span')({
  fontSize: 36,
  fontWeight: 600,
  lineHeight: 1,
})

const StyledContent = styled.div({
  display: 'flex',
  flexDirection: 'column',
  rowGap: FONT_SIZE.SIZE_20,
})

const FiltersContainer = styled('div')({
  display: 'grid',
  rowGap: 15,
  [MEDIA_QUERIES.TABLET]: {
    columnGap: 2,
    gridTemplateColumns: '50% 50%',
  },
  [MEDIA_QUERIES.DESKTOP]: {
    gridTemplateColumns: '25% 25% 25% 25%',
  },
})

const HeaderContainer = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${MID_GREY}`,
  paddingBottom: 10,
  marginTop: 30,
})

const LinkContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  padding: 5,
  alignItems: 'end',
  gap: 10,
})

const StyledButtonLink = styled(ButtonLink)({
  marginBottom: 0,
  border: 0,
  padding: 0,
})

const ListContainer = styled('div')({
  marginTop: 20,
})

const ExportList = ({
  count,
  results,
  itemsPerPage,
  maxItemsToPaginate,
  payload,
  filters,
  hasExportWinFeatureGroup,
}) => {
  const navigate = useNavigate()
  const maxItems = Math.min(count, maxItemsToPaginate)
  const totalPages = Math.ceil(maxItems / itemsPerPage)
  const hasZeroExports = !filters.areActive && count === 0

  const onClearAll = () => {
    navigate({
      search: qs.stringify({
        page: 1,
      }),
    })
  }

  return (
    <>
      {!hasZeroExports && (
        <>
          <Task.Status
            name={TASK_GET_EXPORT_PIPELINE_METADATA}
            id={ID}
            progressMessage="loading export pipeline metadata"
            startOnRender={{
              payload: {},
              onSuccessDispatch: EXPORT__PIPELINE_METADATA_LOADED,
            }}
          >
            {() => (
              <FiltersContainer>
                <ExportSelect
                  label="Status"
                  qsParam="status"
                  options={filters.status.options}
                />
                <ExportSelect
                  label="Ex. Potential"
                  qsParam="export_potential"
                  options={filters.exportPotential.options}
                />
                <ExportSelect
                  label="Sector"
                  qsParam="sector"
                  options={filters.sector.options}
                />
                <ExportSelect
                  label="Country"
                  qsParam="destination_country"
                  options={filters.country.options}
                />
                <ExportDate
                  type="month"
                  boldLabel={false}
                  label="Win from"
                  name="estimated_win_date_after"
                  qsParamName="estimated_win_date_after"
                  data-test="estimated-win-date-after"
                />
                <ExportDate
                  type="month"
                  boldLabel={false}
                  label="Win to"
                  name="estimated_win_date_before"
                  qsParamName="estimated_win_date_before"
                  data-test="estimated-win-date-before"
                />
                <ExportSelect
                  label="Owner"
                  qsParam="owner"
                  options={filters.owner.options}
                />
                <ExportSelect
                  label="Sort by"
                  qsParam="sortby"
                  options={filters.sortby.options}
                />
              </FiltersContainer>
            )}
          </Task.Status>
          <HeaderContainer role="status">
            <StyledHeader>
              <StyledResultCount data-test="collectionCount">
                {count}
              </StyledResultCount>{' '}
              Exports
            </StyledHeader>
            <LinkContainer>
              {filters.areActive && (
                <StyledButtonLink
                  onClick={onClearAll}
                  data-test="clear-filters"
                >
                  Remove all filters
                </StyledButtonLink>
              )}
              {hasExportWinFeatureGroup && (
                <Link
                  href={urls.companies.exportWins.index()}
                  data-test="export-wins"
                >
                  Export wins
                </Link>
              )}
            </LinkContainer>
          </HeaderContainer>
        </>
      )}
      <Task.Status
        name={TASK_GET_EXPORT_PIPELINE_LIST}
        id={ID}
        progressMessage="loading export pipeline list"
        startOnRender={{
          payload,
          onSuccessDispatch: EXPORT__PIPELINE_LIST_LOADED,
        }}
      >
        {() => (
          <>
            {hasZeroExports ? (
              <div data-test="no-export-items">
                <ContentWithHeading
                  data-test="no-export-items"
                  heading="You have no exports"
                >
                  <StyledContent>
                    <div>
                      Here you can create an export project to track a company's
                      export progress. These will appear on your home page, so
                      you keep track of your exports in one place.
                    </div>
                    <span>To add an export:</span>
                    <div>
                      <UnorderedList listStyleType="bullet">
                        <ListItem>go to the company page</ListItem>
                        <ListItem>select 'Add export project' button</ListItem>
                      </UnorderedList>
                    </div>
                  </StyledContent>
                </ContentWithHeading>
              </div>
            ) : (
              <ListContainer>
                <List items={results} itemRenderer={ListItemRenderer} />
                <Pagination
                  totalPages={totalPages}
                  activePage={payload.page}
                  onPageClick={(page, e) => {
                    e.preventDefault()
                    navigate({
                      search: qs.stringify({
                        ...payload,
                        page,
                      }),
                    })
                  }}
                />
              </ListContainer>
            )}
          </>
        )}
      </Task.Status>
    </>
  )
}

ExportList.propTypes = {
  count: PropTypes.number,
  results: PropTypes.array,
  itemsPerPage: PropTypes.number,
  maxItemsToPaginate: PropTypes.number,
  hasExportWinFeatureGroup: PropTypes.bool,
}

export default connect(state2props)(ExportList)
