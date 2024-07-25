import React from 'react'
import styled from 'styled-components'
import { Button, H1, H2, Link } from 'govuk-react'
import { FONT_SIZE, FONT_WEIGHTS, SPACING } from '@govuk-react/constants'

import RecentTaskResult from '../../../components/Task/RecentResult'
import { StyledStatusMessage } from './ThankYou'
import { FormActions } from '../../../components'
import Footer from '../../../components/Footer'
import Task from '../../../components/Task'
import Resource from '../../../components/Resource/Resource'
import { BLACK, WHITE, LIGHT_GREY, GREEN } from '../../../utils/colours'

const Grid = styled.div({
  minHeight: '100vh',
  display: 'grid',
  gridTemplateRows: 'auto auto auto 1fr minmax(min-content, 30px)',
  gridTemplateColumns: `1fr min(100vw, calc(960px + ${SPACING.SCALE_3} * 2)) 1fr`,
  gridTemplateAreas: `
    ". cookie-banner ." 
    ". main-bar ."
    ". header ."
    ". main ."
    "footer footer footer"
  `,
})

const MainBarBackground = styled.div({
  gridRow: 'main-bar',
  gridColumn: '1 / -1',
  background: BLACK,
})

const MainBar = styled.div({
  gridArea: 'main-bar',
  alignSelf: 'center',
  fontWeight: FONT_WEIGHTS.bold,
  fontSize: FONT_SIZE.SIZE_27,
  color: WHITE,
  padding: SPACING.SCALE_3,
})

const HeaderBackground = styled.div({
  gridRow: 'header',
  gridColumn: '1 / -1',
  background: LIGHT_GREY,
})

const Header = styled.header({
  gridArea: 'header',
  alignSelf: 'center',
  padding: SPACING.SCALE_3,
  paddingBottom: SPACING.SCALE_5,
})

const Main = styled.main({
  gridArea: 'main',
  padding: SPACING.SCALE_3,
  paddingBottom: SPACING.SCALE_6,
})

const GridCellFooter = styled(Footer)({
  gridArea: 'footer',
})

const Title = styled(H1)({
  margin: 0,
  marginBottom: SPACING.SCALE_5,
})

const CookieBannerBackground = styled.div({
  gridRow: 'cookie-banner',
  gridColumn: '1 / -1',
  background: '#f3f2f1',
})

const CookieBanner = styled.div({
  gridArea: 'cookie-banner',
  paddingTop: SPACING.SCALE_3,
})

const CookieConsentConfirmation = () => (
  <RecentTaskResult name="save cookie preference" id="cookieConsent">
    {(consent) =>
      consent && (
        <StyledStatusMessage colour={GREEN}>
          Yo've {consent === 'granted' ? 'accepted' : 'rejected'} additional
          cookies. You can change your cookie settings at any time.
        </StyledStatusMessage>
      )
    }
  </RecentTaskResult>
)

const Layout = ({ children, title, supertitle, headingContent }) => (
  <Grid>
    <CookieBannerBackground />
    <Resource name="load cookie preference" id="cookieConsent">
      {(persistedConsent) => (
        <RecentTaskResult name="save cookie preference" id="cookieConsent">
          {(updatedConsent) =>
            !persistedConsent &&
            !updatedConsent && (
              <CookieBanner>
                <H2>Cookies</H2>
                <p>
                  We’d like to use analytics cookies so we can understand how
                  you use the Design System and make improvements.
                </p>
                <p>
                  We also use essential cookies to remember if you’ve accepted
                  analytics cookies.
                </p>
                <FormActions>
                  <Task>
                    {(getTask) => {
                      const setPreference = (value) =>
                        getTask(
                          'save cookie preference',
                          'cookieConsent'
                        ).start({
                          payload: value,
                          onSuccessDispatch: 'FORM__RESOLVED',
                        })
                      return (
                        <>
                          <Button onClick={() => setPreference('granted')}>
                            Accept analytics cookies
                          </Button>
                          <Button onClick={() => setPreference('denied')}>
                            Reject analytics cookies
                          </Button>
                        </>
                      )
                    }}
                  </Task>
                  <Link href="/exportwins/review/cookies">View cookies</Link>
                </FormActions>
              </CookieBanner>
            )
          }
        </RecentTaskResult>
      )}
    </Resource>
    <MainBarBackground />
    <MainBar>Department for Business & Trade</MainBar>
    <HeaderBackground />
    <Header>
      <p>{supertitle}</p>
      <Title>{title}</Title>
      <CookieConsentConfirmation />
      {headingContent}
    </Header>
    <Main>{children}</Main>
    <GridCellFooter
      links={{
        'Privacy Policy':
          'https://www.great.gov.uk/privacy-and-cookies/full-privacy-notice/',
        'Accessibility Statement': '/exportwins/review/accesibility-statement',
        Cookies: '/exportwins/review/cookies',
      }}
    />
  </Grid>
)

export default Layout
