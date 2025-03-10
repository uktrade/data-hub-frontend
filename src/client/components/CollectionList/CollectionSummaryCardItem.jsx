import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'

const CollectionSummaryCardItem = ({ title, links, rows }) => (
  <div
    key={`collection-summary-card-item-${title}`}
    data-test="collection-item"
    className="govuk-summary-card govuk-!-margin-top-6"
  >
    <div className="govuk-summary-card__title-wrapper">
      <h2 className="govuk-summary-card__title">{title}</h2>
      <div className="govuk-summary-card__title-actions">
        {links &&
          links.length > 0 &&
          links.map((link, index) => (
            <span key={`link-${index}`}>
              <Link href={link.url} {...link.attrs}>
                {link.text}
              </Link>
              {index < links.length - 1 && ' | '}
            </span>
          ))}
      </div>
    </div>

    <div className="govuk-summary-card__content">
      <dl className="govuk-summary-list">
        {rows.map((row, index) => (
          <div
            data-test="metadata"
            className="govuk-summary-list__row"
            key={`meta-data-row-item-${index}`}
          >
            <dt className="govuk-summary-list__key">{row.label}</dt>
            <dd className="govuk-summary-list__value">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  </div>
)

CollectionSummaryCardItem.propTypes = {
  title: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      attrs: PropTypes.object,
    })
  ),
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ).isRequired,
}

export default CollectionSummaryCardItem
