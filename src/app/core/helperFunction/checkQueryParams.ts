import { QueryParams } from '../interfaces/queryParams.interface'

export function checkParams(queryParams: QueryParams): Partial<QueryParams> {
    return Object.entries(queryParams).reduce((acc, [key, value]) => {
      if (value !== null && value !== "" && value !== 'undefined,') {
        acc[key as keyof QueryParams] = value.toString();
      }
      return acc;
    }, {} as Partial<QueryParams>);
}