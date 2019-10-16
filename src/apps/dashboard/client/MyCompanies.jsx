import React from 'react'
import { useMyCompaniesContext, MyCompaniesTile } from 'data-hub-components'

const MyCompanies = (props) =>
  <useMyCompaniesContext.Provider {...props}
    deleteListPropsAccessor={list => ({ href: '/delete-list/' + list.id })}
  >
    <MyCompaniesTile />
  </useMyCompaniesContext.Provider>

export default MyCompanies
