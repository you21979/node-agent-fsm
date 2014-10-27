"use strict";
var State = require('./state');
var StateMachine = module.exports = function(ctx, events){
    this.state = new State();
    this.events = events || [];
    this.ctx = ctx;
}
StateMachine.prototype.init = function(state){
    this.state.init(this.events[state])
}
StateMachine.prototype.update = function(state){
    this.state.update(this.events[state], this.ctx);
}
StateMachine.prototype.get = function(){
    var self = this;
    var result = this.events.map(function(v,i){ return self.state.get() === v ? i : null }).filter(function(v){return v !== null})
    if(result.length === 0) return null;
    else return result.shift();
}
StateMachine.prototype.tick = function(){
    this.state.tick(this.ctx);
}
