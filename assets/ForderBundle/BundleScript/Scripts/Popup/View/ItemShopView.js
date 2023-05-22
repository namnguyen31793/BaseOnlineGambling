cc.Class({
    extends: cc.Component,
    ctor() {
        this.data = null;
        this.itemModel = null;
        this.listView = null;
    },

    properties: {
        iconItem : cc.Sprite,
        item : cc.Sprite,
        contentBalance : cc.Sprite,
        prize : cc.Label,
        imgContentNormal : cc.SpriteFrame,
        imgContentFocus: cc.SpriteFrame,
        imgContentGold : cc.SpriteFrame,
        imgContentDiamond : cc.SpriteFrame,
        imgGold : cc.SpriteFrame,
        imgSpin : cc.SpriteFrame,
        imgItemFreezee : cc.SpriteFrame,
        imgItemTarget : cc.SpriteFrame,
        imgItemSpeed : cc.SpriteFrame,
        itemGun101 : cc.SpriteFrame,
        itemGun102 : cc.SpriteFrame,
        itemGun103 : cc.SpriteFrame,
    },

    ClickBtn() { 
        for(let i = 0; i < this.listView.length; i++)
        {
            this.listView[i].ChangeState(false);
        }
        this.ChangeState(true);
        Global.ShopDiamondPopup.SelectItem(this.data.Id, this.iconItem.spriteFrame);
    },

    ChangeState(isActive) {
        if(isActive) {
            this.item.spriteFrame = this.imgContentFocus;
        }
        else {
            this.item.spriteFrame = this.imgContentNormal;
        }
    },

    ClickBtnBag() {
        for (let i = 0; i < this.listView.length; i++) {
            this.listView[i].ChangeState(false);
        }
        this.ChangeState(true);
        // UIManager.Instance.PopupView.BagDiamondPopup.SelectItem ((int)itemModel.Id, item.transform.position);
    },

    Init(listView) {
        this.listView = listView;
    },

    ShowItem(model) {
        this.node.active = true;
        this.data = model;
        if (model.DiamondPrice > 0) {
            this.contentBalance.spriteFrame = this.imgContentDiamond;
            this.prize.string = Global.Helper.NumberShortK (model.DiamondPrice);
        } else if (model.MoneyPrice > 0) {
            this.contentBalance.spriteFrame = this.imgContentGold;
            this.prize.string = Global.Helper.NumberShortK (model.MoneyPrice);
        }
        let listItem = JSON.parse(model.Package);
        if (listItem [0].RewardType == Global.Enum.REWARD_TYPE.INGAME_BALANCE) {
            this.iconItem.sprite = this.imgGold;
        } else if (listItem [0].RewardType == Global.Enum.REWARD_TYPE.LIXI) {
            this.iconItem.sprite = this.imgSpin;
        }
        else if (listItem [0].RewardType == Global.Enum.REWARD_TYPE.ITEM_INGAME)
        {
            this.SetImageItem (listItem[0].ItemType);
        }
    },

    ShowItemBag(model, isLobby) {
        this.node.active = true;
        this.itemModel = model;
        this.prize.string = model.Amount.toString ();
        this.SetImageItem (model.ItemId);
        // if (!isLobby) {
        //     let numb = 0;
        //     let listGun = GameConfigServer.Instance.gunConfigModelRoom1;
        //     if (InGameLogicManager.Instance.gameLogic.roomProperties.RoomType == ROOM_TYPE.ROOM_TYPE_2) {
        //         listGun = GameConfigServer.Instance.gunConfigModelRoom2;
        //     }
        //     for (let i = 0; i < listGun.Length; i++) {
        //         if (listGun [i].GunId == InGameLogicManager.Instance.gameLogic.GetMainActor ().actorProperties.CurrentGunId) {
        //             numb = listGun [i].ItemRequire;
        //             break;
        //         }
        //     }
        //     if (model.ItemId > 100 && model.Amount < numb) {
        //         iconItem.color = new Color (1, 1, 1, 0.5f);
        //     } else {
        //         iconItem.color = new Color (1, 1, 1, 1);
        //     }
        // }
    },

    SetImageItem(itemId) {
        if (itemId == Global.Enum.ITEM_TYPE.ICE) {
            this.iconItem.spriteFrame = this.imgItemFreezee;
        } else if (itemId == Global.Enum.ITEM_TYPE.TARGET) {
            this.iconItem.spriteFrame = this.imgItemTarget;
        } else if (itemId == Global.Enum.ITEM_TYPE.SPEED) {
            this.iconItem.spriteFrame = this.imgItemSpeed;
        } else if (itemId == CONFIG.LAZE_GUN_ID) {
            this.iconItem.spriteFrame = this.itemGun101;
        } else if (itemId == CONFIG.DRILL_GUN_ID) {
            this.iconItem.spriteFrame = this.itemGun102;
        } else if (itemId == CONFIG.BOOM_GUN_ID) {
            this.iconItem.spriteFrame = this.itemGun103;
        } else if (itemId > 400) {
            let fishType = itemId % 400;
            cc.resources.load("Img/Fish"+fishType , cc.SpriteFrame , (err , pre)=>{ 
                this.iconItem.spriteFrame = pre;
            });
        }

    },
    
});
