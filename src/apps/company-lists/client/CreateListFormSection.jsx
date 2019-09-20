/* eslint-disable */

import React from 'react'
import axios from 'axios'
import { CreateListForm } from 'data-hub-components'

const CreateListFormSection = (
  {
    id,
    token,
    name,
    hint,
    label,
    cancelUrl,
    maxLength
  }) => {

  async function onCreateList (id, name, token, cancelUrl, listName) {
    try {
      await axios({
        method: 'POST',
        url: `/companies/${id}/lists/create?_csrf=${token}`,
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
        },
        data: {
          name: listName,
        },
      })
      window.location.href = cancelUrl
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <CreateListForm
      name={name}
      hint={hint}
      label={label}
      cancelUrl={cancelUrl}
      maxLength={maxLength}
      onSubmitHandler={({ listName }) => onCreateList(id, name, token, cancelUrl, listName)}
    />
  )
}

export default CreateListFormSection
