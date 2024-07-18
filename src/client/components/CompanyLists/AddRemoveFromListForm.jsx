import React from 'react'
import Button from '@govuk-react/button'
import PropTypes from 'prop-types'

import { GREY_3, TEXT_COLOUR } from '../../../client/utils/colours'
import { FieldCheckboxes } from '../../../client/components'

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
  const isSelected = []
  for (const key in initState) {
    if (initState[key] === 'yes') {
      isSelected.push(key)
    }
  }
  const checkboxDataTransform = (list) => {
    const cleanedList = {}
    for (let listItem in initState) {
      cleanedList[`${listItem}`] = 'no'
    }
    if (list.userCompanyLists) {
      for (let selectedItem in list.userCompanyLists) {
        cleanedList[`${list.userCompanyLists[selectedItem]}`] = 'yes'
      }
    }
    list = cleanedList
    return { list, token, companyId }
  }

  return (
    <Form
      id="add-remove-from-list"
      analyticsFormName="addRemoveFromList"
      submissionTaskName="Add or remove from list"
      initialValues={{ userCompanyLists: isSelected }}
      transformPayload={checkboxDataTransform}
      flashMessage={() => 'Lists changes for this company have been saved.'}
      redirectTo={() => cancelLinkUrl}
      cancelRedirectTo={() => cancelLinkUrl}
    >
      {() => (
        <>
          <div data-test={`group-of-lists`}>
            <FieldCheckboxes
              name="userCompanyLists"
              label={`What list do you want to save ${companyName} to?`}
              options={companyLists.map(({ listName, listId }) => ({
                label: `${listName}`,
                value: listId,
                key: listId,
              }))}
            />
          </div>

          <Button
            as={'a'}
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
