export default class TicketService {
  constructor(repository) {
    this.repository = repository;
  }

  async createTicket(ticket) {
    const createdTicket = this.repository.createTicket(ticket);
    return createdTicket;
  }
}
