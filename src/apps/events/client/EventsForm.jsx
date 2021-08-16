import React from 'react'

import {
  FieldRadios,
  FieldAddAnother,
  FieldSelect,
  FormStateful,
  Typeahead,
  Step,
} from '../../../client/components'

const EventsForm = () => {
  return (
    <>
      <p>
        If your Event is set up to focus on a Trade Agreement or contributes to
        implementing a Trade Agreement then select that the event relates to a
        Trade Agreement and the relevant Agreement(s)
      </p>
      <a href="https://data-services-help.trade.gov.uk/data-hub/how-articles/trade-agreement-activity/recording-trade-agreement-activity/">
        See more guidance
      </a>

      <FormStateful
        onSubmit={() => {}}
        onExit={() => 'Changes that you made will not be saved.'}
      >
        {({ values }) => (
          <>
            {console.log(values)}
            <FieldRadios
              inline={true}
              name="has_related_trade_agreements"
              legend="Does the Event relate to a Trade Agreement?"
              required="Answer if this Event relates to a Trade Agreement?"
              options={[
                {
                  label: 'Yes',
                  value: 'YES',
                  children: (
                    <FieldAddAnother
                      name="related_trade_agreements"
                      label="Related named trade agreement(s)"
                      data-test-prefix="trade-agreement-field-"
                      required="Select at least one Trade Agreement"
                      item-name="trade agreement"
                    >
                      {({ value, onChange, error }) => (
                        <Typeahead
                          name="related_trade_agreements"
                          inputId="related_trade_agreements"
                          label="Related trade Agreements"
                          options={[]}
                          placeholder="-- Select related trade agreement --"
                          required="Select at least one Trade Agreement"
                          aria-label="Select a trade agreement"
                          value=""
                          onChange={onChange}
                          error={error}
                        />
                      )}
                    </FieldAddAnother>
                  ),
                },
                { label: 'No', value: 'NO' },
              ]}
            />
          </>
        )}
      </FormStateful>
    </>
  )
}

export default EventsForm
