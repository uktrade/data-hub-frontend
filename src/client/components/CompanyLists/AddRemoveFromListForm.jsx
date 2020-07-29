import React from 'react'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import PropTypes from 'prop-types'
import { GREY_3, TEXT_COLOUR } from 'govuk-colours'

import {
  FormStateful,
  FieldRadios,
  FieldInput,
  FormActions,
} from 'data-hub-components'

const AddRemoveFromListForm = ({
  list,
  onSubmitHandler,
  createNewListUrl,
  cancelLinkUrl,
}) => {
  const { companyId, companyLists } = list
  const initState = companyLists.reduce((obj, { listId, isAdded }) => {
    return { ...obj, [listId]: isAdded }
  }, {})
  return (
    <FormStateful initialValues={initState} onSubmit={onSubmitHandler}>
      <FieldInput name="company" type="hidden" value={companyId} />
      {companyLists.map(({ listId, listName }) => (
        <div key={listId}>
          <FieldRadios
            name={listId}
            legend={`On the "${listName}" list`}
            options={[
              {
                label: 'Yes',
                value: 'yes',
                inline: 'true',
              },
              {
                label: 'No',
                value: 'no',
                inline: 'true',
              },
            ]}
          />
        </div>
      ))}

      <Button
        as={Link}
        href={createNewListUrl}
        buttonColour={GREY_3}
        buttonTextColour={TEXT_COLOUR}
      >
        Create a new list
      </Button>

      <FormActions>
        <Button>Save</Button>
        <Link href={cancelLinkUrl}>Cancel</Link>
      </FormActions>
    </FormStateful>
  )
}

AddRemoveFromListForm.propTypes = {
  onSubmitHandler: PropTypes.func.isRequired,
  list: PropTypes.object.isRequired,
  createNewListUrl: PropTypes.string.isRequired,
  cancelLinkUrl: PropTypes.string.isRequired,
}

export default AddRemoveFromListForm
