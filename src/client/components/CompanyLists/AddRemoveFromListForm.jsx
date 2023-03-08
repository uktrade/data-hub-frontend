import React from 'react'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import PropTypes from 'prop-types'

import { GREY_3, TEXT_COLOUR } from '../../../client/utils/colours'
import { FieldRadios } from '../../../client/components'

import Form from '../../../client/components/Form'

const AddRemoveFromListForm = ({
  list,
  createNewListUrl,
  cancelLinkUrl,
  companyName,
  token,
  companyId,
}) => {
  const { companyLists } = list
  const initState = companyLists.reduce((obj, { listId, isAdded }) => {
    return { ...obj, [listId]: isAdded }
  }, {})

  return (
    <Form
      id="add-remove-from-list"
      analyticsFormName="addRemoveFromList"
      submissionTaskName="Add or remove from list"
      initialValues={initState}
      transformPayload={(list) => ({ list, token, companyId })}
      flashMessage={() => 'Lists changes for this company have been saved.'}
      redirectTo={() => cancelLinkUrl}
      cancelRedirectTo={() => cancelLinkUrl}
    >
      {() => (
        <>
          {companyLists.map(({ listId, listName }, index) => (
            <div key={listId} data-test={`company-${index}`}>
              <FieldRadios
                name={listId}
                legend={`Do you want to add ${companyName} to the ${listName} list?`}
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
            data-test="create-list-button"
          >
            Create a new list
          </Button>
        </>
      )}
    </Form>
  )
}

AddRemoveFromListForm.propTypes = {
  list: PropTypes.object.isRequired,
  createNewListUrl: PropTypes.string.isRequired,
  cancelLinkUrl: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  companyId: PropTypes.string.isRequired,
}

export default AddRemoveFromListForm
