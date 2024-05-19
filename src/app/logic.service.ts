import { Injectable } from '@angular/core';
import { TaskModel } from './models/task-model';
import { Observable, combineLatest, Subject, of } from 'rxjs';
import { TaskFactoryService } from './task-factory.service';
import { delay, map, mergeMap, tap } from 'rxjs/operators';
import { CloneSubject } from './clone-subject';

@Injectable({
  providedIn: 'root',
})
export class LogicService {
  readonly initialState: TaskModel[] = [];
  private state: TaskModel[] = [...this.initialState];
  private logicSubj$ = new CloneSubject(this.state);
  private tasksStream$ = this.logicSubj$.asObservable();

  private totalTimeSubj$ = new Subject<number>()
  private totalTimers$ = this.totalTimeSubj$.asObservable();

  constructor(private taskService: TaskFactoryService) {
    this.init();
  }

  init() {
    this.tasks$
      .pipe(map((tasks: TaskModel[]) => tasks.map((task) => task.timer)))
      .subscribe((timers: Observable<number>[]) => {
        combineLatest(timers)
          .pipe(
            map((time: number[]) =>
              time.reduce((currentTime, accTime) => currentTime + accTime, 0)
            )
          )
          .subscribe((total) => this.totalTimeSubj$.next(total));
      });
  }

  public get tasks$(): Observable<TaskModel[]> {
    return this.tasksStream$;
  }

  public addTask(tskName: string) {
    const newTask = this.taskService.createTask(tskName);
    this.state = [...this.state, newTask];
    this.doNext();
  }

  public updateTask(evt: TaskModel): void {
    const index = this.state.findIndex((tsk) => tsk.id === evt.id);
    this.state = this.toggleAllButtonTexts(this.state, index);
    this.doNext();
  }

  public get totalTime$(): Observable<number> {
    return this.totalTimers$;
  }

  public nameExists(value: string): boolean {
    return this.state.some((task) => {
      return task.name.toLowerCase() === value.toLowerCase();
    });
  }
  private toggleAllButtonTexts(
    tasks: TaskModel[],
    selectedId: number
  ): TaskModel[] {
    tasks
      .filter((tsk) => tsk.id !== selectedId)
      .forEach((tsk) => this.inactivateButton(tsk));
    this.toggleText(tasks[selectedId]);
    return tasks;
  }

  private inactivateButton(tsk: TaskModel): void {
    if (tsk.buttonText === 'pause') {
      this.setPlay(tsk);
    }
  }

  private toggleText(tsk: TaskModel): void {
    if (tsk.buttonText === 'pause') {
      this.setPlay(tsk);
    } else {
      this.setPause(tsk);
    }
  }
  private setPlay(tsk: TaskModel) {
    tsk.buttonText = 'play_arrow';
    this.taskService.pause(tsk.id);
  }

  private setPause(tsk: TaskModel) {
    tsk.buttonText = 'pause';
    this.taskService.play(tsk.id);
  }

  private doNext() {
    this.logicSubj$.next(this.state);
  }
}
