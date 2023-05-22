const List = require("../Utils/List");
cc.Class({
    extends: cc.Component,
    ctor() {
        this.listResult = [];
        this.listCacheUser = new List();
        this.listTotal = new List();
    },

    properties: {
        listUser : [require("UserRoomSlot")],
    },

    start () {
        if(Global.isTutorial != 0 || Global.dataBattle != null) {
            this.node.active = false;
            return
        }
        this.CreateListSpin();
        this.listTotal.Import(Global.infoLoginCollecsion);
        for(let i = 0; i < this.listUser.length; i++) {
            this.listUser[i].Init(this);
        }
        let r = Global.RandomNumber(2,this.listUser.length);
        for(let i = 0; i < r; i++) {
            this.listUser[i].SetUser(this.GetUser().AccountId,this.RandomMoney());
        }
    },

    CreateUser(view) {
        view.SetUser(this.GetUser().AccountId,Global.RandomNumber(60,230000)*5000);
    },

    ClickBtnAdd() {
        Global.UIManager.ShowListInviteUser(this);
    },

    InviteUser(user) {
        for(let i = 0; i < this.listUser.length; i++) {
            if(!this.listUser[i].toggle.isChecked) {
                this.listUser[i].SetUser(user.AccountId, this.RandomMoney());
                return;
            }
        }
    },

    CheckNoneUser() {
        for(let i = 0; i < this.listUser.length; i++) {
            if(this.listUser[i].toggle.isChecked) {
                return;
            }
        }
        this.listUser[0].SetUser(this.GetUser().AccountId,this.RandomMoney());
    },

    GetResult() {
        let r = Global.RandomNumber(0, this.listResult.length);
        return this.listResult[r];
    },

    CreateListSpin() {
        let data1 = {
            time : 2,
            win : 0,
            type : 0,
        }
        if(Global.SlotNetWork.slotView.slotType == 28) {
           //miss
           for(let i = 0; i < 200; i++) {
                this.listResult.push(data1);
            }
            //win
            for(let i = 0; i < 20; i++) {
                let data2 = {
                    time : 3.5,
                    win : 0.2 + i*0.2,
                    type : 1,
                }
                this.listResult.push(data2);
            }
            //big win
            for(let i = 0; i < 10; i++) {
                let data2 = {
                    time : 4.5+Global.RandomNumber(0,41)/10,
                    win : 6 + 0.3 * Global.RandomNumber(0,100) ,
                    type : 2,
                }
                this.listResult.push(data2);
            }
            //special
            for(let i = 0; i < 2; i++) {
                let data2 = {
                    time : 27+Global.RandomNumber(0,201)/10,
                    win : 14 + 0.3 * Global.RandomNumber(0,100) ,
                    type : 3,
                }
                this.listResult.push(data2);
            }
        } else {
            //miss
            for(let i = 0; i < 80; i++) {
                this.listResult.push(data1);
            }
            //win
            for(let i = 0; i < 55; i++) {
                let data2 = {
                    time : 3.5,
                    win : 0.2 + i*0.2,
                    type : 1,
                }
                this.listResult.push(data2);
            }
            //big win
            for(let i = 0; i < 10; i++) {
                let data2 = {
                    time : 4.5+Global.RandomNumber(0,41)/10,
                    win : 6 + 0.3 * Global.RandomNumber(0,30) ,
                    type : 2,
                }
                this.listResult.push(data2);
            }
            //special
            for(let i = 0; i < 3; i++) {
                let data2 = {
                    time : 27+Global.RandomNumber(0,201)/10,
                    win : 8 + 0.3 * Global.RandomNumber(0,30) ,
                    type : 3,
                }
                this.listResult.push(data2);
            }
        }
       
    },

    CheckUserInRoom(accountId) {
        for(let i = 0; i < this.listUser.length; i++) {
            if(accountId == this.listUser[i].userId) {
                return false;
            }
        }
        return true;
    },

    GetUser() {
        let check = true;
        let user = null;
        if(Global.infoLoginCollecsion.length > 101) {
            while(check) {
                let indexUser = Global.RandomNumber(0,this.listTotal.GetCount());
                user = this.listTotal.Get(indexUser);
                if(user.AccountId != Global.MainPlayerInfo.accountId && this.CheckUserInRoom()) {
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
                if(indexUser != Global.MainPlayerInfo.accountId && this.CheckUserInRoom()) {
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
            cc.log(user);
            return user;
            // return Global.infoLoginCollecsion[Global.RandomNumber(0,Global.infoLoginCollecsion.length)];
        }
    },

    RandomMoney() {
        let r = Global.RandomNumber(0,100);
        if(r < 40) {
            return Global.RandomNumber(60,800)*5000;
        } else if(r<60) {
            return Global.RandomNumber(600,8000)*5000;
        } else if(r < 80) {
            return Global.RandomNumber(2000,80000)*5000;
        } else if(r < 90) {
            return Global.RandomNumber(20000,230000)*5000;
        } else {
            return Global.RandomNumber(100000,500000)*5000;
        }
    },
});
