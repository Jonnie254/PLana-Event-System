import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NavbarComponent } from '../../user-component/navbar/navbar.component';
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
  slides = [
    { image: 'event.png' },
    { image: 'showcase.avif' },
    { image: 'showcase.avif' },
  ];
  slideIndex = 0;
  carouselInterval: any;

  ngAfterViewInit(): void {
    this.showSlides();
    this.carouselInterval = setInterval(() => this.plusSlides(1), 3000);
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  plusSlides(n: number): void {
    this.slideIndex += n;
    if (this.slideIndex >= this.slides.length) {
      this.slideIndex = 0;
    } else if (this.slideIndex < 0) {
      this.slideIndex = this.slides.length - 1;
    }
    this.showSlides();
  }

  currentSlide(n: number): void {
    this.slideIndex = n;
    this.showSlides();
  }

  private showSlides(): void {
    const slides = document.getElementsByClassName('mySlides');
    const dots = document.getElementsByClassName('dot');
    for (let i = 0; i < slides.length; i++) {
      (slides[i] as HTMLElement).style.display = 'none';
    }
    for (let i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(' active', '');
    }
    (slides[this.slideIndex] as HTMLElement).style.display = 'block';
    if (dots[this.slideIndex]) {
      dots[this.slideIndex].className += ' active';
    }
  }
}
