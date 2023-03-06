import React from 'react'
import { useParams } from 'react-router-dom'

const ExportDetailsForm = () => {
  const { exportId } = useParams()
  return <span>Export Details Form</span>
}

export default ExportDetailsForm
