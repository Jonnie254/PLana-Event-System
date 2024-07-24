import { Pipe, PipeTransform } from '@angular/core';
import { Event } from '../interfaces/events';

@Pipe({
  name: 'search',
  standalone: true,
})
export class SearchPipe implements PipeTransform {
  transform(events: Event[], searchTerm: string): Event[] {
    if (!events || !searchTerm) {
      return events;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return events.filter(
      (event) =>
        event.name.toLowerCase().includes(lowercasedTerm) ||
        event.location.toLowerCase().includes(lowercasedTerm) ||
        event.description?.toLowerCase().includes(lowercasedTerm) ||
        event.date.toString().toLowerCase().includes(lowercasedTerm)
    );
  }
}
