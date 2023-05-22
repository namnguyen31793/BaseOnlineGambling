var NUMBER_ITEM_IN_VIEW = 7;
var WIDTH_ITEM = 68;
var ANCHOR_POSTION_ITEM = 240;
cc.Class({
    extends: cc.Component,
    ctor(){
        this.listPoolItem = [];
        this.listItemShow = [];
        this.listWin = [];
        this.timeSaveCreate = 0;
    },

    properties: {
        contentView : cc.Node,
        itemPlayer : cc.Node,
    },

    onLoad(){
        this.ClearAll();
        this.CreatePool();
    },

    CreatePool(){
        for(let i = 0; i < (NUMBER_ITEM_IN_VIEW + 3); i++){
            let item = cc.instantiate(this.itemPlayer);
            item.parent = this.contentView;
            item.scale = 1;
            item.setPosition(0, ANCHOR_POSTION_ITEM);
            let data = {
                position : 0,
                node : item,
                isRun : false,
            };
            this.listPoolItem[i.toString()] = data;
            item.active = false;
        }
    },
    
    ClearAll(){
        this.listPoolItem = [];
        this.listItemShow = [];
    },

    AddListWinData(data){
        this.listWin[this.listWin.length] = data;
        if(Global.listBigWinData == null)
            Global.listBigWinData = [];
        Global.listBigWinData[Global.listBigWinData.length] = data;
        let timeNow = (new Date()).getTime();
        let delay = 0;
        let time = this.timeSaveCreate+250;
        if(timeNow < time){    //khoang cach nho hon 0.5s
            delay = (time - timeNow)/1000; //convert ve s
            this.timeSaveCreate = time;//add lai time da tao lan cuoi
        }
        this.ShowItem(delay);
    },

    ShowItem(delay){
        if(this.listWin.length <= 0){
            this.toDoList.DoWork();
            return;
        }
        //getdata
        let dataShow = this.listWin[0];
        this.listWin.splice(0,1);

        //lay trong pool ra
        let isMatch = false;
        let item = null;
        for(let i = this.listPoolItem.length - 1; i >= 0; i--){
            if(!this.listPoolItem[i.toString()].isRun){
                item = this.listPoolItem[i.toString()];
                this.listPoolItem.splice(i,1);
                isMatch = true;
                break;
            }
        }
        if(!isMatch){
            let node = cc.instantiate(this.itemPlayer);
            node.parent = this.contentView;
            node.scale = 1;
            node.setPosition(0, ANCHOR_POSTION_ITEM);
            let data = {
                position : 0,
                node : node,
                isRun : false,
            };
            item = data;
        }

        let positionInTable = this.listItemShow.length;
        //set UI cho item
        item.node.active = true;
        item.node.getComponent("ItemTopPlayerControl").Setup(dataShow.GameType, dataShow.Nickname, Global.Helper.formatNumber(dataShow.RewardBalance), dataShow.AccountId);

        //neu Ui full thi sort lai
        if(positionInTable >= NUMBER_ITEM_IN_VIEW){
            this.listItemShow["0"].position = 0;
            this.TweenHideItem(this.listItemShow["0"]);
            this.listPoolItem[this.listPoolItem.length.toString()] = this.listItemShow["0"];

            //sort lai list
            for(let i = 0; i < this.listItemShow.length -1 ; i++){
                this.listItemShow[i.toString()] = this.listItemShow[(i+1).toString()];
                this.listItemShow[i.toString()].position = i;
            }

            item.position = this.listItemShow.length - 1;
            item.node.setPosition(0, ANCHOR_POSTION_ITEM+WIDTH_ITEM+ WIDTH_ITEM/2);  
            this.listItemShow[(this.listItemShow.length - 1).toString()] = item;

            for(let i = 0; i < this.listItemShow.length; i++){
                if(i == this.listItemShow.length - 1){
                    this.TweenMoveitem(this.listItemShow[i.toString()], i, true, delay);
                    this.listItemShow[i.toString()].node.setSiblingIndex(0);
                }
                else
                    this.TweenMoveitem(this.listItemShow[i.toString()], i, true);
            }
        }else{
            item.position = positionInTable;
            this.listItemShow[positionInTable.toString()] = item;
            this.TweenMoveitem(this.listItemShow[positionInTable.toString()], 0, false, delay);
        }
    },

    TweenMoveitem(item, indexWait, isFull, delay = 0){
        let timeMove = 0.3;
        let timeDelayjump = 0.1;
        let high = 5;
        if(isFull)
            high = 3;
        item.node.active = true;

        item.node.stopActionByTag(1);
        
        let positionY = ANCHOR_POSTION_ITEM - ( NUMBER_ITEM_IN_VIEW - item.position)*WIDTH_ITEM + WIDTH_ITEM/2;

        if(!isFull)
            item.node.setPosition(0, positionY+ANCHOR_POSTION_ITEM+WIDTH_ITEM);

        item.node.getComponent("ItemTopPlayerControl").Moveitem(positionY, delay);
        // let acMove = cc.callFunc(() => {
        //     item.node.runAction(cc.moveTo(timeMove, cc.v2(0, positionY)));     
        // });
        // let acJump = cc.callFunc(() => {
        //     item.node.runAction(cc.moveTo(timeDelayjump, cc.v2(0, positionY+high)));     
        // });
        // let acMove2 = cc.callFunc(() => {
        //     item.node.runAction(cc.moveTo(timeDelayjump, cc.v2(0, positionY)));     
        //     if(indexWait == 0)  
        //         this.toDoList.DoWork();
        // });
            
        // item.node.runAction(cc.sequence( acMove, cc.delayTime(timeMove), acJump,cc.delayTime(timeDelayjump), acMove2 )).setTag(1);
        
    },   
    
    TweenHideItem(item){
        let timeMove = 0.3;
        let positionY = ANCHOR_POSTION_ITEM - ( NUMBER_ITEM_IN_VIEW +1)*WIDTH_ITEM + WIDTH_ITEM/2;

        item.node.getComponent("ItemTopPlayerControl").Moveitem(positionY);
        // let acMove = cc.callFunc(() => {
        //     item.node.runAction(cc.moveTo(timeMove, cc.v2(0, positionY)));    
        //     item.isRun = true; 
        // });   

        // let acHide = cc.callFunc(() => {
        //     item.node.active = false;
        //     item.node.setPosition(0, ANCHOR_POSTION_ITEM+WIDTH_ITEM+ WIDTH_ITEM/2);  
        //     item.isRun = false;
        // });
            
        // item.node.runAction(cc.sequence( acMove, cc.delayTime(timeMove), acHide ));
    },
});
