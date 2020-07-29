import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import CreateListForm from '../CreateListForm.jsx'
import AddRemoveFromListForm from '../AddRemoveFromListForm.jsx'
import listsWithCompany from '../__fixtures__/lists-with-company.json'

storiesOf('Company lists', module)
  .add('Create a new list', () => {
    return (
      <CreateListForm
        onSubmitHandler={action('I have been clicked!')}
        name="listName"
        hint="This is a name only you see, and can be up to 30 characters"
        label="List name"
        cancelUrl="/companies/"
        maxLength={30}
      />
    )
  })
  .add('Add or remove from list', () =>
    React.createElement(() => {
      const mockRequest = async () => {
        await new Promise((resolve) => setTimeout(() => resolve(), 2000))
      }
      return (
        <>
          <h1>Add or remove Lambda plc from your lists</h1>
          <AddRemoveFromListForm
            list={listsWithCompany}
            onSubmitHandler={() => mockRequest()}
            createNewListUrl="#"
            cancelLinkUrl="#"
          />
        </>
      )
    })
  )
