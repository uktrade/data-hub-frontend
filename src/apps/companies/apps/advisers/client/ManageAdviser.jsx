import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Details,
  H3,
  InsetText,
  Link,
  ListItem,
  Paragraph,
  UnorderedList
} from 'govuk-react'
import { FormActions } from 'data-hub-components'

const CurrentLeadIta = ({ name, team }) =>
  <InsetText>
    Name: {name}
    <br />
    Team: {team}
  </InsetText>

CurrentLeadIta.propTypes = {
  name: PropTypes.string.isRequired,
  team: PropTypes.string.isRequired,
}

const Add = ({ cancelUrl, csrfToken, currentLeadITA }) =>
  <>
    <H3>Do you want to add yourself as the first point of contact?</H3>
    {currentLeadITA &&
      <>
        <Paragraph>
          You would replace Lead ITA:
        </Paragraph>
        <CurrentLeadIta {...currentLeadITA} />
      </>
    }
    <Details summary="How do I add someone else as the Lead ITA?">
      You can only add yourself as the Lead ITA.
      If you think another International Trade Adviser is the first point of contact
      for this company, they will need to add themselves.
    </Details>

    <H3>What happens next?</H3>

    <UnorderedList listStyleType="bullet">
      <ListItem>
        Your name and team will be displayed on top of the company page,
        as well as in the Lead Adviser tab
      </ListItem>
      <ListItem>
        This will also replace Lead ITAs set on any subsidiaries of this company
      </ListItem>
      <ListItem>
        Other ITAs will be able to replace you as the Lead ITA for the company
      </ListItem>
    </UnorderedList>
    
    <form method="POST">
      <input type="hidden" name="_csrf" value={csrfToken}/>
      <FormActions>
        <Button>Add myself as Lead ITA</Button>
        <Link href={cancelUrl}>Cancel</Link>
      </FormActions>
    </form>
  </>

const Remove = ({ cancelUrl, csrfToken, currentLeadITA }) =>
  <>
    <Paragraph>
      This will remove the current Lead ITA
    </Paragraph>
    <CurrentLeadIta {...currentLeadITA} />
    <H3>What happens next?</H3>
    <UnorderedList listStyleType="bullet">
      <ListItem>
        This company will no longer show a Lead ITA
        as the first point of contact
      </ListItem>
      <ListItem>
        This will also remove the Lead ITAs on any subsidiaries of this company
      </ListItem>
      <ListItem>
        This company and any subsidiaries will no longer be listed
        as account managed companies (Partner led accounts)
      </ListItem>
    </UnorderedList>
    <form method="POST">
      <input type="hidden" name="_csrf" value={csrfToken}/>
      <FormActions>
        <Button>Remove the Lead ITA</Button>
        <Link href={cancelUrl}>Cancel</Link>
      </FormActions>
    </form>
  </>

Add.propTypes = Remove.propTypes = {
  cancelUrl: PropTypes.string.isRequired,
  csrfToken: PropTypes.string.isRequired,
  currentLeadITA: PropTypes.shape({
    name: PropTypes.string.isRequired,
    team: PropTypes.string.isRequired,
  }),
}

const Manage = ({ isRemove, ...props }) =>
  isRemove
    ? <Remove {...props} />
    : <Add {...props} />

Manage.propTypes = { ...Add.propTypes, isRemove: PropTypes.bool }

export default Manage
