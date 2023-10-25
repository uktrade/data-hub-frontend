import unconfirmedWins from './unconfirmed.json'

// Stub the endpoint until we have one
export const getExportWinsUnconfirmed = () => {
  return Promise.resolve({
    results: unconfirmedWins,
  })
}
