import Router from 'express'
import { getItemsFromDB } from '../controllers/searchController.js'

const router = Router()

router.get('/search/', getItemsFromDB)

export default router
