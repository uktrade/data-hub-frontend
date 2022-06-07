import React from 'react'
import { useLocation } from 'react-router-dom'
import qs from 'qs'
import styled from 'styled-components'
import { FONT_WEIGHTS, SPACING } from '@govuk-react/constants'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { Link } from 'govuk-react'
import { BLUE } from 'govuk-colours'

import urls from '../../../lib/urls'
import {
  DefaultLayout,
  CollectionHeader,
  RoutedPagination,
} from '../../components'
import Resource from '../../components/Resource'
import { formatMediumDate } from '../../utils/date'

import { TASK_GET_ESTIMATED_LAND_DATE_REMINDERS } from './state'

const LinkList = styled('ul')({
  listStyleType: 'none',
  padding: 0,
  margin: 0,
})

const LinkListItem = styled('li')({
  marginBottom: SPACING.SCALE_2,
})

const LinkListLink = styled(Link)(({ isActive }) => ({
  textDecoration: 'none',
  position: 'relative',
  paddingLeft: 10,
  display: 'block',
  borderLeft: `solid 5px transparent`,
  ...(isActive
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

const EstimatedLandDateReminders = () => {
  const location = useLocation()
  const qsParams = qs.parse(location.search.slice(1))
  const page = parseInt(qsParams.page, 10)

  return (
    <DefaultLayout
      heading="Reminders for approaching estimated land dates"
      pageTitle="Reminders for approaching estimated land dates"
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
                    isActive={true}
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
              <CollectionHeader
                totalItems={count}
                collectionName="reminders"
                data-test="collection-header"
              />
              <RemindersList>
                {results.map(({ id, created_on, event, project }) => (
                  <li key={id}>
                    <h3>{formatMediumDate(created_on)}</h3>
                    {event} for{' '}
                    <Link
                      href={`${urls.investments.projects.details(project.id)}`}
                    >
                      {project.name}
                    </Link>
                    <p>Project code {project.project_code}</p>
                  </li>
                ))}
              </RemindersList>
              <RoutedPagination items={results.count} />
            </GridCol>
          </GridRow>
        )}
      </Resource>
    </DefaultLayout>
  )
}

export default EstimatedLandDateReminders
