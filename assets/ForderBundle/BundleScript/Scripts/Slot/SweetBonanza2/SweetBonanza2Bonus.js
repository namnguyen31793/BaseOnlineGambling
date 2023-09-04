cc.Class({
    extends: require("SlotBonusManager"),

    ctor() {
        this.listEffect = [];
        this.cacheBonusTurn = 0;
    },

    properties: {
        
    },

    ShowBonusGame(bonusTurn) {
        
        this.toDoList.CreateList();
        this.toDoList.Play();
    },

    CheckBonus(bonusTurn) {
        this.toDoList.CreateList();
        
        this.toDoList.Play();
    },

    EndBonus(bonusValue,accountBalance) {
        this.toDoList.CreateList();
        
        this.toDoList.Play();

    },

    GetListBonusUnActive() {
        let list = this.slotView.normalManager.listItemBonus;
        cc.log(list);
        return this.GetListUnActive(list);
    },

    GetListExtraUnActive() {
        let list = this.slotView.normalManager.listItemExtra;
        return this.GetListUnActive(list);
    },

    GetListUnActive(list) {
        let rs = [];
        for(let i = 0; i < list.length; i++) {
            if(list[i] != null) {
                if(!list[i].isShowPrize) {
                    rs[rs.length] = list[i];
                }
            }
        }
        return rs;
    },

    ProceduBonus() {
       
    },

    ProceduExtra() {
        
    },

    UpdateBonusTurn(bonusTurn, isActive) {
        
    },

    VibrateScreen() {
        this.isShake = true;
        this.scheduleOnce(()=>{
            this.isShake = false;
            this.slotView.node.setPosition(0,0);
        }, 0.2)
    },

    update (dt) {
        
    }
});
