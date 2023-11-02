cc.Class({
    extends:  require('SlotUI'),

    ctor() {
        this.NUMBER_LINE = 20;
        this.NUMBER_COLUMN = 5;
        this.NUMBER_ROW = 3;
        this.NUMBER_ITEM_ABOVE = 5;
        this.NUMBER_ITEM_BELOW = 3;
        this.NUMBER_SPEED = 12;
        this.ID_BONUS = 3;
        this.ID_FREE = 4;
        this.TIME_DISTANCE_COLUMN = 0.25;
        this.listStopObj = [];
        this.listSpinObj = [];
        this.listItem = [];
        this.listLineImg = [];
        this.countSpinDone = 0;
        this.nameClassItem = "Sttt_ItemView";
        this.nameClassSpinColump = "Sttt_SlotSpinColumn";
        this.listIdPreWin = [];
        this.listCountPreWin = [];
        this.listIdPreWinIncrease = [];
        this.listCountPreWinIncrease = [];
        this.listIndexIncrease = [];
        this.listStopIncrease = [];
    },
    properties: {
        parentListItem : cc.Node,
        parentListLine : cc.Node,
        nodeStop : cc.Node,
        nodeSpin : cc.Node,
        itemWildExpand : [cc.Node],
        effectPreWin : [cc.Node],
        itemSpineData: {
            default: [],
            type: sp.SkeletonData,
        },
        itemImgData: {
            default: [],
            type: cc.SpriteFrame,
        },
        minRandom : {
            default : 2,
        },
        maxRandom : {
            default : 10,
        },
    },

    Init(slotController){
        this._super(slotController);
        this.Setup();
    },

    Setup() {
        this.itemParent = cc.find("Container/Items", this.node);
        //tao list item va random anh
        let totalItem = this.NUMBER_COLUMN * this.NUMBER_ROW;
        for(let i = 0; i < totalItem; i++)
        {
            this.listItem[i] = cc.find((i+1).toString(), this.parentListItem).getComponent(this.nameClassItem);
            this.RandomImage(this.listItem[i]);
        }
        //init line
        for(let i = 0; i < this.NUMBER_LINE; i++)
        {
            this.listLineImg[i] = cc.find("line"+(i+1).toString(), this.parentListLine);
        }
        
        this.listStopObj[0] = this.nodeStop;
        for(let i = 1; i < this.NUMBER_COLUMN; i++) {
            this.listStopObj[i] = cc.instantiate(this.listStopObj[0]);
            this.listStopObj[i].parent = this.listStopObj[0].parent;
        }
        //init obj cot quay
        let distanceY = this.listItem[0].node.y - this.listItem[this.NUMBER_COLUMN].node.y;
        this.listSpinObj[0] = this.nodeSpin.getComponent(this.nameClassSpinColump);
        for(let i = 1; i < this.NUMBER_COLUMN; i++) {
            this.listSpinObj[i] = cc.instantiate(this.nodeSpin).getComponent(this.nameClassSpinColump);
            this.listSpinObj[i].node.parent = this.nodeSpin.parent;
        }
        //chuyển item vào cột tương ứng để quản lý
        for(let i = 0; i < this.listSpinObj.length; i++)
        {
            for(let j = 0; j < this.NUMBER_ROW; j++) {
                this.listItem[i+j*this.NUMBER_COLUMN].node.parent = this.listStopObj[i];
            }
        }
        //set infor cho từng cột quay
        for(let i = 0; i < this.NUMBER_COLUMN; i++)
        {   
            this.listSpinObj[i].node.name = (i+1)+"spinColump";
            this.listSpinObj[i].InitSpinColumn(this, this.listItem[i].node, distanceY, this.NUMBER_ITEM_ABOVE, this.NUMBER_ITEM_BELOW, this.NUMBER_ROW, this.NUMBER_COLUMN, this.NUMBER_SPEED);
            this.listSpinObj[i].node.active = false;
        }
    },

    Show(){
        this.listIdPreWin[0] = this.ID_BONUS;
        this.listIdPreWinIncrease[0] = this.ID_FREE;
        // if(Global.uitype == 2){
        //     if(this.nodeUIBackButton)
        //         this.nodeUIBackButton.active = true;
        // }
        //check audio
    },

    Hide(){

    },

    PlaySpinColumn(timeDistanceColumn) {
        for(let i = 0; i < this.listSpinObj.length; i++)
        {
            this.scheduleOnce(()=>{
                this.listStopObj[i].active = false;
                this.listSpinObj[i].PlaySpin(this.listStopObj[i]);
                ///this.CheckSpinColumn(this.listSpinObj[i].node.children[0], i); - bonus giữ item thì dùng dòng này
            } , i*timeDistanceColumn)
        }
    },

    //check quay xong cot chua thi check trang thai stop
    OnCheckSpinSuccess() {
        this.slotController.stateGetResult += 1;
        if(this.slotController.stateGetResult == 2) {
            this.OnStopSpin(this.listSpinObj);
        }
    },

    OnCheckUpdateMatrix(isSetDefaut = false) {
        if(!isSetDefaut) {
            this.slotController.stateSpin += 1;
        } 
        if(this.slotController.stateSpin == 2 || isSetDefaut) {
            for(let i = 0; i < this.slotController.cacheMatrix.length; i++) {
                this.SetImageItem(this.slotController.cacheMatrix[i], this.listItem[i].node);
            }
        }
    },
    //check kết thúc spin, check matrix có item đặc biệt thì kéo dài
    OnStopSpin(listSpinObj) {
        let indexPreWin = this.CountPreWin();
        let min = this.NUMBER_COLUMN;
        for(let i = 0; i < indexPreWin.length; i++) {
            if(indexPreWin[i] != -1) {
                if(indexPreWin[i] < min) {
                    min = indexPreWin[i];
                }
            }
        }
        //add thời gian hiển thị từng cột, nếu có prewin thì delay lâu hơn
        let timeDistanceColumn = this.TIME_DISTANCE_COLUMN;
        let isSpeed = this.slotController.GetIsSpeed();
        if(this.slotController.isBonus)
            isSpeed = false;
        if(isSpeed)
            timeDistanceColumn = this.TIME_DISTANCE_COLUMN/2;
        let listDelay = [];
        let totalDelay = 0;
        for(let i = 0; i < listSpinObj.length; i++) {
            if(i > min) {
                totalDelay += 2;
            } else {
                totalDelay += timeDistanceColumn;
            }
            listDelay[i] = totalDelay;
        }
        for(let i = 0; i < this.listIndexIncrease.length; i++) {
            if(this.listIndexIncrease[i] != -1) {
                for(let j = this.listIndexIncrease[i]+1; j < this.listStopIncrease[i]; j++) {
                    if(listDelay[j] - listDelay[j-1]< 2) {
                        for(let k = j; k < listSpinObj.length; k++) {
                            listDelay[k] = listDelay[k] + 2 - timeDistanceColumn;
                        }
                    }
                }
            }
        }
        //add kết quả từng cột spin và check effect prewin
        for(let i = 0; i < listSpinObj.length; i++)
        {
            this.scheduleOnce(()=>{
                listSpinObj[i].GetResult(i, this.slotController.cacheMatrix);
                let checkShowIncrease = false;
                for(let j = 0; j < this.listIndexIncrease.length; j++) {
                    if(this.listIndexIncrease[j] != -1) {
                        if(i >= this.listIndexIncrease[j]) {
                            if(i < this.listStopIncrease[j]) {
                                checkShowIncrease = true;
                                this.ShowAnimPreWinItem(this.listIdPreWinIncrease[j]);
                            } else {
                                this.scheduleOnce(()=>{
                                    this.HideEffectPreWin(i);
                                } , 0.4);  
                            }
                        }
                    }
                }
                if((i>=min && i != listSpinObj.length-1) || checkShowIncrease) {
                    this.scheduleOnce(()=>{
                        for(let j = 0; j < indexPreWin.length; j++) {
                            if(indexPreWin[j] != -1 && i >= indexPreWin[j]) {
                                this.ShowAnimPreWinItem(this.listIdPreWin[j]);
                            }
                        }
                        this.HideEffectPreWin(i);
                        this.ShowEffectPreWin(i+1);
                        listSpinObj[i+1].SpeedUp();
                    } , 0.4);  
                }
                //check show Wild Doc
                this.CheckShowExpandWild(i);
            } , listDelay[i]);
        }
    },

    //check cột showWild dọc không
    CheckShowExpandWild(index){
        if(this.slotController.posData.length == 0) {
            return;
        }
        for(let i = this.slotController.posData.length - 1; i >= 0; i--) {
            if(this.slotController.posData[i] == 1 && index == 1){
                this.CreateExpandingWild(0, "Wild-SonTinh");
            }else if(this.slotController.posData[i] == 3 && index == 3){
                this.CreateExpandingWild(1, "Wild-ThuyTinh");
            }        
        }
    },

    CreateExpandingWild(index, animName){
        this.itemWildExpand[index].active = true;
        let anim = this.itemWildExpand[index].getComponent(sp.Skeleton);
        anim.setAnimation(0, animName, true);
    },

    RemoveExpandWild() {
        for(let i = this.itemWildExpand.length - 1; i >=0; i--) {
            this.itemWildExpand[i].active = false;
        }
    },

    /*
    --------- Phần set icon item ------
    */
    RandomImage(item)
    {
        let r = Global.RandomNumber(this.minRandom,this.maxRandom);
        this.SetImageItem(r, item);
    },

    SetImageItem(id, itemView, loop = false) {
        if(this.CheckIconSpineById(id)){
            let anim = this.GetNameSpinById(id)
            itemView.getComponent(this.nameClassItem).SetImageSpine(id, this.itemSpineData[id-1], anim, loop);  
        }
        else
            itemView.getComponent(this.nameClassItem).SetImageImg(id, this.itemImgData[id-1]);  
    },

    OnSpinDone(indexColumn) {
        //this.soundControl.StopSpin();
        //this.CheckItemWhenSpinDone(indexColumn); -- dùng để check với bonus k xóa
        this.listStopObj[indexColumn].active = true;
        let animStop = this.listStopObj[indexColumn].getComponent(cc.Animation);
        if(animStop) {
            animStop.play();
        }
        this.countSpinDone+=1;  
        if(this.countSpinDone >= this.NUMBER_COLUMN) {
            this.scheduleOnce(()=>{
                this.HideAllEffectPreWin();
                this.slotController.toDoList.DoWork();
            } , 0.25);
            this.countSpinDone = 0;
        }
    },

    /*----------------------------*/

    
    /*
    --------- Phần check Effect item đặc biệt ------
    */
    //show effect đặc biệt trên item theo id
    ShowAnimPreWinItem(id) {
        for(let i = 0; i < this.listItem.length; i++) {
            if(this.slotController.cacheMatrix[i] == id) {
                this.listItem[i].PlayAnimPreWin();
            }
        }
    },
    //tính số item đặc biệt
    CountPreWin() {
        let listCount = [];
        let listCountIncrease = [];
        let listIndex = [];
        for(let i = 0; i < this.listIdPreWin.length; i++) {
            listCount[i] = 0;
            listIndex[i] = -1;
        }
        for(let i = 0; i < this.listIdPreWinIncrease.length; i++) {
            listCountIncrease[i] = 0;
            this.listIndexIncrease[i] = -1;
            this.listStopIncrease[i] = this.NUMBER_COLUMN;
        }
        if(this.slotController.isBonus || this.slotController.isFree)
            return listIndex;
        let checkIncrease = true;
        for(let i = 0; i < this.NUMBER_COLUMN-1; i++) {
            let checkIn= false;
            for(let j = 0; j < this.NUMBER_ROW; j++) {
                for(let k = 0; k < this.listIdPreWin.length; k++) {
                    if(this.CheckIdPreWin(this.slotController.cacheMatrix[i+j*this.NUMBER_COLUMN], this.listIdPreWin[k])) {
                        listCount[k] += 1;
                        if(listCount[k] >= this.listCountPreWin[k] && listIndex[k] == -1) {
                            listIndex[k] = i;
                        }
                    }
                }
                for(let k = 0; k < this.listIdPreWinIncrease.length; k++) {
                    if(this.CheckIdPreWin(this.slotController.cacheMatrix[i+j*this.NUMBER_COLUMN], this.listIdPreWinIncrease[k]) && checkIncrease) {
                        listCountIncrease[k] += 1;
                        if(listCountIncrease[k] >= this.listCountPreWinIncrease[k] && this.listIndexIncrease[k] == -1) {
                            this.listIndexIncrease[k] = i;
                        }
                        checkIn = true;
                    } else {
                        if(checkIncrease) {
                            this.listStopIncrease[k] = i+1;
                        }
                    }
                }
            }
            if(!checkIn) {
                checkIncrease = false;
            }
        }
        return listIndex;
    },

    CheckPreWin() {
        return this.listIdPreWin.length > 0;
    },

    CheckIdPreWin(idItem, idCheck) {
        return idItem == idCheck;
    },

    EndAllItemPreWin() {
        for(let i = 0; i < this.listItem.length; i++)
            this.listItem[i].EndAnimPreWin();
    }, 

    EndItemBonusPreWin() {
        for(let i = 0; i < this.listItem.length; i++) {
            if(this.slotController.cacheMatrix[i] == this.ID_BONUS)
                this.listItem[i].EndAnimPreWin();
        }
    },

    EndItemFreePreWin() {
        for(let i = 0; i < this.listItem.length; i++) {
            if(this.slotController.cacheMatrix[i] == this.ID_FREE)
                this.listItem[i].EndAnimPreWin();
        }
    },

    /*----------------------------*/

    /* EFFECT PREWIN*/
    ShowEffectPreWin(index) {
        // this.HideAllEffectPreWin();
        this.effectPreWin[index].active = true;
    },

    HideEffectPreWin(index) {
        this.effectPreWin[index].active = false;
    },

    HideAllEffectPreWin() {
        for(let i = 0; i < this.effectPreWin.length; i++) {
            this.effectPreWin[i].active = false;
        }
    },
    /*----------------*/

    GetNameSpinById(id){
        let animationName = '';
        switch(id){
            case 6:
                animationName = "voi9";
                break;
            case 7:
                animationName = "Ngua9";
                break;
            case 8:
                animationName = "Ga9";
                break;
            default:
                animationName = "animation";
                break;
        }
        return animationName;
    },
    CheckIconSpineById(id){
        let useSpine = false;
        switch(id){
            case 1:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
                useSpine = true
                break;
        }
        return useSpine;
    },

    /* EFFECT PREWIN*/
    ShowLineWin(listLine){
        if(listLine.length == 0)
            return;
        if(listLine.length == 1 && listLine[0] == 0)
            return;
        for(let i = 0; i < listLine.length; i++) {
            if(listLine[i] == 0)
                continue;
            this.listLineImg[listLine[i]-1].active = true;
        }
    },

    HideAllLine() {
        for(let j = 0; j < this.listLineImg.length; j++){
            this.listLineImg[j].active = false;
        }
    },
    
    GetPosByColum(listPosColum) {
        let listPos = [];
        //chay theo tung cot
        for (let i = 0; i < listPosColum.length; i++)
        {
            let pos = listPosColum[i] + 1;
            listPos[i] = pos;
        }
        return listPos;
    },
    
    /*---------------*/
});
