
cc.Class({
    extends: require("BigWinEffect"),

    properties: {
    },
    
    RunEffect(isJackpot, winMoney, betValue, toDoList) {
        this.toDoList = toDoList;
        this.AllWin_Skeleton.node.active = false;
        this.BigWin_Skeleton.node.active = false;
        this.MegaWin_Skeleton.node.active = false;
        this.SuperWin_Skeleton.node.active = false;

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

        if(isJackpot){
            this.AllWin_Skeleton.node.active = true;
            this.AllWin_Skeleton.setAnimation(0, 'Jackpot', false);
        }else{
            this.BigWin_Skeleton.node.active = true;
            this.BigWin_Skeleton.setAnimation(0, 'Bigwin', false);
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
        cc.log("Run Effect "+isJackpot+" winMoney "+winMoney+" betValue "+betValue+" heso "+heso+" -this.time "+this.time);
        
    },
});
