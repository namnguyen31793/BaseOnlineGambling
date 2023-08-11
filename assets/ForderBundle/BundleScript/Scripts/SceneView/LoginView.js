
cc.Class({
    extends: cc.Component,
    properties: {
	
		loginObj: cc.Node,
	
		openMiniLogin: false,
		lbVersion : cc.Label,
	
	},

	onEnable(){
		if(CONFIG.MERCHANT == "1") {
			this.getParamsFromHeaderSpinHub();
		}else{
			this.getParamsFromHeaderInet();
		}
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

	getParamsFromHeaderInet(){
		cc.log("getParamsFromHeaderInet ");
		Global.GameId = 19;
		Global.uitype = 1;
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
		if(result["ssoKey"] != null)
			Global.ssoKey = decodeURIComponent(result["ssoKey"])
		if(result["agent"] != null)
			Global.agent = parseInt(result["agent"])
		if(result["gameID"] != null)
			Global.GameId = parseInt(result["gameID"])
		if(result["platform"] != null)
			Global.platform = parseInt(result["platform"])
		if(result["ip"] != null)
			Global.ip = parseInt(result["ip"])
		if(result["deviceid"] != null)
			Global.deviceId = parseInt(result["deviceid"])
		if(result["uitype"] != null)
			Global.uitype = parseInt(result["uitype"])
		if(Global.ssoKey == null)
			return;
		//send request agent 0 để lay connect server 
        ApiController.RequestGetConnectInfoInet(0, result["encryptedData"], result["checksum"], (data) => {
            this.HandlelGetConnectInfo(data);
        }, this.ErrorCallBack);
	},

	getParamsFromHeaderSpinHub(){
		Global.GameId = 19;
		Global.uitype = 1;
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
		if(result["platform"] != null)
			Global.platform = parseInt(result["platform"])
		if(result["ip"] != null)
			Global.ip = parseInt(result["ip"])
		if(result["deviceid"] != null)
			Global.deviceId = parseInt(result["deviceid"])
		if(result["gameid"] != null)
			Global.GameId = parseInt(result["gameid"])
		if(result["uitype"] != null)
			Global.uitype = parseInt(result["uitype"])
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
