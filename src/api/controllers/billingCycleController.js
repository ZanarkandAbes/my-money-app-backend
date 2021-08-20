// C - CONTROLLER

// as operações de manipulação estão dentro do BillingCycle (pois ele é um modelo do mongoose que está no outro arquivo)

const BillingCycle = require('../models/billingCycle')

const NotFoundError = require('../common/errors/NotFound')

exports.create = function (req, res, next) {

  let billingCycle = new BillingCycle({
    name: req.body.name,
    month: req.body.month,
    year: req.body.year,
    credits: req.body.credits.map(credit => {
      return {
        name: credit.name,
        value: credit.value
      }
    }),
    debts: req.body.debts.map(debt => {
      return {
        name: debt.name,
        value: debt.value,
        status: debt.status
      }
    })
  })

  billingCycle.save(function (err) {
    if (err) res.status(500).json({ errors: [error] })
    res.send('Registro do Ciclo de Pagamento criado com sucesso!')
  })
}

exports.getById = function (req, res, next) {
  BillingCycle.findById(req.params.id, function (err, billingCycle) {
    if (err) res.status(500).json({ errors: [err] })
    if (!billingCycle) {
      const error = new NotFoundError()
      error.httpStatusCode = 404
      res.status(error.httpStatusCode).json(`Ciclo de pagamento não encontrado, erro: ${error.httpStatusCode}`)
      return next(error)
    }

    res.send(billingCycle)
  })
}

exports.getAll = function (req, res, next) {

  console.log(req.query)

  // o 1º parâmetro do find é o filtro que se deseja fazer a partir do req.query.(nome do filtro passado)

  BillingCycle.find({ name: req.query.name }, function (err, billingCycles) {
    if (err) res.status(500).json({ errors: [error] })
    res.send(billingCycles)
  }).limit(req.query.limit).skip(req.query.skip)
}

exports.update = function (req, res, next) {
  BillingCycle.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, billingCycle) {
    if (err) res.status(500).json({ errors: [error] })
    if (!billingCycle) res.send('Clico de pagamento não existe')
    BillingCycle.findById(req.params.id, function (err, billingCycle) {
      res.send(billingCycle)
    })
    // res.send('Ciclo de pagamento atualizado com sucesso!')
  })
}

exports.delete = function (req, res, next) {
  BillingCycle.findByIdAndRemove(req.params.id, function (err, billingCycle) {
    if (err) res.status(500).json({ errors: [error] })
    if (!billingCycle) res.send('Ciclo de pagamento não existe')
    res.send('Ciclo de pagamento apagado com sucesso!')
  })
}

exports.count = function (req, res, next) {
  BillingCycle.count({}, function (err, value) {
    if (err) res.status(500).json({ errors: [error] })
    if (!value) res.send('Não existem ciclos de pagamento para serem contabilizados')
    res.json({ value })
  })
}

exports.summary = function (req, res, next) {
  BillingCycle.aggregate({
    $project: { credit: { $sum: "$credits.value" }, debt: { $sum: "$debts.value" } }
  }, {
    $group: {
      _id: null,
      credit: { $sum: "$credit" }, // $credit referência que saiu do $project | credit novo atributo
      debt: { $sum: "$debt" }
    }
  }, {
    $project: {
      _id: 0,
      credit: 1,
      debt: 1
    }
  }, (err, result) => {
    if (err) {
      res.status(500).json({ errors: [error] })
    }
    res.json(result[0] || { credit: 0, debt: 0 })
  })
}