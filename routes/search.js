import Router from 'express'
import { getItemsFromDB } from '../controllers/searchContrller.js'

const router = Router()

router.get('/search/', getItemsFromDB)
