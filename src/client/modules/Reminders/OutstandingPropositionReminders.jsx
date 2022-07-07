import React from 'react'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { SPACING, FONT_SIZE, HEADING_SIZES } from '@govuk-react/constants'
import { Link } from 'govuk-react'
import { GREY_2 } from 'govuk-colours'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import styled from 'styled-components'
import qs from 'qs'

import { REMINDERS__OUTSTANDING_PROPOSITIONS_LOADED } from '../../actions'
import { TASK_GET_OUTSTANDING_PROPOSITIONS_REMINDERS, ID } from './state'

import { DARK_GREY } from '../../utils/colors'
import { format } from '../../utils/date'
import { DATE_DAY_LONG_FORMAT } from '../../../common/constants'
import { maxItemsToPaginate, itemsPerPage } from './constants'

import { DefaultLayout, RoutedPagination } from '../../components'
import CollectionHeader from './CollectionHeader'
import RemindersMenu from './RemindersMenu'
import Task from '../../components/Task'
import urls from '../../../lib/urls'
import Heading from './Heading'

const List = styled('ol')({
  listStyleType: 'none',
  padding: 0,
  marginTop: SPACING.SCALE_2,
  '& > li': {
    marginBottom: SPACING.SCALE_2,
  },
})

const ListItem = styled('li')({
  borderBottom: `solid 1px ${GREY_2}`,
})

const ListItemHeader = styled('div')({
  fontSize: HEADING_SIZES.SMALL,
  marginTop: SPACING.SCALE_3,
  marginBottom: SPACING.SCALE_4,
})

const ListItemContent = styled('div')({
  marginBottom: SPACING.SCALE_2,
  marginTop: SPACING.SCALE_2,
})

const ListItemFooter = styled('div')({
  color: DARK_GREY,
  fontSize: FONT_SIZE.SIZE_16,
  marginBottom: SPACING.SCALE_4,
})

const PaginationSummary = styled('div')({
  fontSize: FONT_SIZE.SIZE_16,
  color: DARK_GREY,
  paddingTop: SPACING.SCALE_4,
  paddingBottom: SPACING.SCALE_3,
  borderBottom: ({ hasReminders }) =>
    hasReminders ? `solid 1px ${GREY_2}` : 'none',
})

const OutstandingPropositionReminders = ({
  outstandingPropositionsReminders,
}) => {
  const { results, count } = outstandingPropositionsReminders
  const location = useLocation()
  const qsParams = qs.parse(location.search.slice(1))
  const page = parseInt(qsParams.page, 10) || 1
  const subject = 'outstanding propositions'
  const title = `Reminders for ${subject}`
  const totalPages = Math.ceil(
    Math.min(count, maxItemsToPaginate) / itemsPerPage
  )

  return (
    <DefaultLayout
      pageTitle={title}
      heading={<Heading preHeading="Reminders for">{subject}</Heading>}
      breadcrumbs={[{ link: urls.dashboard(), text: 'Home' }, { text: title }]}
    >
      <GridRow>
        <GridCol setWidth="one-third">
          <RemindersMenu />
        </GridCol>
        <GridCol>
          <CollectionHeader settings={false} totalItems={count} />
          <PaginationSummary
            hasReminders={results.length > 0}
            data-test="pagination-summary"
          >
            {results.length === 0
              ? 'You have no reminders'
              : `Page ${page || 1} of ${totalPages}`}
          </PaginationSummary>
          <Task.Status
            name={TASK_GET_OUTSTANDING_PROPOSITIONS_REMINDERS}
            id={ID}
            startOnRender={{
              payload: { page, sortby: qsParams.sortby },
              onSuccessDispatch: REMINDERS__OUTSTANDING_PROPOSITIONS_LOADED,
            }}
          >
            {() => (
              <>
                <List data-test="reminders-list">
                  {results.map(({ id, name, deadline, investment_project }) => (
                    <ListItem key={id} data-test="reminders-list-item">
                      <GridRow>
                        <GridCol>
                          <ListItemHeader data-test="item-header">
                            Due {format(deadline, DATE_DAY_LONG_FORMAT)}
                          </ListItemHeader>
                          <ListItemContent data-test="item-content">
                            <Link
                              href={`${urls.investments.projects.propositions(
                                investment_project.id
                              )}`}
                            >
                              {name}
                            </Link>
                          </ListItemContent>
                          <ListItemFooter data-test="item-footer">
                            Project code {investment_project.project_code}
                          </ListItemFooter>
                        </GridCol>
                      </GridRow>
                    </ListItem>
                  ))}
                </List>
                <RoutedPagination initialPage={page} items={count || 0} />
              </>
            )}
          </Task.Status>
        </GridCol>
      </GridRow>
    </DefaultLayout>
  )
}

export const state2props = (state) => state[ID]

export default connect(state2props)(OutstandingPropositionReminders)
