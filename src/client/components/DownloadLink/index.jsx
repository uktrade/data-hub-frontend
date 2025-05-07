import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { apiProxyAxios } from '../Task/utils'
import AccessibleLink from '../Link'
import {
  VIRUS_SCAN_STATUSES,
  getVirusStatusDisplayFromLabel,
} from '../../modules/Investments/Projects/constants'

/*
 * DownloadLink is a component to handle to two step process of downloading
 * uploadable documents from generic document collection items.
 */
const DownloadLink = ({ statusLabel, fileId }) => {
  const [isLoading, setIsLoading] = useState(false)
  if (statusLabel !== VIRUS_SCAN_STATUSES.virusScanned.label) {
    return <span>{getVirusStatusDisplayFromLabel(statusLabel)}</span>
  }

  const handleDownload = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await apiProxyAxios.get(`v4/document/${fileId}/download`)
      if (response.data && response.data.download_url) {
        window.open(response.data.download_url, '_blank', 'noopener noreferrer')
      } else {
        throw new Error('Download URL not found in response')
      }
    } catch (error) {
      throw new Error(`Error fetching download URL: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AccessibleLink
      href="#"
      onClick={handleDownload}
      disabled={isLoading}
      data-test="file-download-link"
    >
      {isLoading ? 'Preparing download...' : 'Download'}
    </AccessibleLink>
  )
}

DownloadLink.PropTypes = {
  statusLabel: PropTypes.string.isRequired,
  fileId: PropTypes.string.isRequired,
}

export default DownloadLink
