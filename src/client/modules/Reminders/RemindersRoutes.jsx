import React from 'react'
import { useRouteMatch, Redirect, Switch, Route } from 'react-router-dom'
import { RemindersLists, RemindersSettings, RemindersForms } from '.'

const RemindersRoutes = () => {
  const { path } = useRouteMatch()
  return (
    <Switch>
      <Route exact={true} path={`${path}/settings`}>
        <RemindersSettings />
      </Route>
      <Route path={`${path}/settings/:reminderType`}>
        <RemindersForms />
      </Route>
      <Redirect
        exact={true}
        from={path}
        to={`${path}/investments-estimated-land-dates`}
      />
      <Route path={`${path}/:reminderType`}>
        <RemindersLists />
      </Route>
    </Switch>
  )
}

export default RemindersRoutes
