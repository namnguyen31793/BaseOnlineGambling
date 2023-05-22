
cc.Class({
    extends: cc.Component,
    properties: {
		inputUserNameLoginWeb: cc.EditBox,
		inputPassWordLoginWeb: cc.EditBox,
		inputUserNameLoginMobile: cc.EditBox,
		inputPassWordLoginMobile: cc.EditBox,
		inputCaptchaLogin: cc.EditBox,
		loginObj: cc.Node,
		registerObj: cc.Node,
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
		btnLoginFb : cc.Node,
		btnLoginFb2 : cc.Node,
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
			if ("undefined" === typeof FB) {
				this.load_Facebook_SDK();
			} else {
			}
		} else {
			this.headerWeb.active = false;
			this.headerMobile.active = true;
			if (cc.sys.os == cc.sys.OS_ANDROID) {
            } else if (cc.sys.os == cc.sys.OS_IOS) {

				jsb.reflection.callStaticMethod("AppController",
					"initFacebook:", "loginFB");
            }
		}
		// let dataSave= cc.sys.localStorage.getItem("FAST_LOGIN") || 0;
		// if(dataSave == 1) {
		// 	this.requestFastLogin();
		// }
		if(CONFIG.VERSION == "1.0.2" || CONFIG.VERSION == "1.0.3"){
			if(this.btnLoginFb != null){
				this.btnLoginFb.active = false;
			}
			if(this.btnLoginFb2 != null){
				this.btnLoginFb2.active = false;
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
	
	requestCaptchaRegister(){
		var data = {
		 
		}
		Global.BaseNetwork.request(Global.ConfigLogin.AuthenGetCaptchaUrl, data, this.reviceCapchaRegister);
	},
	
	requestCaptchaLogin(){
		var data = {
		 
		}
		Global.BaseNetwork.request(Global.ConfigLogin.AuthenGetCaptchaUrl, data, this.reviceCapchaLogin);
	},
	
	reviceCapchaRegister(_data){
		var capcha = JSON.parse(_data);
        Global.LoginView.base64 = capcha.d[0];
        Global.LoginView.veriRes = capcha.d[1];
        Global.LoginView.timeRes = capcha.d[2];
		Global.LoginView.createCaptchaRegister(Global.LoginView.base64);
    },
	
	reviceCapchaLogin(_data){
		var capcha = JSON.parse(_data);
        Global.LoginView.base64 = capcha.d[0];
        Global.LoginView.veriLogin = capcha.d[1];
        Global.LoginView.timeLogin = capcha.d[2];
		Global.LoginView.createCaptchaLogin(Global.LoginView.base64);
	 
    },
	
	createCaptchaRegister(base64) {
		
		Global.BaseNetwork.getCapcha(base64 , this.captchaRegisterImg);
	},
	
	createCaptchaLogin(base64) {
		
		Global.BaseNetwork.getCapcha(base64 , this.captchaLoginImg);
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

	requestFastLogin() {
		cc.sys.localStorage.setItem("FAST_LOGIN" , 1);
		Global.UIManager.showLoading();
		var data = {
			AccountName: Global.deviceId,
			MerchantId:"1",
			Captcha: "",
			Verify:this.veriLogin,
			TimeCaptcha:this.timeLogin,
		  }
		  Global.BaseNetwork.request(Global.ConfigLogin.FastLoginUrl, data, this.LoginAuthenProcess);
	},
	
	onClickChangeRegister(){
		// this.loginObj.active = false;
		this.registerObj.active = true;
		this.requestCaptchaRegister();
		
	},
	
	onClickChangeLogin(){
		// this.loginObj.active = true;
		this.registerObj.active = false;
	},

	onClickCloseRegister() {
		this.registerObj.active = false;
	},
	
	onClickConfirmRegister(){
		if(this.inputUserNameRegister.string.length < 6)
		{
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("USER_NAME_MIN_6"), null);
			return;
		}
		if(this.inputPassWordRegister.string.length < 6)
		{
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("PASS_WORD_MIN_6"), null);
			return;
		}
		if(/\s/g.test(this.inputPassWordRegister.string) == true) 
		{
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("PASS_WORD_SPACE"), null);
            return;
		}
		if (/^[a-zA-Z0-9]*$/.test(this.inputPassWordRegister.string) == false) 
		{
            Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("PASS_WORD_SPECIAL"), null);
            return;
        }
		if(this.inputPassWordRegister.string != this.inputRePassWordRegister.string)
		{
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("PASS_WORD_NOT_SAME"), null);
			return;
		}
		
		var data = {
		  AccountName: this.inputUserNameRegister.string,
		  Password: this.inputPassWordRegister.string,
		  MerchantId:"1",
		  Captcha:this.inputCaptchaRegister.string,
		  Verify:this.veriRes,
		  TimeCaptcha:this.timeRes,
		}
		Global.BaseNetwork.request(Global.ConfigLogin.RegisterUrl, data, this.ReceiveRegister);
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
	
	ReceiveRegister(data){
		Global.UIManager.hideMiniLoading();
		var rs = JSON.parse(data);
		if(rs.c != 0)
		{
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText(rs.m), null);
		}
		else
		{
			Global.LoginView.GetInputLogin().string = Global.LoginView.inputUserNameRegister.string;
			Global.LoginView.GetInputPassword().string = Global.LoginView.inputPassWordRegister.string;
			Global.LoginView.onClickChangeLogin();
			Global.LoginView.requestLogin(Global.LoginView.inputUserNameRegister.string, Global.LoginView.inputPassWordRegister.string);
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
		view.header.active = true;
		view.loginPanel.active = false;
		// Global.LobbyView.miniButton.active = true;
	},

	load_Facebook_SDK() {
		if (!cc.sys.isBrowser) {
		} else {
			var check_SDK_Exist = true;
			var temp = setInterval(function () {
				if (!check_SDK_Exist) {
					clearInterval(temp);
					return;
				}
	
				if (document.getElementById('fb-root')) {
					check_SDK_Exist = false;
					Global.LoginView.InitFacebookSdk();
				}
			}, 500);
	
			(function (d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) return;
				js = d.createElement(s);
				js.id = id;
				js.src = "https://connect.facebook.net/vi_VN/sdk.js";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));
		}
	},

	InitFacebookSdk() {
		if(CONFIG.MERCHANT == 2) {
			FB.init({
				appId: '870866300741744',
				cookie: true, // enable cookies to allow the server to access 
				xfbml: true, // parse social plugins on this page
				version: 'v3.2' // The Graph API version to use for the call
			});
        } else if(CONFIG.MERCHANT == 3) {
			FB.init({
				appId: '901983600926285',
				cookie: true, // enable cookies to allow the server to access 
				xfbml: true, // parse social plugins on this page
				version: 'v3.2' // The Graph API version to use for the call
			});
        }
	},
	OnFbStatusChangeCallback(response) {
		if (response.status === 'connected') {
			// Logged into your app and Facebook.
		} else {
			// The person is not logged into your app or we are unable to tell.
		}
	},
	CheckLFbLoginState() {
		FB.getLoginStatus(function (response) {
			this.OnFbStatusChangeCallback(response);
		});
	},

	SignInFb() {
		if (!cc.sys.isNative) {
			FB.login(function (response) {
				// handle the response
				if (response.status === 'connected') {
					// Logged into your app and Facebook.
					var userId = response.authResponse.userID;
					var accessToken = response.authResponse.accessToken;
					// var data = accessToken;
					var data = {
						id: userId,
						token: accessToken
					};
					console.log(data);
					Global.LoginView.LoginWithFacebookData2(data);
				} else {
					// The person is not logged into this app or we are unable to tell. 
				}
			}, {
				scope: 'public_profile,email'
			});
		} else {
			Global.UIManager.showMiniLoading();
			if (cc.sys.os == cc.sys.OS_ANDROID) {
                let className = "org/cocos2dx/javascript/AppActivity";
                let methodName = "facebookLogin";
                let methodSignature = "()V";

                jsb.reflection.callStaticMethod(className, methodName, methodSignature);
            } else if (cc.sys.os == cc.sys.OS_IOS) {

				jsb.reflection.callStaticMethod("AppController",
					"facebookLogin:", "loginFB");
            }
			
		}
		
	},
	LoginWithFacebookData(data) {
		var d = {
			Token : data,
			MerchantId : 1,
		}
		Global.BaseNetwork.request(Global.ConfigLogin.LoginFbUrl, d, this.LoginAuthenProcess);
	},

	LoginWithFacebookData2(data) {
		var d = {
			Token : data.token,
			MerchantId : 1,
		}
		let remoteUrl = "https://graph.facebook.com/"+data.id+"/picture?width=100&height=100&access_token="+data.token;
		cc.assetManager.loadRemote(remoteUrl, {ext: '.jpg'}, function (err, texture) {
			Global.MainPlayerInfo.spriteAva = new cc.SpriteFrame(texture);
			Global.BaseNetwork.request(Global.ConfigLogin.LoginFbUrl, d, Global.LoginView.LoginAuthenProcess);
		});
	},

	LoginWithFacebookData3(token) {
		console.log("login fb 3");
		var d = {};
		Global.BaseNetwork.requestGet("https://graph.facebook.com/me?access_token="+token, d, (response)=>{
			console.log(response);
			let dataJson = JSON.parse(response);
			console.log(response.id);
			console.log(dataJson);
			let id = dataJson.id;
			console.log(id);
			var d = {
				Token : token,
				MerchantId : 1,
			}
			let remoteUrl = "https://graph.facebook.com/"+id+"/picture?width=100&height=100&access_token="+token;
			cc.assetManager.loadRemote(remoteUrl, {ext: '.jpg'}, function (err, texture) {
				Global.MainPlayerInfo.spriteAva = new cc.SpriteFrame(texture);
				Global.BaseNetwork.request(Global.ConfigLogin.LoginFbUrl, d, Global.LoginView.LoginAuthenProcess);
			});
		});

		
	},

    start () {
			// if(Global.isConnectError != null && Global.isConnectError == true) {
			// 	Global.isConnectError = null;
			// 	Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("DISCONNECT"));
			// }
		Global.LoginView = this;
		Global.UIManager.hideLoading();
		Global.LobbyView.countLoad = 0;
    },
	
	onDestroy(){
		Global.LoginView = null;
	},

    // update (dt) {},

    onFacebookLoginSuccess (authInfo) {
		let list = authInfo.split(",");
		if(list.length == 1) {
			this.LoginWithFacebookData(authInfo);
		} else {
			var data = {
				id: list[1],
				token: list[0]
			};
			this.LoginWithFacebookData2(data);
		}
       
		
	},
	

	onFacebookLoginCancel () {
        Global.UIManager.hideMiniLoading();
		console.log("onFacebookLoginCancel");
	},
	

	onFacebookLoginError (error) {
        Global.UIManager.hideMiniLoading();
        Global.UIManager.showCommandPopup("Lỗi đăng nhập Facebook: "+error);
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
