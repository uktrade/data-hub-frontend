/* eslint-disable */

import React from 'react'
import axios from 'axios'
import { CreateListForm } from '../../../client/components/'

const CreateListFormSection = (
  {
    id,
    csrfToken,
    name,
    hint,
    label,
    cancelUrl,
    maxLength,
  }) => {

  async function onCreateList ({listName}) {
    await axios({
      method: 'POST',
      url: `/companies/${id}/lists/create?_csrf=${csrfToken}`,
      data: { name: listName },
    })
    return cancelUrl
  }

  return (
    <CreateListForm
      name={name}
      hint={hint}
      label={label}
      cancelUrl={cancelUrl}
      maxLength={maxLength}
      onSubmitHandler={onCreateList}
    />
  )
}

export default CreateListFormSection
