import express, { Request, Response } from 'express';
import { NotFoundError } from '@hwbtickets/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
    const tickets = await Ticket.find().limit(10);

    if(!tickets) {
        throw new NotFoundError();
    }

    res.send(tickets);
});

export { router as getTicketRouter };

