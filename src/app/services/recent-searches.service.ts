import { Injectable, signal } from '@angular/core';
import type { RecentSearch } from '../interfaces/recent-search.interface';
const STORAGE_KEY = 'trayectico-recent-searches';
@Injectable({ providedIn: 'root' })
export class RecentSearchesService {
  private readonly state = signal<RecentSearch[]>(this.load());
  readonly searches = this.state.asReadonly();
  save(search: RecentSearch): void {
    const recent = [
      { ...search },
      ...this.searches().filter(
        (item) => item.origin !== search.origin || item.destination !== search.destination,
      ),
    ].slice(0, 5);
    this.state.set(recent);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
    } catch {
      /* Keep the current session usable without browser storage. */
    }
  }
  private load(): RecentSearch[] {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      return Array.isArray(stored)
        ? stored
            .filter(
              (item): item is RecentSearch =>
                !!item && typeof item.origin === 'string' && typeof item.destination === 'string',
            )
            .slice(0, 5)
        : [];
    } catch {
      return [];
    }
  }
}
