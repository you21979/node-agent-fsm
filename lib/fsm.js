var util = require('util');
var Event = require('./event');
var StateMachine = require('./state_machine');

var FSM = exports;

FSM.makeEvent = function(obj){
    var w = function(){
        Event.call(this);
    }
    util.inherits(w, Event);
    w.prototype.begin = obj.begin || function(){};
    w.prototype.end = obj.end || function(){};
    w.prototype.task = obj.task || function(){};
    return new w();
}

FSM.dummyEvent = new Event();

FSM.makeStateMachine = function(ctx, events){
    return new StateMachine(ctx, events);
}

