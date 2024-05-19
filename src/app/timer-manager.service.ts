import { Injectable, NgZone } from '@angular/core';
import { Observable, timer, BehaviorSubject } from 'rxjs';
import { tap, filter } from 'rxjs/operators';
import { TaskTimer } from './models/task-timer';
@Injectable({
  providedIn: 'root',
})
export class TimerManagerService {
  readonly initialValue = 0;
  private timers:  TaskTimer[] = [];
  constructor(private ngZone: NgZone) {
    this.runTimers();
  }

  getNewTimer(id: number): Observable<number> {
    const newTimer = this.createTimer();
    this.timers.push({ id, subj$: newTimer, isRunning: false });
    return newTimer.asObservable();
  }
  private createTimer() {
    return new BehaviorSubject<number>(this.initialValue);
  }
  public playTimer(id: number): void {
    const timer = this.getTimerById(id);
    if (timer) {
      timer.isRunning = true;
    }
  }
  public pauseTimer(id: number): void {
    const timer = this.getTimerById(id);
    if (timer) {
      timer.isRunning = false;
    }
  }

  private getTimerById(id: number): TaskTimer {
    return this.timers.find((timer) => timer.id === id);
  }

  private runTimers(): void {
    timer(0, 1000)
      .pipe(
        filter(() => this.timers.findIndex((timer) => timer.isRunning) >= 0),
        tap(() => {
          this.ngZone.runOutsideAngular(() => {
            this.timers
              .filter((timer) => timer.isRunning)
              .forEach((subj) => subj.subj$.next(subj.subj$.value + 1));
          });
        })
      )
      .subscribe();
  }
}
