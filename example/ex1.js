const rp = require('request-promise');
const FSM = require('..');

const STATE = {
    NONE : 0,
    DOWNLOAD : 1,
    RETRY : 2,
    FINISH : 3,
}

const EVENTS = []
EVENTS[STATE.NONE] = FSM.dummyEvent;
EVENTS[STATE.DOWNLOAD] = FSM.makeEvent({
    begin:ctx => {
        Promise.all(
            ["https://api.github.com/users/you21979", "https://api.github.com/users/you21979/repos"].
            map(url => rp({url:url,timeout:3000,method:"GET",headers:{"User-Agent":"test"}}))
        ).then(res => {
            ctx.data = res
            ctx.m.update(STATE.FINISH)
        }).catch( e => {
            console.log(e)
            ctx.m.update(STATE.RETRY)
        })
    },   
    task:ctx => {
        console.log("process:" + (process.uptime() - ctx.uptime).toFixed(3))
    },
    end:ctx => {
    }
});
EVENTS[STATE.RETRY] = FSM.makeEvent({
    begin : ctx => {
        setTimeout(() => ctx.m.update(STATE.DOWNLOAD), 2000)
    }
})
EVENTS[STATE.FINISH] = FSM.makeEvent({
    begin : ctx => {
        ctx.isExit = true
        console.log(ctx.data)
    }
})

const main = () => {
    const ctx = {isExit : false, uptime:process.uptime()}
    ctx.m = FSM.makeStateMachine(ctx, EVENTS);
    ctx.m.update(STATE.DOWNLOAD)
    const update = () => {
        if(ctx.isExit) return
        ctx.m.tick();
        setTimeout(() => update(), 100)
    }
    update();
}

main()
