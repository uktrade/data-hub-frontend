import { healthcarePing } from '../fixtures/ping.js'

export const ping = function (req, res) {
  res.send(healthcarePing)
}
