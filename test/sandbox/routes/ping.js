import { healthcarePing } from '../fixtures/ping.js'

export function ping(req, res) {
  res.send(healthcarePing)
}
