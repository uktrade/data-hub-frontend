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

  async function onCreateList (id, name, csrfToken, cancelUrl, listName) {
    try {
      await axios({
        method: 'POST',
        url: `/companies/${id}/lists/create`,
        params: { _csrf: csrfToken },
        data: { name: listName },
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
