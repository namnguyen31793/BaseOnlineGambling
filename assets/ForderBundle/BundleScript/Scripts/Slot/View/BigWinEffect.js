cc.Class({
    extends: cc.Component,
    ctor() {
        this.time = 0;
        this.isRun = false;
        this.stateClick = 0;
        this.countTime = 0;
        this.toDoList = null;
        this.slotView = null;
        this.winMoney = 0;
        this.isUpdateWinValue = false;
        this.isUpdateWallet = false;
        this.countShowAds = 0;
        this.buttonX2 = null;
        this.isX2 = false;
    },

    properties: {
        isBattle: false,
        mark : cc.Node,
        lbBigWin : cc.Label,
        content : cc.Node,
        lbMoney : require("LbMonneyChange"),
        imgSkeleton : sp.Skeleton,  
        nodeParticle : cc.Node,
        AllWin_Skeleton : sp.Skeleton,  
        BigWin_Skeleton : sp.Skeleton,  
        MegaWin_Skeleton : sp.Skeleton,  
        SuperWin_Skeleton : sp.Skeleton,  
    },

    start() {
        this.countShowAds = 0;
        let current = this;
        // Global.Bundle.load("GamePrefabs/ButtonX2", cc.Prefab, (err, prefab) => {
        //     current.buttonX2 = cc.instantiate(prefab);
        //     current.buttonX2.parent = current.node;
        //     current.buttonX2.setPosition(cc.v2(0,-125));
        //     current.buttonX2.active = current.isX2;
        // })
    },

    ShowBigWin(winMoney, betValue, toDoList, slotView, isX2 = false, isUpdateWinValue = true, isUpdateWallet = false) {
        this.slotView = slotView;
        this.winMoney = winMoney;
        if(this.content)
            this.content.active = true;
        if(this.nodeParticle)
            this.nodeParticle.active = true;
        this.isUpdateWinValue = isUpdateWinValue;
        this.isUpdateWallet = isUpdateWallet;
        this.isX2 = isX2;
        if(this.buttonX2) {
            if(isX2 && !slotView.isFree && !slotView.isBonus) {
                this.buttonX2.active = true;
            } else {
                this.buttonX2.active = false;
            }
        }
        
        this.RunEffect(false, winMoney, betValue, toDoList);
        if(this.isBattle) {
            this.scheduleOnce(()=>{
                this.ClickEndRunMoney();
            } ,Global.RandomNumber(1,5));
        }
    },

    ShowJackpot(winMoney, betValue, toDoList, slotView, isX2 = false, isUpdateWinValue = true, isUpdateWallet = false) {
        this.slotView = slotView;
        this.winMoney = winMoney;
        if(this.content)
            this.content.active = true;
        if(this.nodeParticle)
            this.nodeParticle.active = true;
        this.isUpdateWinValue = isUpdateWinValue;
        this.isUpdateWallet = isUpdateWallet;
        this.isX2 = isX2;
        if(this.buttonX2) {
            if(isX2 && !slotView.isFree && !slotView.isBonus) {
                this.buttonX2.active = true;
            } else {
                this.buttonX2.active = false;
            }
        }
        this.RunEffect(true, winMoney, betValue, toDoList);
    },

    RunEffect(isJackpot, winMoney, betValue, toDoList) {
        this.toDoList = toDoList;
        this.AllWin_Skeleton.node.active = false;
        this.BigWin_Skeleton.node.active = false;
        this.MegaWin_Skeleton.node.active = false;
        this.SuperWin_Skeleton.node.active = false;
        this.imgSkeleton.node.active = false;
        let heso = winMoney/betValue;
        if(heso <= 4)
            this.time = heso / 4;
        else if(heso <= 12)
            this.time = heso / 9;
        else if(heso <= 36)
            this.time = heso / 15;
        else if(heso <= 108)
            this.time = heso / 30;
        else if(heso <= 324)
            this.time = heso / 50;
        else  if(heso <= 972)
            this.time = heso / 90;
        else this.time = heso / 110;
        if(this.time > 15)
            this.time = 15;
        this.mark.active = true;
        for(let i = 0; i < this.node.children.length; i++)
            this.node.children[i].active = true;
        let line = this.slotView.lineData;
        if(isJackpot){
            if(this.AllWin_Skeleton) {
                this.AllWin_Skeleton.setAnimation(0, 'animation', false);
                /*
                this.scheduleOnce(()=>{
                    this.imgSkeleton.timeScale = 1;
                    this.imgSkeleton.setAnimation(0, 'allwin-tienchay', true);
                } , 0.8);  
                */
            }
            
        }else{
            if(this.imgSkeleton) {
               
                /*
                this.scheduleOnce(()=>{
                    this.imgSkeleton.timeScale = 1;
                    this.imgSkeleton.setAnimation(0, 'bigwin-tienchay', true);
                } , 1);  
                */
                if((heso/line) >= 20){
                    this.SuperWin_Skeleton.node.active = true;
                    this.SuperWin_Skeleton.setAnimation(0, 'animation', false);
                    /*
                    this.scheduleOnce(()=>{
                        this.imgSkeleton.timeScale = 2;
                        this.imgSkeleton.setAnimation(0, 'superwin-tienchay', true);
                    } , 4); 
                    */
                }
                else if((heso/line) >= 10){
                    this.MegaWin_Skeleton.node.active = true;
                    this.MegaWin_Skeleton.setAnimation(0, 'animation', false);
                    /*
                    this.scheduleOnce(()=>{
                        this.imgSkeleton.timeScale = 1.5;
                        this.imgSkeleton.setAnimation(0, 'megawin-tienchay', true);
                    } , 2.5); 
                    */
                }
                else
                {
                    this.BigWin_Skeleton.node.active = true;
                    this.BigWin_Skeleton.setAnimation(0, 'animation', false);
                }
                
                
            }
            
        }
        
        this.lbBigWin.string = "";
        this.lbBigWin.node.active = true;
        this.lbMoney.reset();
        this.lbMoney.time = this.time;
        this.scheduleOnce(()=>{
            this.lbMoney.setMoney(winMoney);
        } , 0.5);  
        this.time += 3;
        this.isRun = true;
        this.stateClick = 0;
        this.countTime = 0;
        
    },

    EndBigWin() {
        cc.log("end BigWin");
        this.AllWin_Skeleton.node.active = false;
        this.BigWin_Skeleton.node.active = false;
        this.MegaWin_Skeleton.node.active = false;
        this.SuperWin_Skeleton.node.active = false;
       // this.imgSkeleton.node.active = false;

        for(let i = 0; i < this.node.children.length; i++)
            this.node.children[i].active = false;
        this.mark.active = false;
        /*
        if(this.imgSkeleton)
            this.imgSkeleton.loop = false;
            */
        if(this.nodeParticle)
            this.nodeParticle.active = false;
        //game nổ sập đã cộng tiền ở các lượt rơi, k cộng tiền 1 lần nữa ở bigwin
        if(this.isUpdateWinValue)
            this.slotView.UpdateWinValue(this.winMoney);
        else
            this.slotView.menuView.ShowWinValueCache();
        cc.log("take balance "+this.isUpdateWallet);
        if(this.isUpdateWallet) {
            if(!this.slotView.isBattle) {
                require("WalletController").getIns().TakeBalance(this.slotView.slotType)
            }
        }
        if(this.content)
            this.content.active = false;
        this.isRun = false;
        
        this.toDoList.DoWork();
        this.CheckShowInterstitial();
    },

    CheckShowInterstitial() {
    },

    ClickEndRunMoney() {
        cc.log("ClickEndRunMoney "+this.stateClick);
        if(this.stateClick == 0) {
            this.stateClick = 1;
            if(this.countTime < this.time - 3) {
                this.countTime = this.time - 3;
                this.lbMoney.EndRun();
            }
        } else if(this.stateClick == 1) {
            this.EndBigWin();
        }
    },

    update(dt) {
        if(this.isRun) {
            this.countTime += dt;
            if(this.countTime >= this.time) {
                cc.log("update EndBigWin");
                this.EndBigWin();
            }
        }
    },
});
