export interface IEvent<T>{
  begin: (ctx: T) => void
  end: (ctx: T) => void
  task: (ctx: T) => void
}
export class Event<T> implements IEvent<T>{
  constructor(){}
  begin(ctx: T): void{}
  end(ctx: T): void{}
  task(ctx: T): void{}
}
