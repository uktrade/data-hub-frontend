import React, { useState } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { storiesOf } from '@storybook/react'

import DataHubHeader from '../index'

const Dashboard = () => <h5>Dashboard</h5>
const Companies = () => <h5>Companies</h5>
const Contacts = () => <h5>Contacts</h5>
const Events = () => <h5>Events</h5>
const Interactions = () => <h5>Interactions</h5>
const Investments = () => <h5>Investments</h5>
const Orders = () => <h5>Orders(OMIS)</h5>
const Support = () => <h5>Support</h5>

const App = () => {
  const [showVerticalNav, setShowVerticalNav] = useState(false)
  return (
    <Router>
      <DataHubHeader
        showVerticalNav={showVerticalNav}
        onShowVerticalNav={setShowVerticalNav}
      />
      <Switch>
        <Route exact={true} path="/" component={Dashboard} />
        <Route path="/companies" component={Companies} />
        <Route path="/contacts" component={Contacts} />
        <Route path="/events" component={Events} />
        <Route path="/interactions" component={Interactions} />
        <Route path="/investments" component={Investments} />
        <Route path="/omis" component={Orders} />
        <Route path="/support" component={Support} />
      </Switch>
    </Router>
  )
}

storiesOf('DataHubHeader', module).add('Data Hub Header', () => <App />)
