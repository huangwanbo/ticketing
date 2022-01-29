import { Subjects, Publisher, PaymentCreatedEvent } from '@hwbtickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}