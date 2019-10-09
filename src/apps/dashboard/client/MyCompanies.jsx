import React from 'react'
import { useMyCompaniesContext, MyCompaniesTile } from 'data-hub-components'

const MyCompanies = (props) =>
  <useMyCompaniesContext.Provider {...props}>
    <MyCompaniesTile />
  </useMyCompaniesContext.Provider>

export default MyCompanies
