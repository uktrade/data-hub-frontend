import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios'
import { throttle } from 'lodash'
import styled from 'styled-components'
import { LoadingBox } from 'govuk-react'

import {
  Button,
  H3,
  InsetText,
  Link,
  ListItem,
  Paragraph,
  UnorderedList,
} from 'govuk-react'

import { FormActions, FieldInput, FieldTypeahead } from 'data-hub-components'

import { ID as STATE_ID, TASK_UPDATE_ADVISER, state2props } from './state'
import { MANAGE_ADVISER__UPDATE } from '../../../../../client/actions'
import urls from '../../../../../lib/urls'
import Form from '../../../../../client/components/Form'
import Task from '../../../../../client/components/Task'
import LocalHeader from '../../../../../client/components/LocalHeader/LocalHeader.jsx'
import { Main } from '../../../../../client/components/'
import { addMessageWithBody } from '../../../../../client/utils/flash-messages'
import { StatusMessage } from '../../../../../client/components/'

const StyledStatusMessage = styled(StatusMessage)`
  p {
    margin: 0;
  }
`

const CurrentLeadIta = ({ name, team }) => (
  <InsetText>
    Name: {name}
    <br />
    Team: {team}
  </InsetText>
)

CurrentLeadIta.propTypes = {
  name: PropTypes.string.isRequired,
  team: PropTypes.string.isRequired,
}

const Add = ({
  cancelUrl,
  currentLeadITA,
  companyName,
  companyId,
  isLeadITAUpdated,
  updatedLeadITA,
}) => {
  useEffect(() => {
    if (isLeadITAUpdated) {
      addMessageWithBody(
        'success',
        'Lead adviser information updated.',
        `Send ${
          updatedLeadITA.name
        } an email to let them know they've been made Lead ITA${
          updatedLeadITA.email
            ? `: <a href="mailto:${updatedLeadITA.email}">${updatedLeadITA.email}</a>`
            : '.'
        }`
      )
      window.location.href = urls.companies.advisers.index(companyId)
    }
  }, [isLeadITAUpdated])
  return (
    <>
      <LocalHeader
        heading={`${
          currentLeadITA
            ? 'Replace the Lead ITA'
            : 'Add someone as the Lead ITA'
        }`}
        breadcrumbs={[
          { link: urls.dashboard(), text: 'Home' },
          { link: urls.companies.index(), text: 'Companies' },
          { link: urls.companies.detail(companyId), text: companyName },
          {
            text: `${currentLeadITA ? 'Replace the Lead ITA' : 'Add Lead ITA'}`,
          },
        ]}
      />
      <Main>
        <Task>
          {(getTask) => {
            const updateStageTask = getTask(TASK_UPDATE_ADVISER, STATE_ID)
            return (
              <>
                {currentLeadITA && (
                  <>
                    <Paragraph>You would replace Lead ITA:</Paragraph>
                    <CurrentLeadIta {...currentLeadITA} />
                  </>
                )}
                <LoadingBox loading={isLeadITAUpdated}>
                  <Form
                    id={STATE_ID}
                    onSubmit={(values) => {
                      updateStageTask.start({
                        payload: { values },
                        onSuccessDispatch: MANAGE_ADVISER__UPDATE,
                      })
                    }}
                    submissionError={updateStageTask.errorMessage}
                  >
                    <FieldTypeahead
                      name="dit_participants"
                      label="Select an ITA"
                      hint="Who should be the primary point of contact?"
                      placeholder="-- Select ITA --"
                      noOptionsMessage={() => 'Type to search for advisers'}
                      required="Select an ITA"
                      loadOptions={throttle(
                        (searchString) =>
                          axios
                            .get('/api-proxy/adviser/', {
                              params: {
                                autocomplete: searchString,
                                dit_team__role:
                                  '5e329c18-6095-e211-a939-e4115bead28a',
                              },
                            })
                            .then(({ data: { results } }) =>
                              results
                                .filter(
                                  (adviser) => adviser?.name.trim().length
                                )
                                .map(({ id, name, dit_team }) => ({
                                  label: `${name}${
                                    dit_team ? ', ' + dit_team.name : ''
                                  }`,
                                  value: id,
                                }))
                            ),
                        500
                      )}
                    />
                    <H3 as="h2">What happens next</H3>
                    <UnorderedList listStyleType="bullet">
                      <ListItem>
                        The Lead ITA’s name and team will be shown on the
                        company record page and on the Lead ITA tab.
                      </ListItem>
                      <ListItem>
                        This will replace all Lead ITAs added on any
                        subsidiaries of this company.
                      </ListItem>
                      <ListItem>
                        Other ITAs can replace or remove this Lead ITA at any
                        time.
                      </ListItem>
                    </UnorderedList>
                    <StyledStatusMessage>
                      <p>
                        <strong>
                          When adding someone else as the Lead ITA, send the
                          person an email to notify them. Data Hub does not send
                          notications.
                        </strong>
                      </p>
                    </StyledStatusMessage>
                    <FieldInput
                      type="hidden"
                      name="companyId"
                      initialValue={companyId}
                    />

                    <FormActions>
                      <Button>Add Lead ITA</Button>
                      <Link href={cancelUrl}>Cancel</Link>
                    </FormActions>
                  </Form>
                </LoadingBox>
              </>
            )
          }}
        </Task>
      </Main>
    </>
  )
}

const Remove = ({
  cancelUrl,
  csrfToken,
  currentLeadITA,
  companyName,
  companyId,
}) => (
  <>
    <LocalHeader
      heading="Remove the Lead ITA"
      breadcrumbs={[
        { link: urls.dashboard(), text: 'Home' },
        { link: urls.companies.index(), text: 'Companies' },
        { link: urls.companies.detail(companyId), text: companyName },
        {
          text: 'Remove the Lead ITA',
        },
      ]}
    />
    <Main>
      <Paragraph>This will remove the current Lead ITA</Paragraph>
      <CurrentLeadIta {...currentLeadITA} />
      <H3 as="h2">What happens next?</H3>
      <UnorderedList listStyleType="bullet">
        <ListItem>
          This company will no longer show a Lead ITA as the first point of
          contact
        </ListItem>
        <ListItem>
          This will also remove the Lead ITAs on any subsidiaries of this
          company
        </ListItem>
        <ListItem>
          This company and any subsidiaries will no longer be listed as account
          managed companies (Partner led accounts)
        </ListItem>
      </UnorderedList>
      <form method="POST">
        <input type="hidden" name="_csrf" value={csrfToken} />
        <FormActions>
          <Button>Remove the Lead ITA</Button>
          <Link href={cancelUrl}>Cancel</Link>
        </FormActions>
      </form>
    </Main>
  </>
)

Add.propTypes = Remove.propTypes = {
  cancelUrl: PropTypes.string.isRequired,
  csrfToken: PropTypes.string.isRequired,
  currentLeadITA: PropTypes.shape({
    name: PropTypes.string.isRequired,
    team: PropTypes.string.isRequired,
  }),
}

const Manage = ({ isRemove, ...props }) =>
  isRemove ? <Remove {...props} /> : <Add {...props} />

Manage.propTypes = { ...Add.propTypes, isRemove: PropTypes.bool }

export default connect(state2props)(Manage)
