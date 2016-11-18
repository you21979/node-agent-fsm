const FSM = require('..');

const STATE = {
    TEST_1 : 0,
    TEST_2 : 1,
    TEST_3 : 2,
    TEST_4 : 3,
}

const EVENTS = []
EVENTS[STATE.TEST_1] = FSM.makeEvent({
    begin:ctx => {
        console.log("TEST_1 begin")
    },   
    task:ctx => {
        console.log("TEST_1 task")
        ctx.m.update(STATE.TEST_2)
    },
    end:ctx => {
        console.log("TEST_1 end")
    }
});
EVENTS[STATE.TEST_2] = FSM.makeEvent({
    begin:ctx => {
        console.log("TEST_2 begin")
    },   
    task:ctx => {
        console.log("TEST_2 task")
        if(Math.random() * 100 > 50) ctx.m.update(STATE.TEST_3)
    },
    end:ctx => {
        console.log("TEST_2 end")
    }
});
EVENTS[STATE.TEST_3] = FSM.makeEvent({
    begin:ctx => {
        console.log("TEST_3 begin")
    },   
    task:ctx => {
        console.log("TEST_3 task")
        if(Math.random() * 100 > 70) ctx.m.update(STATE.TEST_4)
    },
    end:ctx => {
        console.log("TEST_3 end")
    }
});
EVENTS[STATE.TEST_4] = FSM.makeEvent({
    begin:ctx => {
        console.log("TEST_4 begin")
    },   
    task:ctx => {
        console.log("TEST_4 task")
        if(Math.random() * 100 > 90) ctx.m.update(STATE.TEST_1)
    },
    end:ctx => {
        console.log("TEST_4 end")
    }
});

const main = () => {
    const ctx = {isExit : false}
    ctx.m = FSM.makeStateMachine(ctx, EVENTS);
    ctx.m.init(STATE.TEST_1)
    const update = () => {
        if(ctx.isExit) return
        ctx.m.tick();
        setTimeout(() => update(), 100)
    }
    update();
}

main()
