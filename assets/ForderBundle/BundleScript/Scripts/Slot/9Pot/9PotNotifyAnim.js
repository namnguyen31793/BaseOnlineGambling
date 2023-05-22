var TIME_SHOW_ANIM = 6;

cc.Class({
    extends: cc.Component,

    properties: {
        listNodeNotify :{
            default : [],
            type: cc.Node,
        },
    },

    ctor(){
        this.timeShow = 0;
        this.indexAnim = 0;
        this.isPlayAnim = false;
    },

    onLoad () {
        this.isPlayAnim = true;
        this.changeNotify();
    },

    update (dt) {
        if(this.isPlayAnim){
            this.timeShow += dt;
            if(this.timeShow > TIME_SHOW_ANIM){
                this.changeNotify();
            }
        }
    },

    changeNotify(){
        this.timeShow = 0;
        this.listNodeNotify[this.indexAnim].runAction(cc.scaleTo(0.5, 0).easing(cc.easeSineOut()));
        this.indexAnim +=1;
        if(this.indexAnim >= this.listNodeNotify.length)
            this.indexAnim = 0;
        let acInit = cc.callFunc(() => {
            this.listNodeNotify[this.indexAnim].runAction(cc.scaleTo(0.4, 1).easing(cc.easeSineOut()));
        });
        this.listNodeNotify[this.indexAnim].runAction(cc.sequence(cc.delayTime(0.6), acInit));
    },
});
