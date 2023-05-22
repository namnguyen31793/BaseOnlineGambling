cc.Class({
    extends: cc.Component,

    properties: {
        btnTurnOnMusic : cc.Node,
        btnTurnOffMusic : cc.Node,
        content : cc.Node,
    },

    ShowSettingLobby() {
        this.content.active = true;
        
    },

    Init() {
        let isMusic = cc.sys.localStorage.getItem(CONFIG.KEY_MUSIC+"123465") || 1;
        cc.log("save music:"+isMusic);
        if(isMusic > 0) {
            this.TurnOnMusic();
        } else {
            this.TurnOffMusic();
        }
    },

    HideSettingLobby() {
        this.content.active = false;
    },

    TurnOnMusic() {
        this.btnTurnOnMusic.active = true;
        this.btnTurnOffMusic.active = false;
        Global.AudioManager.ChangeValueMusic(1);
        Global.AudioManager.ChangeValueSound(1);
    },

    TurnOffMusic() {
        this.btnTurnOnMusic.active = false;
        this.btnTurnOffMusic.active = true;
        Global.AudioManager.ChangeValueMusic(0);
        Global.AudioManager.ChangeValueSound(0);
    },

    OnBack() {
		Global.AudioManager.ClickButton();
		if(!Global.isConnect) {
			Global.isLogin = false;
			this.BackEvent();
		} else {
			Global.UIManager.showConfirmPopup(Global.MyLocalization.GetText("QUIT_GAME"), this.BackEvent, null);
		}
	},

    BackEvent() {
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                let className = "org/cocos2dx/javascript/AppActivity";
                let methodName = "facebookLogout";
                let methodSignature = "()V";
                jsb.reflection.callStaticMethod(className, methodName, methodSignature);
            }
        }

		Global.CookieValue = null;
		Global.isLogin = false;
        Global.isShowStart = false;
        Global.MainPlayerInfo.spriteAva = null;
        cc.sys.localStorage.setItem("FAST_LOGIN" , 0);
		require("ScreenManager").getIns().lastScreen = 0;
		require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.LOGIN);
	},
});
