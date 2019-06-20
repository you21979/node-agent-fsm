import {
  Event, StateMachine
} from '../index'
import * as assert from 'assert';

enum STATE{
  NONE,
  INIT,
  ACTIVE,
  FINISH,
}

class Context{
  public done: boolean = false
  public loop: boolean = true
  private m: StateMachine<Context>
  constructor(events: MyEvent[]){
    this.m = new StateMachine<Context>(this, events);
    this.m.init(STATE.NONE)
  }
  fsm(){
    return this.m
  }
}

class MyEvent extends Event<Context>{}

class EventInit extends MyEvent{
  begin(ctx:Context){
    ctx.done = true
  }
  task(ctx:Context){
    if(ctx.done){
      ctx.fsm().update(STATE.ACTIVE);
    }
  }
}
class EventActive extends MyEvent{
  begin(ctx:Context){
  }
  task(ctx:Context){
    ctx.fsm().update(STATE.FINISH);
  }
}
class EventFinish extends MyEvent{
  begin(ctx:Context){
    ctx.loop = false
  }
}

const initialize = () => {
  const events: MyEvent[] = [];
  events[STATE.NONE] = new MyEvent()
  events[STATE.INIT] = new EventInit()
  events[STATE.ACTIVE] = new EventActive()
  events[STATE.FINISH] = new EventFinish()
  return events
}

describe('test', () => {
  const events = initialize()
  it('test', () => {
    const ctx = new Context(events)
    ctx.loop = true
    ctx.fsm().update(STATE.INIT);
    while(ctx.loop === true){
      ctx.fsm().tick()
    }
    assert(ctx.done === true)
    assert(ctx.fsm().get() === STATE.FINISH)
  })
})
