cc.Class({
    extends: require("SlotBonusManager"),

    ctor() {
        this.listEffect = [];
        this.cacheBonusTurn = 0;
    },

    properties: {
        lbBonusValue : cc.Label,
        lbCountTime : cc.Label,
        nodeTime : cc.Node,
        listBtn : [cc.Node],
        txtContent : cc.Node,
        itemTxt : cc.Node,

    },

    ctor() {
        this.listBonus = [];
        this.indexBonus = 0;
        this.time = 0;
        this.isCountTime = false;
        this.bonusValue = 0;
        this.cachebonusValue = 0;
        this.waitEnd = false;
    },

    ShowBonusGame(listBonus, bonusValue) {
        for(let i = 0; i < this.listBtn.length; i++){
            this.listBtn[i].active = true;
        }
        cc.log(listBonus);
        this.listBonus = listBonus;
        this.indexBonus = 0;
        this.cachebonusValue = 0;
        this.time = 20;
        this.isCountTime = true;
        this.nodeTime.active = true;
        this.bonusValue = bonusValue;
        this.waitEnd = true;
        this.node.active = true;
    },

    ClickValueBonus(event, index){
        if(this.indexBonus == this.listBonus.length)
            return;
        // this.isCountTime = false;
        this.time = 20;
        this.nodeTime.active = false;
        //show win by index 
        cc.log(this.listBonus[this.indexBonus]);
        let valueWin = this.listBonus[this.indexBonus];
        //show effect
        this.listBtn[index].active = false;

        let txtValue = cc.instantiate(this.itemTxt);
        txtValue.parent = this.txtContent;
        txtValue.setPosition(cc.v2(this.listBtn[index].getPosition().x, -150));
        txtValue.active = true; 
        txtValue.scale = 0;
        txtValue.getComponent(cc.Label).string = Global.Helper.formatNumber(parseInt(valueWin));
        const scaleAction = cc.scaleTo(1, 1);
        const moveAction = cc.moveTo(1, cc.v2(txtValue.getPosition().x, 0));
        const sequence = cc.sequence(scaleAction, moveAction);
        txtValue.runAction(sequence);

        let valueBonus = this.slotView.menuView.GetBetValue()* parseInt(valueWin)/1000;
        this.cachebonusValue += valueBonus;
        this.lbBonusValue.string = Global.Helper.formatNumber(valueBonus);

        //index ++
        this.indexBonus++;
        if(this.indexBonus == this.listBonus.length){
            this.scheduleOnce(()=>{
                this.EndBonus(this.bonusValue)
            } , 2);
        }
    },

    update (dt) {
        if(this.isCountTime ){
            this.time -= dt;
            this.UpdateLbTime();
        }
    },

    UpdateLbTime(){
        if(this.time < 0){
            this.time = 0;
            this.isCountTime = false;
            this.EndBonus(this.bonusValue)
        }
        this.lbCountTime.string = parseInt(this.time);
    },

    EndBonus(bonusValue) {
        //show wim all bonus
        if(!this.waitEnd )
            return;
        this.waitEnd = false;
        this.lbBonusValue.string = Global.Helper.formatNumber(parseInt(bonusValue));
        this.slotView.ShowNotifyWinFree(parseInt(bonusValue));

        this.scheduleOnce(()=>{
            this.slotView.HideNotifyWinFree();
            this.slotView.toDoList.DoWork();
            this.Hide();
        } , 2);
    },

    Hide(){
        this.waitEnd = false;
        this.resetTxtContent();
        this.listBonus = [];
        this.indexBonus = 0;
        this.time = 0;
        this.isCountTime = false;
        this.nodeTime.active = false;
        this.bonusValue = 0;
        this.node.active = false;
    },
    resetTxtContent() {
        for(let i = this.txtContent.children.length - 1; i >=0; i--) {
            this.txtContent.children[i].destroy();
        }
    },
});
