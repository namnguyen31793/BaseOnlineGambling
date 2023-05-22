cc.Class({
    extends: cc.Component,

    ctor() {
        this.slotView = null;
        this.currentMutilTown = 0;
        this.currentMutilLastTurn = 0;
        this.TimeRunAnim = 0.6;
        this.TimeRunAnimReset = 0.9;
    },

    properties: {
        objBG : cc.Node,
        objBGTree : cc.Node,
        animBG : cc.Animation,
        animRim : cc.Animation,
        effectLight : cc.Animation,
    },

    Init(slotView){
        this.slotView = slotView;
    },

    SetupTown(floor){
        //load lai game cho len tang tuong ung
    },

    PlayAnimFloor(floor){
        this.currentMutilTown = floor;
        if(this.currentMutilLastTurn == this.currentMutilTown){
            //k upadte he so
            this.slotView.toDoList.DoWork();
        } else if(this.currentMutilLastTurn > 1 && this.currentMutilTown == 1 ){
            this.ResetTown();
        }else{
            this.StartAnim();
        }
        this.currentMutilLastTurn = this.currentMutilTown;
    },

    StartAnim(){
        if(this.currentMutilTown <= 10)
		    this.objBG.runAction(cc.moveTo(this.TimeRunAnim, cc.v2(0, -120*this.currentMutilTown)));
        else
		    this.objBG.runAction(cc.moveTo(this.TimeRunAnim, cc.v2(0, -1200+(-40*(this.currentMutilTown-10)))));
		this.objBGTree.runAction(cc.moveTo(this.TimeRunAnim, cc.v2(0, -10*this.currentMutilTown)));
        this.animBG.play("AnimBgTowerUpLevel");
        if(this.currentMutilLastTurn <= 2){
            this.animRim.play("AnimTowerUpLevel1");
        }else{
            this.animRim.play("AnimTowerUpLevel2");
        }
    },

    ResetTown(){
		this.objBG.runAction(cc.moveTo(this.TimeRunAnimReset, cc.v2(0, 0)));
		this.objBGTree.runAction(cc.moveTo(this.TimeRunAnim, cc.v2(0, 0)));
        this.animBG.play("AnimBgTowerReset");
        this.animRim.play("AnimTowerReset");
        this.slotView.PlaySpinFallTowerFall();
    },

    PlayAnimLight(){
        this.animRim.play("EffectLightBg");
    },
});
