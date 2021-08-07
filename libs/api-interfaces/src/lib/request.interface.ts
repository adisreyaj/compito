export interface PaginationParams {
  page: string;
  limit: string;
}

export interface SearchParams {
  search: string;
}

export interface RequestParams extends PaginationParams, SearchParams {}

export class RequestParamsDto {
  page: number;
  limit: number;
  skip: number;
  search: string | null;
  constructor(pageValue: string, limit: string, search: string) {
    this.page = +pageValue;
    this.limit = +limit;
    this.skip = this.page * this.limit;
    if (this.search != null && this.search != '') {
      this.search = search;
    }
  }
}
