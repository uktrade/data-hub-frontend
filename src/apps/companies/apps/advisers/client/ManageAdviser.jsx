import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import {
  Button,
  H3,
  InsetText,
  Link,
  ListItem,
  Paragraph,
  UnorderedList,
} from 'govuk-react'

import urls from '../../../../../lib/urls'
import LocalHeader from '../../../../../client/components/LocalHeader/LocalHeader'
import {
  FormActions,
  FieldInput,
  StatusMessage,
  Main,
} from '../../../../../client/components'

import TaskForm from '../../../../../client/components/Task/Form'

import FieldActiveITA from '../../../../../client/components/Form/elements/FieldActiveITA'

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

const Add = ({ cancelUrl, currentLeadITA, companyName, companyId }) => (
  <>
    <LocalHeader
      heading={`${
        currentLeadITA ? 'Replace the Lead ITA' : 'Add someone as the Lead ITA'
      }`}
      breadcrumbs={[
        { link: urls.dashboard(), text: 'Home' },
        {
          link: urls.companies.index(),
          text: 'Companies',
        },
        { link: urls.companies.detail(companyId), text: companyName },
        {
          text: `${currentLeadITA ? 'Replace the Lead ITA' : 'Add Lead ITA'}`,
        },
      ]}
    />
    <Main>
      {currentLeadITA && (
        <>
          <Paragraph>You would replace Lead ITA:</Paragraph>
          <CurrentLeadIta {...currentLeadITA} />
        </>
      )}
      <TaskForm
        id="manage-adviser"
        submissionTaskName="Update Lead ITA"
        analyticsFormName="updateLeadITA"
        transformPayload={(values) => ({ ...values, companyId })}
        redirectTo={() => urls.companies.advisers.index(companyId)}
        flashMessage={({ name, email }) => [
          'Lead adviser information updated.',
          `Send ${name} an email to let them know they've been ` +
            `made Lead ITA${
              email ? `: <a href="mailto:${email}">${email}</a>` : '.'
            }`,
        ]}
        actionLinks={[{ children: 'Cancel', href: cancelUrl }]}
        submitButtonLabel="Add Lead ITA"
      >
        <FieldActiveITA
          name="dit_participants"
          hint="Who should be the primary point of contact?"
          required="Select an ITA"
        />
        <H3 as="h2">What happens next</H3>
        <UnorderedList listStyleType="bullet">
          <ListItem>
            The Lead ITA’s name and team will be shown on the company record
            page and on the Lead ITA tab.
          </ListItem>
          <ListItem>
            This will replace all Lead ITAs added on any subsidiaries of this
            company.
          </ListItem>
          <ListItem>
            Other ITAs can replace or remove this Lead ITA at any time.
          </ListItem>
        </UnorderedList>
        <StyledStatusMessage>
          <p>
            <strong>
              When adding someone else as the Lead ITA, send the person an email
              to notify them. Data Hub does not send notications.
            </strong>
          </p>
        </StyledStatusMessage>
        <FieldInput type="hidden" name="companyId" initialValue={companyId} />
      </TaskForm>
    </Main>
  </>
)

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
        {
          link: urls.companies.index(),
          text: 'Companies',
        },
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

export default Manage
