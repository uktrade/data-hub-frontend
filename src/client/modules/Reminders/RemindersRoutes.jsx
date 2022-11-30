import React from 'react'
import { useRouteMatch, Redirect, Switch, Route } from 'react-router-dom'
import { RemindersLists, ReminderSettings, ReminderForms } from '.'

const RemindersRoutes = () => {
  const { path } = useRouteMatch()
  return (
    <Switch>
      <Route exact={true} path={`${path}/settings`}>
        <ReminderSettings />
      </Route>
      <Route path={`${path}/settings/:reminderType`}>
        <ReminderForms />
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
