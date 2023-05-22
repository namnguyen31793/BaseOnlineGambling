cc.Class({
    extends: cc.Component,
    ctor() {
        this.type = 0;
    },

    properties: {
        textCard : cc.Label,
        textCoin : cc.Label,
        bg : cc.Sprite,
        listImg : [cc.SpriteFrame],
    },

    SetUp(data, type, nsp = 0) {
        this.data = data;
        this.type = type;
        this.node.active = true;
        this.textCard.string = Global.Helper.formatNumber (data.CardAmount)+" đ";
        if(type == 1) {
            this.textCoin.string = "Nhận "+ Global.Helper.formatPrice (data.GoldAmount) + " Vàng";
        }
        else if(type == 2) {
            this.textCoin.string = Global.Helper.formatNumber (data.GoldCost)+ " Vàng";
            this.textCard.string = "Đổi thẻ\n" + this.textCard.string;
        }
            
        if(nsp != 0) {
            this.bg.spriteFrame = this.listImg[nsp-1];
        }
    },

    OnClick() {
        if(this.type == 1) {
            Global.ShopPopup.cardIn.ShowPopup(this.data);
        } else if(this.type == 2) {
            Global.ShopPopup.cardOut.ShowPopup(this.data);
        }
    },
});
