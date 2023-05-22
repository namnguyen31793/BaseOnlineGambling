cc.Class({
    extends: cc.Component,
    ctor() {
        this.type = 109;
    },

    properties: {
        ske : sp.Skeleton,
    },

    Click() {
        this.ske.setAnimation(0, 'Lv3_Up', false);
        this.scheduleOnce(()=>{
            this.inRun = true;
            this.ske.setAnimation(0, 'Lv4_SWIM', true);
        }, 1.3)
    }, 

    start () {

    },

    // update (dt) {},
});
 