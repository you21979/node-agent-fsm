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
    ctx.done = false
  }
  task(ctx:Context){
    if(ctx.done){
      ctx.fsm().update(STATE.ACTIVE);
    }else{
      ctx.done = true
    }
  }
}
class EventActive extends MyEvent{
  task(ctx:Context){
    ctx.fsm().update(STATE.FINISH);
  }
}
class EventFinish extends MyEvent{
  begin(ctx:Context){
    ctx.loop = false
  }
}

const initializeEvent = () => {
  const events: MyEvent[] = [];
  events[STATE.NONE] = new MyEvent()
  events[STATE.INIT] = new EventInit()
  events[STATE.ACTIVE] = new EventActive()
  events[STATE.FINISH] = new EventFinish()
  return events
}

describe('test', () => {
  it('test', () => {
    const events = initializeEvent()
    const ctx = new Context(events)
    ctx.fsm().update(STATE.INIT);
    while(ctx.loop === true){
      ctx.fsm().tick()
    }
    assert(ctx.done === true)
    assert(ctx.fsm().get() === STATE.FINISH)
  })
  it('error', () =>{
    try{
      const ctx = new Context([])
      assert(false)
    }catch(e){
      assert(true)
    }
  })
})
