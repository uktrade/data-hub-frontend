import React from 'react'
import { SPACING, MEDIA_QUERIES } from '@govuk-react/constants'
import styled from 'styled-components'
import { Link } from 'govuk-react'

import { DefaultLayout } from '../../components'
import RemindersMenu from './RemindersMenu'
import Heading from './Heading'

import urls from '../../../lib/urls'

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

const RemindersLayout = ({
  pageTitle,
  subject,
  children,
  hasSettingsLink = true,
}) => (
  <DefaultLayout
    pageTitle={pageTitle}
    heading={<Heading preHeading="Reminders for">{subject}</Heading>}
    breadcrumbs={[
      { link: urls.dashboard(), text: 'Home' },
      { text: pageTitle },
    ]}
  >
    <>
      <Container>
        <MenuContainer>
          <RemindersMenu />
          {hasSettingsLink && (
            <SettingsLink
              data-test="reminders-settings-link"
              href="/reminders/settings"
            >
              Reminders settings
            </SettingsLink>
          )}
        </MenuContainer>
        <ListContainer>{children}</ListContainer>
      </Container>
      <HomeLink data-test="home-link" href={urls.dashboard()}>
        Home
      </HomeLink>
    </>
  </DefaultLayout>
)

export default RemindersLayout
