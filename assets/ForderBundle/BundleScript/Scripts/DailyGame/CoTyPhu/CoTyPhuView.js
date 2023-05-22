const DailyGameManager = require("../DailyGameManager");


cc.Class({
    extends: require("DailyGameView"),

    properties: {
        txtGoldValue : [cc.Label],
        nameSlot : [cc.Label],
        imgSlot : [cc.Sprite],
        imgIconSlot:[cc.SpriteFrame],
        cell : [cc.Node],
        panelDice : cc.Node,
        dice : [cc.Sprite],
        effectSpin : cc.Animation,
        btnPlay : cc.Button,
        character : cc.Node,
        imgDice:[cc.Sprite],
        imgNumber : [cc.SpriteFrame],
        nodeGame : cc.Node,
        winPopup : cc.Node,
        lbWinMoney : cc.Label,
    },

    ctor() {
        this.idCell = -1;
        this.currentId = -1;
        this.countStep = 0;
        this.winMoney = 0;
        this.accountBalance = 0;
        this.description = "";
    },

    ShowReward(listReward) {
        for(let i = 0; i < 10; i++) {
            this.txtGoldValue[i].string = Global.Helper.formatNumber(listReward[i].RewardMoney);
        }
        this.btnPlay.interactable = true;
        for(let i = 10; i < 14; i++) {
            let index = i - 10;
            switch(listReward[i].ItemType) {
                case Global.Enum.GAME_TYPE.OLD_SCHOOL:
                    this.nameSlot[index].string = "SHOCK DEER";
                    this.imgSlot[index].spriteFrame = this.imgIconSlot[0];
                    break;
                case Global.Enum.GAME_TYPE.JUMP_GAME:
                    this.nameSlot[index].string = "CASINO";
                    this.imgSlot[index].spriteFrame = this.imgIconSlot[1];
                    break;
                case Global.Enum.GAME_TYPE.SLOT_25LINE_BASIC:
                    this.nameSlot[index].string = "TAM QUỐC";
                    this.imgSlot[index].spriteFrame = this.imgIconSlot[2];
                    break;
                case Global.Enum.GAME_TYPE.TANSUU_GAME:
                    this.nameSlot[index].string = "TÂN SỬU";
                    this.imgSlot[index].spriteFrame = this.imgIconSlot[3];
                    break;
            }
        }
    },

    ClickPlay() {
        this.panelDice.active = false;
        this.effectSpin.node.active = true;
        this.btnPlay.interactable = false;
        this.effectSpin.play();
        let data = {};
        this.type = 1;
		data[1] = this.type;
        data[40] = this.type;
        require("SendRequest").getIns().MST_Client_Play_Daily_Login_Game(data);
    },

    GetReult(winMoney, accountBalance, description, idCell) {
        this.idCell = idCell;
        this.winMoney = winMoney;
        this.accountBalance = accountBalance;
        this.description = description;
        this.scheduleOnce(()=>{
            this.panelDice.active = true;
            this.effectSpin.node.active = false;
            this.GoToCell();
        } , 0.95);
    },

    GoToCell() {
        if(this.idCell == -1) {
            //thong bao loi
            return;
        }
        let count = 0;
        let index = this.currentId;
        let listId = [1,2,3,12,4,5,13,6,7,8,14,9,10,11];
        while (listId[index] != this.idCell || count < 3) {
            count += 1;
            index += 1;
            if(index == 14)
                index = 0;
        }       
        let check = false;
        let xx1 = 0, xx2 = 0, xx3 = 0;
        while(!check) {
            let tong  = 0;
            xx1 = Global.RandomNumber(1,7);
            tong += xx1;
            if(tong >= count){
            }else {
                let max = 7;
                if(count - tong <= 6)
                    max = count - tong + 1;
                xx2 = Global.RandomNumber(1, max);
                tong += xx2;
                if(tong >= count){
                }else {
                    xx3 = count - tong;
                    if(xx3 <= 0 || xx3 > 6) {
                    } else {
                        check = true;
                        this.imgDice[0].spriteFrame = this.imgNumber[xx1-1];
                        this.imgDice[1].spriteFrame = this.imgNumber[xx2-1];
                        this.imgDice[2].spriteFrame = this.imgNumber[xx3-1];
                    }
                }
            }
        }
        this.countStep = 0;
        this.CheckJump();
    },  

    CheckJump() {
        let listId = [1,2,3,12,4,5,13,6,7,8,14,9,10,11];
        this.currentId += 1;
        if(this.currentId == 14)
            this.currentId = 0;
        let state = 1;
        if(this.currentId +1 < 5)
            state = 1;
        else if(this.currentId +1 < 8)
            state = 2;
        else if(this.currentId +1 < 12)
            state = 3;
        else state = 4;
        this.Jump(this.currentId +1, 50, state, 0.5);
        this.countStep += 1;
        if(listId[this.currentId] != this.idCell || this.countStep < 3) {
            this.scheduleOnce(()=>{
                this.CheckJump();
            } ,  0.65);
        } else {
            this.scheduleOnce(()=>{
                this.ShowPopupReward();
            } ,  1);
        }
    },

    ShowPopupReward() {
        this.nodeGame.active = false;
        if(this.idCell <= 10) {
            this.winPopup.active = true;
            this.lbWinMoney.string = Global.Helper.formatNumber(this.winMoney);
            Global.MainPlayerInfo.ingameBalance = this.accountBalance;
            Global.LobbyView.UpdateInfoView ();
            this.btnClose.active = true;
        } else {
            Global.UIManager.showCommandPopup(this.description);
            this.ClickClose();
        }
    },

    ClickClose() {
        DailyGameManager.getIns().openGame = false;
        this.node.destroy();
    },

    Jump(id, height, state, time) {
        let t1 = 0.3 * time;
        let t2 = 0.2 * time;
        let startPos = this.character.getPosition();
        if(id == 14)
            id = 0;
        let endPos = this.cell[id].getPosition();
        
        let hesoX1 = 0, hesoX2 = 0, hesoY1 = 0, hesoY2 = 0;
        if(state == 1) {
            hesoX1 = 1;
            hesoX2 = 0;
            hesoY1 = 1;
            hesoY2 = 0;
        }
        if(state == 2) {
            hesoX1 = 0;
            hesoX2 = 1;
            hesoY1 = 0;
            hesoY2 = 1;
        }
        if(state == 3) {
            hesoX1 = 1;
            hesoX2 = 0;
            hesoY1 = 1;
            hesoY2 = 0;
        }
        if(state == 4) {
            hesoX1 = 0;
            hesoX2 = -1;
            hesoY1 = 0;
            hesoY2 = 1;
        }

        let acMove1 = cc.callFunc(() => {
            this.character.runAction(cc.moveTo(t1, this.GetPos1(startPos, endPos, height, hesoX1, hesoX2, hesoY1, hesoY2)));
        });
        let acMove2 = cc.callFunc(() => {
            this.character.runAction(cc.moveTo(t2, this.GetPos2(startPos, endPos, height, hesoX1, hesoX2, hesoY1, hesoY2)));
        });
        let acMove3 = cc.callFunc(() => {
            this.character.runAction(cc.moveTo(t2, this.GetPos3(startPos, endPos, height, hesoX1, hesoX2, hesoY1, hesoY2)));
        });
        let acMove4 = cc.callFunc(() => {
            this.character.runAction(cc.moveTo(t1, endPos));
        });
        this.character.runAction(cc.sequence(acMove1, cc.delayTime(t1), acMove2, cc.delayTime(t2), acMove3, cc.delayTime(t2), acMove4));
    },

    GetPos1(startPos, endPos, height, hesoX1, hesoX2, hesoY1, hesoY2) {
        

        let x = startPos.x + hesoX1 * (endPos.x - startPos.x)/3 + hesoX2 * height * 2/3;
        let y = startPos.y + hesoY1 * height * 2/3 + hesoY2 * (endPos.y - startPos.y)/3;
        return cc.v2(x, y);
    },

    GetPos2(startPos, endPos, height, hesoX1, hesoX2, hesoY1, hesoY2) {
        let x = startPos.x + hesoX1 * (endPos.x - startPos.x)/2  + hesoX2 * height;
        let y = startPos.y + hesoY1 * height + hesoY2 * (endPos.y - startPos.y)/2
        return cc.v2(x, y);
    },

    GetPos3(startPos, endPos, height, hesoX1, hesoX2, hesoY1, hesoY2) {
        let x = startPos.x + hesoX1 * (endPos.x - startPos.x)*2/3 + hesoX2 * height * 2/3;
        let y = startPos.y + hesoY1 * height * 2/3 + hesoY2 * (endPos.y - startPos.y)*2/3;
        return cc.v2(x, y);
    },
});
