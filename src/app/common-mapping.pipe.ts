import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeToPassFunction'
})
export class CommonMappingPipe implements PipeTransform {

    transform(value, mappingFunction: Function){
        return mappingFunction(value)
      }

}