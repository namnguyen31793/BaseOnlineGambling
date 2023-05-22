
let NUMBER_COLUM_MATRIX = 5;

cc.Class({
    extends: require("SlotNormalGameManager"),

    properties: {

        wildContent : cc.Node,
        itemWildJump : cc.Node,
        listGift :{
            default : [],
            type : cc.Animation
        },
        listPosGift :{
            default : [],
            type : cc.Node
        },
        effectWin : cc.Node,
        posNumberFree : cc.Node,
        posValueText : cc.Node,
        itemWildAlice : cc.Node,
    },

    ctor() {
        this.timerCurain = 0;
        this.isPlayTweenCurain = false;
        this.listLengthmatrix;
        this.toDoList = null;
        this.timerJackpot = 0;
        this.numJackpot = 0;
        this.currentNumJackpot = 0;
        this.timerRumTweenJackpot = 0;
        this.jumpPosData = null;
        this.listWild = [];
        this.listWildAlice = [];
        this.listEffect = [];
    },

    onLoad() {
        this.toDoList = this.node.addComponent("ToDoList");
    },
    

    OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData, extandMatrix) {
        this.slotView.OnUpdateMoney(accountBalance);
        //let extend = this.ParseExtendData(extandMatrix);
        this.resetWild();

        this.jumpPosData = [];
        if(extandMatrix !="")
            this.jumpPosData = JSON.parse(extandMatrix);
        this.SetLastViewMatrix();
        this.slotView.SetFreeSpin(freeSpin);
        this.slotView.UpdateTotalBetValue(totalBetValue);
        this.slotView.UpdateJackpotValue(jackpotValue);
        this.slotView.SetLastPrizeValue(lastPrizeValue);
        this.slotView.SetLineData(lineData);
        //this.slotView.toDoList.DoWork();
    },

    OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn, freeSpinLeft, totalWin, accountBalance, 
        currentJackpotValue, isTakeJackpot, extendMatrixDescription) {
            
        if(isTakeJackpot)
            winNormalValue = totalWin;
        let matrixInfo = this.ParseMatrix(matrix)
        
        this.jumpPosData = [];
        if(extendMatrixDescription!="")
            this.jumpPosData = JSON.parse(extendMatrixDescription);

        this.slotView.UpdateMatrix(matrixInfo);

        let mAccountBalance = accountBalance;
        if(this.slotView.isBonus)
            mAccountBalance = accountBalance-winBonusValue;
        this.slotView.UpdateMoneyNormalGame(winNormalValue, mAccountBalance);
        let toDoList = this.slotView.toDoList;
        let slotView = this.slotView;
        toDoList.CreateList();
        toDoList.AddWork(()=>{
            this.SetJumpItem(toDoList);
        }, true);
        toDoList.AddWork(()=>slotView.UpdateJackpotValue(currentJackpotValue),false);
        toDoList.AddWork(()=>slotView.GetSpinResult(),true);
        toDoList.AddWork(()=>slotView.UpdateSessionID(spinId),false);
        toDoList.AddWork(()=>slotView.EndAnimPreWin(freeSpinLeft, bonusTurn),true);

        if(this.jumpPosData.length > 0){
            let isHaveGift = false;
            for(let i = 0; i < this.jumpPosData.length; i++){
                if(this.jumpPosData[i].V > 0)
                    isHaveGift = true;
            }
            if(isHaveGift)
                toDoList.Wait(3.5);
        }
        toDoList.AddWork(()=>slotView.SetFreeSpin(freeSpinLeft, true, this.ParseLineData(listLineWinData), winNormalValue, totalWin),true);

        if(!slotView.isFree){
            toDoList.AddWork(()=>slotView.UpdateLineWinData(this.ParseLineData(listLineWinData)),false);
            toDoList.AddWork(()=>slotView.UpdateMoneyResult(winNormalValue, totalWin, isTakeJackpot, false),true);
        }
        //toDoList.AddWork(()=>slotView.CheckBonus(winBonusValue, totalWin, accountBalance, bonusTurn),true);
        slotView.CheckTimeShowPrize(winNormalValue);
        toDoList.AddWork(()=>slotView.ActiveButtonMenu(),false);
        toDoList.AddWork(()=>slotView.ActionAutoSpin(),false);
        //check item
        toDoList.AddWork(()=>this.slotView.ShowCommandUseItemBonusTurn(this.slotView.toDoList), true);
        toDoList.AddWork(()=>slotView.ActionAutoSpin(),false);
        toDoList.Play();
    },

    CheckBonus(){

    },

    ParseMatrix(matrixData) {
        let matrixStr = matrixData.split(",");
        let matrix = [];
        for(let i = 0; i < matrixStr.length; i++) {
            matrix[i] = parseInt(matrixStr[i]);
        }
        return matrix;
    },

    ResetUINewTurn(){
        if(this.slotView.isFree){
            //reset tao hop qua moi
        }
        else
            this.ActiveColorButtonNormalGame();
    },

    ActiveColorButtonNormalGame(){
        this.slotView.ActiveColorButtonNormalGame();
    },

    //reset luc het free
    resetWild() {
        this.listWild = [];
        this.listWildAlice = [];
        for(let i = this.wildContent.children.length - 1; i >=0; i--) {
            this.wildContent.children[i].destroy();
        }
    },

    SetJumpItem(toDoList) {
        if(this.jumpPosData.length == 0) {
            cc.log("---tho nhay");
            toDoList.DoWork();
        } else {
            
            let timeDelayGift1 = 0
            let timeDelayGift2 = 0
            let timeDelayGift3 = 0
            var isHaveAlice = false;

            let listItem = this.slotView.spinManager.listItem;
            //this.wildContent.setSiblingIndex(this.wildContent.parent.children.length-1);
            //xoa cac wild da nhay toi o dau
            for(let i = this.listWild.length - 1; i >= 0; i--) {
                if(this.listWild[i].pos == -1){
                    this.listWild[i].data.destroy();
                    this.listWild.splice(i, 1);
                }
            }
            for(let i = 0; i < this.listWild.length; i++) {
                this.listWild[i].isMove = false;
            }
            //alice
            for(let i = this.listWildAlice.length - 1; i >= 0; i--) {
                if(this.listWildAlice[i].pos == -1){
                    this.listWildAlice[i].data.destroy();
                    this.listWildAlice.splice(i, 1);
                }
            }
            for(let i = 0; i < this.listWildAlice.length; i++) {
                this.listWildAlice[i].isMove = false;
            }
            cc.log("-------------this.jumpPosData");
            cc.log(this.jumpPosData);
            for (let i = 0; i < this.jumpPosData.length; i++) {
                if(this.jumpPosData[i].ID == 3){    //wild jump
                    if(this.jumpPosData[i].SP != 0 && this.jumpPosData[i].EP != 0) {
                        let hasWild = false;
                        for(let j = 0; j < this.listWild.length; j++) {
                            if(this.listWild[j].pos === this.jumpPosData[i].SP && !this.listWild[j].isMove) {
                                hasWild = true;
                                this.listWild[j].isMove = true;
                                let posEnd = listItem[this.jumpPosData[i].EP-1].node.getPosition();
                                this.listWild[j].pos = this.jumpPosData[i].EP;
                                let acPlayAnim =  cc.callFunc(() => { 
                                    let anim = this.listWild[j].data.getChildByName("Item").getComponent(dragonBones.ArmatureDisplay);
                                    anim.playAnimation("active", 1);
                                });
                                let acMove =  cc.callFunc(() => { 
                                    this.listWild[j].data.runAction(cc.moveTo(0.5, cc.v2(posEnd.x, posEnd.y)).easing(cc.easeSineOut()));
                                });
                                this.listWild[j].data.runAction(cc.sequence(acPlayAnim, cc.delayTime(0.2), acMove));
                            }
                        }
                        if(!hasWild) {
                            let jumpNew = cc.instantiate(this.itemWildJump);
                            jumpNew.parent = this.wildContent;
                            jumpNew.setPosition(listItem[this.jumpPosData[i].EP-1].node.getPosition());
                            jumpNew.active = true;
                            jumpNew.scale = 1;
                            let wild = {
                                pos : this.jumpPosData[i].EP,
                                data : jumpNew,
                                isMove : true,  //tao moi khi moi jump khong nhay
                            }
                            this.listWild.push(wild);
                        }
                    }
                    else if(this.jumpPosData[i].SP == 0){    //jump moi
                        let jumpNew = cc.instantiate(this.itemWildJump);
                        jumpNew.parent = this.wildContent;
                        jumpNew.setPosition(listItem[this.jumpPosData[i].EP-1].node.getPosition());
                        jumpNew.active = true;
                        jumpNew.opacity = 0;
                        //jumpNew.getComponent(cc.Animation).play("animShowWild");
                        let wild = {
                            pos : this.jumpPosData[i].EP,
                            data : jumpNew,
                            isMove : false,
                        }
                        let acShow =  cc.callFunc(() => {
                            wild.data.opacity = 255; 
                            let anim = wild.data.getChildByName("Item").getComponent(dragonBones.ArmatureDisplay);
                            anim.playAnimation("xuathientho", 1);
                        });
                        wild.data.runAction(cc.sequence(cc.delayTime(1), acShow));
                        this.listWild.push(wild);
                    }else if(this.jumpPosData[i].EP == 0){    //jump bien mat
                        for(let j = 0; j < this.listWild.length; j++) {
                            if(this.listWild[j].pos == this.jumpPosData[i].SP && !this.listWild[j].isMove) {
                                this.listWild[j].isMove = true;
                                let row = Math.floor(this.jumpPosData[i].SP/NUMBER_COLUM_MATRIX);
                                let startPos = this.listPosGift[row].getPosition();
                                let acPlayAnim =  cc.callFunc(() => { 
                                    let anim = this.listWild[j].data.getChildByName("Item").getComponent(dragonBones.ArmatureDisplay);
                                    anim.playAnimation("active", 1);
                                });
                                let acPlayJump =  cc.callFunc(() => { 
                                    this.listWild[j].data.runAction(cc.moveTo(0.5, startPos).easing(cc.easeSineOut()));                               
                                    this.listWild[j].pos = this.jumpPosData[i].EP;
                                });

                                let acClear = cc.callFunc(() => {
                                    //this.listWild[j].data.getComponent(cc.Animation).play("animHideWild"); 
                                    this.listWild[j].data.getChildByName("Item").getComponent(dragonBones.ArmatureDisplay).playAnimation("bienmat", 1);
                                });
                                if(this.jumpPosData[i].V > 0){
                                    timeDelayGift1 = 1;
                                    timeDelayGift2 = 0.7;
                                    timeDelayGift3 = 1.8;
                                }
                                let acShowGift = cc.callFunc(() => {
                                    if(this.jumpPosData[i].V > 0){
                                        this.listGift[row].play("animHideGift");
                                    }
                                });
                                let acShowMoney = cc.callFunc(() => {
                                    if(this.jumpPosData[i].V > 0){
                                        this.CreateEffectWinGift(startPos, this.jumpPosData[i].V);
                                    }
                                });
                                let acReset = cc.callFunc(() => {
                                    if(this.jumpPosData[i].V > 0){
                                        for(let i = 0; i < this.listEffect.length; i++) {
                                            this.listEffect[i].destroy();
                                        }
                                        this.listEffect = [];
                                        this.listGift[row].play("animShowGift");
                                    }
                                });
                                this.listWild[j].pos = -1;
                                this.listWild[j].data.runAction(cc.sequence(acPlayAnim, cc.delayTime(0.2), acPlayJump
                                , cc.delayTime(0.5), acClear, cc.delayTime(timeDelayGift1), acShowGift
                                , cc.delayTime(timeDelayGift2), acShowMoney, cc.delayTime(timeDelayGift3), acReset));
                            }
                        }
                    }
                }
                //alice
                if(this.jumpPosData[i].ID == 34){    //wild jump alice
                    if(isHaveAlice)
                        continue;
                    if(this.jumpPosData[i].SP != 0 && this.jumpPosData[i].EP != 0) {
                        let hasWild = false;
                        if(this.listWildAlice.length == 0){
                            let jumpNew = cc.instantiate(this.itemWildAlice);
                            jumpNew.parent = this.wildContent;
                            jumpNew.setPosition(cc.v2(listItem[this.jumpPosData[i].EP-1].node.getPosition().x, 0));
                            jumpNew.active = true;
                            jumpNew.scale = 1;
                            let wild = {
                                pos : this.jumpPosData[i].EP,
                                data : jumpNew,
                                isMove : true,  //tao moi khi moi jump khong nhay
                            }
                            
                            let anim = jumpNew.getChildByName("Item").getComponent(sp.Skeleton);
                            anim.setAnimation(0, "xuat hien", false);

                            this.listWildAlice.push(wild);
                            isHaveAlice = true;
                        }
                        for(let j = 0; j < this.listWildAlice.length; j++) {
                            if(this.listWildAlice[j].pos === this.jumpPosData[i].SP && !this.listWildAlice[j].isMove) {
                                hasWild = true;
                                this.listWildAlice[j].isMove = true;
                                let posEnd = listItem[this.jumpPosData[i].EP-1].node.getPosition();
                                this.listWildAlice[j].pos = this.jumpPosData[i].EP;
                                let acPlayAnim =  cc.callFunc(() => { 
                                    let anim = this.listWildAlice[j].data.getChildByName("Item").getComponent(sp.Skeleton);
                                    anim.setAnimation(0, "jump", false);
                                });
                                let acMove =  cc.callFunc(() => { 
                                    this.listWildAlice[j].data.runAction(cc.moveTo(0.5, cc.v2(posEnd.x, 0)).easing(cc.easeSineOut()));
                                });
                                this.listWildAlice[j].data.runAction(cc.sequence(acPlayAnim, cc.delayTime(0.7), acMove));
                                isHaveAlice = true;
                            }
                        }
                    }
                    else if(this.jumpPosData[i].SP == 0){    //jump moi
                        let jumpNew = cc.instantiate(this.itemWildAlice);
                        jumpNew.parent = this.wildContent;
                        jumpNew.setPosition(cc.v2(listItem[this.jumpPosData[i].EP-1].node.getPosition().x, 0));
                        jumpNew.active = true;
                        jumpNew.opacity = 0;
                        //jumpNew.getComponent(cc.Animation).play("animShowWild");
                        let wild = {
                            pos : this.jumpPosData[i].EP,
                            data : jumpNew,
                            isMove : false,
                        }
                        let anim = wild.data.getChildByName("Item").getComponent(sp.Skeleton);
                        anim.setAnimation(0, "xuat hien", false);

                        let acShow =  cc.callFunc(() => {
                            wild.data.opacity = 255; 
                            let anim = wild.data.getChildByName("Item").getComponent(sp.Skeleton);
                            anim.setAnimation(0, "waiting", false);
                        });
                        wild.data.runAction(cc.sequence(cc.delayTime(1), acShow));
                        this.listWildAlice.push(wild);
                        isHaveAlice = true;
                    }else if(this.jumpPosData[i].EP == 0){    //jump bien mat
                        if(this.jumpPosData[i].ID == 34){
                            //neu trung id wild thi dien anim nhay, khong thi wait show gift
                            var isMatchWildAliceClear = false;
                            for(let j = 0; j < this.listWildAlice.length; j++) {
                                if(this.listWildAlice[j].pos == this.jumpPosData[i].SP && !this.listWildAlice[j].isMove) {
                                    isMatchWildAliceClear = true;
                                    this.listWildAlice[j].isMove = true;
                                    let row = Math.floor(this.jumpPosData[i].SP/NUMBER_COLUM_MATRIX);
                                    let startPos = cc.v2(this.listPosGift[row].getPosition().x, 0);
                                    let acPlayAnim =  cc.callFunc(() => { 
                                        let anim = this.listWildAlice[j].data.getChildByName("Item").getComponent(sp.Skeleton);
                                        anim.setAnimation(0, "jump", false);
                                    });
                                    let acPlayJump =  cc.callFunc(() => { 
                                        this.listWildAlice[j].data.runAction(cc.moveTo(0.5, startPos).easing(cc.easeSineOut()));                               
                                        this.listWildAlice[j].pos = this.jumpPosData[i].EP;
                                    });

                                    let acClear = cc.callFunc(() => {
                                        let anim = this.listWildAlice[j].data.getChildByName("Item").getComponent(sp.Skeleton);
                                        anim.setAnimation(0, "bien mat", false);
                                    });
                                    if(this.jumpPosData[i].V > 0){
                                        timeDelayGift1 = 0.5;
                                        timeDelayGift2 = 0.6;
                                        timeDelayGift3 = 1.8;
                                    }
                                    let acShowGift = cc.callFunc(() => {
                                        if(this.jumpPosData[i].V > 0){
                                            this.listGift[row].play("animHideGift");
                                        }
                                    });
                                    let acShowMoney = cc.callFunc(() => {
                                        if(this.jumpPosData[i].V > 0){
                                            this.CreateEffectWinGift(startPos, this.jumpPosData[i].V);
                                        }
                                    });
                                    let acReset = cc.callFunc(() => {
                                        if(this.jumpPosData[i].V > 0){
                                            for(let i = 0; i < this.listEffect.length; i++) {
                                                this.listEffect[i].destroy();
                                            }
                                            this.listEffect = [];
                                            this.listGift[row].play("animShowGift");
                                        }
                                    });
                                    this.listWildAlice[j].pos = -1;
                                    this.listWildAlice[j].data.runAction(cc.sequence(acPlayAnim, cc.delayTime(0.7), acPlayJump
                                    , cc.delayTime(0.5), acClear, cc.delayTime(timeDelayGift1), acShowGift
                                    , cc.delayTime(timeDelayGift2), acShowMoney, cc.delayTime(timeDelayGift3), acReset));
                                }
                            }
                            if(!isMatchWildAliceClear){
                                let row = Math.floor(this.jumpPosData[i].SP/NUMBER_COLUM_MATRIX);
                                let startPos = this.listPosGift[row].getPosition().x;
                                let acClear = cc.callFunc(() => {
                                });
                                if(this.jumpPosData[i].V > 0){
                                    timeDelayGift1 = 0.5;
                                    timeDelayGift2 = 0.6;
                                    timeDelayGift3 = 1.8;
                                }
                                let acShowGift = cc.callFunc(() => {
                                    if(this.jumpPosData[i].V > 0){
                                        this.listGift[row].play("animHideGift");
                                    }
                                });
                                let acShowMoney = cc.callFunc(() => {
                                    if(this.jumpPosData[i].V > 0){
                                        this.CreateEffectWinGift(startPos, this.jumpPosData[i].V);
                                    }
                                });
                                let acReset = cc.callFunc(() => {
                                    if(this.jumpPosData[i].V > 0){
                                        for(let i = 0; i < this.listEffect.length; i++) {
                                            this.listEffect[i].destroy();
                                        }
                                        this.listEffect = [];
                                        this.listGift[row].play("animShowGift");
                                    }
                                });
                                this.listGift[row].node.runAction(cc.sequence(cc.delayTime(0.5), acClear, cc.delayTime(timeDelayGift1), acShowGift
                                , cc.delayTime(timeDelayGift2), acShowMoney, cc.delayTime(timeDelayGift3), acReset));
                            }
                        }
                    }
                }
            }
            //thoi gian cho ket thuc nhay
            this.scheduleOnce(()=>{
                toDoList.DoWork();
            } , 1+(timeDelayGift2));//+timeDelayGift3));  
        }
    },

    SetLastViewMatrix(){
        if(!this.jumpPosData) {
            
        } else {
            for(let i = 0; i < this.listWild.length; i++) {
                this.listWild[i].isMove = false;
            }
            let listItem = this.slotView.spinManager.listItem;
            var isCreateAlice = false;
            for (let i = 0; i < this.jumpPosData.length; i++) { //tao moi tat ca cac vi tri tru endpos = 0
                if(this.jumpPosData[i].ID == 3){
                    if(this.jumpPosData[i].EP != 0){
                        let jumpNew = cc.instantiate(this.itemWildJump);
                        jumpNew.parent = this.wildContent;
                        jumpNew.setPosition(listItem[this.jumpPosData[i].EP-1].node.getPosition());
                        jumpNew.active = true;
                        //jumpNew.getComponent(cc.Animation).play("animShowWild");
                        let anim = jumpNew.getChildByName("Item").getComponent(dragonBones.ArmatureDisplay);
                        anim.playAnimation("xuathientho", 1);
                        let wild = {
                            pos : this.jumpPosData[i].EP,
                            data : jumpNew,
                            isMove : false,
                        }
                        this.listWild.push(wild);
                    }
                }
                if(this.jumpPosData[i].ID == 34){
                    if(!isCreateAlice){
                        if(this.jumpPosData[i].EP != 0){
                            let jumpNew = cc.instantiate(this.itemWildAlice);
                            jumpNew.parent = this.wildContent;
                            jumpNew.setPosition(cc.v2(listItem[this.jumpPosData[i].EP-1].node.getPosition().x, 0));
                            jumpNew.active = true;
                            //jumpNew.getComponent(cc.Animation).play("animShowWild");
                            let anim = jumpNew.getChildByName("Item").getComponent(sp.Skeleton);
                            anim.setAnimation(0, "xuat hien", false);
                            let wild = {
                                pos : this.jumpPosData[i].EP,
                                data : jumpNew,
                                isMove : false,
                            }
                            this.listWildAlice.push(wild);
                            isCreateAlice = true;
                        }
                    }
                }
            }
        }
    },

    ClearWildEndFree() {
        for(let i = this.listWild.length - 1; i >= 0; i--) {
            this.listWild[i].data.destroy();
            this.listWild.splice(i, 1);
        }
        this.listWild = [];
        for(let i = this.listWildAlice.length - 1; i >= 0; i--) {
            this.listWildAlice[i].data.destroy();
            this.listWildAlice.splice(i, 1);
        }
        this.listWildAlice = [];
    },

    CreateEffectWinGift(pos, value){
        let eff = cc.instantiate(this.effectWin);
        eff.parent = this.effectWin.parent;
        eff.setPosition(pos);
        eff.active = true;
        let string = "";
        if(value < 10){
            string = "+"+ value;
            eff.getChildByName("light").active = true;
            //this.slotView.UpdateNumberFreeDrop(value);
        } else{
            string = "+"+  Global.Helper.formatNumber(value * this.slotView.GetBetValue()/100);
            eff.getChildByName("light").active = false;
            //this.slotView.SetLastPrizeDrop(value);
        }
        eff.getChildByName("text").getComponent(cc.Label).string = string;
        eff.getComponent(cc.Animation).play("animWimMoney");
        this.listEffect[this.listEffect.length] = eff;

        let timeMove = 0.6;
        let acMove = cc.callFunc(() => {
            let endPos = this.posNumberFree.getPosition();
            if(value > 10)
                endPos = this.posValueText.getPosition();
            eff.runAction(cc.moveTo(timeMove, endPos).easing(cc.easeSineOut()));         
        });

        let acUpdate = cc.callFunc(() => {
            if(value < 10){
                this.slotView.UpdateNumberFreeDrop(value);
            } else{
                this.slotView.SetLastPrizeDrop(value/100);
            }
        });

        eff.runAction(cc.sequence(cc.delayTime(1), acMove, cc.delayTime(timeMove), acUpdate));
    },

    playAnimShowGift(isShow){
        for(let i = 0; i < this.listGift.length; i++){
            if(isShow)
                this.listGift[i].play("animShowGift");
            else
                this.listGift[i].play("animHideGift");
        }
    },
    
    CheckTimeShowPrize(prizeValue) {
        let isSpeed = this.slotView.isSpeed;
        if(this.slotView.isBonus)
            isSpeed = false;
        if(prizeValue > 0) {
            let isBigWin = this.slotView.CheckBigWin(prizeValue);
            this.isWin = true;
            if(isBigWin)
                this.slotView.toDoList.Wait(3);
            else if(this.slotView.isAuto) {
                if(isSpeed)
                    this.slotView.toDoList.Wait(2.2);
                else this.slotView.toDoList.Wait(2.2);
            } else{
                this.slotView.toDoList.Wait(2);
            }
            
        } else {
            this.isWin = false;
            if(this.slotView.isAuto) {
                if(isSpeed)
                    this.slotView.toDoList.Wait(1.2);
                else this.slotView.toDoList.Wait(1.2);
            }             
            else  {
                this.slotView.toDoList.Wait(0.2);
            }
        }
    },

    lerp: function (value1, value2, amount) {
        amount = amount < 0 ? 0 : amount;
        amount = amount > 1 ? 1 : amount;
        return value1 + (value2 - value1) * amount;
    },
});
