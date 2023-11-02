// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        lbValue : cc.Label,
        anim: sp.Skeleton,
        btn : cc.Button,
    },

    Init(){
        this.btn = this.node.getComponent(cc.Button);
        this.lbValue = this.node.getChildByName("label").getComponent(cc.Label);
        this.anim = this.node.getChildByName("ske").getComponent(sp.Skeleton);
    },

    ShowEffect(bonusValue){
        this.anim.setAnimation(0,'Ruong_C_01',false);
        this.scheduleOnce(()=>{
            this.anim.setAnimation(0,'Ruong_C_02',true);
        } , 1.5);
        this.lbValue.string = Global.Helper.formatNumber(bonusValue);
        this.lbValue.scale = 0;
        this.btn.interactable = false;
        //anim txt
        const scaleAction = cc.scaleTo(0.25, 1);
        const moveAction = cc.moveTo(0.45, cc.v2(0, 50));
        const sequence = cc.sequence(scaleAction, moveAction);
        this.lbValue.node.runAction(sequence);
    },

    Reset(){
        this.btn.interactable = true;
        this.lbValue.string = "";
        this.anim.setAnimation(0,'Ruong_Idle',true);
        this.lbValue.scale = 0;
    },
});
