import React from 'react'
import {Route} from 'react-router-dom'

export const ResetQueryStringButton = () =>
  <Route>
    {({history, location: {search, ...location}}) =>
      <button onClick={() => history.replace(location)}>
        Reset querystring
      </button>
    }
  </Route>
