import ticketModel from "../../dao/mongo/models/ticketModel.js";
export default class TicketRepository {
  async createTicket(ticket) {
    const createdTicket = await ticketModel.create(ticket);
    return createdTicket;
  }
}
