
cc.Class({
    extends: cc.Component,
    properties: {
		inputUserNameLoginWeb: cc.EditBox,
		inputPassWordLoginWeb: cc.EditBox,
		inputUserNameLoginMobile: cc.EditBox,
		inputPassWordLoginMobile: cc.EditBox,
	
		loginObj: cc.Node,
	
		captchaLoginObj: cc.Node,
		captchaRegisterImg: cc.Node,
		captchaLoginImg: cc.Node,
		inputUserNameRegister: cc.EditBox,
		inputPassWordRegister: cc.EditBox,
		inputRePassWordRegister: cc.EditBox,
		inputCaptchaRegister: cc.EditBox,
		openMiniLogin: false,
		lbVersion : cc.Label,
		headerWeb : cc.Node,
		headerMobile : cc.Node,
	
	},
	onEnable(){
		this.getParamsFromHeader();
		Global.isShowSale = true;
		this.lbVersion.string = CONFIG.VERSION;
		this.GetInputLogin().string = cc.sys.localStorage.getItem(CONFIG.KEY_USERNAME) || "";
		this.GetInputPassword().string = cc.sys.localStorage.getItem(CONFIG.KEY_PASSWORD) || "";
		if (!cc.sys.isNative) {
			this.headerWeb.active = true;
			this.headerMobile.active = false;
			
		} else {
			this.headerWeb.active = false;
			this.headerMobile.active = true;
			if (cc.sys.os == cc.sys.OS_ANDROID) {
            } else if (cc.sys.os == cc.sys.OS_IOS) {

				
            }
		}
		
	
	},

	GetInputLogin() {
		if (!cc.sys.isNative) {
			return this.inputUserNameLoginWeb;
		} else {
			return this.inputUserNameLoginMobile;
		}
	},

	GetInputPassword() {
		if (!cc.sys.isNative) {
			return this.inputPassWordLoginWeb;
		} else {
			return this.inputPassWordLoginMobile;
		}
	},
	



    onClickBtnLogin() {
		// Global.AudioManager
		if(this.GetInputLogin().string.length < 6)
		{
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("USER_NAME_MIN_6"), null);
			return;
		}
		if(this.GetInputPassword().string.length < 6)
		{
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("PASS_WORD_MIN_6"), null);
			return;
		}
        this.requestLogin(this.GetInputLogin().string, this.GetInputPassword().string);
    },
	
	requestLogin(username, password){
		var data = {
		  AccountName: username,
		  Password: password,
		  MerchantId:"1",
		  Captcha: "",
		  Verify:this.veriLogin,
		  TimeCaptcha:this.timeLogin,
		  
		}
		Global.BaseNetwork.request(Global.ConfigLogin.LoginUrl, data, this.LoginAuthenProcess);
		Global.UIManager.showMiniLoading();
	},


	LoginAuthenProcess(data) {
		Global.UIManager.hideLoading();
		Global.UIManager.hideMiniLoading();
		var rs = JSON.parse(data);
		
		if(rs.c != 0)
		{
			if(rs.c == -101)
			{
				// Global.LoginView.captchaLoginObj.active = true;
				Global.LoginView.requestCaptchaLogin();
				Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_CAPTCHA"), null);
			}
			else if(rs.c != -54)
			{
				Global.UIManager.showCommandPopup(Global.MyLocalization.GetText(rs.m), null);
			}
			else
			{
				Global.CookieValue = rs.d.Cookie;
				Global.UIManager.showSetNamePopup(rs.d.AccountId, Global.LoginView.UpdateNickName);
			}
		}
		else
		{
			Global.LoginView.LoginSuccess(rs.d);
		}
		
	},
	

	UpdateNickName(accountName){
		var data = {
		  NewNickName: accountName,
		  Cookie: Global.CookieValue,
		}
		Global.BaseNetwork.request(Global.ConfigLogin.UpdateInfoUrl, data, Global.LoginView.LoginAuthenProcess);
		Global.UIManager.showMiniLoading();
	},
	
	LoginSuccess(data){
		cc.sys.localStorage.setItem(CONFIG.KEY_USERNAME , this.GetInputLogin().string);
		cc.sys.localStorage.setItem(CONFIG.KEY_PASSWORD , this.GetInputPassword().string);
		require("ScreenManager").getIns().currentScreen = Global.Enum.SCREEN_CODE.LOBBY;
		Global.CookieValue = data.Cookie;
		Global.UIManager.showLoading();
		Global.isLogin = true;
		let view = Global.LobbyView;

		view.Connect();
		
		view.loginPanel.active = false;
	
	},

	

	

    start () {
		
		Global.LoginView = this;
		Global.UIManager.hideLoading();
		Global.LobbyView.countLoad = 0;
    },
	
	onDestroy(){
		Global.LoginView = null;
	},


	

	getParamsFromHeader(){
		const location = window.location;
		cc.log(location.href);
		var params = location.href.split("?")[1];
		if(params == null)
			return;
		var parts = params.split("&");
		var result = {};
		for(var i = 0; i < parts.length; i++){
			var part = parts[i].split("=");
			result[part[0]] = part[1];
		}
		console.log("--------------------");
		console.log(result);
	},
});
