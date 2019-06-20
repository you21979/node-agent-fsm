import {IEvent} from './event'
import {State} from './state'
import * as assert from 'assert'

export class StateMachine<T>{
  private ctx: T
  private state: State<T>
  private events: IEvent<T>[]
  private current: number
  constructor(ctx:T, events: IEvent<T>[]){
    this.state = new State<T>();
    this.events = events;
    this.ctx = ctx;
    this.current = -1;
  }
  private checkState(state: number){
    if(  state >= -1
      && state < this.events.length
    ){
      return true
    }
    return false
  }
  init(state: number): void{
    assert( this.checkState(state) )
    this.current = state
    this.state.init(this.events[state])    
  }
  update(state: number): void{
    assert( this.checkState(state) )
    this.current = state
    this.state.update(this.events[state], this.ctx);
  }
  get(): number{
    return this.current
  }
  tick(): void{
    this.state.tick(this.ctx);
  }
}

