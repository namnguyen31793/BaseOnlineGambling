

cc.Class({
    extends: cc.Component,
    ctor() {
        this.listVipInfo = [];
    },

    properties: {
        description: cc.Label,
        requireTopup: cc.Label,
        vipName: cc.Label,
        progress: cc.Label,
        current : cc.Sprite,
        iconVip : [cc.Sprite],
        imgActive : [cc.SpriteFrame],
        imgUnActive : [cc.SpriteFrame],
        btnShop : cc.Node,
    },

    start() {

    },

    show() {

        this.node.setSiblingIndex(this.node.parent.children.length-1);
        this.node.active = true;
        
        /*
        require("SendRequest").getIns().MST_Client_Get_Vip_Config_Info();
        
        if(Global.GameConfig != null && Global.GameConfig.FeatureConfig.CashinLobbyFeature == Global.Enum.EFeatureStatus.Open) {
			this.btnShop.active = true;
		} else {
            this.btnShop.active = false;
        }
        */
    },

    GetVipInfo(listVipInfo, des, dq) {
        this.listVipInfo = listVipInfo;
        this.OnShowVipContent(null, 0);
    },
    OnShowVipContent(event, index) {
        cc.log(this.listVipInfo);
        if (this.listVipInfo != null && this.listVipInfo.length > index) {
            this.description.string = this.listVipInfo[index].Description;
            this.vipName.string = "BẠN ĐANG VIP " + Global.MainPlayerInfo.vipLevel;
            if(Global.MainPlayerInfo.vipPoint >= this.listVipInfo[index].RequireTopup) {
                this.current.fillRange = 1;
                this.requireTopup.string = "Bạn đã đạt cấp VIP này";
                this.progress.string = "0/0";
            } else {
                this.requireTopup.string = "Bạn cần nạp thêm " + Global.Helper.formatMoney(this.listVipInfo[index].RequireTopup) + " VNĐ";
                this.progress.string = Global.Helper.formatMoney(Global.MainPlayerInfo.vipPoint) + "/" + Global.Helper.formatMoney(this.listVipInfo[index].RequireTopup)
                this.current.fillRange = Global.MainPlayerInfo.vipPoint/this.listVipInfo[index].RequireTopup;
            }
            
        } else {
            this.current.fillRange = 1;
            this.progress.string = "0/0";
            this.requireTopup.string = "";
            this.vipName.string = "BẠN ĐÃ ĐẠT CẤP VIP CAO NHẤT";
        }
    },

    ClickButtonShop() {
        this.Hide();
        Global.UIManager.showShopPopup();
    },

    Hide() {
        this.node.active = false;
        Global.UIManager.hideMark();
    },

    onDestroy() {
        Global.VipInfoPopup = null;
    },

});
