import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import DataHubHeader from '../index'

export default {
  title: 'DataHubHeader',
}

const Dashboard = () => <h5>Dashboard</h5>
const Companies = () => <h5>Companies</h5>
const Contacts = () => <h5>Contacts</h5>
const Events = () => <h5>Events</h5>
const Interactions = () => <h5>Interactions</h5>
const Investments = () => <h5>Investments</h5>
const Orders = () => <h5>Orders(OMIS)</h5>
const Support = () => <h5>Support</h5>

export const DataHubHeaderStory = () => {
  const [showVerticalNav, setShowVerticalNav] = useState(false)
  return (
    <>
      <DataHubHeader
        showVerticalNav={showVerticalNav}
        onShowVerticalNav={setShowVerticalNav}
      />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/events" element={<Events />} />
        <Route path="/interactions" element={<Interactions />} />
        <Route path="/investments" element={<Investments />} />
        <Route path="/omis" element={<Orders />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </>
  )
}

DataHubHeaderStory.storyName = 'DataHubHeader'
