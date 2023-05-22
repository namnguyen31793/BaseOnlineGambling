import List from "List";
cc.Class({
    extends: cc.Component,

    ctor(){
        this.Id = 0;
        this.Type = 0;
        this.Url = '';
        this.Token = '';
        this.Channel = '';
        this.IndexId = 0;
        this.listUser = new List();
        this.dataLike = null;
    },
    properties: {
        icon : cc.Sprite,
        viewLb : cc.Label,
    },

    Setup(IndexId, data){
        this.IndexId = IndexId;
        this.node.active = true;
        this.Id = data.Id;
        this.Type = data.Type;
        this.Url = data.Url;
        this.Token = data.Token;
        this.Channel = data.Channel;//" data.LinkImage
        let parentItemBank = this.node;
        cc.loader.load(data.LinkImage, function (err, texture) {
            parentItemBank.getComponent(cc.Sprite).spriteFrame =  new cc.SpriteFrame(texture);
        }); 
        
        if(this.Id == 0 && this.Type == 0) {

        } else {
            this.RandomList();
        }
        this.viewLb.string = Global.Helper.formatNumber(this.GetTotalView());
        this.schedule(() => {
            this.viewLb.string = Global.Helper.formatNumber(this.GetTotalView());
          }, 2);
    },

    UpdateView() {
        this.viewLb.string = Global.Helper.formatNumber(this.GetTotalView());
    },

    Clear(){
        this.Id = 0;
        this.Type = 0;
        this.Url = '';
        this.Token = '';
        this.Channel = '';
        this.node.active = false;
        this.listUser.Clear();
    },

    ClickShowLive(){
        if(this.Id == 0 || this.Type == 0)
            return;
        Global.LiveStreamView.SetListUser(this.listUser, this, this.dataLike)
        Global.LobbyView.SelectChannel(this.IndexId, this.Id)
        
    },

    RandomList() {
        let numbUser = Global.RandomNumber(5,15);
        for(let i = 0; i < numbUser; i++) {
            let id = Global.RandomNumber(1000,50000);
            let r = Global.RandomNumber(0,100);
            let donate = 0;
            if(r > 50) {
                donate = Global.RandomNumber(0,41) * 5000;
            }
            let user = {
                nickName : "Vip"+id,
                id : id,
                totalDonate : donate
            };
            this.listUser.Add(user);
        }
        let like = Global.RandomNumber(5,101);
        let disLike = Global.RandomNumber(1,10);
        this.dataLike = {
            like : like,
            dislike : disLike,
            state : 0,
            currentDonate : 0,
        }
    },

    GetTotalView() {
        return this.listUser.GetCount();
    },
});
