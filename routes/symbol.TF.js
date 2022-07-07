// = auth.routes.js
// роут для отправки на сервер данных: инструмент, таймфреймы
const { Router } = require('express')
const { check, validationResult } = require('express-validator')
const UserRequest = require('../models/user.request')
const router = Router()

// /api/userrequest/datarequest
router.post(
  '/datarequest',
  [
    check('symbol', 'Некорректный symbol').isLength({ min: 6 }),
    check('seniorTimeFrame', 'Неверный старший тайм фрейм').isLength({
      min: 2,
    }),
    check('lowerTimeFrame', 'Неверный младший тайм фрейм').isLength({ min: 2 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Вы ввели некорректные данные для запуска теста',
        })
      }

      const { symbol, seniorTimeFrame, lowerTimeFrame } = req.body

      // проверка: правильно ли пользователь ввел symbol
      /*
      const symbolСontainsInBookTicker = await UserRequest.findOne({ symbol })

      if (!symbolСontainsInBookTicker) {
          return res.status(400).json({ message: 'Такой symbol отсутствует на бирже Binance' })
      }
      */

      const dataRequest = new UserRequest({
        symbol,
        seniorTimeFrame,
        lowerTimeFrame,
      })

      await dataRequest.save()

      // res.json({ symbol, seniorTimeFrame, lowerTimeFrame })
      res
        .status(201)
        .json({ message: 'Запрос отправлен на сервер для обработки...' })
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  }
)

module.exports = router
