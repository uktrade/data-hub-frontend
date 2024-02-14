/* eslint-disable prettier/prettier */
import React from "react"

import { DefaultLayout } from "../../../components"

const RejectedExportWin = () =>
  <DefaultLayout
    heading="Company Name"
    breadcrumbs={[
      {
        text: 'Foo',
        url: 'foo'
      }
    ]}
  >

  </DefaultLayout>

export default RejectedExportWin
