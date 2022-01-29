import { Publisher, OrderCreatedEvent, Subjects} from '@hwbtickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated 
};