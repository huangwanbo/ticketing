import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { currentUser } from '@hwbtickets/common';
import { requireAuth } from '@hwbtickets/common';
const router = express.Router();

router.get(
    "/api/users/currentuser", 
    [
        currentUser,
        requireAuth
    ],
    (req: Request, res: Response) => {
        res.send({ currentUser: req.currentUser || null });
    });

export { router as currentUserRouter };
