import React from 'react'
import { put, take } from 'redux-saga/effects'

import { eventChannel } from 'redux-saga'

import { H2 } from 'govuk-react'

import { GREEN } from '../../../../utils/colours'
import { FieldRadios, Form } from '../../../../components'
import RecentTaskResult from '../../../../components/Task/RecentResult'

import Layout from '../Layout'
import { StyledStatusMessage } from '../ThankYou'

const storageChannel = eventChannel((emit) => {
  window.addEventListener('storage', emit)
  return () => window.removeEventListener(emit)
})

export function* cookiePreferenceChangeSaga() {
  while (true) {
    const { key, newValue } = yield take(storageChannel)
    if (key === 'cookie-consent') {
      yield put({
        type: 'FORM__RESOLVED',
        name: 'save cookie preference',
        id: 'cookieConsent',
        result: newValue,
      })
    }
  }
}

const CookiePage = () => (
  <Layout
    title="Export Wins cookie policy"
    headingContent={
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
    }
  >
    <H2>How cookies are used in Export Wins</H2>
    <p>Export wins puts small files (known as 'cookies') onto your computer.</p>
    <p>
      Cookies are used to measure how to use the website so it can be updated
      and improved based on your needs.
    </p>
    <p>
      Export Wins cookies never contain personally identifiable information.
    </p>
    <H2>Analytics cookies</H2>
    <p>
      We use Google Analytics software to collect information about how you use
      Export Wins. We do this to help make sure the site is meeting the needs of
      its users and to help us make improvements. Google Analytics stores
      information about:
    </p>
    <ul>
      <li>the pages you visit</li>
      <li>how long you spend on each page</li>
      <li>how you got to the site</li>
      <li>what you click on while you're visiting the site</li>
    </ul>
    <p>We don't allow Google to use or share our analytics data.</p>
    <Form
      analyticsFormName="cookie-page-form"
      id="cookieConsent"
      submissionTaskName="save cookie preference"
      initialValuesTaskName="load cookie preference"
      submissionTaskResultToValues={(cookieConsent) => ({ cookieConsent })}
      transformInitialValues={(cookieConsent) => ({ cookieConsent })}
      transformPayload={({ cookieConsent }) => cookieConsent}
      submitButtonLabel="Save cookie settings"
    >
      <FieldRadios
        label="Do you want to accept analytics cookies?"
        name="cookieConsent"
        required="Choose one option"
        options={[
          { label: 'Yes', value: 'granted' },
          { label: 'No', value: 'denied' },
        ]}
      />
    </Form>
  </Layout>
)

export default CookiePage
