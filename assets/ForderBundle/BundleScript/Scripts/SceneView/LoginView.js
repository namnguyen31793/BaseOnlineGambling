
cc.Class({
    extends: cc.Component,
    properties: {
	
		loginObj: cc.Node,
	
		openMiniLogin: false,
		lbVersion : cc.Label,
	
	},

	onEnable(){
		this.getParamsFromHeader();
		this.lbVersion.string = CONFIG.VERSION;	
	},

    start () {
		Global.LoginView = this;
		//Global.UIManager.hideLoading();
		Global.LobbyView.countLoad = 0;
    },
	
	onDestroy(){
		Global.LoginView = null;
	},

	getParamsFromHeader(){
		const location = window.location;
		console.log(location.href);
		var params = location.href.split("?")[1];
		if(params == null ||params == "")
			return;
		var parts = params.split("&");
		var result = {};
		for(var i = 0; i < parts.length; i++){
			var part = parts[i].split("=");
			result[part[0]] = part[1];
		}
		console.log("--------------------");
		console.log(result);
		if(result["encryptedData"] == null && result["checksum"] == null && result["agent"] == null){
			//showloading need login
			return;
		}
		if(result["encryptedData"] != null)
			Global.encryptedData = decodeURIComponent(result["encryptedData"])
		if(result["checksum"] != null)
			Global.checksum = decodeURIComponent(result["checksum"])
		if(result["agent"] != null)
			Global.agent = parseInt(result["agent"])
		//send request api
        ApiController.RequestGetConnectInfo(result["agent"], result["encryptedData"], result["checksum"], (data) => {
            this.HandlelGetConnectInfo(data);
        }, this.ErrorCallBack);
	},

	HandlelGetConnectInfo(data){
		//success call LoginSuccess
		if(data == "null" || data == ""){
			Global.UIManager.showCommandPopup("THÔNG TIN KHÔNG HỢP LỆ", () => {
            });
        }else{
            console.log("HandlelGetConnectInfo "+data);
            Global.GetServerLogicAddress = data[0];
            Global.CookieValue = data[1];
			this.LoginSuccess();
        }
	},
	
	LoginSuccess(){
		require("ScreenManager").getIns().currentScreen = Global.Enum.SCREEN_CODE.LOBBY;
		Global.UIManager.showLoading();
		Global.isLogin = true;
		let view = Global.LobbyView;
		view.Connect();
		view.loginPanel.active = false;
	},

    ErrorCallBack(errorCode, message) {
        if (errorCode == 500)
        {
            Global.UIManager.showCommandPopup(message, () => {
                this.inputPass.focus();
            });
        }
        else if (errorCode == 50)
        {
            Global.UIManager.showCommandPopup(message, () => {
                this.inputUser.focus();
            });
        }
    },
});
