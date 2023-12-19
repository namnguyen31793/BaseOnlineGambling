// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    ctor(){
        this.id = 1;
    },

    properties: {
        lbValue : cc.Label,
        nodeValue : cc.Node,
        anim: sp.Skeleton,
        btn : cc.Button,
    },

    Init(id){
        this.id = id;
        this.btn = this.node.getComponent(cc.Button);
        this.nodeValue = this.node.getChildByName("Khung")
        this.lbValue = this.nodeValue.getChildByName("label").getComponent(cc.Label);
        this.anim = this.node.getChildByName("ske").getComponent(sp.Skeleton);
        this.Reset();
    },

    ShowEffect(bonusValue, id){
        this.anim.setAnimation(0,'girl_0'+id+'_chon',false);
        this.scheduleOnce(()=>{
            this.anim.setAnimation(0,'girl_0'+id+'_Grey',true);
            this.nodeValue.active = true;
        } , 1.5);
        this.lbValue.string = Global.Helper.formatNumber(bonusValue);
        this.lbValue.scale = 1;
        this.btn.interactable = false;
    },

    Reset(){
        this.nodeValue.active = false;
        this.btn.interactable = true;
        this.lbValue.string = "";
        this.anim.setAnimation(0,'girl_0'+this.id+'_idle',true);
        this.lbValue.scale = 0;
    },
});
