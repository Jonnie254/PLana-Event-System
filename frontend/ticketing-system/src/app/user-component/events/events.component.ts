import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-events',
  standalone: true,
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
  imports: [NavbarComponent, CommonModule, RouterLink],
})
export class EventsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('slideContainer') slideContainer!: ElementRef;

  slides = [
    { image: 'Happy-country-1200X300--2.avif' },
    { image: 'showcase.avif' },
    { image: 'showcase.avif' },
  ];
  slideIndex = 0;
  carouselInterval: any;

  ngAfterViewInit(): void {
    this.startAutoScroll();
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
  }

  currentSlide(n: number): void {
    this.slideIndex = n;
    this.scrollToSlide(n);
  }

  private startAutoScroll(): void {
    this.carouselInterval = setInterval(() => {
      this.slideIndex = (this.slideIndex + 1) % this.slides.length;
      this.scrollToSlide(this.slideIndex);
    }, 3000);
  }

  private stopAutoScroll(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  private scrollToSlide(index: number): void {
    const slideElement = this.slideContainer.nativeElement.children[index];
    if (slideElement) {
      slideElement.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    }
  }
}
