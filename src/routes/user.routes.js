import { Router } from 'express'
const router = Router()

import { getUsers, profile, updateUser, updatePassword, generatePassword, updateUserState, searchUser } from '../controllers/user.controller'

import { verifyToken } from '../lib/jwt'
import { verifyData } from '../lib/helpers'


router.get('/', verifyToken, getUsers)
router.get('/:id', verifyToken, profile)
    //put -> get
router.get('/update/:id', verifyData, verifyToken, updateUser)
    //put -> get
router.get('/updatePass/:id', verifyData, verifyToken, updatePassword)
router.get('/generate/:id', verifyToken, generatePassword)
router.get('/updateState/:id', verifyToken, updateUserState)

router.get('/search/:valor', verifyToken, searchUser)


export default router