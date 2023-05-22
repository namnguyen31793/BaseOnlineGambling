cc.Class({
    extends: require("SlotNormalGameManager"),

    properties: {
        bonusContainer : cc.Node,
        itemMultiUI : sp.Skeleton,
    },

    ctor() {
        this.test = 1;
        this.listItemWildFree = [];
        this.toDoListNormal = null;
    },

    onLoad() {
        this.toDoListNormal = this.node.addComponent("ToDoList");
    },

    OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn, freeSpinLeft, totalWin, accountBalance, 
        currentJackpotValue, isTakeJackpot, extendMatrixDescription) {
            
        let isEndFree = false;
        if(this.slotView.isFree && freeSpinLeft == 0)
            isEndFree = true;
        if(isTakeJackpot)
            winNormalValue = totalWin;
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
   
        if(!this.slotView.isFree && !this.slotView.isBonus){
            toDoList.AddWork(()=>slotView.UpdateLineWinData(this.ParseLineData(listLineWinData)),false);
            if(this.slotView.MultiSave > 1 && totalWin > 0){
                toDoList.AddWork(()=>slotView.ShowMoneyMultiResult(totalWin, this.slotView.MultiSave));
                toDoList.Wait(1.8);
                toDoList.AddWork(()=>slotView.HideMoneyMultiResult())
            }
            toDoList.AddWork(()=>slotView.UpdateMoneyResult(winNormalValue, totalWin, isTakeJackpot),true);
        }
        // toDoList.AddWork(()=>slotView.CheckJackpot(isTakeJackpot, totalWin),false);
        slotView.CheckTimeShowPrize(winNormalValue);
        toDoList.AddWork(()=>this.UpdateMutil(extendMatrixDescription, totalWin, isEndFree),true);
        toDoList.AddWork(()=>slotView.ShowEffectLightBG(),false);
        if(!this.slotView.isFree && totalWin > 0 || isEndFree)
            toDoList.Wait(0.8);
        if(slotView.isSpeed)
            toDoList.Wait(0.3);
        toDoList.AddWork(()=>slotView.ActiveButtonMenu(),false);
        //check item
        toDoList.AddWork(()=>slotView.ActionAutoSpin(),false);
        toDoList.Play();
    },

    UpdateMutil(multi, totalWin, isEndFree = false){
        let value = parseInt(multi);
        if(value != this.slotView.MultiSave){
            this.toDoListNormal.CreateList();
            this.toDoListNormal.AddWork(()=>this.itemMultiUI.setAnimation(0, "active-thay doi he so", false), false);
            this.toDoListNormal.Wait(0.5);
            this.toDoListNormal.AddWork(()=>{
                if(this.slotView.isFree){
                    this.itemMultiUI.setSkin("v-x"+multi);
                }else{
                    this.itemMultiUI.setSkin("d-x"+multi);
                }
            }, false);
            this.toDoListNormal.Wait(0.8);
            this.toDoListNormal.AddWork(()=>this.itemMultiUI.setAnimation(0, "waiting", true), false);
            this.toDoListNormal.Play();
        }
        if(this.slotView.isFree){
            let listItem = this.slotView.spinManager.listItem;
            for(let i = 0; i < listItem.length; i++) {
                listItem[i].ShowEffectWinFree();
            }
        }else{
            let listItem = this.slotView.spinManager.listItem;
            for(let i = 0; i < listItem.length; i++) {
                listItem[i].ShowEffectWinNormal();
            }
        }
        this.slotView.AnimTower(value);
        if(isEndFree)
            this.slotView.PlayAnimBg();
        else if(totalWin > 0)
            this.slotView.PlayAnimBg();
        else
            this.slotView.toDoList.DoWork();
    },

    CheckRandomWild() {

    },

    CheckBonus() {
        
    },

    EndBonus() { 
        
    },

    CheckFreeWild() {

    },

    EndFree(){
        for(let i = 0; i < this.listItemWildFree.length; i++) {
            if(this.listItemWildFree[i] != null) {
                this.listItemWildFree[i].node.destroy();
            }
        }
        this.listItemWildFree = [];

        let listItem = this.slotView.spinManager.listItem;
        for(let i = 0; i < listItem.length; i++) {
            listItem[i].ShowEffectWinNormal();
        }
    },

    ParseMatrix(matrixData) {
        let matrixStr = matrixData.split(",");
        let matrix = [];
        for(let i = 0; i < matrixStr.length; i++) {
            matrix[i] = parseInt(matrixStr[i]);

        }
        // this.test++;
        return matrix;
    },

    UpdateUIMutilNormal(){
        this.itemMultiUI.setSkin("d-x1");
    },

    UpdateUIMutilFree(){
        this.itemMultiUI.setSkin("v-x1");
        
        let listItem = this.slotView.spinManager.listItem;
        for(let i = 0; i < listItem.length; i++) {
            listItem[i].ShowEffectWinFree();
        }
    },
});
