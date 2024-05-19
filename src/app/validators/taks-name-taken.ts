import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LogicService } from '../logic.service';

export class TaskNameTakenValidator {
  static nameTaken(userService: LogicService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return of(userService.nameExists(control.value)).pipe(
        map((result: boolean) => (result ? { nameTaken: true } : null))
      );
    };
  }
}
