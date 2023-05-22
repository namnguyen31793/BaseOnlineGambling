

cc.Class({
    extends: cc.Component,
    ctor() {
        this.userInRoom = null;
        this.user = null;
    },

    properties: {
        ava : cc.Sprite,
        nation : cc.Sprite,
        lbName : cc.Label,
        btnInvite : cc.Button,
    },

    ClickInvite() {
        this.btnInvite.interactable = false;
        let check = Global.RandomNumber(5,11);
        let r = Global.RandomNumber(0,100);
        if(r < check) {
            this.scheduleOnce(this.actionUser = ()=>{
                this.userInRoom.InviteUser(this.user);
            } ,Global.RandomNumber(1,4));
        }
    },

    Init(user, userInRoom) {
        this.userInRoom = userInRoom;
        this.user = user;
        Global.Helper.GetAvataOtherById(this.ava, user.AccountId);
        Global.Helper.GetNationRandom(this.nation, user.AccountId);
        let str = "";
        if(user.Nickname <= 13) {
            for(let i = 0; i < user.Nickname.length-1; i++) {
                str += user.Nickname[i];
            }
        } else {
            for(let i = 0; i < 12; i++) {
                str += user.Nickname[i];
            }
        }
        str += "xxx";
        this.lbName.string = str;
        this.btnInvite.interactable = true;
    },
   
});
