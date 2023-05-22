

cc.Class({
    extends: cc.Component,

    properties: {
        startPos : cc.v2(0,0),
        endPos : cc.v2(0,0),
        timeMove : 0,
    },

    Play() {
        this.node.active = true;
        this.node.setPosition(this.startPos);
        this.node.runAction(cc.moveTo(this.timeMove, this.endPos));
        this.scheduleOnce(()=>{
            this.node.active = false;
        }, this.timeMove);
    },
});
