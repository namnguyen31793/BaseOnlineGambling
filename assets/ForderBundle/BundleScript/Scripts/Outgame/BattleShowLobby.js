const List = require("../Utils/List");


cc.Class({
    extends: cc.Component,
    ctor() {
        this.isInvite = false;
        this.listCacheUser = new List();
        this.listTotal = new List();
    },

    properties: {
        table : [require("TableBattleView")],
        content : cc.Node,
    },

    Init() {
        if(!this.content.active)
            this.content.active = true;
        this.listTotal.Import(Global.infoLoginCollecsion);
    },

    ClickJoin() {
        if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		if(Global.LobbyView.isShowTutorial) {
			return;
		}
        this.CreateInvite();
    },

    CreateInvite() {
        if(this.config == null)
            return;
        if(Global.MainPlayerInfo.ingameBalance < 50000) {
            Global.UIManager.ShowGetMoneyPopup();
            // Global.UIManager.showConfirmPopup (Global.MyLocalization.GetText("NOT_ENOUGHT_BATTLE"), ()=>{
            //     Global.UIManager.showMiniLoading();
            //     Global.UIManager.ShowGetMoneyPopup();
            // });
            return;
        }
        let r = Global.RandomNumber(0,24);
        this.currentId = this.config[r].Id;
        if(Global.MainPlayerInfo.ingameBalance < this.config[r].BetValue) {
            this.CreateInvite();
            return;
        }
        let data = {};
        data[1] = this.currentId;
        require("SendRequest").getIns().MST_Client_Battle_Field_Register(data);
    },

    GetUser() {
        let check = true;
        let user = null;
        if(Global.infoLoginCollecsion.length > 101) {
            while(check) {
                let indexUser = Global.RandomNumber(0,this.listTotal.GetCount());
                user = this.listTotal.Get(indexUser);
                if(user.AccountId != Global.MainPlayerInfo.accountId) {
                    if(this.listCacheUser.Find(user.AccountId) == -1) {
                        check = false;
                        this.listTotal.RemoveAt(indexUser);
                        this.listCacheUser.Add(user.AccountId);
                    }
                }
            }
            if(this.listCacheUser.GetCount() >= 100) {
                for(let i = 0; i < Global.infoLoginCollecsion.length; i++) {
                    if(Global.infoLoginCollecsion[i].AccountId == this.listCacheUser.Get(0)) {
                        this.listTotal.Add(Global.infoLoginCollecsion[i]);
                        break;
                    }
                }
                this.listCacheUser.RemoveAt(0);
            }
            return user;
        } else {
            while(check) {
                let indexUser = Global.RandomNumber(1000,100000);
                if(indexUser != Global.MainPlayerInfo.accountId) {
                    user = {
                        AccountId : indexUser,
                        Nickname : "VipPlayer"+indexUser,
                    };
                    if(this.listCacheUser.Find(user.AccountId) == -1) {
                        check = false;
                        // this.listTotal.RemoveAt(indexUser);
                        this.listCacheUser.Add(user.AccountId);
                    }
                }
                
            }
            if(this.listCacheUser.GetCount() >= 100) {
                this.listCacheUser.RemoveAt(0);
            }
            return user;
            // return Global.infoLoginCollecsion[Global.RandomNumber(0,Global.infoLoginCollecsion.length)];
        }
    },

    UpdateConfig(config) {
        this.config = config;
        
    },

    update(dt) {
        if (Global.isConnect == true && this.isInvite == false) {
            this.isInvite = true;
            this.scheduleOnce(()=>{
                require("SendRequest").getIns().MST_Client_Battle_Field_Get_Config();
            } , 1);
            
        }
    },

    Test1() {
        for(let i = 0; i < this.table.length; i++) {
            this.table[i].test = true;
            console.log(this.table[i].index);
            console.log(this.table[i].user1);
            console.log(this.table[i].user2);
            console.log("----------------");
        }
        console.log(this.listCacheUser);
    },

    Test2() {
        for(let i = 0; i < this.table.length; i++) {
            this.table[i].test = false;
        }
    },
});
