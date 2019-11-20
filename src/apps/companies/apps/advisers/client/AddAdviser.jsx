import React from 'react'
import PropTypes from 'prop-types'
import { Button, H3, Details, UnorderedList, Link, ListItem } from 'govuk-react'
import { FormActions } from 'data-hub-components'

const AddAdviser = ({ csrfToken }) =>
  <div>
    <H3>Do you want to add yourself as the first point of contact?</H3>
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
        <Link href="../advisers">Cancel</Link>
      </FormActions>
    </form>
  </div>

AddAdviser.propTypes = {
  csrfToken: PropTypes.string.isRequired,
}

export default AddAdviser
