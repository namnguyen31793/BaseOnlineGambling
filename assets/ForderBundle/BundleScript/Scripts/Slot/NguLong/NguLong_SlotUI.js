cc.Class({
    extends:  require('SlotUI'),

    ctor() {
        this.NUMBER_COLUMN = 5;
        this.NUMBER_ROW = 3;
        this.NUMBER_ITEM_ABOVE = 3;
        this.NUMBER_ITEM_BELOW = 3;
        this.NUMBER_SPEED = 12;
        this.ID_BONUS = 3;
        this.ID_FREE = 2;
        this.ID_WILD = 1;
        this.listSpecialWild = [];
        this.TIME_DISTANCE_COLUMN = 0.25;
        this.listStopObj = [];
        this.listSpinObj = [];
        this.listItem = [];
        this.countSpinDone = 0;
        this.nameClassItem = "NguLong_ItemView";
        this.nameClassSpinColump = "NguLong_SlotSpinColumn";
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
        nodeStop : cc.Node,
        nodeSpin : cc.Node,
        itemSpineBGData: {
            default: [],
            type: sp.SkeletonData,
        },
        itemSpineData: {
            default: [],
            type: sp.SkeletonData,
        },
        itemImgData: {
            default: [],
            type: cc.SpriteFrame,
        },
        itemImgDataFree: {
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
        this.listCountNearWinIncrease[0] = 2; //so item check là 2
        this.InitPayLine();
    },

    InitPayLine() {
        this.listSpecialWild = [this.ID_WILD];
        this.payLine = [];
        let index = 0;
        for (let i = 0; i < this.NUMBER_ROW; i++) {
            for (let j = 0; j < this.NUMBER_ROW; j++) {
                for (let k = 0; k < this.NUMBER_ROW; k++) {
                    for (let l = 0; l < this.NUMBER_ROW; l++) {
                        for (let m = 0; m < this.NUMBER_ROW; m++) {
                            index++;
                            let list = [i, j, k, l, m];
                            this.payLine[index] = this.GetPosByColum(list);
                        }
                    }
                }
            }
        }
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
        if(!isSetDefaut) {
            this.slotController.stateSpin += 1; 
        } 
        if(this.slotController.stateSpin == 2 || isSetDefaut) {
            for(let i = 0; i < this.slotController.cacheMatrix.length; i++) {
                this.SetImageItemReal(this.slotController.cacheMatrix[i], this.listItem[i].node, false, this.slotController.cacheMulti[i]);
            }
        }
    },
    //check kết thúc spin, check matrix có item đặc biệt thì kéo dài
    OnStopSpin(listSpinObj) {
        let indexPreWin = this.CountNearWin();
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
        //add kết quả từng cột spin và check effect nearwin
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
                                this.ShowAnimNearWinItem(this.listIdNearWinIncrease[j]);
                            } else {
                                this.scheduleOnce(()=>{
                                } , 0.4);  
                            }
                        }
                    }
                }
                if((i>=min && i != listSpinObj.length-1) || checkShowIncrease) {
                    this.scheduleOnce(()=>{
                        for(let j = 0; j < indexPreWin.length; j++) {
                            if(indexPreWin[j] != -1 && i >= indexPreWin[j]) {
                                this.ShowAnimNearWinItem(this.listIdNearWin[j]);
                            }
                        }
                        listSpinObj[i+1].SpeedUp();
                    } , 0.4);  
                }
            } , listDelay[i]);
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

    SetImageItem(id, itemView, loop = false, dragonId = 1) {
        var idItem = id % 20;
        let isGem = (id > 20) ? true : false;
        if(this.CheckIconSpineById(idItem)){
            let anim = this.GetNameSpinById(idItem)
            let animBG = this.GetNameBGById(idItem)
            itemView.getComponent(this.nameClassItem).SetSpineItem(idItem, this.itemSpineData[idItem-1], this.itemSpineBGData[idItem-1], anim, animBG, isGem);  
        }
        else {
            if(this.slotController.isFree)
                itemView.getComponent(this.nameClassItem).SetImageItem(idItem, this.itemImgDataFree[idItem-1], isGem);  
            else
                itemView.getComponent(this.nameClassItem).SetImageItem(idItem, this.itemImgData[idItem-1], isGem);  
        }
    },

    SetImageItemReal(id, itemView, loop = false, dragonId = 1) {
        var idItem = id % 20;
        let isGem = (id > 20) ? true : false;
        if(this.CheckIconSpineById(idItem)){
            let anim = this.GetNameSpinById(id)
            let animBG = this.GetNameBGById(idItem)
            itemView.getComponent(this.nameClassItem).SetSpineItem(idItem, this.itemSpineData[idItem-1], this.itemSpineBGData[idItem-1], anim, animBG, isGem);  
        }
        else{
            if(this.slotController.isFree)
                itemView.getComponent(this.nameClassItem).SetImageItem(idItem, this.itemImgDataFree[idItem-1], isGem);  
            else
                itemView.getComponent(this.nameClassItem).SetImageItem(idItem, this.itemImgData[idItem-1], isGem);  
        }
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
    ShowAnimNearWinItem(id) {
        for(let i = 0; i < this.listItem.length; i++) {
            if(this.slotController.cacheMatrix[i] == id) {
                this.listItem[i].PlayAnimPreWin();
            }
        }
    },
    //tính số item đặc biệt
    CountNearWin() {
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

    GetNameSpinById(id, isFree = false){
        let animationName = 'animation';
        switch(id){
            case 1:
                animationName = isFree ? "animation_Fire" : "animation_Fire";
            case 2:
                animationName = isFree ?  "animation_FreeG" : "animation_MainG";
            case 3:
                animationName = isFree ? "animation_FreeG" : "animation_MainG";
            case 4:
                animationName = isFree ?  "animation_FreeG" : "animation_MainG";
            case 5:
                animationName = isFree ? "animation_FreeG" : "animation_MainG";
            case 6:
                animationName = isFree ? "animation_FreeG" : "animation_MainG";
            case 7:
                animationName = isFree ? "animation_FreeG" : "animation_MainG";
                break;
        }
        return animationName;
    },

    GetNameBGById(id, isFree = false){
        let animationName = '';
        switch(id){
            case 1:
                animationName = isFree ? "animation_Fire" : "animation_Fire";
            case 3:
                animationName = isFree ? "animation_FreeG" : "animation_MainG";
            case 4:
                animationName = isFree ?  "animation_FreeG" : "animation_MainG";
            case 5:
                animationName = isFree ?  "animation_FreeG" : "animation_MainG";
            case 6:
                animationName = isFree ?  "animation_FreeG" : "animation_MainG";
            case 7:
                animationName = isFree ?  "animation_FreeG" : "animation_MainG";
                break;
        }
        return animationName;
    },

    CheckIconSpineById(id){
        let useSpine = false;
        switch(id){
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                useSpine = true
                break;
        }
        return useSpine;
    },

    ShowLineFree(){
        let matrix = this.slotController.cacheMatrix;
        let listLineWin = [];
        for(let i = 0; i < matrix.length; i++){
            if(matrix[i] == this.ID_FREE)
                listLineWin.push(i);
        }
        this.DrawLine(listLineWin);
    },

    ShowLineBonus(){
        let matrix = this.slotController.cacheMatrix;
        let listLineWin = [];
        for(let i = 0; i < matrix.length; i++){
            if(matrix[i] == this.ID_BONUS)
                listLineWin.push(i);
        }
        this.DrawLine(listLineWin);
    },

    ShowLineWin(listLine){
        if(listLine.length == 0)
            return;
        if(listLine.length == 1 && listLine[0] == 0)
            return;
        for(let i = 0; i < this.listItem.length; i++) {
            this.listItem[i].HideColoritem();
        }
        let listLineWin = this.GetListPosRuleAllWay(listLine);        
        this.DrawLine(listLineWin[0]);
    },

    DrawLine(listPoint) {
        for(let i = 0; i < listPoint.length; i++) {
            this.listItem[listPoint[i]].ActiveColorItem();
        }
    },

    GetListPosRuleAllWay(listLine){
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
            if(matrix[startPos] != this.ID_WILD)
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
                if(idCheckMatch == -1 && matrix[linePos[j]-1] != this.ID_WILD)
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

    HideAllLine() {
        for(let i = 0; i < this.listItem.length; i++) {
            this.listItem[i].ActiveColorItem();
        }
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
            let pos = this.NUMBER_COLUMN * listPosColum[i] + (i + 1);
            listPos[i] = pos;
        }
        return listPos;
    },
    
});
