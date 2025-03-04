import React from 'react'

import Link from '@govuk-react/link'

const CollectionSummaryCardItem = ({ title, links, rows }) => {
  return (
    <div className="govuk-summary-card govuk-!-margin-top-6">
      <div class="govuk-summary-card__title-wrapper">
        <h2 class="govuk-summary-card__title">{title}</h2>
        <div className="govuk-summary-card__title-actions">
          {links &&
            links.length > 0 &&
            links.map((link, index) => (
              <>
                <Link href={link.url} onClick={link.onClick} {...link.attrs}>
                  {link.text}
                </Link>
                {index < links.length - 1 && ' | '}
              </>
            ))}
        </div>
      </div>

      <div class="govuk-summary-card__content">
        <dl class="govuk-summary-list">
          {rows.map((row, index) => (
            <div className="govuk-summary-list__row" key={index}>
              <dt className="govuk-summary-list__key">{row.label}</dt>
              <dd className="govuk-summary-list__value">{row.value}</dd>
              <dd className="govuk-summary-list__actions"></dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

export default CollectionSummaryCardItem
