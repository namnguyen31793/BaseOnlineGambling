

cc.Class({
    extends: cc.Component,
    ctor(){
        this.listDataMail = [];
        this.mailIdShow = 0;
        this.listItemMail = [];
    },

    properties: {
        srcView : require("BaseScrollView"),
        tabSelect : cc.Node,
        tabContentMail : cc.Node,
        textUsername : cc.Label,
        textTime : cc.Label,
        textContent : cc.Label,
        textHeader : cc.Label,
        textNullMail : cc.Node,
        btnAcceptMoney : cc.Button,
        boxItem : cc.Node,
        itemUI : cc.Node,
    },

    show() {
        this.node.scale = 1;
        this.node.opacity = 255;
        this.getComponent(cc.Animation).play("AnimShowMail");
        this.node.setSiblingIndex(this.node.parent.children.length-1);
        this.node.active = true;
        this.tabContentMail.active = false;
        this.tabSelect.active = true;
        this.SetInfoMail ();
    },

    SetInfoMail() {
        this.listDataMail = Global.MainPlayerInfo.listMail;
        cc.log(this.listDataMail);
        if(this.listDataMail == null) {
            this.textNullMail.active = true;
            return;
        }
            
        if (this.listDataMail.length == 0)
            this.textNullMail.active = true;
        else
            this.textNullMail.active = false;
        let list = [];
        for(let i = 0  ; i < this.listDataMail.length ; i++){
            if(this.listDataMail[i].IsReaded == 0 || this.listDataMail[i].IsReaded == 1)
                list.push(this.listDataMail[i]);
        }
        this.srcView.resetScr();
        // cc.log(this.listDataMail.length+"   "+this.listDataMail.length*120);
        this.scheduleOnce(()=>{
            this.srcView.init(list , this.listDataMail.length*120 , 120);
        }, 0.1)
        
    },

    ShowMailById(mailId) {
        this.clearItemPool();
        let mail = null;
        this.mailIdShow = mailId;
        for (let i = 0; i < this.listDataMail.length; i++) {
            if (this.listDataMail [i].MailId == mailId) {
                mail = this.listDataMail [i];
            }
        }
        if (mail != null) {
            this.textUsername.string = mail.SenderNickname;
            this.textTime.string = this.formatTime(mail.SendTime.toString ());
            this. textContent.string = mail.MailContent;
            this.textHeader.string = mail.MailHeader;
            this.tabContentMail.active = true;
            this.tabSelect.active = false;
            var haveItem = false;
            if(mail.RewardBonusDescription != null && mail.RewardBonusDescription != "" && mail.RewardBonusDescription != " "&& mail.RewardBonusDescription != "  "){
                let dataItem = JSON.parse(mail.RewardBonusDescription)
                if(dataItem.length > 0)
                    haveItem = true;
                for(let i = 0; i < dataItem.length ; i++){
                    let data = dataItem[i];
                    let item = this.getItemPool();
                    this.listItemMail.push(item);
                    item.active = true;
                    this.boxItem.insertChild(item , 0);
                    if(data.ItemId != null) {
                        Global.Helper.GetIconBagByType(item.getChildByName("IconItem").getComponent(cc.Sprite), data.ItemType)
                        item.getChildByName("IconGame").getComponent(cc.Sprite).spriteFrame = null;
                    } else if(data.GameID != null) {
                        Global.Helper.GetIconBagByType(item.getChildByName("IconItem").getComponent(cc.Sprite), 99);
                        Global.Helper.GetIconGame(item.getChildByName("IconGame").getComponent(cc.Sprite), data.GameID);
                    }
                    item.getComponentInChildren(cc.Label).string = "X"+ Global.Helper.formatNumberLong(data.Amount);
                }
            }
            if(mail.Money > 0 ){
                haveItem = true;
                let item = this.getItemPool();
                this.listItemMail.push(item);
                item.active = true;
                this.boxItem.insertChild(item , 0);
                Global.Helper.GetIconBagByType(item.getComponent(cc.Sprite), 0)
                item.getComponentInChildren(cc.Label).string = "X"+ Global.Helper.formatNumberLong(mail.Money);
                console.log("label:"+item.getComponentInChildren(cc.Label));
            }
            if(!haveItem){
                this.boxItem.active = false;
            }else{
                this.boxItem.active = true;
            }
            console.log(mail.Money+"    "+mail.RewardBonusDescription+"    "+mail.AcceptMoney);
            if(mail.Money > 0 || (mail.RewardBonusDescription != null && mail.RewardBonusDescription != ""&& mail.RewardBonusDescription != " ")){
                this.btnAcceptMoney.node.active = true;
            }else{
                this.btnAcceptMoney.node.active = false;
            }
            if(mail.AcceptMoney){
                this.btnAcceptMoney.interactable = false;
            }else{
                this.btnAcceptMoney.interactable = true;
            }
        }
    },

    formatTime(str) {
        return require("SyncTimeControl").getIns().convertTimeToString((new Date(str)).getTime());
    },

    BackContentMail() {
        this.tabContentMail.active = false;
        this.tabSelect.active = true;
    },


    Hide() {
        this.node.getComponent(cc.Animation).play("HidePopup");
        this.scheduleOnce(()=>{
            this.node.active = false;
            Global.UIManager.hideMark();
        } , 0.2);
    },

    onLoad() {
        Global.MailPopup = this;
        this.poolItem = new cc.NodePool();
    },

    onDestroy(){
		Global.MailPopup = null;
        this.poolItem.clear();
	},

    sendAcceptMoneyMail(){
        let msgData = {};
        msgData [1] = this.mailIdShow;
        require("SendRequest").getIns().MST_Client_Accept_Money_Mail (msgData);
        this.btnAcceptMoney.interactable = false;
        for (let i = 0; i < this.listDataMail.length; i++) {
            if (this.listDataMail [i].MailId == this.mailIdShow) {
                this.listDataMail [i].AcceptMoney = false;
            }
        }
    },

    getItemPool(){
        if(this.poolItem.size() > 0){
            return this.poolItem.get();
        }else{
            let node = cc.instantiate(this.itemUI);
            this.poolItem.put(node);
            return this.poolItem.get();
        }
    },

    clearItemPool(){
        for (let i = this.listItemMail.length -1; i >= 0; i--) {
            this.poolItem.put(this.listItemMail[i]);
        }
    },
});
