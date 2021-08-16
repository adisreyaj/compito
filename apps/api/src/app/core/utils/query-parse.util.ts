import { RequestParams, RequestParamsParsed } from '@compito/api-interfaces';

export const parseQuery = (req: RequestParams): RequestParamsParsed => {
  return {
    limit: req.limit ? +req.limit : 100,
    page: req.page ? +req.page : 0,
    skip: req.page && req.limit ? +req.limit * +req.page : 0,
    search: req.search ?? '',
  };
};
