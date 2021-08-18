export interface DocDates {
  createdAt: Date;
  updatedAt: Date;
}

export interface MultiDocPayload<T> {
  payload: T[];
  meta: {
    count: number;
  };
}

export type DataLoading =
  | { type: DataLoadingState.init }
  | { type: DataLoadingState.loading }
  | { type: DataLoadingState.error; error?: Error }
  | { type: DataLoadingState.success };

export enum DataLoadingState {
  init = 'INIT',
  loading = 'LOADING',
  success = 'SUCCESS',
  error = 'ERROR',
}
