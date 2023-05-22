cc.Class({
    extends: require("SlotNormalGameManager"),

    properties: {
        bonusContainer : cc.Node,
        itemBonus : cc.Node,
        itemExtraSilver : cc.Node,
        itemExtraGold : cc.Node,
        itemWildFree : cc.Node,
    },

    ctor() {
        this.listWildSingle = [];
        this.listWildColumn = [];
        this.listItemBonus = [];
        this.listItemExtraSilver = [];
        this.listItemExtraGold = [];
        this.listExtraSilver = {};
        this.listExtraGold = {};
        this.listJackpot = {};
        this.listBonus = {};
        this.test = 1;
        this.listItemWildFree = [];
    },

    OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn, freeSpinLeft, totalWin, accountBalance, 
        currentJackpotValue, isTakeJackpot) {
            cc.log("on get spin result:"+freeSpinLeft);
        if(isTakeJackpot)
            winNormalValue = totalWin;
        this.listWildColumn = [];
        this.listWildSingle = [];
        this.listBonus = {};
        this.listExtraSilver = {};
        this.listExtraGold = {};
        this.listJackpot = {};
        this.slotView.UpdateMatrix(this.ParseMatrix(matrix));
        let mAccountBalance = accountBalance;
        if(this.slotView.isBonus)
            mAccountBalance = accountBalance-winBonusValue;
        this.slotView.UpdateMoneyNormalGame(winNormalValue, mAccountBalance);
        let toDoList = this.slotView.toDoList;
        let slotView = this.slotView;
        toDoList.CreateList();
        toDoList.AddWork(()=>slotView.GetSpinResult(),true);
        toDoList.AddWork(()=>slotView.UpdateSessionID(spinId),false);
        toDoList.AddWork(()=>slotView.EndAnimPreWin(freeSpinLeft, bonusTurn),true);
        
        toDoList.AddWork(()=>slotView.SetFreeSpin(freeSpinLeft, true, this.ParseLineData(listLineWinData), winNormalValue, totalWin),true);

        toDoList.AddWork(()=>slotView.CheckBonus(winBonusValue, totalWin, accountBalance, bonusTurn, isTakeJackpot),true);      
        if(!this.slotView.isFree && !this.slotView.isBonus){
            toDoList.AddWork(()=>slotView.UpdateLineWinData(this.ParseLineData(listLineWinData)),false);
            toDoList.AddWork(()=>slotView.UpdateMoneyResult(winNormalValue, totalWin, isTakeJackpot),true);
        }
        // toDoList.AddWork(()=>slotView.CheckJackpot(isTakeJackpot, totalWin),false);
        slotView.CheckTimeShowPrize(winNormalValue);
        toDoList.AddWork(()=>slotView.ActiveButtonMenu(),false);
        //check item
        toDoList.AddWork(()=>this.slotView.ShowCommandUseItemBonusTurn(this.slotView.toDoList), true);
        toDoList.AddWork(()=>slotView.ActionAutoSpin(),false);
        toDoList.Play();
    },

    CheckRandomWild() {
        if(this.listWildSingle.length == 0 && this.listWildColumn.length == 0) {

        } else {
            this.scheduleOnce(()=>{
                for(let i = 0; i < this.listWildSingle.length; i++) {
                    this.slotView.itemManager.SetImage(2, this.slotView.spinManager.listItem[this.listWildSingle[i]]);
                }
                for(let i = 0; i < this.listWildColumn.length; i++) {
                    this.slotView.itemManager.SetImage(2, this.slotView.spinManager.listItem[this.listWildColumn[i]]);
                }
            } , 2);  
        }
    },

    CheckBonus() {
        if(this.slotView.isBonus) {
            let listItem = this.slotView.spinManager.listItem;
            for(let temp in this.listBonus){
                if(this.listItemBonus[temp] == null) {
                   let bonusObj = cc.instantiate(this.itemBonus);
                   bonusObj.parent = this.bonusContainer;
                   bonusObj.active = true;
                   bonusObj.setPosition(listItem[temp].node.getPosition());
                   this.listItemBonus[temp] = bonusObj.getComponent("ItemSlotView");
                   this.listItemBonus[temp].level = 1;
               } 
                this.listItemBonus[temp].prizeValue = parseInt(this.listBonus[temp]) ;
           }
           for(let temp in this.listExtraSilver){
                if(this.listItemExtraSilver[temp] == null) {
                    let bonusObj = cc.instantiate(this.itemExtraSilver);
                    bonusObj.parent = this.bonusContainer;
                    bonusObj.active = true;
                    bonusObj.setPosition(listItem[temp].node.getPosition());
                    this.listItemExtraSilver[temp] = bonusObj.getComponent("ItemSlotView");
                    bonusObj.getComponent("ItemSlotView").index = temp;
                    this.listItemExtraSilver[temp].level = 2;
                }
                this.listItemExtraSilver[temp].prizeValue = parseInt(this.listExtraSilver[temp]);
            }
            for(let temp in this.listExtraGold){
                if(this.listItemExtraGold[temp] == null) {
                    let bonusObj = cc.instantiate(this.itemExtraGold);
                    bonusObj.parent = this.bonusContainer;
                    bonusObj.active = true;
                    bonusObj.setPosition(listItem[temp].node.getPosition());
                    this.listItemExtraGold[temp] = bonusObj.getComponent("ItemSlotView");
                    bonusObj.getComponent("ItemSlotView").index = temp;
                    this.listItemExtraGold[temp].level = 3;
                }
                this.listItemExtraGold[temp].prizeValue = parseInt(this.listExtraGold[temp]);
            }
            for(let temp in this.listJackpot){
                if(this.listItemBonus[temp] == null) {
                   let jackpotObj = cc.instantiate(this.itemBonus);
                   jackpotObj.parent = this.bonusContainer;
                   jackpotObj.active = true;
                   jackpotObj.setPosition(listItem[temp].node.getPosition());
                   this.listItemBonus[temp] = jackpotObj.getComponent("ItemSlotView");
                   this.listItemBonus[temp].item = listItem[temp];
                   this.slotView.itemManager.SetImage(1, this.listItemBonus[temp], temp);
                   this.listItemBonus[temp].level = 10;
               } 
            }
        }
    },

    EndBonus() { 
        if(!this.slotView.isBonus) {
            for(let i = 0; i < this.listItemBonus.length; i++) {
                if(this.listItemBonus[i] != null) {
                    this.listItemBonus[i].node.destroy();
                }
            }
            for(let i = 0; i < this.listItemExtraSilver.length; i++) {
                if(this.listItemExtraSilver[i] != null) {
                    this.listItemExtraSilver[i].node.destroy();
                }
            }
            for(let i = 0; i < this.listItemExtraGold.length; i++) {
                if(this.listItemExtraGold[i] != null) {
                    this.listItemExtraGold[i].node.destroy();
                }
            }
            this.listItemBonus = [];
            this.listItemExtraSilver = [];
            this.listItemExtraGold = [];
            this.listExtraSilver = {};
            this.listExtraGold = {};
            this.listJackpot = {};
            this.listBonus = {};
        }
    },

    CheckFreeWild() {
        if(this.slotView.isFree) {
            let listItem = this.slotView.spinManager.listItem;
            for(let i = 0; i < this.listWildSingle.length; i++) {
                if(this.listItemWildFree[this.listWildSingle[i]] == null){
                    cc.log("create ");
                    cc.log(this.listWildSingle[i]);
                    let wildFreeObj = cc.instantiate(this.itemWildFree);
                    wildFreeObj.parent = this.bonusContainer;
                    wildFreeObj.active = true;
                    wildFreeObj.setPosition(listItem[this.listWildSingle[i]].node.getPosition());
                    this.listItemWildFree[this.listWildSingle[i]] = wildFreeObj.getComponent("ItemSlotView");
                }
            }
        }
    },

    EndFree(){
        for(let i = 0; i < this.listItemWildFree.length; i++) {
            if(this.listItemWildFree[i] != null) {
                this.listItemWildFree[i].node.destroy();
            }
        }
        this.listItemWildFree = [];
        this.listWildSingle = {};
    },

    ParseMatrix(matrixData) {
        let matrixStr = matrixData.split(",");
        // matrixStr[1] = "5.200";
        // if(this.test == 2)
        // matrixStr[2] = "5.400";
        // if(this.test == 3)
        // matrixStr[4] = "5.800";
        let matrix = [];
        for(let i = 0; i < matrixStr.length; i++) {
            matrix[i] = parseInt(matrixStr[i]);
            if(matrix[i] == 17) {
                this.listWildSingle[this.listWildSingle.length] = i;
            }
            if(matrix[i] == 16) {
                this.listWildColumn[this.listWildColumn.length] = i;
            }
            if(matrix[i] == 3) {
                let value = matrixStr[i].split(".")
                this.listBonus[i.toString()] = value[1];
            }
            if(matrix[i] == 1) {
                let value = matrixStr[i].split(".")
                this.listJackpot[i.toString()] = value[1];
            }
            if(matrix[i] == 5) {
                let value = matrixStr[i].split(".")
                this.listExtraSilver[i.toString()] = value[1];
            }
            if(matrix[i] == 55) {
                let value = matrixStr[i].split(".")
                this.listExtraGold[i.toString()] = value[1];
            }
        }
        // this.test++;
        return matrix;
    },
});
