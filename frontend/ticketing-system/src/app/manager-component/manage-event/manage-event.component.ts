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

@Component({
  selector: 'app-manage-event',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './manage-event.component.html',
  styleUrl: './manage-event.component.css',
})
export class ManageEventComponent {
  eventForm: FormGroup;
  showModal: boolean = false;
  showEditModal: boolean = false;
  currentStep: number = 1;

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required],
      singleTicket: [false],
      groupTicket: [false],
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

  get singleTickets(): FormArray {
    return this.eventForm.get('singleTickets') as FormArray;
  }

  get groupTickets(): FormArray {
    return this.eventForm.get('groupTickets') as FormArray;
  }

  addSingleTicket(): void {
    this.singleTickets.push(
      this.fb.group({
        type: ['Single', Validators.required],
        slots: ['', [Validators.required, Validators.min(1)]],
        price: ['', [Validators.required, Validators.min(0)]],
      })
    );
  }

  removeSingleTicket(): void {
    const index = this.singleTickets.controls.findIndex(
      (ticket) => ticket.value.type === 'Single'
    );
    if (index !== -1) {
      this.singleTickets.removeAt(index);
    }
  }

  addGroupTicket(): void {
    this.groupTickets.push(
      this.fb.group({
        type: ['Group', Validators.required],
        slots: ['', [Validators.required, Validators.min(1)]],
        price: ['', [Validators.required, Validators.min(0)]],
      })
    );
  }

  removeGroupTicket(): void {
    const index = this.groupTickets.controls.findIndex(
      (ticket) => ticket.value.type === 'Group'
    );
    if (index !== -1) {
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
  nextStep(): void {
    this.currentStep++;
  }

  prevStep(): void {
    this.currentStep--;
  }

  createEvent() {
    if (this.eventForm.valid) {
      console.log('Event created:', this.eventForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

  toggleModal() {
    this.showModal = !this.showModal;
    if (!this.showModal) {
      this.eventForm.reset();
    }
  }
  toggleEditModal() {
    this.showEditModal = !this.showEditModal;
  }
}
