cc.Class({
    extends: cc.Component,
    ctor() {
        this.bonusData = [];
        this.slotView = null;
        this.bonusWin = 0;
        this.totalWin = 0;
        this.accountBalance = 0;
        this.isQuickPlay = false;
        this.countTime = 0;
        this.isEndBonus = false;
        this.listItem = [];
        this.canTouch = false;
        this.listItemClicked = [];
        this.curBonusWin = 0;

        this.number_Item = 21;
        this.initPosItem = cc.v2(-375, 145);
        this.spaceItem = 45;
        this.isCheckAuto = false;
        this.toDoList = null;
    },

    properties: {
        bonusObj : cc.Node,
        lb_Win: cc.Label,
        notifyBonus : cc.Node,
        // parentItem : cc.Node,
    },

    start() {
        
    },

    Init(slotView) {
        this.slotView = slotView;
    },

    CountTimeAutoPlay(bonusValue, totalWin, accountBalance) {
        this.isEndBonus = false;
        this.isQuickPlay = true;
        this.countTime = 0;
        this.bonusWin = bonusValue;
        this.totalWin = totalWin;
        this.accountBalance = accountBalance;
    },

    ShowBonusGame(bonusValue, betValue) {
        if(!this.isEndBonus) {
            this.bonusObj.active = true;
            this.totalBonusWin = bonusValue;
            //this.StopCountTime();
            this.setInfo(bonusValue, betValue);
        }
    },

    setInfo(bonusValue, betValue) {
        this.listItemClicked = [];
        this.bonusData = this.convertDataBonus(bonusValue, betValue);
        this.canTouch = false;
        this.lb_Win.string = "0";
        this.indexClick = 0;
        this.curBonusWin = 0;
        this.clickLeft = this.bonusData.length;
        this.initItem();
        this.ResetCountTime();
    },

    StopCountTime() {
        this.isQuickPlay = false;
    },

    ResetCountTime() {
        this.countTime = 0;
    },


    ClickPlayFast() {
        this.slotView.PlayBonusEnd();
        this.isQuickPlay = false;
        this.isEndBonus = true;
        this.bonusObj.active = false;
        this.isCheckAuto = true;
        this.countTime = 0;
        // this.slotView.ShowNotify(this.bonusWin, ()=>this.slotView.ActionAutoSpin());
        this.slotView.effectManager.ClickCloseBonus();
        this.slotView.UpdateWinValue(this.totalWin);
        this.slotView.UpdateAccountBalance(this.accountBalance);
        this.toDoList.DoWork();
    },

    //createItem
    initItem() {
        //check array item rong thi khoi tao, khong thi reset
        if(this.listItem.length > 0){
            this.resetlist();
            this.canTouch = true
        }else{
            for (let i = 0; i < this.number_Item; i++) {
                let acInit = cc.callFunc(() => {
                    let newNode = cc.instantiate(this.node_Item);
                    this.parentItem.addChild(newNode);
                    newNode.scale = 0;
                    let deltaX = 0;
                    let deltaY = 0;
                    //so item tren 1 hang, co 3 hang
                    let numberItemInRow = this.number_Item/3;
                    if (i % numberItemInRow !== 0) {
                        deltaX = i % numberItemInRow * newNode.width + i % numberItemInRow * this.spaceItem;
                    }
                    if (i < numberItemInRow*2 && i >= numberItemInRow) {
                        deltaY = newNode.height + this.spaceItem ;
                    }
                    if (i >= numberItemInRow*2) {
                        deltaY = 2 * (newNode.height + this.spaceItem);
                    }
                    newNode.position = cc.v2(this.initPosItem.x + deltaX, this.initPosItem.y - deltaY);
                    newNode.runAction(cc.scaleTo(0.1, 1).easing(cc.easeBackOut()));
                    let button  = newNode.getComponent(cc.Button);
                    button.enabled = true;
                    button.node.on('click', this.clickButton, this);
                    this.listItem.push(newNode);
                    if (i === (this.number_Item-1)) this.canTouch = true;
                });
                this.node.runAction(cc.sequence(cc.delayTime(i * 0.05), acInit));
            }
        }
    },

    clickButton: function (button) {
        if (this.canTouch &&  !this.listItemClicked.includes(button.node) ) {
            this.indexClick++;
            this.clickLeft--;
            this.handleClickItem(button.node);
            this.listItemClicked.push(button.node);
            this.slotView.PlayClick();
        }
    },

    
    handleClickItem(itemNode) {
        this.ResetCountTime();
        if (this.clickLeft >= 0) {
            this.clickCheck = true;
            for (let i = 0; i < this.bonusData.length; i++) {
                let data = this.bonusData[i];
                if (data.index === this.indexClick) {
                    this.effShowItem(itemNode, data);
                }
            }

        }
        this.unscheduleAllCallbacks();
        //check het luot click chua
        if (this.clickLeft === 0 ) { 
            this.canTouch = false;
            setTimeout(() => {
                this.ClickPlayFast();
                this.isQuickPlay = false;
            }, 2000)
        }
    },

    effShowItem(item, data) {

        this.slotView.PlayWinMoney();
        let str = Global.Helper.formatNumber(data.chip);
        let drg = item.getComponentInChildren(dragonBones.ArmatureDisplay);
        drg.playAnimation("an", 1);

        let lbChip = item.getComponentInChildren(cc.Label);
        this.curBonusWin += data.chip;
        lbChip.scale = 0;

        item.runAction(cc.sequence(cc.delayTime(1.2) , cc.callFunc(()=>{
            lbChip.node.runAction(cc.scaleTo(0.5 , 1).easing(cc.easeBackOut()));
            lbChip.string = str;
            this.lb_Win.string = Global.Helper.formatNumber(this.curBonusWin);
        })))
    },

    //setdata bonus
    convertDataBonus(data, betValue) {
        //   "1,201,20,2000;2,220,8,800;3,220,8,800;4,220,8,800;5,220,8,800;6,203,40,4000;7,220,8,800;8,220,8,800;9,220,8,800;10,220,8,800",
        if(data > 0) {
            let arrData = this.getRanNum(3,5);
            let total = data/ betValue;
            let newList = [];
            for (let i = 0; i < arrData; i++) {
                let mutiplier = 0;
                if(i == arrData -1)
                    mutiplier = total;
                else{
                    let max = total / (5 * arrData);
                    mutiplier = this.getRanNum(1,max)*5 ;
                    total -= mutiplier;
                }
                let index = i+1;
                let bonusData = {
                    index: index,
                    idBonus: 211,//idBonus > 210 --win ô / idBonus === 210 -- x He So / Or mini game chọn 3 ô
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

    getRanNum(min_value, max_value) {
        let random_number = Math.random() * (max_value - min_value) + min_value;
        return Math.floor(random_number);
    },

    resetlist(){
        for (let i = 0; i < this.listItem.length; i++) {
            //this.listItem[i].getComponent(cc.Sprite).enabled = true;
            this.listItem[i].getComponentInChildren(cc.Label).string = "";
            let drg = this.listItem[i].getComponentInChildren(dragonBones.ArmatureDisplay);
            drg.playAnimation("trangthaicho", 0);
        }
    },

    onLoad() {
        this.toDoList = this.node.addComponent("ToDoList");
        // cc.game.on(cc.game.EVENT_HIDE, ()=>{
        //     this.timer = setInterval(()=>{
        //         this.update(0.1);
        //     }, 100);
        // })
        
        // cc.game.on(cc.game.EVENT_SHOW, ()=>{
        //     clearInterval(this.timer);
        // })
    },
});
