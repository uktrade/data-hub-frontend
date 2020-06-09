import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { LoadingBox } from 'govuk-react'

import { SEND_REFERRAL_FORM__SUBMIT } from '../../../../../../client/actions'
import StepReferralDetails from './StepReferralDetails'
import StepReferralConfirmation from './StepReferralConfirmation'
import LocalHeader from '../../../../../../client/components/LocalHeader/LocalHeader'
import { Main } from '../../../../../../client/components/'
import { companies, dashboard } from '../../../../../../lib/urls'
import Form from '../../../../../../client/components/Form'
import Task from '../../../../../../client/components/Task'
import Analytics from '../../../../../../client/components/Analytics/index.jsx'
import { addMessageWithBody } from '../../../../../../client/utils/flash-messages'

import {
  ID as STATE_ID,
  TASK_OPEN_REFERRALS_CONTACT_FORM,
  TASK_SAVE_REFERRAL,
} from './state'

const SendReferralForm = ({
  cancelUrl,
  companyContacts,
  companyName,
  companyId,
  subject,
  notes,
  contact,
  adviser,
  sendingAdviserTeamName,
  flashMessages,
  progress = false,
  formSubmitted = false,
}) => {
  useEffect(() => {
    if (formSubmitted) {
      addMessageWithBody(
        'success',
        'Referral sent.',
        `You can <a href=${companies.referrals.list()}>see all of your referrals on your Homepage</a>.`
      )
      window.location.href = companies.detail(companyId)
    }
  }, [formSubmitted])
  return (
    <>
      <LocalHeader
        heading={'Send a referral'}
        breadcrumbs={[
          { link: dashboard(), text: 'Home' },
          { link: companies.index(), text: 'Companies' },
          { link: companies.detail(companyId), text: companyName },
          { text: 'Send a referral' },
        ]}
        flashMessages={flashMessages}
      />

      <Main>
        <Task>
          {(getTask) => {
            const saveTask = getTask(TASK_SAVE_REFERRAL, STATE_ID)
            const openContactFormTask = getTask(
              TASK_OPEN_REFERRALS_CONTACT_FORM,
              STATE_ID
            )

            return (
              <Analytics>
                {(pushData) => (
                  <Form
                    id={STATE_ID}
                    onSubmit={(values) => {
                      const receivingAdviserTeamName = values.adviser.label?.split(
                        ', '
                      )[1]
                      pushData({
                        event: 'send_referral',
                        sendingAdviserTeam: sendingAdviserTeamName,
                        receivingAdviserTeam: receivingAdviserTeamName,
                        referralSubject: values.subject,
                      })
                      saveTask.start({
                        payload: {
                          values,
                          companyId,
                        },
                        onSuccessDispatch: SEND_REFERRAL_FORM__SUBMIT,
                      })
                    }}
                    initialValues={{ adviser, subject, notes, contact }}
                    submissionError={saveTask.errorMessage}
                  >
                    {() => (
                      <LoadingBox loading={progress}>
                        <Form.Step name="referral_details" forwardButton={null}>
                          {() => (
                            <StepReferralDetails
                              cancelUrl={cancelUrl}
                              companyContacts={companyContacts}
                              companyId={companyId}
                              openContactFormTask={openContactFormTask}
                            />
                          )}
                        </Form.Step>
                        <Form.Step
                          name="referral_confirmation"
                          forwardButton={null}
                          backButton={null}
                        >
                          {() => (
                            <StepReferralConfirmation cancelUrl={cancelUrl} />
                          )}
                        </Form.Step>
                      </LoadingBox>
                    )}
                  </Form>
                )}
              </Analytics>
            )
          }}
        </Task>
      </Main>
    </>
  )
}

SendReferralForm.propTypes = {
  companyContacts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string,
    })
  ),
  cancelUrl: PropTypes.string.isRequired,
  sendingAdviserTeamName: PropTypes.string,
}

export default connect(({ values, ...state }) => ({
  ...state[STATE_ID],
  values,
}))(({ ...props }) => <SendReferralForm {...props} />)
