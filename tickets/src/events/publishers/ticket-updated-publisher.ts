import { Publisher, Subjects, TicketUpdatedEvent } from '@hwbtickets/common';

export class TicketUpdatePublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdate = Subjects.TicketUpdate;
}
