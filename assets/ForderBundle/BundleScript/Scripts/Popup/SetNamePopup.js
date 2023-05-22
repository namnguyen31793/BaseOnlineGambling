
cc.Class({
    extends: cc.Component,

    properties: {
       inputNickName : cc.EditBox,
    },

    onClickConfirm(){
        let data = {};
		data[1] = this.inputNickName.string;
		require("SendRequest").getIns().MST_Client_Change_NickName(data);
        Global.UIManager.showMiniLoading();
        // this.event();
        // this.Hide();
	},
	
	show(name = "", event){
        Global.UIManager.hideMiniLoading();
		this.node.setSiblingIndex(this.node.parent.children.length-1);
		this.node.active = true;
		this.node.getComponent(cc.Animation).play("ShowPopup");
        cc.sys.localStorage.setItem(CONFIG.KEY_NEW_USER , 1);
		this.inputNickName.string = name;
		this.event = event;
	},

    GetResult(defaultDisplayName, messageError, isResult) {
        Global.UIManager.hideMiniLoading();
        if(isResult) {
            Global.MainPlayerInfo.nickName = this.inputNickName.string;
            Global.LobbyView.UpdateInfoView();
            this.Hide();
            this.event();
        } else {
            Global.UIManager.showCommandPopup(messageError);
        }
    },

    Hide() {
        this.node.getComponent(cc.Animation).play("HidePopup");
        this.scheduleOnce(()=>{
            this.node.active = false;
            Global.UIManager.hideMark();
        } , 0.2);
    },

    onDestroy(){
		Global.SetNamePopup = null;
	},

    // update (dt) {},
});
