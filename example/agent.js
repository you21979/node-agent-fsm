var FSM = require('..');

var map = [];
var cmd = [];

var STATE = {
    NONE : 0,
    INIT : 1,
    ACTIVE : 2,
    SUSPEND : 3,
}

class MyEvent extends FSM.Event{}
class EventInit extends MyEvent{
    begin(ctx){
        ctx.work[ctx.m.get()] = {done:false};
        setTimeout(function(){ctx.work[ctx.m.get()].done = true}, 1000);
    }
    task(ctx){
        if(ctx.work[ctx.m.get()].done){
            ctx.m.update(STATE.ACTIVE);
        }
    }
    end(ctx){
        ctx.work[ctx.m.get()] = null;
        console.log('initialize done')
    }
}
class EventActive extends MyEvent{
    begin(ctx){
        console.log('ACTIVE');
        ctx.work[ctx.m.get()] = {time:process.uptime() + (Math.random() * 10)};
        map.push(ctx);
    }
    end(ctx){
        ctx.work[ctx.m.get()] = null;
        map = map.filter(function(v){return v.id !== ctx.id})
    }
    task(ctx){
        if(ctx.work[ctx.m.get()].time < process.uptime()){
            ctx.m.update(STATE.SUSPEND);
        }else{
            cmd.push([ctx.id, ctx.action()]);
        }
    }
}
class EventSuspend extends MyEvent{
    begin(ctx){
        console.log('SUSPEND');
        setTimeout(function(){ctx.m.update(STATE.ACTIVE)}, 2000);
    }
}

var EVENTS = [];
EVENTS[STATE.NONE] = new MyEvent();
EVENTS[STATE.INIT] = new EventInit();
EVENTS[STATE.ACTIVE] = new EventActive();
EVENTS[STATE.SUSPEND] = new EventSuspend();
Object.freeze(EVENTS)

var Agent = function(id){
    this.id = id;
    this.work = {};
    this.m = new FSM.StateMachine(this, EVENTS);
    this.m.update(STATE.INIT)
}
Agent.prototype.heartbeat = function(){
    this.m.tick();
}
Agent.prototype.action = function(){
    switch(this.id){
    case 1:
        return 'jump';
    case 5:
        return 'fire';
    default:
        return 'run';
    }
}

var id = 0;
var agents = [
    new Agent(++id),
    new Agent(++id),
    new Agent(++id),
    new Agent(++id),
    new Agent(++id),
    new Agent(++id)
];
var update = function(){
    setTimeout(function(){
        agents.forEach(function(v){v.heartbeat()});
        console.log('agent:', map.length)
        cmd.forEach(function(v){console.log(v)})
        cmd.length = 0;
        update();
    }, 1000);
}
update()
