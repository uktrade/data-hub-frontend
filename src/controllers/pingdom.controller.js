const router = require('express').Router()
const axios = require('axios')
const config = require('../../config')

function returnError (res, error) {
  res.set('Content-Type', 'text/xml')
  res.status(500)
  res.send(error.response.data)
}

function returnOk (res) {
  res.set('Content-Type', 'text/xml')
  res.status(200)
  res.send(```<?xml version="1.0" encoding="UTF-8"?>
    <pingdom_http_custom_check>
      <status>OK</status>
    </pingdom_http_custom_check>')```)
}

function get (req, res) {
  axios.get(`${config.apiRoot}/ping.xml`, { responseType: 'text' })
    .then(() => returnOk(res))
    .catch(error => returnError(res, error))
}

router.get('/ping.xml', get)

module.exports = { router }
