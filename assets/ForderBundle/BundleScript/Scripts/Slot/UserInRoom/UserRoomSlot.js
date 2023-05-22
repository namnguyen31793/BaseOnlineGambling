cc.Class({
    extends: cc.Component,
    ctor() {
        this.balance = 0;
        this.listUser = null;
        this.result = null;
        this.countTime = 0;
        this.timeShow = 0;
        this.runTime = false;
        this.isShow = false;
        this.betValue = 0;
        this.actionUser = null;
        this.userId = 0;
    },

    properties: {
        toggle : cc.Toggle,
        ava : cc.Sprite,
        nation : cc.Sprite,
        lbMoney : cc.Label,
        animText : sp.Skeleton,
    },

    start() {
        this.animText.node.active = false;
    },

    ProcessCreateUser() {
        this.unschedule(this.actionUser);
        this.scheduleOnce(this.actionUser = ()=>{
            if(!this.toggle.isChecked) {
                this.listUser.CreateUser(this);
            }
        } ,Global.RandomNumber(150,300));
    },

    ProcessDestroyUser() {
        this.unschedule(this.actionUser);
        this.scheduleOnce(this.actionUser = ()=>{
            if(this.toggle.isChecked) {
                this.toggle.isChecked = false;
                this.runTime = false;
                this.animText.node.active = false;
                this.listUser.CheckNoneUser();
            }
            this.ProcessCreateUser();
        } ,Global.RandomNumber(150,300));
    },

    Init(listUser) {
        this.listUser = listUser;
        this.toggle.isChecked = false;
        this.animText.node.active = false;
        this.ProcessCreateUser();
    },

    SetUser(accountId, money) {
        this.toggle.isChecked = true;
        this.userId = accountId;
        Global.Helper.GetAvataOtherById(this.ava, accountId);
        Global.Helper.GetNationRandom(this.nation, accountId);
        this.balance = money;
        this.UpdateMoney();

        let listMultiRoom = Global.SlotRoomMuitlConfig;
        cc.log(listMultiRoom);
        for(let i = 0; i <  listMultiRoom.length; i++){
            if(listMultiRoom[i].GameId == Global.SlotNetWork.slotView.slotType){
                this.listBet = [];
                let model = JSON.parse(listMultiRoom[i].RoomMultiInfo);
                for(let j = 0; j < model.length; j++){
                    this.listBet[model[j].RoomBetId-1] = model[j].Bet;
                }
                break;
            }
        }
        this.betValue = this.listBet[0];
        for(let i = this.listBet.length-1; i > 0; i--) {
            if(this.balance >= this.listBet[i]*100) {
                this.betValue = this.listBet[i];
                break;
            }
        }
        this.GetResult();
        this.ProcessDestroyUser();
       
    },

    GetResult() {
        if(this.betValue > this.balance) {
            this.scheduleOnce(()=>{
                this.toggle.isChecked = false;
                this.runTime = false;
                this.animText.node.active = false;
                this.ProcessCreateUser();
                this.listUser.CheckNoneUser();
            } ,3);
            return;
        }
        this.balance -= this.betValue;
        this.UpdateMoney();
        this.result = this.listUser.GetResult();
        this.runTime = true;
        this.countTime = this.result.time;
        if(this.result.type != 3)
            this.timeShow = this.countTime - 2;
        else {
            this.timeShow = this.countTime - (3.5+Global.RandomNumber(0,41)/10);
        }
        this.isShow = false;
    },

    UpdateMoney() {
        this.lbMoney.string = Global.Helper.formatNumberLong(this.balance);
    },

    update(dt) {
        if(this.runTime) {
            this.countTime -= dt;
            if(this.countTime <= this.timeShow && !this.isShow) {
                this.isShow = true;
                if(this.result.win > 0) {
                    this.lbMoney.node.scale = 2;
                    this.lbMoney.node.runAction(cc.scaleTo(0.3, 1));
                    this.balance += this.result.win*this.betValue;
                    
                    this.showText = false;
                    if(this.result.type == 2) {
                        this.showText = true;
                        this.animText.setSkin("textbigwin");
                    } 
                    if(this.result.type == 3) {
                        this.showText = true;
                        this.animText.setSkin("textspecial");
                        this.scheduleOnce(()=>{
                            this.UpdateMoney();
                        } ,this.countTime);
                    } else {
                        this.UpdateMoney();
                    }
                    if(this.showText) {
                        this.animText.node.active = true;
                        this.animText.setAnimation(0, 'xuat hien', false);
                        this.scheduleOnce(()=>{
                            this.animText.setAnimation(0, 'waiting', true);
                        } ,0.8);
                    }
                }
                //show effect
            } 
            if(this.countTime <= 0) {
                this.GetResult();
                if(this.showText) {
                    this.animText.setAnimation(0, 'bien mat', false);
                    this.scheduleOnce(()=>{
                        this.animText.node.active = false;
                    } ,0.8);
                }
            }
        }
    },

    
});
