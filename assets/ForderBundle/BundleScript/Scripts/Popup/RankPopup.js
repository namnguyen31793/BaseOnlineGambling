cc.Class({
    extends: cc.Component,
    ctor() {
        this.count = 0;
        this.listTop = [];
    },

    properties: {
        srcView : require("BaseScrollView"),
        userView : require("BaseScrollView"),
        topInfo : [require("UserTopView")],
        title : cc.Label,
        anim : cc.Animation,
    },

    show() {
        this.node.setSiblingIndex(this.node.parent.children.length-1);
        this.node.active = true;
        Global.UIManager.showMiniLoading();
        this.count = 0;
        let data = {};
		data[1] = 19;
        require("SendRequest").getIns().MST_Client_Event_Score_Get_Top_Player_By_Game(data);
		data[1] = 20;
        require("SendRequest").getIns().MST_Client_Event_Score_Get_Top_Player_By_Game(data);
		data[1] = 21;
        require("SendRequest").getIns().MST_Client_Event_Score_Get_Top_Player_By_Game(data);
		data[1] = 22;
        require("SendRequest").getIns().MST_Client_Event_Score_Get_Top_Player_By_Game(data);
        data[1] = 23;
        require("SendRequest").getIns().MST_Client_Event_Score_Get_Top_Player_By_Game(data);
        require("SendRequest").getIns().MST_Client_Event_Score_Get_Top_Player();
    },

    showInGame(gameType) {
        this.node.setSiblingIndex(this.node.parent.children.length-1);
        this.node.active = true;
        let data = {};
		data[1] = gameType;
        require("SendRequest").getIns().MST_Client_Event_Score_Get_Top_Player_By_Game(data);
    },

    GetTopPlayerWorld(data) {
        data.GameType = 0;
        for(let i = 0; i < data.length; i++) {
            if(data[i].Nickname == Global.MainPlayerInfo.nickName) {
                data[data.length] = data[i];
                break;
            }
                
        }
        this.listTop[0] = data;
        this.count += 1;
        this.CheckUpdateTop();
    },

    GetTopPlayerGame(gameType, data) {
        data.GameType = gameType;
        this.listTop[gameType] = data;
        if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY) {
            this.count += 1;
            this.CheckUpdateTop();
        } else {
            if(data[data.length-1].Nickname == Global.MainPlayerInfo.nickName) {
                data.length = data.length-1;
            }
            this.ShowDetail(data);
        }
        
    },

    CheckUpdateTop() {
        if(this.count == 6) {
            Global.UIManager.hideMiniLoading();
            let data = [];
            for(let info in this.listTop) {
                data[data.length] = this.listTop[info];
            }
            this.srcView.init(data , 6*257 , 257);
        }
    },

    ShowDetail(info) {
        if(info.GameType == 0) {
            this.title.string = Global.MyLocalization.GetText("RANK_GAME");
        } else if(info.GameType == 19) {
            this.title.string = Global.MyLocalization.GetText("DRAGON_GAME");
        } else if(info.GameType == 20) {
            this.title.string = Global.MyLocalization.GetText("MAYA_GAME");
        } else if(info.GameType == 21) {
            this.title.string = Global.MyLocalization.GetText("QUEEN_GAME");
        } else if(info.GameType == 22) {
            this.title.string = Global.MyLocalization.GetText("ZEUS_GAME");
        } else if(info.GameType == 23) {
            this.title.string = Global.MyLocalization.GetText("HADES_GAME");
        }
        for(let i = 0; i < 3; i++) {
            if(i < info.length) {
                this.topInfo[i].SetInfoOther(info[i]);
            } else {
                this.topInfo[i].SetInfoOther(null);
            }
        }
        let list = [];
        for(let i = 3; i < info.length; i++) {
            info[i].Position = i+1; 
            list[list.length] = info[i];
        }
        this.userView.resetScr();
        this.userView.init(list , list.length*104 , 104);
        if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY) {
            this.anim.play("ShowDetailTop");
        } else {
            Global.UIManager.hideMiniLoading();
        }
        
    },

    HideDetail() {
        this.anim.play("HideDetailTop");
    },

    Hide() {
        this.node.active = false;
		Global.UIManager.hideMark();
    },

    formatTime(str) {
        return require("SyncTimeControl").getIns().convertTimeToString2((new Date(str)).getTime());
    },

    onDestroy() {
        Global.RankPopup = null;
    },
    
});
