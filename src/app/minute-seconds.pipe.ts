import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minuteSeconds',
})
export class MinuteSecondsPipe implements PipeTransform {
  
  transform(value: number): string {
    if (!value) {
      return '00:00';
    }

    const minutes: number = Math.floor(value / 60);
    const seconds: number = value % 60;

    const minutesString = minutes < 10 ? '0' + minutes : minutes;
    const secondsString = seconds < 10 ? '0' + seconds : seconds;


    return `${minutesString}:${secondsString}`;
  }
}
