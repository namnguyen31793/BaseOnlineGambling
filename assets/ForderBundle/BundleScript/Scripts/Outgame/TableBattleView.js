cc.Class({
    extends: cc.Component,
    ctor() {
        this.status = 0;
        this.countTime = 0;
        this.target = 0;
        this.startPos = null;
        this.TIME_STATE_1 = 5;
        this.TIME_STATE_2 = 3;
        this.TIME_STATE_3 = 3;
        this.user1 = null;
        this.user2 = null;
        this.test = false;
    },

    properties: {
        ava : [cc.Sprite],
        lbName : [cc.Label],
        iconGame : cc.Sprite,
        iconState : [cc.Node],
        anim : cc.Animation,
        index : 0,
    },

    start() {
        /*
        this.startPos = this.node.getPosition();
        this.countTime = Global.RandomNumber(0,10);
        this.CreateNewState();
        */
    },

    ClickJoin() {

    },

    CreateInfo() {
        let r = Global.RandomNumber(0,3);
        this.user1 = Global.LobbyView.battleShowLobby.GetUser();
        this.user2 = Global.LobbyView.battleShowLobby.GetUser();

        this.lbName[0].string = Global.Helper.formatName(this.user1.Nickname,4);
        this.lbName[1].string = Global.Helper.formatName(this.user2.Nickname,4);
        let current = this;
        Global.Helper.GetAvataOtherById(this.ava[0], this.user1.AccountId);
        Global.Helper.GetAvataOtherById(this.ava[1], this.user2.AccountId);

        Global.Helper.GetIconGame(this.iconGame,19+r);
    },

    CreateNewState() {
        this.CreateInfo();
        let r = Global.RandomNumber(0,60);
        if(r < 20) {
            this.target = this.TIME_STATE_1 + Global.RandomNumber(0,50)/10;
            this.status = 1;//1 player - waiting
            this.anim.play("ShowTableBattle");
            this.SetUIState1();
        } else if(r < 40) {
            this.target = this.TIME_STATE_2 + Global.RandomNumber(0,50)/10;
            this.status = 2//2 player - waiting
            this.SetUIState2();
        } else {
            this.target = this.TIME_STATE_3 + Global.RandomNumber(0,50)/10;
            this.status = 3//2 player - playing
            this.SetUIState3();
        }
    },

    SetUIState1() {
        this.SetWaiting();
        this.lbName[1].node.active = false;
        this.ava[1].node.active = false;
        Global.Helper.GetAvataOtherById(this.ava[0], this.user1.AccountId);
    },

    SetUIState2() {
        this.SetWaiting();
        this.lbName[1].node.active = true;
        this.ava[1].node.active = true;
        Global.Helper.GetAvataOtherById(this.ava[0], this.user1.AccountId);
        Global.Helper.GetAvataOtherById(this.ava[1], this.user2.AccountId);
    },

    SetUIState3() {
        this.SetPlaying();
        this.lbName[1].node.active = true;
        this.ava[1].node.active = true;
        Global.Helper.GetAvataOtherById(this.ava[0], this.user1.AccountId);
        Global.Helper.GetAvataOtherById(this.ava[1], this.user2.AccountId);
    },


    SetWaiting() {
        this.iconState[0].active = true;
        this.iconState[1].active = false;
    },

    SetPlaying() {
        this.iconState[0].active = false;
        this.iconState[1].active = true;
    },

    update(dt) {
        if(!this.test)
            this.countTime += dt;
        if(this.countTime >= this.target && this.status > 0) {
            this.status += 1;
            if(this.status == 2) {
                this.SetUIState2();
            } else if(this.status == 3) {
                this.SetUIState3();
            }
            this.countTime = 0;
            if(this.status > 3) {
                this.status = 0;
                if(this.index %2==0) {
                    this.anim.play("TableBattleMoveLeft");
                } else {
                    this.anim.play("TableBattleMoveRight");
                }
                this.scheduleOnce(()=>{
                    this.node.setPosition(this.startPos);
                    this.node.scale = 0;
                    this.anim.play("ShowTableBattle");
                    this.status = 1;
                    this.CreateInfo();
                    this.SetUIState1();
                } , 0.6);
            }
        }
    },

   
});
