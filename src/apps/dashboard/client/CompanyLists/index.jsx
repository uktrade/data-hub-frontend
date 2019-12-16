import { GREY_2, GREY_3 } from 'govuk-colours'
import {
  SPACING, BORDER_WIDTH_MOBILE, LEVEL_SIZE, MEDIA_QUERIES
} from '@govuk-react/constants'
import { H2, H3 } from '@govuk-react/heading'
import HintText from '@govuk-react/hint-text'
import Input from '@govuk-react/input'
import Link from '@govuk-react/link'
import SectionBreak from '@govuk-react/section-break'
import Select, { SelectInput } from '@govuk-react/select'
import Table from '@govuk-react/table'
import { orderBy } from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useReducer } from 'react'
import LinesEllipsis from 'react-lines-ellipsis'
import { stylesheet } from 'typestyle'

import { FormActions } from 'data-hub-components'

import urls from '../../../../lib/urls'
import * as actions from './actions'
import reducer, { initialState } from './reducer'
import InlineLabel from './InlineLabel'
import SecondaryButton from './SecondaryButton'

const css = stylesheet({
  root: {
    borderTop: `${BORDER_WIDTH_MOBILE} solid ${GREY_2}`,
    paddingTop: SPACING.SCALE_3,
  },
  listSelector: {
    display: 'flex',
    alignItems: 'baseline',
  },
  headline: {
    flexGrow: 1,
  },
  select: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    marginRight: SPACING.SCALE_2,
    span: {
      marginRight: SPACING.SCALE_2,
    },
    // We need to override the select style because it has a hardcoded 50% width.
    select: {
      width: 'initial',
      minWidth: 200,
    },
  },
  sectionBreak: {
    marginBottom: SPACING.SCALE_3,
  },
  listHeading: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  listTitle: {
    flexGrow: 1,
    marginBottom: 0,
  },
  filters: {
    display: 'flex',
    justifyContent: 'space-between',
    background: GREY_3,
    padding: SPACING.SCALE_2,
  },
  search: {
    width: 200,
    marginRight: SPACING.SCALE_6,
  },
  sortBy: {
    [MEDIA_QUERIES.LARGESCREEN]: { width: 'auto' },
  },
  cellButton: {
    whiteSpace: 'nowrap',
    marginBottom: 0,
  },
})

const EmptyListMsg = () => (
  <HintText>
    You have not added any companies to your list.
    <br />
    You can add companies to this list from a company page, and only you can see
    this list.
  </HintText>
)

const NoListsMsg = () => (
  <HintText>
    You have not yet created any lists with companies.
    <br />
    You can add companies to lists from a company page, and only you can see
    these lists.
  </HintText>
)

function CompanyLists (props) {
  const [
    { lists, selectedIdx, sortBy, filter },
    dispatch,
  ] = useReducer(reducer, {
    ...initialState,
    // Reducer assumes the list of company lists is sorted.
    lists: orderBy(props.lists, 'name'),
  })

  const list = lists[selectedIdx]
  const hasCompanies = list && list.companies && list.companies.length
  const orderByParams = {
    recent: [c => c.latestInteraction.date || '', 'desc'],
    'least-recent': [c => c.latestInteraction.date || '', 'asc'],
    alphabetical: [c => c.company.name, 'asc'],
  }[sortBy]
  const filtered = list.companies
    .filter(c => c.company.name.match(new RegExp(filter, 'i')))
  const ordered = orderBy(filtered, ...orderByParams)

  return (
    <div className={css.root}>

      <div className={css.listSelector}>
        <H2 size={LEVEL_SIZE[3]} className={css.headline}>
          My Companies Lists
        </H2>
        {lists.length > 1 &&
          <Select
            className={css.select}
            label="View list"
            input={{
              onChange: (e) =>
                dispatch({
                  type: actions.LIST_CHANGE,
                  idx: e.target.value,
                }),
            }}
          >
            {lists.map(({ name }, idx) => (
              <option key={idx} value={idx}>
                {name}
              </option>
            ))}
          </Select>
        }
      </div>

      <SectionBreak visible={true} className={css.sectionBreak} />

      {list && (
        <div className={css.listHeading}>
          {list && <H3 className={css.listTitle}>{list.name}</H3>}
          <FormActions>
            <SecondaryButton
              as={Link}
              href={urls.companyLists.rename(list.id)}
            >
              Edit list name
            </SecondaryButton>
            <SecondaryButton
              as={Link}
              href={urls.companyLists.delete(list.id)}
            >
              Delete list
            </SecondaryButton>
          </FormActions>
        </div>
      )}

      {lists.length ? (
        hasCompanies ? (
          <>
            {list.companies.length > 1 &&
              <div className={css.filters}>
                <InlineLabel text="Search this list">
                  <Input
                    className={css.search}
                    placeholder="Company name"
                    onChange={e => dispatch({
                      type: actions.FILTER_CHANGE,
                      filter: e.target.value,
                    })}
                  />
                </InlineLabel>
                <InlineLabel text="Sort by">
                  <SelectInput
                    className={css.sortBy}
                    onChange={e => dispatch({
                      type: actions.ORDER_CHANGE,
                      sortBy: e.target.value,
                    })}
                  >
                    <option value="recent">Recent interaction</option>
                    <option value="least-recent">Least recent interaction</option>
                    <option value="alphabetical">Company name A-Z</option>
                  </SelectInput>
                </InlineLabel>
              </div>
            }
            <Table
              head={
                <Table.Row>
                  <Table.CellHeader>Company name</Table.CellHeader>
                  <Table.CellHeader>Last interaction</Table.CellHeader>
                  {/* CellHeader complains if it has no children */}
                  <Table.CellHeader colSpan="2">{''}</Table.CellHeader>
                </Table.Row>
              }
            >
              {ordered.map(({ company, latestInteraction }) =>
                <Table.Row key={company.id}>
                  <Table.Cell setWidth="25%">
                    <Link href={`companies/${company.id}`}>
                      <LinesEllipsis
                        text={company.name}
                        maxLine="2"
                        ellipsis="..."
                        trimRight={true}
                        basedOn="words"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell setWidth="15%">
                    {latestInteraction.date
                      ? moment(latestInteraction.date).format('D MMM YYYY')
                      : '-'
                    }
                  </Table.Cell>
                  <Table.Cell setWidth="50%">
                    {latestInteraction.id ? (
                      <Link href={`interactions/${latestInteraction.id}`}>
                        <LinesEllipsis
                          text={latestInteraction.subject}
                          maxLine="2"
                          ellipsis="..."
                          trimRight={true}
                          basedOn="words"
                        />
                      </Link>
                    ) : (
                      latestInteraction.subject
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <SecondaryButton
                      className={css.cellButton}
                      as={Link}
                      href={urls.companies.interactions.create(company.id)}
                    >
                      Add interaction
                    </SecondaryButton>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table>
          </>
        ) : <EmptyListMsg />
      ) : <NoListsMsg />
      }

    </div>
  )
}

const idNamePropType = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

CompanyLists.propTypes = {
  lists: PropTypes.arrayOf(PropTypes.shape({
    ...idNamePropType,
    companies: PropTypes.arrayOf(PropTypes.shape({
      company: idNamePropType,
      latestInteraction: PropTypes.shape({
        date: PropTypes.instanceOf(Date),
        id: PropTypes.string.isRequired,
        subject: PropTypes.string.isRequired,
      }),
    })),
  })),
}

export default CompanyLists
