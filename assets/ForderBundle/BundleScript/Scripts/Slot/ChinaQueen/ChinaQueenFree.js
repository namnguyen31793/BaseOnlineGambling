cc.Class({
    extends: require("SlotFreeManager"),
    ctor() {
        this.listEffect = [];
        this.cacheNumQueen = 0;
        this.listTodoListEffect = [];
    },

    properties: {
        freeTurn : cc.Animation,
        effectChangeTurn : cc.Animation,
        animFree : cc.Animation,
        lbNumQueen : cc.Label,
        effectUpdateNumQueen : cc.Animation,
        effectChangeBgFree : cc.Animation,
        effectLight : cc.Node,
        startPos : cc.Node,
        listTypeItemChange : {
            default: [],
            type: cc.Node,
        },
        nodeNotifyNumberChange : cc.Sprite,
        nodeNotifyNumberChangeSprite : {
            default: [],
            type: cc.SpriteFrame,
        },
        nodeNotifyNumberChangeSpriteEng : {
            default: [],
            type: cc.SpriteFrame,
        },
        nodeWaitFree : cc.Node,
    },

    ShowFree(numberFree, extendMatrix, isNotify, lineWin, winNormalValue = 0) {
        this.toDoList.CreateList();
        this.numberFreeSpin = numberFree;
        cc.log(isNotify);
        if(isNotify && numberFree > 0 && !this.slotView.isFree) {
            this.ClearTotalWinCache();
            this.toDoList.Wait(1);
            this.toDoList.AddWork(()=>{
                this.slotView.effectManager.ShowNotifyFree(numberFree);
            }, false);
            this.toDoList.Wait(1.5);
            this.toDoList.AddWork(()=>{
                this.notifyFree.active = false;
            }, false);
        }
        if(this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                this.SetTextFree();
                this.effectChangeTurn.play();
            }, false);
            this.toDoList.AddWork(()=>this.ShowAnimQueen(), true);
            this.toDoList.AddWork(()=>this.UpdateNumberQueen(extendMatrix), false);
            //show light
            this.toDoList.AddWork(()=>{
                let listPos = this.slotView.normalManager.listPosItemChange;
                let listIndex = this.slotView.normalManager.listIndexItemChange;
                //khong co list item thi chay luon todolist cuar free
                if(listPos == null || listPos.length == 0)
                    this.toDoList.DoWork();
                for(let i = 0; i < listPos.length; i++) {
                    if(listPos[i] != null) {
                        //component
                        let eff = cc.instantiate(this.effectLight);
                        eff.parent = this.effectLight.parent;
                        eff.setPosition(this.startPos.getPosition());
                        eff.active = true;
                        eff.getComponent(cc.ParticleSystem).enabled  = false;
                        this.listEffect[this.listEffect.length] = eff;
                        let toDoListEffect = eff.addComponent("ToDoList");
                        
                        //todolist obj
                        toDoListEffect.CreateList();
                        let time = 0.1+0.4*i;
                        toDoListEffect.Wait(time);
                        toDoListEffect.AddWork(()=>{
                            let pos = listPos[i];
                            eff.runAction(cc.moveTo(0.4,pos));
                            eff.getComponent(cc.ParticleSystem).enabled  = true;
                        }, false);
                        toDoListEffect.Wait(0.5);
                        toDoListEffect.AddWork(()=>{
                            eff.getComponent(cc.ParticleSystem).enabled  = false;
                            this.ShowAnimChangeItem(listIndex[i]);
                        }, false);
                        toDoListEffect.Wait(0.6);
                        toDoListEffect.AddWork(()=>{
                            //cuoi cung vong for thi chay lai todolist cua free
                            if(i == (listPos.length-1))
                                this.toDoList.DoWork();
                        }, false);
                        toDoListEffect.Play()
                    }
                }
            }, true);
            if(winNormalValue > 0){
                this.toDoList.AddWork(()=>this.slotView.UpdateLineWinData(lineWin),false);
                this.toDoList.AddWork(()=>this.UpdateMoneyResult(winNormalValue, this.toDoList, true),true);
            }
            this.toDoList.AddWork(()=>{
                for(let i = 0; i < this.listEffect.length; i++) {
                    this.listEffect[i].destroy();
                }
                this.listEffect = [];
            }, false);
        }
        if(numberFree > 0 && !this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                if(Global.language == "vi") {
                    this.nodeNotifyNumberChange.spriteFrame = this.nodeNotifyNumberChangeSprite[0];
                } else {
                    this.nodeNotifyNumberChange.spriteFrame = this.nodeNotifyNumberChangeSpriteEng[0];
                }
            }, false);
            this.toDoList.Wait(1);
            this.toDoList.AddWork(()=>{
                this.GetTotalWinCache();
                this.SetTextFree();
                this.slotView.isFree = true;
                this.playAnimShowFree(true);
                this.ActiveItemChangeByQueen(0);
            }, false);
            this.toDoList.Wait(1);
        }
        if(numberFree == 0 && this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                this.slotView.isFree = false;
                this.slotView.ShowNotifyWinFree(this.totalWin);
            }, false);
            this.toDoList.Wait(2);
            this.toDoList.AddWork(()=>{
                this.slotView.HideNotifyWinFree();
                this.SetToTalWinValue(0);
                this.lbNumQueen.string ="0";
                this.playAnimShowFree(false);
                this.nodeNotifyNumberChange.node.active = false;
                this.nodeWaitFree.active = true;
            }, false);
            this.toDoList.Wait(1);
        }
        this.toDoList.AddWork(()=>{
            this.slotView.toDoList.DoWork();
        }, false);
        this.toDoList.Play();
    },

    playAnimShowFree(isStart){
        if(!isStart){
            this.freeTurn.play("EffectHideFree");
            this.animFree.play("HideNodeQueenFree");
            this.effectChangeBgFree.play("EffectHideBgFree");
        }else{
            this.freeTurn.play("EffectShowFree");
            this.animFree.play("ShowNodeQueenFree");
            this.effectChangeBgFree.play("EffectShowBgFree");
        }
    },

    ShowAnimQueen() {
        this.slotView.ChangeQueenEffectFree();
    },

    ShowAnimChangeItem(index){
        this.slotView.ChangeItemEffectFree(index);
    },

    UpdateNumberQueen(num){
        if(num == this.cacheNumQueen)
            return;
        this.cacheNumQueen = num;
        this.lbNumQueen.string = num;
        this.ActiveItemChangeByQueen(num);
        this.effectUpdateNumQueen.play();
    },

    ActiveItemChangeByQueen(num){
        this.nodeNotifyNumberChange.node.active = true;
        this.nodeWaitFree.active = false;
        for(let i = 0; i < this.listTypeItemChange.length; i++){
            this.listTypeItemChange[i].active = false;
        }
        if(num >=3){
            this.listTypeItemChange[0].active = true;
        }
        if(num >=5){
            this.listTypeItemChange[1].active = true;
        }
        if(num >=9){
            this.listTypeItemChange[2].active = true;
        }
        if(num >=15){
            this.listTypeItemChange[3].active = true;
        }
        if(Global.language == "vi") {
            if(num < 3)
                this.nodeNotifyNumberChange.spriteFrame = this.nodeNotifyNumberChangeSprite[0];
            else if(num < 5)
                this.nodeNotifyNumberChange.spriteFrame = this.nodeNotifyNumberChangeSprite[1];
            else if(num < 9)
                this.nodeNotifyNumberChange.spriteFrame = this.nodeNotifyNumberChangeSprite[2];
            else
                this.nodeNotifyNumberChange.spriteFrame = this.nodeNotifyNumberChangeSprite[3];
        } else {
            if(num < 3)
                this.nodeNotifyNumberChange.spriteFrame = this.nodeNotifyNumberChangeSpriteEng[0];
            else if(num < 5)
                this.nodeNotifyNumberChange.spriteFrame = this.nodeNotifyNumberChangeSpriteEng[1];
            else if(num < 9)
                this.nodeNotifyNumberChange.spriteFrame = this.nodeNotifyNumberChangeSpriteEng[2];
            else
                this.nodeNotifyNumberChange.spriteFrame = this.nodeNotifyNumberChangeSpriteEng[3];
        }
    }
});
