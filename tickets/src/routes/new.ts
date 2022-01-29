import express, { Request, Response } from 'express';
import { body } from 'express-validator'
import { requireAuth, currentUser, validateRequest } from '@hwbtickets/common';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publish';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();

router.post('/api/tickets', [
    requireAuth,
    body('title')
        .not()
        .isEmpty()
        .withMessage('title invalid'),
    body('price')
        .isFloat({ gt: 0 })
        .withMessage('price invalid')
    ,validateRequest
],
async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({
            title,
            price,
            userId: req.currentUser!.id,
    });
    await ticket.save();
    await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: title,
        price: price,
        userId: ticket.userId,
        version: ticket.version
    });
    res.status(201).send(ticket);

})

export { router as createTicketRouter };