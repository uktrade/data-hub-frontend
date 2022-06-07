import React from 'react'
import { useLocation } from 'react-router-dom'
import pluralize from 'pluralize'
import qs from 'qs'
import styled from 'styled-components'
import { FONT_WEIGHTS, HEADING_SIZES, SPACING } from '@govuk-react/constants'
import { H2, H3 } from '@govuk-react/heading'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { Link } from 'govuk-react'
import { BLUE, GREY_1, GREY_2 } from 'govuk-colours'

import urls from '../../../lib/urls'
import {
  CollectionHeaderRow,
  DefaultLayout,
  RoutedPagination,
} from '../../components'
import Resource from '../../components/Resource'
import { formatMediumDate } from '../../utils/date'
import { decimal } from '../../utils/number-utils'

import { TASK_GET_ESTIMATED_LAND_DATE_REMINDERS } from './state'

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
  paddingLeft: 10,
  display: 'block',
  borderLeft: `solid 5px transparent`,
  ...($isActive
    ? {
        fontWeight: FONT_WEIGHTS.bold,
        borderColor: BLUE,
      }
    : {}),
}))

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
  color: GREY_1,
  marginBottom: SPACING.SCALE_4,
})

const ListHeader = styled(H2)({
  marginTop: 0,
  fontWeight: FONT_WEIGHTS.normal,
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

const PreHeading = styled('span')({
  display: 'block',
  fontWeight: FONT_WEIGHTS.regular,
  marginBottom: SPACING.SCALE_1,
})

const RemindersHeaderRow = ({ totalItems }) => {
  const formattedTotal = decimal(totalItems)
  const counterSuffix = pluralize('reminders', totalItems)
  const actions = <Link href="/reminders/settings">Reminders settings</Link>
  return (
    <StyledCollectionHeaderRow primary={true} actions={actions}>
      <ListHeader>
        <ResultCount>{formattedTotal}</ResultCount>
        {` ${counterSuffix}`}
      </ListHeader>
    </StyledCollectionHeaderRow>
  )
}

const EstimatedLandDateReminders = () => {
  const location = useLocation()
  const qsParams = qs.parse(location.search.slice(1))
  const page = parseInt(qsParams.page, 10)
  const title = 'Reminders for approaching estimated land dates'
  const heading = (
    <>
      <PreHeading>Reminders for </PreHeading>approaching estimated land dates
    </>
  )

  return (
    <DefaultLayout
      pageTitle={title}
      heading={heading}
      breadcrumbs={[{ link: '/', text: 'Home' }, { text: title }]}
    >
      <Resource
        name={TASK_GET_ESTIMATED_LAND_DATE_REMINDERS}
        id={TASK_GET_ESTIMATED_LAND_DATE_REMINDERS}
        payload={{ page }}
      >
        {({ results, count }) => (
          <GridRow>
            <GridCol setWidth="one-third">
              <LinkList>
                <LinkListItem>
                  <LinkListLink
                    href="/reminders/estimated-land-dates"
                    $isActive={true}
                  >
                    Reminders for approaching estimated land dates
                  </LinkListLink>
                </LinkListItem>
                <LinkListItem>
                  <LinkListLink href="/reminders/no-recent-interaction">
                    Reminders for projects with no recent interaction
                  </LinkListLink>
                </LinkListItem>
                <LinkListItem>
                  <LinkListLink href="/reminders/outstanding-propositions">
                    Reminders for outstanding propositions
                  </LinkListLink>
                </LinkListItem>
              </LinkList>
            </GridCol>
            <GridCol>
              <RemindersHeaderRow totalItems={count} />
              <RemindersList>
                {results.map(({ id, created_on, event, project }) => (
                  <RemindersListItem key={id}>
                    <ItemHeader>
                      Received {formatMediumDate(created_on)}
                    </ItemHeader>
                    <ItemContent>
                      {event} for{' '}
                      <Link
                        href={`${urls.investments.projects.details(
                          project.id
                        )}`}
                      >
                        {project.name}
                      </Link>
                    </ItemContent>
                    <ItemFooter>Project code {project.project_code}</ItemFooter>
                  </RemindersListItem>
                ))}
              </RemindersList>
              <RoutedPagination initialPage={page} items={count || 0} />
            </GridCol>
          </GridRow>
        )}
      </Resource>
    </DefaultLayout>
  )
}

export default EstimatedLandDateReminders
