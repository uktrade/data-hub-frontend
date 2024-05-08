import React from 'react'
import PropTypes from 'prop-types'
import { throttle } from 'lodash'

import RoutedTypeahead from '../RoutedTypeahead'
import Task from '../Task'
import urls from '../../../lib/urls'
import { apiProxyAxios } from '../Task/utils'
import { transformIdNameToValueLabel } from '../../transformers'

const parseTeamData = (teams) =>
  teams
    .filter((team) => team.name && team.name.trim().length)
    .map(transformIdNameToValueLabel)

const fetchTeams = () =>
  throttle((searchString) => {
    if (searchString.length) {
      return apiProxyAxios
        .get(urls.metadata.team(), {
          params: {
            autocomplete: searchString,
          },
        })
        .then(({ data }) => parseTeamData(data))
    } else {
      return Promise.resolve([])
    }
  }, 500)

const RoutedTeamsTypeahead = ({
  taskProps,
  closeMenuOnSelect = true,
  loadOptions = fetchTeams(),
  ...props
}) => (
  <Task.Status {...taskProps} progressOverlay={true}>
    {() => (
      <RoutedTypeahead
        loadOptions={loadOptions}
        closeMenuOnSelect={closeMenuOnSelect}
        {...props}
      />
    )}
  </Task.Status>
)

RoutedTeamsTypeahead.propTypes = {
  name: PropTypes.string.isRequired,
  taskProps: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  closeMenuOnSelect: PropTypes.bool,
}

export default RoutedTeamsTypeahead
