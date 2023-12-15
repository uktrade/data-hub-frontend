import React from 'react'
import { Details, ListItem, UnorderedList } from 'govuk-react'
import { H3 } from '@govuk-react/heading'
import styled from 'styled-components'
import Label from '@govuk-react/label'
import pluralize from 'pluralize'

import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'
import { LIGHT_GREY, BLACK, WHITE } from '../../../../client/utils/colours'
import { useFormContext } from '../../../../client/components/Form/hooks'
import CountriesResource from '../../../components/Resource/Countries'
import { SectorResource } from '../../../components/Resource'
import { OPTION_YES } from '../../../../common/constants'
import { StyledHintParagraph } from './styled'
import {
  Step,
  FieldDate,
  FieldInput,
  FieldTextarea,
  FieldCurrency,
  FieldTypeahead,
  FieldCheckboxes,
} from '../../../components'
import {
  steps,
  winTypeOptions,
  goodsServicesOptions,
  winTypes,
} from './constants'
import {
  formatValue,
  getYearFromWinType,
  getTwelveMonthsAgo,
  sumWinTypeYearlyValues,
  sumAllWinTypeYearlyValues,
} from './utils'

const MAX_WORDS = 100

const WinTypeContainer = styled('div')({
  marginLeft: 56,
})

const FieldCurrencyContainer = styled('div')({
  display: 'flex',
  gap: 5,
})

const StyledLabel = styled(Label)({
  fontWeight: 'bold',
})

const StyledParagraph = styled('p')({
  padding: 10,
  fontWeight: 'bold',
  backgroundColor: LIGHT_GREY,
})

const StyledDetails = styled(Details)({
  margin: 0,
})

const StyledExportTotal = styled('p')({
  padding: 10,
  color: WHITE,
  backgroundColor: BLACK,
})

const WinTypeValues = ({ label, name, years = 5, values }) => {
  const year = getYearFromWinType(name, values)
  return (
    <WinTypeContainer>
      <StyledLabel>{label}</StyledLabel>
      <StyledHintParagraph>(round to nearest £)</StyledHintParagraph>
      <FieldCurrencyContainer>
        {[...Array(years).keys()].map((index) => (
          <FieldCurrency
            type="text"
            name={`${name}_${index}`}
            key={`${name}_${index}`}
            label={`Year ${index + 1}`}
            boldLabel={true}
          />
        ))}
      </FieldCurrencyContainer>
      <StyledParagraph>
        Totalling over {year} {pluralize('year', year)}:{' '}
        {formatValue(sumWinTypeYearlyValues(name, values))}
      </StyledParagraph>
    </WinTypeContainer>
  )
}

const WinDetailsStep = () => {
  const { values } = useFormContext()
  const twelveMonthsAgo = getTwelveMonthsAgo()
  const month = twelveMonthsAgo.getMonth() + 1
  const year = twelveMonthsAgo.getFullYear()

  return (
    <Step name={steps.WIN_DETAILS}>
      <H3>Win details</H3>
      <StyledHintParagraph>
        The customer will be asked to confirm this infomation.
      </StyledHintParagraph>
      <ResourceOptionsField
        name="destination_country"
        id="destination-country"
        label="Destination country"
        required="Choose a destination country"
        resource={CountriesResource}
        field={FieldTypeahead}
      />
      <FieldDate
        name="win_date"
        format="short"
        label="Date won"
        hint={`For example ${month} ${year}, date of win must be in the last 12 months.`}
        required="Enter the win date"
        invalid="Enter a valid date"
      />
      <FieldTextarea
        name="summary_of_support"
        label="Summary of the support given"
        hint="Outline what had the most impact or would be memorable to the customer in less than 100 words."
        required="Enter a summary"
        invalid={`Summary must be ${MAX_WORDS} words or less`}
        maxWords={MAX_WORDS}
      />

      <FieldInput
        type="text"
        name="name_of_customer"
        label="Overseas customer"
        required="Enter the name of the overseas customer"
        placeholder="Add name"
      />

      <FieldCheckboxes
        name="name_of_customer_confidential"
        hint="Check this box if your customer has asked for this not to be public (optional)."
        options={[
          {
            value: OPTION_YES,
            label: 'Confidential',
          },
        ]}
      />

      <FieldInput
        type="text"
        name="business_type"
        label="Type of business deal"
        required="Enter the type of business deal"
        hint="For example: export sales, contract, order, distributor, tender / competition win, joint venture, outward investment."
        placeholder="Enter a type of business deal"
      />

      <FieldCheckboxes
        name="win_type"
        legend="Type of win"
        required="Choose at least one type of win"
        options={winTypeOptions.map((option) => ({
          ...option,
          ...(option.value === winTypes.EXPORT && {
            children: (
              <WinTypeValues
                label="Export value over the next 5 years"
                name="export_win_year"
                values={values}
              />
            ),
          }),
          ...(option.value === winTypes.BUSINESS_SUCCESS && {
            link: (
              <StyledDetails
                summary="What is business success?"
                data-test="business-success-details"
              >
                <p>Business success is defined as:</p>
                <UnorderedList listStyleType="bullet">
                  <ListItem>
                    the exchange of ownership of goods/services from a
                    subsidiary of an eligible UK company to a non_UK resident.
                  </ListItem>
                  <ListItem>
                    in financial services, the value of assets under management
                    or the value of a listing.
                  </ListItem>
                  <ListItem>
                    the collection of cash from an overdue invoice.
                  </ListItem>
                  <ListItem>
                    reduced tax burden on a customer achieved by lobbying.
                  </ListItem>
                  <ListItem>repatriation of profits to the UK.</ListItem>
                </UnorderedList>
              </StyledDetails>
            ),
            children: (
              <WinTypeValues
                label="Business success over the next 5 years"
                name="business_success_win_year"
                values={values}
              />
            ),
          }),
          ...(option.value === winTypes.ODI && {
            link: (
              <StyledDetails summary="What is an ODI?" data-test="odi-details">
                <p>
                  An ODI is a cross-border investment from the UK into another
                  country, where the source of the money is the UK.
                </p>
                <p>
                  The aim of the investment is to set up a lasting interest in a
                  company, where the investor has a genuine influence in the
                  management. This may involve providing capital for vehicles,
                  machinery, buildings, and running costs to:
                </p>
                <UnorderedList listStyleType="bullet">
                  <ListItem>set up an overseas subsidiary.</ListItem>
                  <ListItem>enter into a joint venture.</ListItem>
                  <ListItem>expand current overseas operations.</ListItem>
                </UnorderedList>
              </StyledDetails>
            ),
            children: (
              <WinTypeValues
                label="Outward Direct Investment over the next 5 years"
                name="odi_win_year"
                values={values}
              />
            ),
          }),
        }))}
      />

      {values?.win_type?.length > 1 && (
        <StyledExportTotal>
          Total export value:{' '}
          {formatValue(sumAllWinTypeYearlyValues(values?.win_type, values))}
        </StyledExportTotal>
      )}

      <FieldCheckboxes
        name="goods_and_services"
        legend="What does the value relate to?"
        hint="Select goods or services"
        required="Select at least one option"
        options={goodsServicesOptions}
      />

      <FieldInput
        type="text"
        name="goods_and_services_name"
        label="Name of goods or services"
        required="Enter the name of goods or services"
        hint="For instance 'shortbread biscuits'"
        placeholder="Enter a name for goods or services"
      />

      <ResourceOptionsField
        id="sector"
        name="sector"
        label="Sector"
        required="Enter a sector"
        resource={SectorResource}
        field={FieldTypeahead}
      />
    </Step>
  )
}

export default WinDetailsStep
