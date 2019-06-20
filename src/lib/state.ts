import {IEvent} from './event'

type EventObject<T> = IEvent<T> | null

export class State<T>{
  private current: EventObject<T>
  constructor(){
    this.current = null;
  }
  get(): EventObject<T>{
    return this.current;
  }
  init(event: EventObject<T>): void{
    this.current = event;
  }
  update(newevent: EventObject<T>, ctx: T): EventObject<T>{
    const oldevent = this.current;
    if(this.current) this.current.end( ctx );
    this.current = newevent;
    if(this.current) this.current.begin( ctx );
    return oldevent;
  }
  tick(ctx: T): void{
    if(this.current) this.current.task( ctx );
  }
}

