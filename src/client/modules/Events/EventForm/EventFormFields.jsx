import React from 'react'
import PropTypes from 'prop-types'

import Link from '@govuk-react/link'

import {
  AdviserTypeAhead,
  FieldRadios,
  FieldInput,
  FieldDate,
  FieldTextarea,
  FieldTypeahead,
} from '../../../../client/components'
import {
  OPTIONS_YES_NO,
  OPTION_YES,
  UNITED_KINGDOM_ID,
} from '../../../../common/constants'
import { validateStartDateBeforeOrEqualToEndDate } from './validators'
import urls from '../../../../lib/urls'

export const EventFormFields = ({ values }) => {
  return values && values.metadata ? (
    <>
      <article>
        <p>Select a trade agreement and then a related event.</p>
        <p>
          Find{' '}
          <Link
            href={urls.external.helpCentre.tradeagreementGuidance()}
            target="_blank"
            aria-label="This will open in a new window"
          >
            more information
          </Link>{' '}
          about selecting trade agreements. This will open in a new window.
        </p>
      </article>
      <FieldRadios
        legend="Does the event relate to a trade agreement?"
        name="has_related_trade_agreements"
        required="Answer if the event is related to a trade agreement"
        options={OPTIONS_YES_NO.map((option) => ({
          label: option.label,
          value: option.value,
          ...(option.value === OPTION_YES && {
            children: (
              <FieldTypeahead
                label="Related Trade Agreements"
                isMulti={true}
                closeMenuOnSelect={true}
                name="related_trade_agreements"
                options={values.metadata.relatedTradeAgreements}
                placeholder="Search trade agreements"
                required="Select at least one trade agreement"
                aria-label="Select a trade agreement"
                noOptionsMessage={() => <span>No trade agreement found</span>}
              />
            ),
          }),
        }))}
        inline={true}
      />
      <FieldInput
        label="Event name"
        name="name"
        type="text"
        required="Enter an event name"
      />
      <FieldTypeahead
        name="event_type"
        label="Type of event"
        options={values.metadata.eventTypeOptions}
        placeholder="Select event type"
        required="Select at least one event type"
        aria-label="Select an event type"
        noOptionsMessage={() => <span>No event type found</span>}
      />
      <FieldDate
        name="start_date"
        label="Event start date"
        required="Enter a valid start date"
      />
      <FieldDate
        name="end_date"
        label="Event end date"
        required="Enter a valid end date"
        validate={validateStartDateBeforeOrEqualToEndDate}
      />
      <FieldTypeahead
        name="location_type"
        label="Event location type (optional)"
        options={values.metadata.eventLocationTypes}
        placeholder="Select event"
        aria-label="Select an event"
        noOptionsMessage={() => <span>No event location found</span>}
      />
      <FieldInput
        label="Address line 1"
        name="address_1"
        type="text"
        required="Enter an Address line 1"
      />
      <FieldInput
        name="address_2"
        type="text"
        label="Address line 2 (optional)"
      />
      <FieldInput
        label="Town or city"
        name="address_town"
        type="text"
        required="Enter a town or city"
      />
      <FieldInput label="County (optional)" name="address_county" type="text" />
      <FieldInput
        label="Postcode"
        name="address_postcode"
        type="text"
        required="Enter a postcode"
      />
      <FieldTypeahead
        name="address_country"
        label="Country"
        options={values.metadata.countries}
        required="Enter a country"
        placeholder="Select country"
        aria-label="Select a country"
        noOptionsMessage={() => <span>No country found</span>}
      />
      {values.address_country?.value === UNITED_KINGDOM_ID && (
        <FieldTypeahead
          name="uk_region"
          label="UK Region"
          options={values.metadata.ukRegions}
          required="Select a UK region"
          placeholder="Select region"
          aria-label="Select a region"
          noOptionsMessage={() => <span>No region found</span>}
        />
      )}
      <FieldTextarea type="text" name="notes" label="Event Notes (optional)" />
      <FieldTypeahead
        name="lead_team"
        label="Team hosting the event"
        options={values.metadata.teams}
        required="Select at least one team hosting the event"
        placeholder="Select team"
        aria-label="Select an team"
        noOptionsMessage={() => <span>No hosting team found</span>}
      />
      <FieldTypeahead
        name="service"
        label="Service"
        required="Select at least one service"
        options={values.metadata.services}
        placeholder="Select service"
        aria-label="Select a service"
        noOptionsMessage={() => <span>No service found</span>}
      />
      <AdviserTypeAhead
        name="organiser"
        label="Organiser"
        required="Enter at least one organiser"
        placeholder="Type to search for organiser"
      />
      <FieldRadios
        legend="Is this a shared event? (optional)"
        name="event_shared"
        options={OPTIONS_YES_NO.map((option) => ({
          label: option.label,
          value: option.value,
          ...(option.value === OPTION_YES && {
            children: (
              <FieldTypeahead
                label="Teams"
                isMulti={true}
                closeMenuOnSelect={true}
                name="teams"
                options={values.metadata.teams}
                placeholder="Select team"
                required="Select at least one team"
                aria-label="Select at least one team"
                noOptionsMessage={() => <span>No shared team found</span>}
              />
            ),
          }),
        }))}
        inline={true}
      />
      <FieldTypeahead
        label="Related programmes"
        isMulti={true}
        closeMenuOnSelect={true}
        name="related_programmes"
        options={values.metadata.programmes}
        placeholder="Select programme"
        required="Select at least one related programme"
        aria-label="Select at least one related programme"
        noOptionsMessage={() => <span>No programmes found</span>}
      />
    </>
  ) : null
}

const valueLabelShape = PropTypes.shape({
  value: PropTypes.string,
  label: PropTypes.string,
})

const arrayOfValueLabel = PropTypes.arrayOf(valueLabelShape)

EventFormFields.propTypes = {
  values: PropTypes.shape({
    metadata: PropTypes.shape({
      eventTypeOptions: arrayOfValueLabel,
      relatedTradeAgreements: arrayOfValueLabel,
      eventLocationTypes: arrayOfValueLabel,
      countries: arrayOfValueLabel,
      teams: arrayOfValueLabel,
      services: arrayOfValueLabel,
      programmes: arrayOfValueLabel,
      ukRegions: arrayOfValueLabel,
    }),
    id: PropTypes.string,
    address_postcode: PropTypes.string,
    address_1: PropTypes.string,
    address_2: PropTypes.string,
    address_county: PropTypes.string,
    address_postcode: PropTypes.string,
    address_town: PropTypes.string,
    address_country: valueLabelShape,
    end_date: PropTypes.shape({
      year: PropTypes.string,
      month: PropTypes.string,
      day: PropTypes.string,
    }),
    start_date: PropTypes.shape({
      year: PropTypes.string,
      month: PropTypes.string,
      day: PropTypes.string,
    }),
    event_type: valueLabelShape,
    lead_team: valueLabelShape,
    location_type: valueLabelShape,
    name: PropTypes.string,
    notes: PropTypes.string,
    organiser: valueLabelShape,
    has_related_trade_agreements: PropTypes.oneOf(['yes', 'no', '']),
    related_trade_agreements: arrayOfValueLabel,
    related_programmes: arrayOfValueLabel,
    event_shared: PropTypes.oneOf(['yes', 'no', '']),
    teams: arrayOfValueLabel,
    service: valueLabelShape,
    uk_region: valueLabelShape,
  }),
}
