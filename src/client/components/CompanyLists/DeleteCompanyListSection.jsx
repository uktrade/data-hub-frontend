import React from 'react'
import PropTypes from 'prop-types'
import { RED } from 'govuk-colours'
import Button from '@govuk-react/button'
import ErrorSummary from '@govuk-react/error-summary'
import InsetText from '@govuk-react/inset-text'
import Link from '@govuk-react/link'
import ListItem from '@govuk-react/list-item'
import Paragraph from '@govuk-react/paragraph'
import UnorderedList from '@govuk-react/unordered-list'
import pluralize from 'pluralize'

import { FormActions } from 'data-hub-components'

const DeleteCompanyListSection = ({
  companyList,
  errorMessage,
  onDelete,
  returnUrl,
}) => {
  const companyCountText = pluralize('company', companyList.item_count, true)

  return (
    <div>
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
          <ListItem>
            <strong>{companyList.name}</strong>
          </ListItem>
          <ListItem>{companyCountText}</ListItem>
        </UnorderedList>
      </InsetText>
      <FormActions>
        <Button buttonColour={RED} onClick={onDelete}>
          Delete list
        </Button>
        <Link href={returnUrl}>Return without deleting</Link>
      </FormActions>
    </div>
  )
}

DeleteCompanyListSection.propTypes = {
  companyList: PropTypes.object.isRequired,
  errorMessage: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  returnUrl: PropTypes.string.isRequired,
}

DeleteCompanyListSection.defaultProps = {
  errorMessage: null,
}

export default DeleteCompanyListSection
