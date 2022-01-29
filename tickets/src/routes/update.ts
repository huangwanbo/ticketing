import express, { Request, Response } from 'express';
import { body } from 'express-validator'
import { requireAuth, 
         NotFoundError, 
         validateRequest, 
         NotAuthorizedError, 
         BadRequestError } from '@hwbtickets/common';
import { Ticket } from '../models/ticket';
import { TicketUpdatePublisher } from '../events/publishers/ticket-updated-publisher'
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();

router.put('/api/tickets/:id', [
    requireAuth,
    body('title')
        .not()
        .isEmpty()
        .withMessage('title invalid'),
    body('price')
        .isFloat({ gt: 0 })
        .withMessage('price invalid'),
    validateRequest
],
async (req: Request, res: Response) => {
    console.log('req.params.id',req.params.id);
    
    const ticket = await Ticket.findById(req.params.id);

    if(!ticket) {
        throw new NotFoundError();
    }

    if (ticket.orderId) {
        throw new BadRequestError('Cannot edit a reserved ticket');
    }

    if(ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    ticket.set({
        title: req.body.title,
        price: req.body.price
    });

    await ticket.save();
    new TicketUpdatePublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    })
    res.send(ticket);
})

export { router as updateTicketRouter };