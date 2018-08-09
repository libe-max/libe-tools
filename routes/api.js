const express = require('express')
const moment = require('moment')
const router = express.Router()

/* Send all bundles in database */
router.all('/get-all-bundles', (req, res, next) => {
  const collection = req.db.collection('bundles')
  collection.find({}, (e, docs) => {
    if (!e) res.json({err: null, data: docs})
    else res.json({err: e, data: null})
  })
})

/* Create a new bundle in database */
router.all('/create-bundle/:type', (req, res, next) => {
  const type = req.params.type
  const allowedTypes = ['yellow-word', 'libe-box']
  if (allowedTypes.indexOf(type) + 1) {
    const now = moment().valueOf()
    const newBundle = {
      type,
      name: null,
      settings_history: [],
      created_on: now
    }
    const collection = req.db.collection('bundles')
    collection.insert(newBundle, (e, docs) => {
      if (!e) res.json({err: null, data: docs})
      else res.json({err: e, data: null})
    })
  } else {
    res.json({
      data: null,
      err: `Not allowed to create a bundle of type ${type}`
    })
  }
})

/* All other requests */
router.all('/*', (req, res, next) => {
  res.json({
    data: null,
    err: `There is nothing to ${req.method} on ${req.url}`
  })
})

module.exports = router
