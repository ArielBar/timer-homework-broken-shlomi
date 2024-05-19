import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
} from '@angular/forms';
import { LogicService } from '../logic.service';
import { distinctUntilChanged, map, pairwise } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { TaskNameTakenValidator } from '../validators/taks-name-taken';

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html',
  styleUrls: ['./task-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskAddComponent implements OnInit {
  form: FormGroup;
  formStatus$: Observable<boolean>;
  constructor(private fb: FormBuilder, private service: LogicService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      text: [
        null,
        [Validators.required, Validators.minLength(2)],
        [TaskNameTakenValidator.nameTaken(this.service)],
      ],
    });

    this.formStatus$ = this.form.statusChanges.pipe(
      pairwise(),
      map(([prev, next]) => {
        return next === 'PENDING' && prev !== 'PENDING';
      })
    );
  }
  submitHandler(text: string) {
    this.service.addTask(text);
    this.resetForm();
  }
  private resetForm() {
    this.form.reset();
  }

  get hasRequiredError(): boolean {
    return this.form.controls['text'].hasError('required');
  }
}
