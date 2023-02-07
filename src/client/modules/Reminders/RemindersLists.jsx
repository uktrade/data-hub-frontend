import React from 'react'
import { SPACING, MEDIA_QUERIES } from '@govuk-react/constants'
import styled from 'styled-components'
import { Link, H6 } from 'govuk-react'
import FooterLink from './FooterLink'

import { DefaultLayout } from '../../components'
import RemindersMenu from './RemindersMenu'

import InvestmentsEstimatedLandDatesList from './InvestmentsEstimatedLandDatesList'
import InvestmentsNoRecentInteractionsList from './InvestmentsNoRecentInteractionsList'
import InvestmentsOutstandingPropositionsList from './InvestmentsOutstandingPropositionsList'
import ExportsNoRecentInteractionsList from './ExportsNoRecentInteractionsList'
import ExportsNewInteractionsList from './ExportsNewInteractionsList'

import urls from '../../../lib/urls'
import {
  reminderTypeToLabel,
  INVESTMENTS_ESTIMATED_LAND_DATES,
  INVESTMENTS_NO_RECENT_INTERACTIONS,
  INVESTMENTS_OUTSTANDING_PROPOSITIONS,
  COMPANIES_NO_RECENT_INTERACTIONS,
  COMPANIES_NEW_INTERACTIONS,
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

// const StyledFooterLink = styled('div')({
//   display: 'block',
//   marginTop: SPACING.SCALE_4,
//   marginBottom: SPACING.SCALE_4,
//   [MEDIA_QUERIES.DESKTOP]: {
//     marginLeft: 1,
//     marginBottom: 25,
//   },
// })

// const FooterLink = ({urls, title}) => {
//   return (
//     <div data-test="help-text-link">
//       <hr />
//       <h6 as="h2">{title}</h6>
//       <p>
//         See the{' '}
//         <a href={urls}>
//           guidance on reminders and email notifications
//         </a>
//       </p>
//     </div>
//   );
// };

const RemindersLists = ({ reminderType }) => {
  const subject = reminderTypeToLabel[reminderType]
  return (
    <DefaultLayout
      pageTitle={`Reminders - ${subject}`}
      heading="Reminders"
      subheading={subject}
      breadcrumbs={[
        { link: urls.dashboard(), text: 'Home' },
        { link: urls.reminders.index(), text: 'Reminders' },
        { text: subject },
      ]}
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
            {reminderType === INVESTMENTS_ESTIMATED_LAND_DATES && (
              <InvestmentsEstimatedLandDatesList />
            )}
            {reminderType === INVESTMENTS_NO_RECENT_INTERACTIONS && (
              <InvestmentsNoRecentInteractionsList />
            )}
            {reminderType === INVESTMENTS_OUTSTANDING_PROPOSITIONS && (
              <InvestmentsOutstandingPropositionsList />
            )}
            {reminderType === COMPANIES_NO_RECENT_INTERACTIONS && (
              <ExportsNoRecentInteractionsList />
            )}
            {reminderType === COMPANIES_NEW_INTERACTIONS && (
              <ExportsNewInteractionsList />
            )}
          </ListContainer>
        </Container>
        {/* <FooterLink data-test="help-text-link">
          <hr />
          <H6 as="h2">Need Help?</H6>
          <p>
            See the{' '}
            <a href={urls.external.reminderAndSettings}>
              guidance on reminders and email notifications
            </a>
          </p>
        </FooterLink> */}
        {/* <FooterLink data-test="help-text-link">
          headingText="Need Help?", linkUrl={urls.external.reminderAndSettings},
          linkText="guidance on reminders and email notifications"
        </FooterLink> */}
        <FooterLink
          headingText="Need Help?"
          linkUrl={urls.external.reminderAndSettings}
          linkText="guidance on reminders and email notifications"
        />
      </>
    </DefaultLayout>
  )
}

export default RemindersLists
