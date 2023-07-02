

cc.Class({
    extends: cc.Component,

    properties: {
        textName : cc.Label,
        textMoney : cc.Label,
        textDiamond : cc.Label,
        textId : cc.Label,
        textVip : cc.Label,
        iconVip : cc.Sprite,
        avata : cc.Sprite,
    },

    start() {
      //  Global.Helper.GetAvata(this.avata);
    },

    show() {
        /*
        Global.UIManager.hideMiniLoading();
		this.node.setSiblingIndex(this.node.parent.children.length-1);
		this.node.active = true;
		this.node.getComponent(cc.Animation).play("ShowPopup");
        this.SetInfoProfile();
        Global.LobbyView.RequestGetVipConfig();
        */
    },

    SetInfoProfile() {
        this.textName.string = Global.MainPlayerInfo.nickName;
        this.textMoney.string = Global.Helper.formatNumber (Global.MainPlayerInfo.ingameBalance);
        let listItemData = require("BagController").getIns().listDataItem;
        for(let i = 0; i < listItemData.length; i++) {
            if(listItemData[i].ItemId == 4) {
				this.textDiamond.string = Global.Helper.formatNumber(listItemData[i].Amount.toString());
            }
        }
        this.textId.string = Global.MainPlayerInfo.accountId;
        this.textVip.string = "VIP " + Global.MainPlayerInfo.vip;
        Global.DownloadManager.LoadAssest("Image",cc.SpriteFrame,"Vip/Vip"+Global.MainPlayerInfo.accountId, (pre)=>{
            if(Global.ProfilePopup.iconVip != null&& Global.ProfilePopup.iconVip.materials != null)
                Global.ProfilePopup.iconVip.spriteFrame = pre;
        });
        Global.Helper.GetAvata(this.avata);
    },

    ClickCoppyAccountId() {
        Global.Helper.coppyToClipboard(Global.MainPlayerInfo.accountId);
    },

    OpenBag() {
        this.Hide();
        Global.UIManager.showBag();
    },

    Hide() {
        this.node.active = false;
        Global.UIManager.hideMark();
    },

    onDestroy(){
		Global.ProfilePopup = null;
	},

    
});
