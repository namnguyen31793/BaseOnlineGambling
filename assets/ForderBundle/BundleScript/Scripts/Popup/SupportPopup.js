cc.Class({
    extends: cc.Component,

    properties: {
    },

    onClickClose(){
		this.node.getComponent(cc.Animation).play("HidePopup");
        this.scheduleOnce(()=>{
            this.node.active = false;
            Global.UIManager.hideMark();
        } , 0.2);
	},
	
	show(){
		Global.UIManager.hideMiniLoading();
		this.node.setSiblingIndex(this.node.parent.children.length-1);
		this.node.active = true;
		this.node.getComponent(cc.Animation).play("ShowPopup");
	},

    ClickTelegram() {
        cc.log(Global.ConfigLogin);
        cc.sys.openURL(Global.ConfigLogin.ZaloUrl);
    },

    ClickMessenger() {
        cc.sys.openURL(Global.ConfigLogin.HotSmsFanpage);
    },
	
    ClickFanpage() {
        cc.sys.openURL(Global.ConfigLogin.FanpageUrl);
    },

	onDestroy(){
		Global.SupportPopup = null;
	},

});
