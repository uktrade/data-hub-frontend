import React from 'react'
import { useParams } from 'react-router-dom'
import { SPACING, MEDIA_QUERIES } from '@govuk-react/constants'
import styled from 'styled-components'
import { Link } from 'govuk-react'

import { DefaultLayout } from '../../components'
import RemindersMenu from './RemindersMenu'
import Heading from './Heading'

import InvestmentEstimatedLandDateList from './InvestmentEstimatedLandDateList'
import InvestmentNoRecentInteractionList from './InvestmentNoRecentInteractionList'
import InvestmentOutstandingPropositionsList from './InvestmentOutstandingPropositionsList'
import ExportsNoRecentInteractionList from './ExportsNoRecentInteractionList'

import urls from '../../../lib/urls'
import {
  reminderTypeToLabel,
  INVESTMENTS_ESTIMATED_LAND_DATE,
  INVESTMENTS_NO_RECENT_INTERACTION,
  INVESTMENTS_OUTSTANDING_PROPOSITIONS,
  EXPORTS_NO_RECENT_INTERACTION,
} from './constants'

const Container = styled('div')({
  [MEDIA_QUERIES.DESKTOP]: {
    display: 'flex',
  },
})

const MenuContainer = styled('div')({
  width: '100%',
  [MEDIA_QUERIES.DESKTOP]: {
    width: 'calc(33% - 20px)',
    padding: SPACING.SCALE_2,
  },
})

const SettingsLink = styled(Link)({
  display: 'block',
  marginTop: SPACING.SCALE_5,
  marginBottom: SPACING.SCALE_3,
  [MEDIA_QUERIES.TABLET]: {
    display: 'none',
  },
  [MEDIA_QUERIES.DESKTOP]: {
    display: 'none',
  },
})

const ListContainer = styled('div')({
  width: '100%',
  [MEDIA_QUERIES.DESKTOP]: {
    width: '67%',
  },
})

const HomeLink = styled(Link)({
  display: 'block',
  marginTop: SPACING.SCALE_4,
  marginBottom: SPACING.SCALE_4,
  [MEDIA_QUERIES.DESKTOP]: {
    marginLeft: 25,
    marginBottom: 25,
  },
})

const RemindersLists = () => {
  const { reminderType } = useParams()
  const subject = reminderTypeToLabel[reminderType]
  const title = `Reminders for ${subject}`
  return (
    <DefaultLayout
      pageTitle={title}
      heading={<Heading preHeading="Reminders for">{subject}</Heading>}
      breadcrumbs={[{ link: urls.dashboard(), text: 'Home' }, { text: title }]}
    >
      <>
        <Container>
          <MenuContainer>
            <RemindersMenu />
            {reminderType !== INVESTMENTS_OUTSTANDING_PROPOSITIONS && (
              <SettingsLink
                data-test="reminders-settings-link"
                href="/reminders/settings"
              >
                Reminders settings
              </SettingsLink>
            )}
          </MenuContainer>
          <ListContainer>
            {reminderType === INVESTMENTS_ESTIMATED_LAND_DATE && (
              <InvestmentEstimatedLandDateList />
            )}
            {reminderType === INVESTMENTS_NO_RECENT_INTERACTION && (
              <InvestmentNoRecentInteractionList />
            )}
            {reminderType === INVESTMENTS_OUTSTANDING_PROPOSITIONS && (
              <InvestmentOutstandingPropositionsList />
            )}
            {reminderType === EXPORTS_NO_RECENT_INTERACTION && (
              <ExportsNoRecentInteractionList />
            )}
          </ListContainer>
        </Container>
        <HomeLink data-test="home-link" href={urls.dashboard()}>
          Home
        </HomeLink>
      </>
    </DefaultLayout>
  )
}

export default RemindersLists
