import React from 'react'
import PropTypes from 'prop-types'
import Button from '@govuk-react/button'
import ErrorSummary from '@govuk-react/error-summary'
import InsetText from '@govuk-react/inset-text'
import ListItem from '@govuk-react/list-item'
import Paragraph from '@govuk-react/paragraph'
import UnorderedList from '@govuk-react/unordered-list'
import pluralize from 'pluralize'

import { FormActions, LocalHeader, Main } from '../../../client/components'
import urls from '../../../lib/urls'
import { RED } from '../../../client/utils/colours'
import AccessibleLink from '../Link'

const DeleteCompanyListSection = ({
  companyList,
  errorMessage,
  onDelete,
  returnUrl,
}) => {
  const companyCountText = pluralize('company', companyList.item_count, true)
  return (
    <>
      <LocalHeader
        heading="Delete list"
        breadcrumbs={[
          { link: urls.dashboard.index(), text: 'Home' },
          {
            text: 'Delete list',
          },
        ]}
      />
      <Main>
        {errorMessage && (
          <ErrorSummary
            heading="There was an error deleting this list"
            description={errorMessage}
            errors={[]}
          />
        )}
        <Paragraph>
          Deleting this list will remove all companies from this list. These
          companies will remain on any other lists.
        </Paragraph>
        <InsetText>
          <UnorderedList listStyleType="none" mb={0}>
            <ListItem data-test="list-name">
              <strong>{companyList.name}</strong>
            </ListItem>
            <ListItem data-test="company-count">{companyCountText}</ListItem>
          </UnorderedList>
        </InsetText>
        <FormActions>
          <Button buttonColour={RED} onClick={onDelete}>
            Delete list
          </Button>
          <AccessibleLink href={returnUrl} data-test="return-link">
            Return without deleting
          </AccessibleLink>
        </FormActions>
      </Main>
    </>
  )
}

DeleteCompanyListSection.propTypes = {
  companyList: PropTypes.object.isRequired,
  errorMessage: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  returnUrl: PropTypes.string.isRequired,
}

export default DeleteCompanyListSection
