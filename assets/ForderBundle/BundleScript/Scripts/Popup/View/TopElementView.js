cc.Class({
    extends: cc.Component,
    ctor() {
        this.info = null;
    },

    properties: {
        title : cc.Label,
        userInfo : require("UserTopView"),
        otherInfo : [require("UserTopView")],
    },

    initItem(info) {
        this.info = info;
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
        if(info[info.length-1].Nickname == Global.MainPlayerInfo.nickName) {
            this.userInfo.SetInfoUser(info[info.length-1]);
            info.length = info.length-1;
        } else {
            this.userInfo.SetInfoUser(null);
        }
        for(let i = 0; i < this.otherInfo.length; i++) {
            if(i < info.length ) {
                this.otherInfo[i].SetInfoOther(info[i]);
            } else {
                this.otherInfo[i].SetInfoOther(null);
            }
        }
    },

    ClickDetail() {
        Global.RankPopup.ShowDetail(this.info);
    },

});
