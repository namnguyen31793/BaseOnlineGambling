

cc.Class({
    extends: cc.Component,

    properties: {
        ip: "",
        ipSend: "",
        CAfile: {
            type: cc.Asset,
            default: null
          },
    },


    start() {
        cc.game.addPersistRootNode(this.node);
    },

    init(ip) {

        ip = Global.GetServerLogicAddress;
        //ip = "192.168.1.11:9090";//Global.GameConfig.UrlGameLogic.GetServerLogicAddress;
        var connect = new Photon.PhotonPeer(Photon.ConnectionProtocol.Ws, ip);
        // connect.keepAliveTimeoutMs = 170000;
        console.log(ip);
        this._connect = connect;
        connect.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.connect, this.connect.bind(this));
        connect.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.connecting, this.connecting.bind(this));
        connect.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.connectFailed, this.connectFailed.bind(this));
        connect.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.connectClosed, this.connectClosed.bind(this));
        connect.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.disconnect, this.disconnect.bind(this));
        connect.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.error, this.error.bind(this));
        connect.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.timeout, this.timeout.bind(this));

        this.addEventSevice(connect);

    },

    connect_sv() {
        cc.log("connect_sv");
        this._connect.connect();
    },

    addEventSevice(connect) {
        connect.addResponseListener(Global.Enum.NETWORK_TARGET_CODE.LOBBY, (data) => {
            require("ReceiveResponse").getIns().reviceData(data);
        });
        // connect.addResponseListener(Global.Enum.NETWORK_TARGET_CODE.FISH_SHOOTING, (data) => {
        //     require("FishNetworkManager").getIns().HandleResponse(data);
        // });
        connect.addResponseListener(Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE, (data) => {
            require("SlotNetworkManager").getIns().HandleResponse(data);
        });
        connect.addResponseListener(Global.Enum.NETWORK_TARGET_CODE.DICE, (data) => {
            require("ReceiveResponse").getIns().reviceData(data);
        });
        connect.addResponseListener(Global.Enum.NETWORK_TARGET_CODE.MINIPOKER, (data) => {
            require("MiniPokerNetworkManager").getIns().HandleResponse(data);
        });
        connect.addResponseListener(Global.Enum.NETWORK_TARGET_CODE.EVENT, (data) => {
            require("EventLogicManager").getIns().HandleResponse(data);
        });
        connect.addResponseListener(Global.Enum.NETWORK_TARGET_CODE.CITY_GAME, (data) => {
            require("CityNetworkManager").getIns().HandleResponse(data);
        });
        connect.addResponseListener(Global.Enum.NETWORK_TARGET_CODE.SKILL_GAME, (data) => {
            require("SkillNetworkManager").getIns().HandleResponse(data);
        });

    },

    sendRequest(code, msg, tag = 100) {
        // if(Global.isOffline) {
        //     Global.ServerOffline.HandleRequest(code, msg);
        //     return;
        // }
        if(!Global.isLogin) {
            return;
        }
        // cc.log("sendRequest "+code +" - "+tag);
        if(this._connect == null)
            return;
        if (!this._connect.isConnected()) {
            cc.log("close connect when request");
            if(Global.activeDisconnect) {
                return;
            }
            Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("DISCONNECT"), this.LoadLoginScene);
            return;
        }
        // msg[200] = code;
        // msg[250] = code;
        // msg[255] = this.ipSend;
        
        let data 
        //  tag = 100;
        let arr = [];
        for (let temp in msg) {
            arr.push(parseInt(temp));
            arr.push(msg[temp])
        }
        //add
        arr.push(200);
        arr.push(code)
        arr.push(250);
        arr.push(code)

		try {
			this._connect.sendOperation(tag, arr, false);
		} catch (err) {
			this.OnDisconnect();
		}
    },

    connect() {
        if(Global.activeDisconnect) {
            return;
        }
        console.log("chay vao bat dau connect");
        //Global.UIManager.hideLoading();
        Global.isConnect = true;
        // if (cc.sys.isBrowser) {

        let source = "";
            if (cc.sys.isBrowser) {
                source = "1";//CONFIG.SOURCE_ID_WEB;
            }
            else if(cc.sys.os.toString() == "Android") {
                source = "3";
            }
            else if(cc.sys.os == cc.sys.OS_IOS) {
                source = "2";
            }
            else if(cc.sys.os == cc.sys.OS_WINDOWS) {
                source = "4";
            }
            
            let utf8Encode = new TextEncoder();
            let msgData = {};
            if(!CONFIG.INET) {
                msgData[1] = Global.CookieValue;
                msgData[2] = Global.encryptedData;//utf8Encode.encode(Global.encryptedData);
                msgData[3] = Global.checksum;
                msgData[4] = Global.agent;
            }else{
                msgData[1] = Global.ssoKey;
                msgData[2] = "";
                msgData[3] = "";
                msgData[4] = Global.agent;
            }
            require("SendRequest").getIns().MST_Client_Login(msgData);

    },
    connecting() {
        cc.log("connect connecting");
    },
    connectFailed() {
        Global.isConnect = false;
        cc.log("connect fail");
        Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("DISCONNECT"), this.LoadLoginScene);
    },

    connectClosed() {
        cc.log("connect close");
        Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("DISCONNECT"), this.LoadLoginScene);
    },
    disconnect() {
        cc.log("connect disconnect");
        if(Global.activeDisconnect) {
            return;
        }
        this.OnDisconnect();
        if(Global.isConnect) {
            Global.isConnect = false;
            Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("DISCONNECT"), this.LoadLoginScene);
        }
        
    },
    error() {
        Global.isConnect = false;
        cc.log("connect error");
        Global.CookieValue = null;
		Global.isLogin = false;
        Global.isShowStart = false;
        Global.MainPlayerInfo.spriteAva = null;
        cc.sys.localStorage.setItem("FAST_LOGIN" , 0);
		require("ScreenManager").getIns().lastScreen = 0;
		require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.LOGIN);
    },
    
    timeout() {
        Global.isConnect = false;
        cc.log("connect time out");
        Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("DISCONNECT"), this.LoadLoginScene);
    },
    checkConnectAndConnect() {
        if (!this._connect.isConnected()) {
            this.connect_sv()
        }
    },

    OnDisconnect() {
        this._connect.disconnect();
    },
    
    LoadLoginScene() {
        // Global.UIManager.showLoading();
        // Global.NetworkManager.init("");
		// Global.NetworkManager.connect_sv();
        Global.NetworkManager.error();
    },

    SetTimeOnline(minute) {
        this.timeOnline = minute * 60;
    },

    GetTimeRemain() {
        return parseInt(this.timeOnline);
    },

	onLoad() {
        console.log("load network");
        if(Global.NetworkManager != null) {
            this.node.destroy();
            return;
        }
        Global.NetworkManager = this;
        Global.CApem = this.CAfile.nativeUrl;
	},
	
	onDestroy(){
        console.log("destroy network");
		Global.NetworkManager = null;
    },

    

});
