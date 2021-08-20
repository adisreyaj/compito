export interface CardEvent<T = any> {
  type: string;
  payload?: T;
}
