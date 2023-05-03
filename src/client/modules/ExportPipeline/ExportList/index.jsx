import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import qs from 'qs'

import Task from '../../../components/Task'
import Pagination from '../../../components/Pagination'

import { EXPORT__PIPELINE_LIST_LOADED } from '../../../actions'
import { ID, TASK_GET_EXPORT_PIPELINE_LIST, state2props } from './state'
import { parsePage } from '../../../../client/utils/pagination'

import List from './List'
import ListItemRenderer from './ItemRenderer'
import ContentWithHeading from '../../../components/ContentWithHeading'
import { UnorderedList, ListItem } from 'govuk-react'
import styled from 'styled-components'
import { FONT_SIZE } from '@govuk-react/constants'

const StyledContent = styled.div({
  display: 'flex',
  flexDirection: 'column',
  rowGap: FONT_SIZE.SIZE_20,
})

const EmptyState = () => (
  <div data-test="no-export-items">
    <ContentWithHeading heading="You have no exports">
      <StyledContent>
        <div>
          Here you can create an export project to track a company's export
          progress. These will appear on your home page, so you keep track of
          your exports in one place.
        </div>
        <span>To add an export:</span>
        <div>
          <UnorderedList listStyleType="bullet">
            <ListItem>go to the company page and press 'view options'</ListItem>
            <ListItem>select 'Add export project'</ListItem>
          </UnorderedList>
        </div>
      </StyledContent>
    </ContentWithHeading>
  </div>
)

const ExportList = ({ count, results, itemsPerPage, maxItemsToPaginate }) => {
  const history = useHistory()
  const location = useLocation()

  const qsParams = qs.parse(location.search.slice(1))
  const initialPage = parsePage(qsParams.page)
  const maxItems = Math.min(count, maxItemsToPaginate)
  const totalPages = Math.ceil(maxItems / itemsPerPage)

  return (
    <Task.Status
      name={TASK_GET_EXPORT_PIPELINE_LIST}
      id={ID}
      progressMessage="loading export pipeline list"
      startOnRender={{
        payload: {
          page: initialPage,
        },
        onSuccessDispatch: EXPORT__PIPELINE_LIST_LOADED,
      }}
    >
      {() => (
        <>
          {count === 0 ? (
            <EmptyState />
          ) : (
            <>
              <List items={results} itemRenderer={ListItemRenderer} />
              <Pagination
                totalPages={totalPages}
                activePage={initialPage}
                onPageClick={(page, e) => {
                  e.preventDefault()
                  history.push({
                    search: qs.stringify({
                      ...qsParams,
                      page,
                    }),
                  })
                }}
              />
            </>
          )}
        </>
      )}
    </Task.Status>
  )
}

ExportList.propTypes = {
  count: PropTypes.number,
  results: PropTypes.array,
  itemsPerPage: PropTypes.number,
  maxItemsToPaginate: PropTypes.number,
}

export default connect(state2props)(ExportList)
