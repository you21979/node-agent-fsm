"use strict";
var State = module.exports = function(){
    this.current = null;
}
State.prototype.get = function(){
    return this.current;
};
State.prototype.init = function( event ){
    this.current = event;
}
State.prototype.update = function( newevent, ctx ){
    var oldevent = this.current;
    if(this.current) this.current.end( ctx );
    this.current = newevent;
    if(this.current) this.current.begin( ctx );
    return oldevent;
}
State.prototype.tick = function( ctx ){
    if(this.current) this.current.task( ctx );
}
