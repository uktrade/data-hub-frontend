import React from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
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
      <Route path={`${path}/:reminderType`}>
        <RemindersLists />
      </Route>
      <Route path={path}>
        <RemindersLists />
      </Route>
    </Switch>
  )
}

export default RemindersRoutes
