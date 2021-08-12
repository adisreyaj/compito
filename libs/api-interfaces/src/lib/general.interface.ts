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