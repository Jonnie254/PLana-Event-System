import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Booking, Event } from '../../interfaces/events';
import { FooterComponent } from '../../all-users/footer/footer.component';
import { BookingsService } from '../../services/bookings.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FooterComponent],
  templateUrl: './my-tickets.component.html',
  styleUrls: ['./my-tickets.component.css'],
})
export class MyTicketsComponent {
  selectedSection: string = 'confirmed';
  bookings: Booking[] = [];

  constructor(private bookingService: BookingsService) {
    this.getUserTickets();
  }

  getUserTickets() {
    this.bookingService.getBookingByUser().subscribe((res) => {
      this.bookings = res.data;
      console.log('User tickets:', this.bookings);
    });
  }

  selectSection(section: string) {
    this.selectedSection = section;
  }

  getFilteredTickets(): Booking[] {
    return this.bookings.filter(
      (booking) => booking.status === this.selectedSection
    );
  }

  editTicket(ticket: Booking) {
    console.log('Edit ticket:', ticket);
  }

  cancelTicket(ticket: Booking) {
    console.log('Cancel ticket:', ticket);
  }

  deleteTicket(ticket: Booking) {
    console.log('Delete ticket:', ticket);
  }

  downloadTicket(ticket: Booking) {
    const doc = new jsPDF();

    // Set PDF metadata
    doc.setProperties({
      title: `Ticket_${ticket.ticketNumber}`,
      subject: 'Ticket Details',
      author: 'Plana Events',
      keywords: 'ticket, event',
      creator: 'Plana Events',
    });

    // Add a header
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Event Ticket', 105, 25, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    const startY = 50;
    const lineHeight = 10;

    doc.setFont('helvetica', 'bold');
    doc.text('Ticket Details:', 10, startY);
    doc.setFont('helvetica', 'normal');

    doc.text(`Ticket Number: ${ticket.ticketNumber}`, 20, startY + lineHeight);
    doc.text(`Event Name: ${ticket.event.name}`, 20, startY + 2 * lineHeight);
    doc.text(
      `Event Location: ${ticket.eventLocation}`,
      20,
      startY + 3 * lineHeight
    );
    doc.text(
      `Event Date: ${new Date(ticket.eventDate).toLocaleDateString()}`,
      20,
      startY + 4 * lineHeight
    );
    doc.text(`Event Time: ${ticket.eventTime}`, 20, startY + 5 * lineHeight);
    doc.text(`Ticket Type: ${ticket.ticketType}`, 20, startY + 6 * lineHeight);
    doc.text(`Status: ${ticket.status}`, 20, startY + 7 * lineHeight);

    // Add event description
    doc.setFont('helvetica', 'bold');
    doc.text('Event Description:', 10, startY + 9 * lineHeight);
    doc.setFont('helvetica', 'normal');
    const splitDescription = doc.splitTextToSize(ticket.event.description, 180);
    doc.text(splitDescription, 20, startY + 10 * lineHeight);

    // Add a QR code (you'll need to generate this separately)
    // doc.addImage(qrCodeDataUrl, 'PNG', 150, 20, 40, 40);

    // Save the PDF
    doc.save(`Ticket_${ticket.ticketNumber}.pdf`);
  }
}
