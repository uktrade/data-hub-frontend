import React from 'react'
import { useLocation } from 'react-router-dom'
import pluralize from 'pluralize'
import styled from 'styled-components'
import {
  FONT_SIZE,
  FONT_WEIGHTS,
  HEADING_SIZES,
  SPACING,
} from '@govuk-react/constants'
import { H2, H3 } from '@govuk-react/heading'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { Link } from 'govuk-react'
import { BLUE, GREY_1, GREY_2 } from 'govuk-colours'

import urls from '../../../lib/urls'
import {
  CollectionHeaderRow,
  CollectionSort,
  DefaultLayout,
  RoutedPagination,
} from '../../components'
import Heading from './Heading'
import { DARK_GREY } from '../../utils/colors'
import { formatMediumDate } from '../../utils/date'
import { decimal } from '../../utils/number-utils'

const LinkList = styled('ul')({
  listStyleType: 'none',
  padding: 0,
  margin: 0,
})

const LinkListItem = styled('li')({
  marginBottom: SPACING.SCALE_2,
})

const LinkListLink = styled(Link)(({ $isActive }) => ({
  textDecoration: 'none',
  position: 'relative',
  paddingLeft: SPACING.SCALE_2,
  display: 'block',
  borderLeft: `solid 5px transparent`,
  ...($isActive
    ? {
        fontWeight: FONT_WEIGHTS.bold,
        borderColor: BLUE,
      }
    : {}),
}))

const DeleteButton = styled('button')({
  display: 'inline',
  padding: 0,
  margin: `${SPACING.SCALE_3} 0`,
  background: 'transparent',
  border: 'none',
  fontSize: FONT_SIZE.SIZE_16,
  fontFamily: 'inherit',
  color: GREY_1,
  cursor: 'pointer',
  textDecoration: 'underline',
})

const RightCol = styled(GridCol)({
  textAlign: 'right',
})

const RemindersList = styled('ol')({
  listStyleType: 'none',
  padding: 0,
  marginTop: SPACING.SCALE_2,

  '& > li': {
    marginBottom: SPACING.SCALE_2,
  },
})

const RemindersListItem = styled('li')({
  borderBottom: `solid 1px ${GREY_2}`,
})

const ItemHeader = styled(H3)({
  fontSize: HEADING_SIZES.SMALL,
  marginTop: SPACING.SCALE_3,
  marginBottom: SPACING.SCALE_4,
})

const ItemContent = styled('div')({
  marginBottom: SPACING.SCALE_3,
})

const ItemFooter = styled('div')({
  color: DARK_GREY,
  fontSize: FONT_SIZE.SIZE_16,
  marginBottom: SPACING.SCALE_4,
})

const ListHeader = styled(H2)({
  marginTop: 0,
  fontWeight: FONT_WEIGHTS.regular,
  fontSize: HEADING_SIZES.MEDIUM,
  marginBottom: 0,
})

const ResultCount = styled('span')({
  fontSize: '36px',
  fontWeight: FONT_WEIGHTS.bold,
  lineHeight: 1,
})

const StyledCollectionHeaderRow = styled(CollectionHeaderRow)({
  alignItems: 'flex-end',
})

const SettingsLink = styled(Link)({
  fontSize: FONT_SIZE.SIZE_19,
})

const RemindersHeaderRow = ({ totalItems }) => {
  const formattedTotal = decimal(totalItems)
  const counterSuffix = pluralize('reminders', totalItems)
  const actions = (
    <SettingsLink
      data-test="reminders-settings-link"
      href="/reminders/settings"
    >
      Reminders settings
    </SettingsLink>
  )
  return (
    <StyledCollectionHeaderRow primary={true} actions={actions}>
      <ListHeader data-test="reminder-list-header">
        <ResultCount>{formattedTotal}</ResultCount>
        {` ${counterSuffix}`}
      </ListHeader>
    </StyledCollectionHeaderRow>
  )
}

const sortOptions = [
  {
    name: 'Most recent',
    value: '-created_on',
  },
  {
    name: 'Oldest',
    value: 'created_on',
  },
]
const maxItemsToPaginate = 10000
const itemsPerPage = 10

const RemindersCollection = ({
  subject,
  results,
  count,
  page,
  onDeleteReminder,
}) => {
  const location = useLocation()
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
          <LinkList data-test="link-list">
            <LinkListItem data-test="link-list-item">
              <LinkListLink
                href={urls.reminders.estimatedLandDate()}
                $isActive={
                  location.pathname == urls.reminders.estimatedLandDate()
                }
              >
                Reminders for approaching estimated land dates
              </LinkListLink>
            </LinkListItem>
            <LinkListItem data-test="link-list-item">
              <LinkListLink
                href={urls.reminders.noRecentInteraction()}
                $isActive={
                  location.pathname == urls.reminders.noRecentInteraction()
                }
              >
                Reminders for projects with no recent interaction
              </LinkListLink>
            </LinkListItem>
            <LinkListItem data-test="link-list-item">
              <LinkListLink
                href={urls.reminders.outstandingProposition()}
                $isActive={
                  location.pathname == urls.reminders.outstandingProposition()
                }
              >
                Reminders for outstanding propositions
              </LinkListLink>
            </LinkListItem>
          </LinkList>
        </GridCol>
        <GridCol>
          <RemindersHeaderRow totalItems={count} />
          <CollectionSort sortOptions={sortOptions} totalPages={totalPages} />
          <RemindersList data-test="reminders-list">
            {results.map(({ id, created_on, event, project, deleted }) => (
              <RemindersListItem key={id} data-test="reminders-list-item">
                <GridRow>
                  {deleted ? (
                    <GridCol>
                      <ItemHeader data-test="item-header">
                        Reminder deleted
                      </ItemHeader>
                      <ItemContent data-test="item-content">
                        {event} for {project.name}
                      </ItemContent>
                      <ItemFooter data-test="item-footer"></ItemFooter>
                    </GridCol>
                  ) : (
                    <>
                      <GridCol>
                        <ItemHeader data-test="item-header">
                          Received {formatMediumDate(created_on)}
                        </ItemHeader>
                        <ItemContent data-test="item-content">
                          {event} for{' '}
                          <Link
                            href={`${urls.investments.projects.details(
                              project.id
                            )}`}
                          >
                            {project.name}
                          </Link>
                        </ItemContent>
                        <ItemFooter data-test="item-footer">
                          Project code {project.project_code}
                        </ItemFooter>
                      </GridCol>
                      {onDeleteReminder && (
                        <RightCol setWidth="one-quarter">
                          <DeleteButton
                            data-test="delete-button"
                            onClick={() => onDeleteReminder(id)}
                          >
                            Delete reminder
                          </DeleteButton>
                        </RightCol>
                      )}
                    </>
                  )}
                </GridRow>
              </RemindersListItem>
            ))}
          </RemindersList>
          <RoutedPagination initialPage={page} items={count || 0} />
        </GridCol>
      </GridRow>
    </DefaultLayout>
  )
}

export default RemindersCollection
