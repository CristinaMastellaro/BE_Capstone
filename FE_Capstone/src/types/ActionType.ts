export default interface ActionType<A> {
  type: string;
  payload: A;
}
