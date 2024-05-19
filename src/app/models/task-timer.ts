import { BehaviorSubject, Observable } from 'rxjs';

export interface TaskTimer {
    id: number;
    subj$: BehaviorSubject<number>;
    isRunning: boolean;
}
