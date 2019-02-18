const express = require('express')
const { curry } = require('ramda')

const constants = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
}

const router = (config) => {
  let { routes } = config
  let routerInstance = express.Router()
  for (const route of routes) {
    if (route.provider)
      route.provider = require(route.provider)
    switch (route.method) {
      case constants.GET:
        routerInstance.route(route.route)
          .get(
            route.provider ? route.provider.validate(route.name) : (f) => (f),
            curry(providerInject)(route, (req) => req.query))
        break
      case constants.POST:
        routerInstance.route(route.route)
          .post(
            route.provider ? route.provider.validate(route.name) : (f) => (f),
            curry(providerInject)(route, (req) => req.body)
          )
        break
      case constants.DELETE:
        routerInstance.route(route.route)
          .delete(
            route.provider ? route.provider.validate(route.name) : (f) => (f),
            curry(providerInject)(route, (req) => req.query))
        break
      case constants.PATCH:
        routerInstance.route(route.route)
          .patch(
            route.provider ? route.provider.validate(route.name) : (f) => (f),
            curry(providerInject)(route, (req) => req.body)
          )
        break
      default:
        throw new Error(`The configured route method is not supported : ${route.method}`)
    }
  }
  return routerInstance
}

const providerInject = (routeDefinition, getParams, req, res) => {
  req.getValidationResult()
    .then(validatorHandler())
    .then(() => {
      const provider = new routeDefinition.provider()
      provider.on(routeDefinition.name + '_DONE', function (err, result) {
        if (err)
          res.json({ status: 500, message: err })
        res.json({ status: 200, ...result })
      })
      provider.emit(routeDefinition.name, getParams(req))
    })
    .catch((err) => {
      console.trace(err)
      res.json({ status: 500, message: 'Unexpected error' })
    })
}

const validatorHandler = next => result => {
  if (result.isEmpty()) return
  if (!next)
    throw new Error(
      result.array().map(i => `${i.msg}`).join(' , ')
    )
  else
    return next(
      new Error(
        result.array().map(i => `${i.msg}`).join(' , ')
      )
    )
}

module.exports = router
