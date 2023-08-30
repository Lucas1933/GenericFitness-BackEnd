import ticketModel from "../../dao/mongo/models/ticket_model.js";
export default class TicketRepository {
  async createTicket(ticket) {
    const createdTicket = await ticketModel.create(ticket);
    return createdTicket;
  }
}
