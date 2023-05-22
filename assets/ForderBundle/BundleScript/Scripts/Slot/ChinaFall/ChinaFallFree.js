cc.Class({
    extends: require("SlotFreeManager"),
    ctor() {
        this.cacheValueMulti = 0;
        this.cacheTotalSpin = 0;
    },

    properties: {
        freeTurn : cc.Animation,
        effectChangeTurn : cc.Animation,
        animFree : cc.Animation,
        lbNumMulti : cc.Label,
        effectUpdateNumQueen : cc.Animation,
        effectChangeBgFree : cc.Animation,
        animLighting : cc.Animation,
    },

    ShowFree(numberFree, extendMatrix, isNotify, winNormalValue = 0) {
        this.toDoList.CreateList();
        this.numberFreeSpin = numberFree;
        if(extendMatrix == null || extendMatrix === "")
            extendMatrix = 1;
        if(isNotify && numberFree > 0 && !this.slotView.isFree) {
            //save số lượt
            cc.sys.localStorage.setItem("Key_Free_SnowFall" , numberFree);
            this.cacheTotalSpin = numberFree;
            this.ClearTotalWinCache();
            this.slotView.menuView.ResetValueCacheWin();

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
            //wait anim item Spec destroy
            this.toDoList.Wait(1);
            this.toDoList.AddWork(()=>this.UpdateNumberMulti(extendMatrix), false);
            
            //add show money free
            if(extendMatrix > 1 && winNormalValue > 0){
                //effect bay hệ số từ wild qua ô tiền
                this.toDoList.AddWork(()=>this.slotView.FlyLightToResultFree(winNormalValue/extendMatrix , extendMatrix),false);
                this.toDoList.Wait(1.5);
                //update tien lan 1 voi tien chua nhan he so multi);
                this.toDoList.AddWork(()=>this.slotView.PlayUpdateMoneyResultFree( winNormalValue/extendMatrix , extendMatrix),false);
                this.toDoList.Wait(1);
            }
            if(winNormalValue > 0)
                this.toDoList.AddWork(()=>this.UpdateMoneyResult(winNormalValue, this.toDoList, true),true);
        }
        if(numberFree > 0 && !this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                //this.animFree.play("HoaRong");
            }, false);
            this.toDoList.Wait(1);
            this.toDoList.AddWork(()=>{
                this.cacheTotalSpin = parseInt(cc.sys.localStorage.getItem("Key_Free_SnowFall")) || this.numberFreeSpin;
                this.SetTextFree();
                this.slotView.isFree = true;
                this.playAnimStartFree(true);
                this.UpdateNumberMulti(extendMatrix);
            }, false);
            this.toDoList.Wait(1);
        }
        if(numberFree == 0 && this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                this.slotView.HideNotifyWinFree();
                this.lbNumMulti.string ="";
                this.playAnimStartFree(false);
            }, false);
            this.toDoList.Wait(2);
            this.toDoList.AddWork(()=>{
                this.slotView.isFree = false;
                this.ShowTotalWin(this.toDoList);
            }, true);
        }
        this.toDoList.AddWork(()=>{
            this.slotView.toDoList.DoWork();
        }, false);
        this.toDoList.Play();
    },

    playAnimStartFree(isStart){
        this.animLighting.play("AnimLightingControl");
        if(isStart){
            this.freeTurn.play("EffectShowBoxFree");
            this.animFree.play("EffectShowFree");
            this.effectChangeBgFree.play("EffectShowBgFree");
        }else{
            this.freeTurn.play("EffectHideBoxFree");
            this.animFree.play("EffectHideFree");
            this.effectChangeBgFree.play("EffectHideBgFree");
        }
    },

    CheckItemWild() {

    },

    UpdateNumberMulti(num){
        if(this.cacheValueMulti != num)
            this.cacheValueMulti = parseInt(num);
        else
            return;
        this.lbNumMulti.string = num+"x";
        this.effectUpdateNumQueen.play();
    },
    
    UpdateNumberMultiDrop(){
        this.cacheValueMulti += 1;
        this.lbNumMulti.string = this.cacheValueMulti+"x";
        this.effectUpdateNumQueen.play();
    },

    UpdateNumberFreeDrop(num){
        this.numberFreeSpin += parseInt(num);
        this.cacheTotalSpin += parseInt(num);
        cc.sys.localStorage.setItem("Key_Free_SnowFall" , this.cacheTotalSpin);

        this.lbFreeTurn.string = this.numberFreeSpin.toString()+"/"+this.cacheTotalSpin.toString();
        this.effectChangeTurn.play();
    },

    SetTextFree()
    {
        this.lbFreeTurn.string = this.numberFreeSpin.toString()+"/"+this.cacheTotalSpin.toString();
    },
    
});
