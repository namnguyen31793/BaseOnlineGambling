cc.Class({
    extends:  require('SlotUI'),

    ctor() {
        this.NUMBER_LINE = 20;
        this.NUMBER_COLUMN = 5;
        this.NUMBER_ROW = 3;
        this.NUMBER_ITEM_ABOVE = 5;
        this.NUMBER_ITEM_BELOW = 3;
        this.NUMBER_SPEED = 15;
        this.ID_BONUS = 3;
        this.ID_FREE = 4;
        this.ID_WILD_EXTEND = 2;
        this.ID_WILD = 1;
        this.listSpecialWild = [];
        this.TIME_DISTANCE_COLUMN = 0.15;
        this.listStopObj = [];
        this.listSpinObj = [];
        this.listItem = [];
        this.listLineImg = [];
        this.countSpinDone = 0;
        this.nameClassItem = "NightClub_ItemView";
        this.nameClassSpinColump = "NightClub_SlotSpinColumn";
        this.listIdNearWin = [];
        this.listCountNearWin = [];
        this.listIdNearWinIncrease = [];
        this.listCountNearWinIncrease = [];
        this.listIndexIncrease = [];
        this.listStopIncrease = [];
        this.payLine = [];
    },
    properties: {
        BG_Free : cc.Node,
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
        this.listIdNearWin[0] = this.ID_BONUS;
        this.listIdNearWinIncrease[0] = this.ID_FREE;
        this.listCountNearWin[0] = 2;   //so item check là 2
        this.listCountNearWinIncrease[1] = 2; //so item check là 2
    
        this.InitPayLine();
    },

    InitPayLine() {
        this.listSpecialWild = [this.ID_WILD, this.ID_WILD_EXTEND];
        this.payLine = [];
        this.payLine[1] = this.GetPosByColum([5, 6, 7, 8, 9]);
        this.payLine[2] = this.GetPosByColum([0, 1, 2, 3, 4]);
        this.payLine[3] = this.GetPosByColum([10, 11, 12, 13, 14]);
        this.payLine[4] = this.GetPosByColum([0, 6, 12, 8, 4]);
        this.payLine[5] = this.GetPosByColum([10, 6, 2, 8, 14]);
        this.payLine[6] = this.GetPosByColum([5, 1, 7, 3, 9]);
        this.payLine[7] = this.GetPosByColum([5, 11, 7, 13, 9]);
        this.payLine[8] = this.GetPosByColum([0, 6, 2, 8, 4]);
        this.payLine[9] = this.GetPosByColum([10, 6, 12, 8, 14]);
        this.payLine[10] = this.GetPosByColum([5, 1, 2, 3, 9]);
        this.payLine[11] = this.GetPosByColum([5, 11, 12, 13, 9]);
        this.payLine[12] = this.GetPosByColum([10, 11, 7, 13, 14]);
        this.payLine[13] = this.GetPosByColum([10, 6, 12, 8, 14]);
        this.payLine[14] = this.GetPosByColum([10, 6, 7, 8, 14]);
        this.payLine[15] = this.GetPosByColum([0, 6, 7, 8, 4]);
        this.payLine[16] = this.GetPosByColum([0, 11, 2, 13, 4]);
        this.payLine[17] = this.GetPosByColum([10, 1, 12, 3, 14]);
        this.payLine[18] = this.GetPosByColum([5, 6, 2, 8, 9]);
        this.payLine[19] = this.GetPosByColum([5, 6, 12, 8, 9]);
        this.payLine[20] = this.GetPosByColum([10, 11, 2, 13, 14]);
    },

    Show(){
        //check audio
        this.BG_Free.active = false;
    },

    Hide(){

    },

    ShowBgGameFree(isShow){
        this.BG_Free.active = isShow;
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
        cc.log("OnCheckUpdateMatrix "+this.slotController.stateSpin);
        if(!isSetDefaut) {
            this.slotController.stateSpin += 1;
        } 
        if(this.slotController.stateSpin >= 2 || isSetDefaut) {
            for(let i = 0; i < this.slotController.cacheMatrix.length; i++) {
                this.SetImageItem(this.slotController.cacheMatrix[i], this.listItem[i].node);
            }
        }
    },
    //check kết thúc spin, check matrix có item đặc biệt thì kéo dài
    OnStopSpin(listSpinObj) {
        cc.log("OnStopSpin ");
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
            timeDistanceColumn = 0;
        let listDelay = [];
        let totalDelay = 0;
        for(let i = 0; i < listSpinObj.length; i++) {
            totalDelay += timeDistanceColumn;
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
                                this.ShowAnimPreWinItem(this.listIdNearWinIncrease[j]);
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
                                this.ShowAnimPreWinItem(this.listIdNearWin[j]);
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
        itemView.getComponent(this.nameClassItem).SetImageImg(id, this.itemImgData[id-1]);  
    },

    OnSpinDone(indexColumn) {
        cc.log("OnSPinDone "+indexColumn);
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
        for(let i = 0; i < this.listIdNearWin.length; i++) {
            listCount[i] = 0;
            listIndex[i] = -1;
        }
        for(let i = 0; i < this.listIdNearWinIncrease.length; i++) {
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
                for(let k = 0; k < this.listIdNearWin.length; k++) {
                    if(this.CheckIdPreWin(this.slotController.cacheMatrix[i+j*this.NUMBER_COLUMN], this.listIdNearWin[k])) {
                        listCount[k] += 1;
                        if(listCount[k] >= this.listCountNearWin[k] && listIndex[k] == -1) {
                            listIndex[k] = i;
                        }
                    }
                }
                for(let k = 0; k < this.listIdNearWinIncrease.length; k++) {
                    if(this.CheckIdPreWin(this.slotController.cacheMatrix[i+j*this.NUMBER_COLUMN], this.listIdNearWinIncrease[k]) && checkIncrease) {
                        listCountIncrease[k] += 1;
                        if(listCountIncrease[k] >= this.listCountNearWinIncrease[k] && this.listIndexIncrease[k] == -1) {
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

    CheckNearWin() {
        return this.listIdNearWin.length > 0;
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
        cc.log("HideEffectPreWin "+index);
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
            case 1:
                animationName = "Jackpot-anim";
                break;
            case 3:
                animationName = "bonus-anim";
                break;
            case 4:
                animationName = "Free-anim";
                break;
            case 5:
                animationName = "girlA-anim";
                break;
            case 6:
                animationName = "girlC-anim";
                break;
            case 7:
                animationName = "girlB-anim";
                break;
            case 8:
                animationName = "Champangne-anim";
                break;
            case 9:
                animationName = "Cigar-anim";
                break;
            case 10:
                animationName = "Medal-anim";
                break;
            default:
                animationName = "animation";
                break;
        }
        return animationName;
    },
    CheckIconSpineById(id){
        let useSpine = true;
        switch(id){
            case 2:
            case 11:
            case 12:
            case 13:
            case 14:
                useSpine = false;
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
        for(let i = 0; i < this.listItem.length; i++) {
            this.listItem[i].HideColoritem();
        }
        let listLineWin = this.GetListPosWin(listLine);        
        this.DrawLine(listLineWin[0]);
    },

    DrawLine(listPoint) {
        for(let i = 0; i < listPoint.length; i++) {
            this.listItem[listPoint[i]].ActiveColorItem();
        }
    },

    HideAllLine() {
        for(let j = 0; j < this.listLineImg.length; j++){
            this.listLineImg[j].active = false;
        }
        for(let i = 0; i < this.listItem.length; i++) {
            this.listItem[i].ActiveColorItem();
        }
    },

    GetListPosWin(listLine){
        let matrix = this.slotController.cacheMatrix;
        let listLineWin = [];
        //list tong hop
        let listPoin = {};//list position win + 1 all
        listPoin["0"] = [];
        let outLineWin = [];
        //chay tung line win
        for(let i = 0; i < listLine.length; i++) {
            let linePos = this.payLine[listLine[i]];// list position line win
            var startPos = linePos[0]-1;

            var idCheckMatch = -1;
            if(matrix[startPos] != this.ID_WILD && matrix[startPos] != this.ID_WILD_EXTEND)
                idCheckMatch = matrix[startPos]

            if(!(startPos.toString() in listPoin)) {
                listPoin[startPos.toString()] = [];
                listPoin[startPos.toString()].push(startPos);
            }
            if(!listPoin["0"].includes(startPos))
                listPoin["0"].push(startPos);

            //lay id cac vi tri check
            let listRs = []
            listRs[0] = startPos;
            for(let j = 1; j < linePos.length; j++){
                if(idCheckMatch == -1 && matrix[linePos[j]-1] != this.ID_WILD && matrix[startPos] != this.ID_WILD_EXTEND)
                    idCheckMatch = matrix[linePos[j]-1];

                if((idCheckMatch != -1 && matrix[linePos[j]-1] != idCheckMatch && !this.CheckSpecialItem(matrix[linePos[j]-1])))
                    break;
                listRs[j] = linePos[j]-1;
                if(!listPoin[startPos.toString()].includes((linePos[j]-1)))
                    listPoin[startPos.toString()].push(linePos[j]-1);
                if(!listPoin["0"].includes((linePos[j]-1)))
                    listPoin["0"].push(linePos[j]-1);
            };
            listLineWin[i] = listRs;
        }
        for( var line in listPoin){
            outLineWin[outLineWin.length] = listPoin[line];
        }

        return outLineWin;
    },

    CheckSpecialItem(id){
        var isSpecialWild = false;
        for(let i = 0; i < this.listSpecialWild.length; i++){
            if(id == this.listSpecialWild[i])
            isSpecialWild = true;
        }
        return isSpecialWild;
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
