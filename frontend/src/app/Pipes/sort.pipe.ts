import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  // Исправили тип: Array<any> вместо Array<string>, так как мы сортируем объекты
  transform(value: Array<any>, args: any[]): any {
    const sortField = args[0];
    const sortDirection = args[1];
    let multiplier = 1;

    if (sortDirection === 'desc') {
      multiplier = -1;
    }

    if (!value || !sortField) {
        return value;
    }

    value.sort((a: any, b: any) => {
      // Добавлена проверка, чтобы не падать на null/undefined
      const valA = a[sortField] || 0; // Если поля нет, считаем как 0 (для чисел) или '' (для строк)
      const valB = b[sortField] || 0;

      if (valA < valB) {
        return -1 * multiplier;
      } else if (valA > valB) {
        return 1 * multiplier;
      } else {
        return 0;
      }
    });

    return value;
  }

}