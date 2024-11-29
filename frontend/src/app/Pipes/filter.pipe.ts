import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(value: any[], filterString: string, filterField: string): any[] {
    const resultArray: any[] = [];
    if (!value || !filterString || !filterField) {
      return value;
    }

    for (const item of value) {
      if (item[filterField]?.toLowerCase().startsWith(filterString.toLowerCase())) {
        resultArray.push(item);
      }
    }
    return resultArray;
  }
}
