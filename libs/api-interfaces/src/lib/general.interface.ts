export interface DocDates {
  createdAt: string;
  updatedAt: string;
}


export interface MultiDocPayload<T> {
  payload: T[];
  meta: {
    count: number;
  };
}