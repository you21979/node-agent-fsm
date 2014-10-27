var FSM = require('..');

var map = [];
var cmd = [];

var STATE = {
    NONE : 0,
    INIT : 1,
    ACTIVE : 2,
    SUSPEND : 3,
}

var EVENTS = [];
EVENTS[STATE.NONE] = FSM.dummyEvent;
EVENTS[STATE.INIT] = FSM.makeEvent({
    begin:function(ctx){
        ctx.work[ctx.m.get()] = {done:false};
        setTimeout(function(){ctx.work[ctx.m.get()].done = true}, 1000);
    },   
    task:function(ctx){
        if(ctx.work[ctx.m.get()].done){
            ctx.m.update(STATE.ACTIVE);
        }
    },
    end:function(ctx){
        ctx.work[ctx.m.get()] = null;
        console.log('initialize done')
    }
});
EVENTS[STATE.ACTIVE] = FSM.makeEvent({
    begin:function(ctx){
        console.log('ACTIVE');
        ctx.work[ctx.m.get()] = {time:process.uptime() + (Math.random() * 10)};
        map.push(ctx);
    },
    end:function(ctx){
        ctx.work[ctx.m.get()] = null;
        map = map.filter(function(v){return v.id !== ctx.id})
    },
    task:function(ctx){
        if(ctx.work[ctx.m.get()].time < process.uptime()){
            ctx.m.update(STATE.SUSPEND);
        }else{
            cmd.push([ctx.id, ctx.action()]);
        }
    },
});
EVENTS[STATE.SUSPEND] = FSM.makeEvent({
    begin:function(ctx){
        console.log('SUSPEND');
        setTimeout(function(){ctx.m.update(STATE.ACTIVE)}, 2000);
    },
});
Object.freeze(EVENTS)

var Agent = function(id){
    this.id = id;
    this.work = {};
    this.m = FSM.makeStateMachine(this, EVENTS);
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
