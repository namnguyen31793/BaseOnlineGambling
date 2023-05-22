cc.Class({
    extends: cc.Component,

    ctor() {
        this.slotView = null;
    },

    properties: {
        PlayerView : require("SlotRpg_CharacterElementUI"),
        OtherView : require("SlotRpg_CharacterElementUI"),
        effectCurrentTurn : cc.Node,
    },
    
    Init(slotView) {
        this.slotView = slotView;
    },

    SetupUI(playerData, otherData){
        this.PlayerView.Init(playerData, this.slotView.MaxHp);
        this.OtherView.Init(otherData, this.slotView.MaxHp);
    },

    UpdateInfo(playerData, otherData){
        cc.log(playerData);
        cc.log(otherData);
        // this.PlayerView.UpdateInfo(playerData, this.slotView.MaxHp);
        // this.OtherView.UpdateInfo(otherData, this.slotView.MaxHp);
        let waitTime = 0;
        if(playerData.lastTurn != null) {
            this.PlayerView.UpdateCountAttack(playerData.Point_Attack);
            this.scheduleOnce(()=>{
                if(playerData.Point_Attack != this.PlayerView.countAttack) {
                    if(playerData.Point_Attack > this.PlayerView.countAttack) {
                        //effect up count
                    }
                    this.scheduleOnce(()=>{
                        this.PlayerView.UpdateCountAttack(playerData.Point_Attack);
                    }, 1);
                }
                if(playerData.lastTurn.DF > 0) {
                    this.PlayerView.BuffDef(playerData.lastTurn.DF);
                    waitTime += 0.85;
                } else {
                    this.PlayerView.ResetDef();
                }
                if(playerData.lastTurn.HE > 0) {
                    this.PlayerView.Heal(playerData, this.slotView.MaxHp, waitTime);
                    waitTime += 0.85;
                }
                if(playerData.lastTurn.DA > 0) {
                    this.PlayerView.Attack("SlashMelee1H", waitTime);
                    this.OtherView.OnHit(otherData, this.slotView.MaxHp, waitTime);
                    waitTime += 1.2;
                } else {
                    this.OtherView.ResetDef();
                }
                this.scheduleOnce(()=>{
                    this.ShowEffectCurrentTurn(false);
                    this.slotView.toDoList.DoWork();
                }, waitTime);
            }, 0.3);
        }
        if(otherData.lastTurn != null) {
            if(otherData.Point_Attack != this.OtherView.countAttack) {
                if(otherData.Point_Attack > this.OtherView.countAttack) {
                    //effect up count
                }
                this.scheduleOnce(()=>{
                    this.OtherView.UpdateCountAttack(otherData.Point_Attack);
                }, 1);
            }
            this.scheduleOnce(()=>{
                if(otherData.lastTurn.DF > 0) {
                    this.OtherView.BuffDef(otherData.lastTurn.DF);
                    waitTime += 0.85;
                } else {
                    this.OtherView.ResetDef();
                }
                if(otherData.lastTurn.HE > 0) {
                    this.OtherView.Heal(otherData, this.slotView.MaxHp, waitTime);
                    waitTime += 0.85;
                }
                if(otherData.lastTurn.DA > 0) {
                    this.OtherView.Attack("Cast1H", waitTime);
                    this.PlayerView.OnHit(playerData, this.slotView.MaxHp, waitTime);
                    waitTime += 1.2;
                } else {
                    this.PlayerView.ResetDef();
                }
                this.scheduleOnce(()=>{
                    this.slotView.toDoList.DoWork();
                }, waitTime);
            }, 0.3);
        }
    },

    ShowEffectCurrentTurn(isUser = true) {
        if(!this.slotView.isPlaySpin) {
            this.effectCurrentTurn.active = true;
            if(isUser) {
                this.effectCurrentTurn.x = -305;
            } else {
                this.effectCurrentTurn.x = 275;
            }
        }
    },

    HideEffectCurrentTurn() {
        this.effectCurrentTurn.active = false;
    },
});
