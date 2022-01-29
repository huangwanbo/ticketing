import { Publisher, OrderCancelledEvent, Subjects} from '@hwbtickets/common';

export class OrderCannelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled 
};