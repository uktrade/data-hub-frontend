import React from 'react'
import PropTypes from 'prop-types'

import { CollectionItem } from '../../components'
import Resource from '../Resource/Resource'
import {
  transformFieldName,
  transformAuditResponseToCollection,
} from './transformers'

/**
 * A component that makes a call to a audit log endpoint and displays the results in the familiar CollectionList style.
 */
const AuditHistory = ({
  resource: Rsrc = Resource,
  id,
  valueTransformer,
  fieldMapper = transformFieldName,
  excludedFields = [],
  auditType,
  showSort = true,
}) => (
  <Rsrc.Paginated showSort={showSort} id={id}>
    {(items) => (
      <ul>
        {transformAuditResponseToCollection(
          items,
          valueTransformer,
          fieldMapper,
          excludedFields,
          auditType
        ).map((item) => (
          <CollectionItem
            key={item.id}
            headingText={item.headingText}
            metadata={item.metadata}
            badges={item.badges}
          />
        ))}
      </ul>
    )}
  </Rsrc.Paginated>
)

AuditHistory.propTypes = {
  /**
   * The resource to use for the audit log call.
   * This **must** be a collection resource as these are the only ones that support pagination.
   */
  resource: PropTypes.func.isRequired,
  /**
   * The endpoint containing a dynamic ID for the resource to use.
   */
  id: PropTypes.string.isRequired,
  /**
   * The transformer for the values. These will be different for each type of record.
   */
  valueTransformer: PropTypes.func.isRequired,
  /**
   * A function that makes field names render correctly. If no function is passed the field names will
   * render as they are named in the API, which isn't ideal for any field names with acronyms.
   */
  fieldMapper: PropTypes.func,
  /**
   * An array of fields that can be ignored or shouldn't be displayed in the audit log.
   */
  excludedFields: PropTypes.arrayOf(PropTypes.string),
  /**
   * The type of record. This is displayed as part of the 'no changes saved' text.
   */
  auditType: PropTypes.string.isRequired,
  /**
   * An option to show / hide the sort options. This is true by default.
   */
  showSort: PropTypes.bool,
}

export default AuditHistory
