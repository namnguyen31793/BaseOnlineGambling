var TIME_WAIT = 15;
cc.Class({
    extends: require("SlotBonusManager"),
    ctor() {
        this.listLevel = [];
        this.bet = 0;
        this.totalWin = 0;
    },

    properties: {

        listLb: {
            default: [],
            type: cc.Label,
        },
        btnSpin : cc.Button,
        
        listLevelSpr: {
            default: [],
            type: cc.Sprite,
        },
    },

    setInfo(bonusValue, betValue) {
        this.canTouch = false;
        this.lb_Win.string = "";
        this.indexClick = 0;
        this.curBonusWin = 0;
        this.totalWin = bonusValue;
        this.btnSpin.interactable = true;
        this.bet = betValue;

        this.reset();
        this.bonusData = this.convertDataBonus(bonusValue, betValue);

        this.clickLeft = this.bonusData.length;
        this.initItem();
        this.ResetCountTime();
    },

    reset(){
        //tao cac moc level
        this.listLevel = [];
        this.listLevel[0] = 0;
        this.listLevel[1] = 50;
        this.listLevel[2] = 100;
        this.listLevel[3] = 250;
        this.listLevel[4] = 500;
        this.listLevel[5] = 800;
        this.listLevel[6] = 1000;
        this.listLevel[7] = 1500;
        for(let i = 0; i < this.listLevelSpr.length; i++){
            this.listLevelSpr[i].enabled = false;
            this.listLevelSpr[i].getComponentInChildren(cc.Label).string = Global.Helper.formatNumber(this.listLevel[i+1]* this.bet);
        }
    },

    //createItem
    initItem() {
        for(let i = 0; i < this.listLb.length; i++){
            let acInit = cc.callFunc(() => {
                this.effectChangeText(this.listLb[i], "0");
            });
            this.node.runAction(cc.sequence(cc.delayTime(i * 0.05), acInit));
            if (i === (this.listLb.length-1)) this.canTouch = true;
        }
        this.lb_Win.string = Global.Helper.formatString(Global.MyLocalization.GetText("WIN_NEXT_BONUS_CASINO"),[Global.Helper.formatNumber(this.listLevel[this.indexClick +1]*this.bet)]);
    },

    handleClickSpin() {
        if (!this.canTouch)
            return;
        this.ResetCountTime();
        if (this.clickLeft > 0) {
            this.indexClick++;
            this.clickLeft--;
            this.clickCheck = true;
            for(let i = 0; i < this.listLevelSpr.length; i++){
                if(i < this.indexClick)
                    this.listLevelSpr[i].enabled = true;
            }
            for (let i = 0; i < this.bonusData.length; i++) {
                let data = this.bonusData[i];
                if (data.index === this.indexClick) {
                    this.handleSpin(data);
                }
            }

        }
        this.unscheduleAllCallbacks();
        //check het luot click chua
        if (this.clickLeft === 0 ) { 
            this.canTouch = false;
            this.btnSpin.interactable = false;
            //thong bao tien thang
            this.lb_Win.string = Global.Helper.formatString(Global.MyLocalization.GetText("WIN_BONUS_CASINO"),[Global.Helper.formatNumber(this.totalWin)]);
            setTimeout(() => {
                this.ClickPlayFast();
                this.isQuickPlay = false;
            }, 2000)
        }
    },

    handleSpin(data){
        this.canTouch = false;
        this.slotView.PlayWinMoney();
        this.curBonusWin = data.chip;

        //thong bao tien can luot tiep
        this.lb_Win.string = Global.Helper.formatString(Global.MyLocalization.GetText("WIN_NEXT_BONUS_CASINO"),[Global.Helper.formatNumber(this.listLevel[data.index +1]*this.bet)]);

        let listValue = this.convertValueToListString(data.chip);
        //fake vong quay
        for(let i = 0; i < this.listLb.length; i++){
            let acInit = cc.callFunc(() => {
                this.effectChangeText(this.listLb[i], listValue[i]);
            });
            this.node.runAction(cc.sequence(cc.delayTime(i * 0.05), acInit));
            if (i === (this.listLb.length-1)) this.canTouch = true;
        }
    },

    effectChangeText(label, text) {
        label.string = text;
        label.node.opacity = 0;
        label.node.y += 40;
        let action1 = cc.moveBy(0.3, cc.v2(0, -40)).easing(cc.easeBackOut());
        let action12 = cc.fadeIn(0.15);
        label.node.runAction(cc.spawn(action1, action12));
    },

    convertDataBonus(data, betValue) {

        if(data > 0) {
            let arrData = 0;
            for(let i = 0; i < this.listLevel.length; i++){
                if(data > this.listLevel[i]*betValue)
                    arrData ++;
            }
            let total = data/ betValue;
            let newList = [];
            for (let i = 0; i < arrData; i++) {
                let mutiplier = 0;
                if(i == arrData -1)
                    mutiplier = total;
                else if(i == arrData - 2)
                    mutiplier = this.listLevel[i+1]+ this.getRanNum(1,(total - this.listLevel[i+1])) ;
                else{
                    mutiplier = this.listLevel[i+1]+ this.getRanNum(1,(this.listLevel[i+2]- this.listLevel[i+1])) ;
                }
                let index = i+1;
                let bonusData = {
                    index: index,
                    idBonus: 211,
                    chip: mutiplier*betValue,
                    mutiplier: mutiplier,
                }
                newList.push(bonusData);
            }
            return newList;
        }else{
            return "";
        }
    },

    convertValueToListString(value){
        let text = value.toString();
        let lengthString = text.length;
        let newList = [];
        //tao list theo chieu dai o quay
        for(let i = 0; i < this.listLb.length; i++){
            if(i < lengthString){
                let element = text.charAt(lengthString-i-1);
                newList.push(element);
            }else{
                newList.push("0");
            }
        }
        return newList;
    },

    StartBonus(bonusValue, total, accountBalance) {
        this.toDoList.CreateList();
        this.toDoList.Wait(1);
        this.toDoList.AddWork(()=>{
            this.slotView.PlayBonusStart();
            this.notifyBonus.active = true;
        }, false);
        this.toDoList.Wait(1.5);
        this.toDoList.AddWork(()=>{
            this.notifyBonus.active = false;
            this.CountTimeAutoPlay(bonusValue, total, accountBalance);
            this.slotView.ShowBonusGame(bonusValue);
        }, true);
        this.toDoList.AddWork(()=>{
            this.slotView.PlayBonusEnd();
            this.slotView.effectManager.ShowNotify(this.bonusWin, null);
            // this.showResultBonus(this.bonusWin);
        }, false);
        this.toDoList.Wait(2);
        this.toDoList.AddWork(()=>{
            this.slotView.isBonus = false;
            this.bonusObj.active = false;
            this.slotView.effectManager.ClickCloseNotify(null);
            this.slotView.effectManager.ClickCloseBonus();
            // 
            this.slotView.toDoList.DoWork();
        }, false);
        this.toDoList.Play();
    },

    ClickPlayFast() {
        this.isQuickPlay = false;
        this.isEndBonus = true;
        this.isCheckAuto = true;
        this.countTime = 0;
        this.toDoList.DoWork();
        this.slotView.menuView.UpdateWinValue(this.totalWin);
        this.slotView.UpdateAccountBalance(this.accountBalance);
        //sua show popup
    },

    update(dt) {
        if(this.isQuickPlay) {
            this.countTime += dt;
            if(this.countTime >= TIME_WAIT) {
                this.ClickPlayFast();
                this.isQuickPlay = false;
            }
        }
    },
});
