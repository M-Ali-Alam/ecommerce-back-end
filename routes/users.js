import express, { Router } from 'express';
import { deleteUser, getUser, getUsers, updateUser } from '../controller/user.js';
import { verifyAdmin, verifyToken, verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

// router.get('/checkauthentication', verifyToken, (req, res, next) => {
//     res.send("You are logged in")
// })

// router.get('/checkuser/:id', verifyUser, (req, res, next) => {
//     res.send("Hello user, you are logged in and can delete your account")
// })

// router.get('/checkadmin/:id', verifyAdmin, (req, res, next) => {
//     res.send("Hello Admin ,you are logged in and can delete all accounts")
// })

router.put('/:id',verifyUser, updateUser)

router.delete('/:id',verifyUser, deleteUser)

router.get('/:id',verifyUser, getUser)

router.get('/',verifyUser,verifyAdmin, getUsers)

export default router;