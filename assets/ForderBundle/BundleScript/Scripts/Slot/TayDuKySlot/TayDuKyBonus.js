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
    },

    ctor() {
        this.listBonus = [];
        this.indexBonus = 0;
        this.time = 0;
        this.isCountTime = false;
        this.bonusValue = 0;
        this.toDoList = null;
    },

    ShowBonusGame(listBonus, bonusValue, toDoList) {
        this.listBonus = listBonus;
        this.indexBonus = 0;
        this.time = 20;
        this.isCountTime = true;
        this.nodeTime.active = true;
        this.bonusValue = bonusValue;
        this.toDoList = toDoList;
        this.node.active = true;
    },

    ClickValueBonus(){
        if(this.indexBonus == this.listBonus.length)
            return;
        this.isCountTime = false;
        this.nodeTime.active = false;
        //show win by index 
        let valueWin = this.listBonus[this.indexBonus];
        //show effect

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
        this.lbCountTime.string = this.time;
    },

    EndBonus(bonusValue) {
        //show wim all bonus
        this.scheduleOnce(()=>{
            this.toDoList.DoWork();
            this.Hide();
        } , 2);
    },

    Hide(){
        this.listBonus = [];
        this.indexBonus = 0;
        this.time = 0;
        this.isCountTime = false;
        this.nodeTime.active = false;
        this.bonusValue = 0;
        this.toDoList = null;
        this.node.active = false;
    },
});
