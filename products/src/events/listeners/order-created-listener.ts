import { Listener, Subjects, OrderCreatedEvent } from '@devdezyn/common';
import { Message } from 'node-nats-streaming';
import Ticket from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  // readonly prevents a property of a class from being changed.
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id, ticket } = data;

    // Find the ticket that the order is reserving
    const existingTicket = await Ticket.findById(ticket.id);

    // If the Ticket is not found, throw an error
    if (!existingTicket) {
      throw new Error('Ticket not found');
    }
    // Update the Ticket's orderId to indicate that it is reserved
    existingTicket.set({ orderId: id });
    await existingTicket.save();

    // Publish Ticket update
    await new TicketUpdatedPublisher(this.client).publish({
      id: existingTicket.id,
      orderId: existingTicket.orderId,
      title: existingTicket.title,
      price: existingTicket.price,
      userId: existingTicket.userId,
      version: existingTicket.version,
    });

    // Acknowledge the message
    msg.ack();
  }
}
