import confirmedWins from './confirmed.json'

// Stub the endpoint until we have one
export const getExportWinsConfirmed = () => {
  return Promise.resolve({
    results: confirmedWins,
  })
}
