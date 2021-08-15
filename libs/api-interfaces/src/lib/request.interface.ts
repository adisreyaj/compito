import { Request } from 'express';
import { Role } from './role.interface';
export interface PaginationParams {
  page: string;
  limit: string;
  skip: string;
}

export interface SearchParams {
  search: string;
}
export interface OtherRequestParams {
  [key: string]: string;
}

export interface RequestParams extends PaginationParams, SearchParams, OtherRequestParams {}

export type RequestParamsParsed = {
  page: number;
  limit: number;
  skip: number;
  search: string;
  [key: string]: any;
};

export interface UserPayload {
  'https://compito.adi.so/roles': Role;
  'https://compito.adi.so/org': string;
  'https://compito.adi.so/userId': string;
  email: string;
}

export type RequestWithUser = Request & { user: UserPayload };
