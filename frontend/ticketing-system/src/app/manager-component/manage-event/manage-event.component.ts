import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EventsService } from '../../services/events.service';
import { Event } from '../../interfaces/events';
import { Res } from '../../interfaces/res';

@Component({
  selector: 'app-manage-event',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './manage-event.component.html',
  styleUrl: './manage-event.component.css',
})
export class ManageEventComponent {
  currentDate: string = '';
  events: Event[] = [];
  event: Event = {} as Event;
  eventForm: FormGroup = new FormGroup({});
  editEventForm: FormGroup = new FormGroup({});
  showModal: boolean = false;
  showEditModal: boolean = false;
  currentStep: number = 1;
  spinnerVisible: boolean = false;
  imageurl: string = '';
  eventSuccess: boolean = false;
  eventError: boolean = false;
  eventMessage: string = '';
  singleTicketId: string | null = null;
  groupTicketId: string | null = null;
  confirmationModal: boolean = false;
  selectedEventId: string = '';

  constructor(private fb: FormBuilder, private eventsService: EventsService) {
    this.currentDate = this.getCurrentDate(); // Set current date
    this.getEvents();
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      image: [''],
      description: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required],
      eventTime: ['', Validators.required],
      singleTicket: [false],
      groupTicket: [false],
      singleTickets: this.fb.array([]),
      groupTickets: this.fb.array([]),
    });
    this.editEventForm = this.fb.group({
      name: ['', Validators.required],
      image: [''],
      description: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required],
      eventTime: ['', Validators.required],
      singleTicket: [false],
      groupTicket: [false],
      singleSlots: [''],
      singlePrice: [''],
      groupSlots: [''],
      groupPrice: [''],
      groupSize: [''],
      singleTickets: this.fb.array([]),
      groupTickets: this.fb.array([]),
    });

    this.eventForm.get('singleTicket')?.valueChanges.subscribe((checked) => {
      if (checked) {
        this.addSingleTicket();
      } else {
        this.removeSingleTicket();
      }
    });

    this.eventForm.get('groupTicket')?.valueChanges.subscribe((checked) => {
      if (checked) {
        this.addGroupTicket();
      } else {
        this.removeGroupTicket();
      }
    });
  }
  //get the current date
  // Helper function to get the current date in yyyy-mm-dd format
  getCurrentDate(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  }
  //get all the events
  getEvents() {
    this.eventsService.getEventsByPlanner().subscribe({
      next: (response: Res) => {
        this.events = response.data;
      },
      error: (error) => {
        console.error('Error fetching events:', error);
      },
    });
  }
  get singleTickets(): FormArray {
    return this.eventForm.get('singleTickets') as FormArray;
  }

  get groupTickets(): FormArray {
    return this.eventForm.get('groupTickets') as FormArray;
  }

  getImagesUrl(event: any) {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'tours_travel');
      formData.append('cloud_name', 'do9a5sjgi');

      this.imageurl = '';
      this.showSpinner();

      fetch('https://api.cloudinary.com/v1_1/do9a5sjgi/image/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          this.imageurl = result.url;
          console.log('Image URL:', this.imageurl);
          this.eventForm.patchValue({ image: this.imageurl });
          this.editEventForm.patchValue({ image: this.imageurl });
          console.log('Event Form:', this.editEventForm.value);
          setTimeout(() => {
            this.hideSpinner();
          }, 2000);
        })
        .catch((error) => {
          console.error('Error uploading image:', error);
          this.hideSpinner();
        });
    }
  }

  showSpinner() {
    this.spinnerVisible = true;
  }

  hideSpinner() {
    this.spinnerVisible = false;
  }
  addSingleTicket(): void {
    this.singleTickets.push(
      this.fb.group({
        slots: ['', [Validators.required, Validators.min(1)]],
        price: ['', [Validators.required, Validators.min(0)]],
      })
    );
  }

  addGroupTicket(): void {
    this.groupTickets.push(
      this.fb.group({
        slots: ['', [Validators.required, Validators.min(1)]],
        price: ['', [Validators.required, Validators.min(0)]],
        groupSize: ['', [Validators.required, Validators.min(2)]],
      })
    );
  }

  removeSingleTicket(): void {
    const index = this.singleTickets.length - 1;
    if (index >= 0) {
      this.singleTickets.removeAt(index);
    }
  }

  removeGroupTicket(): void {
    const index = this.groupTickets.length - 1;
    if (index >= 0) {
      this.groupTickets.removeAt(index);
    }
  }
  stepClass(stepNumber: number): string {
    const baseClasses =
      'w-8 h-8 mx-[-1px] p-1.5 flex items-center justify-center rounded-full';
    if (stepNumber === this.currentStep) {
      return 'bg-blue-600 ' + baseClasses;
    } else if (stepNumber < this.currentStep) {
      return 'bg-green-500 ' + baseClasses;
    } else {
      return 'bg-gray-300 ' + baseClasses;
    }
  }

  stepLineClass(stepNumber: number): string {
    if (stepNumber < this.currentStep) {
      return 'bg-blue-600';
    } else {
      return 'bg-gray-300';
    }
  }
  nextStep() {
    if (
      this.currentStep === 1 &&
      this.eventForm.get('name')?.valid &&
      this.eventForm.get('description')?.valid
    ) {
      this.currentStep++;
    } else if (
      this.currentStep === 2 &&
      this.eventForm.get('date')?.valid &&
      this.eventForm.get('location')?.valid &&
      this.eventForm.get('eventTime')?.valid
    ) {
      this.currentStep++;
    } else {
      this.validateAllFormFields(this.eventForm);
    }
  }

  prevStep(): void {
    this.currentStep--;
  }
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormArray) {
        control.controls.forEach((group) =>
          this.validateAllFormFields(group as FormGroup)
        );
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }

  createEvent() {
    {
      const eventData = this.eventForm.value;
      console.log('Event Data:', eventData);
      this.eventsService.createEvent(eventData).subscribe({
        next: (response: Res) => {
          this.eventSuccess = true;
          this.eventMessage = response.message;
          this.getEvents();
          setTimeout(() => {
            this.eventSuccess = false;
            this.toggleModal();
          }, 3000);
        },
        error: (error) => {
          console.error('Error creating event:', error);
          this.eventError = true;
          if (error.error && error.error.message) {
            this.eventMessage = error.error.message;
          } else {
            this.eventMessage = 'An error occurred. Please try again later.';
          }
          setTimeout(() => {
            this.eventError = false;
          }, 3000);
        },
      });
    }
  }
  toggleModal() {
    this.showModal = !this.showModal;
    if (!this.showModal) {
      this.eventForm.reset();
    }
  }

  patchEventForm() {
    if (this.event) {
      console.log('Event:', this.event);

      // Format date
      const eventDate = new Date(this.event.date);
      const formattedDate = eventDate.toISOString().substring(0, 10);
      // Format time
      const eventTime = this.event.eventTime;
      const formattedTime = eventTime ? eventTime.substring(0, 5) : '';

      this.editEventForm.patchValue({
        name: this.event.name,
        image: this.event.image,
        description: this.event.description,
        date: formattedDate,
        location: this.event.location,
        eventTime: formattedTime,
        singleTicket:
          this.event.singleTickets && this.event.singleTickets.length > 0,
        groupTicket:
          this.event.groupTickets && this.event.groupTickets.length > 0,
      });

      // Patch single ticket info if available

      if (this.event.singleTickets && this.event.singleTickets.length > 0) {
        const singleTicket = this.event.singleTickets[0];
        this.editEventForm.patchValue({
          singleSlots: singleTicket.slots,
          singlePrice: singleTicket.price,
        });
        this.singleTicketId = singleTicket.id;
      }

      // Patch group ticket info if available
      if (this.event.groupTickets && this.event.groupTickets.length > 0) {
        const groupTicket = this.event.groupTickets[0];
        this.editEventForm.patchValue({
          groupSlots: groupTicket.slots,
          groupPrice: groupTicket.price,
          groupSize: groupTicket.groupSize,
        });
        this.groupTicketId = groupTicket.id;
      }
    }
  }
  updateEvent() {
    if (this.editEventForm.valid) {
      const updatedEvent = this.editEventForm.value;
      updatedEvent.id = this.event.id;
      updatedEvent.singleTickets = [];
      updatedEvent.groupTickets = [];

      if (this.editEventForm.get('singleTicket')?.value) {
        updatedEvent.singleTickets.push({
          id: this.singleTicketId,
          slots: updatedEvent.singleSlots,
          price: updatedEvent.singlePrice,
        });
      }

      if (this.editEventForm.get('groupTicket')?.value) {
        updatedEvent.groupTickets.push({
          id: this.groupTicketId,
          slots: updatedEvent.groupSlots,
          price: updatedEvent.groupPrice,
          groupSize: updatedEvent.groupSize,
        });
      }
      this.eventsService.updateEvent(updatedEvent).subscribe({
        next: (response: Res) => {
          this.eventSuccess = true;
          this.eventMessage = response.message;
          this.getEvents();
          setTimeout(() => {
            this.eventSuccess = false;
          }, 3000);
        },
        error: (error) => {
          console.error('Error updating event:', error);
          this.eventError = true;
          if (error.error && error.error.message) {
            this.eventMessage = error.error.message;
          } else {
            this.eventMessage = 'An error occurred. Please try again later.';
          }
          setTimeout(() => {
            this.eventError = false;
          }, 3000);
        },
      });
    }
  }
  editModal(eventId: string) {
    this.showEditModal = !this.showEditModal;
    if (this.showEditModal) {
      this.getEventById(eventId);
    }
  }

  toggleEditModal() {
    this.showEditModal = !this.showEditModal;
  }

  getEventById(id: string) {
    this.eventsService.getEventById(id).subscribe({
      next: (response: Res) => {
        console.log('Event:', response.data);
        this.event = response.data;
        this.patchEventForm();
      },
      error: (error) => {
        console.error('Error fetching event:', error);
      },
    });
  }
  requestPromotion(eventId: string) {
    console.log('Requesting promotion for event:', eventId);
    this.eventsService.requestEventPromotion(eventId).subscribe({
      next: (response: Res) => {
        this.closeModal();
        console.log('Promotion request:', response);
      },
      error: (error) => {
        console.error('Error requesting promotion:', error);
      },
    });
  }
  closeModal() {
    this.confirmationModal = false;
  }
  showConfirmationModal(eventId: string) {
    this.selectedEventId = eventId;
    this.confirmationModal = true;
  }
}
