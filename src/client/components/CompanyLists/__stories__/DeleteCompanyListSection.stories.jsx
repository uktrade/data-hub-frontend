import React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'

import DeleteCompanyListSection from '../DeleteCompanyListSection'
import listWithMultipleItems from '../__fixtures__/list-with-multiple-items.json'
import listWithSingleItem from '../__fixtures__/list-with-single-item.json'
import listWithoutItems from '../__fixtures__/list-without-items.json'

const onDelete = action('DeleteCompanyListSection.onDelete')

storiesOf('Company lists / DeleteCompanyListSection', module)
  .add('with multiple items', () => (
    <DeleteCompanyListSection
      companyList={listWithMultipleItems}
      onDelete={onDelete}
      returnUrl="#"
    />
  ))
  .add('with one item', () => (
    <DeleteCompanyListSection
      companyList={listWithSingleItem}
      onDelete={onDelete}
      returnUrl="#"
    />
  ))
  .add('without items', () => (
    <DeleteCompanyListSection
      companyList={listWithoutItems}
      onDelete={onDelete}
      returnUrl="#"
    />
  ))
  .add('with error', () => (
    <DeleteCompanyListSection
      companyList={listWithMultipleItems}
      errorMessage="Request failed with status code 404"
      onDelete={onDelete}
      returnUrl="#"
    />
  ))
