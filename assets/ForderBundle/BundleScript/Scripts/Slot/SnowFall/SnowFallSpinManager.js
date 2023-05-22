var DELAY_COLUM_DROP = 0.1;
cc.Class({
    extends: require("SpinManager"),
    ctor() {
        this.listLengthmatrix;
        this.countFallOut = 0;
        this.isFreeDom = false;
        this.countTimeFreeDom = 0;
        this.listIndexRandom = [];
        this.toDoList = null;
        this.listEffect = [];
    },

    properties: {
        effectLighting : cc.Node,
        effectDestroyItem : cc.Node,
        characterZeus : dragonBones.ArmatureDisplay,
        effectShowExtraItem : cc.Node,
        effectLight : cc.Node,
        listEndPosLight : {
            default: [],
            type: cc.Node,
        },
        endEffLightResultFree : cc.Node,
    },

    SetSizeMatrix() {
        this.NUMBER_COLUMN = 5;
        this.NUMBER_ROW = 4;
        this.NUMBER_ITEM_ABOVE = 4;
        this.NUMBER_ITEM_BELOW = 0;
        this.NUMBER_SPEED = 10;
        this.ID_GOLD_QUEEN = 3;
        this.TIME_DISTANCE_COLUMN = 0.15;
        this.nameSpin = "SnowFallSpinColumn";
        this.toDoList = this.node.addComponent("ToDoList");
    },

    SetSpeedMobile() {
        if (cc.sys.isNative) {
            this.TIME_SPIN = 0.1;
            this.TIME_DISTANCE_COLUMN = 0.1;
            this.TIME_BACK = 1;
            this.TIME_ACTION = 0.6;
            this.NUMBER_SPEED = 15;
        }
    },

    SetPreWin() {
        // this.ID_FREE = 2;
        // this.listIdPreWin[0] = this.ID_FREE;
        // this.listCountPreWin[0] = 2;
    },

    UpdateMatrix(matrix) {
        this.cacheMatrix = matrix;
        this.OnCheckUpdateMatrix();
    },

    OnCheckUpdateMatrix() {
        this.stateSpin += 1;
        if(this.stateSpin == 2) {
            for(let i = 0; i < this.cacheMatrix.length; i++) {
                this.slotView.itemManager.SetImage(this.cacheMatrix[i], this.listItem[i], i);
            }
        }
    },

    ChangeItemEffect(matrix) {
        if(this.stateSpin == 2) {
            if(this.slotView.isFree){
                for(let i = 0; i < matrix.length; i++) {
                    this.slotView.itemManager.SetImageFree(matrix[i], this.listItem[i], i, false);
                }
            }
            this.slotView.toDoList.DoWork();
        }
    },

    SetWildFree(listMultiWild){
        for(let temp in listMultiWild){
            if(parseInt(listMultiWild[temp]) > 1)
                this.listItem[temp].SetValueWild("X"+parseInt(listMultiWild[temp]));
            else
                this.listItem[temp].HideValueWild();
        }
    },

    HideWildFree(){
        for(let i = 0; i < this.listItem.length; i++) {
            this.listItem[i].HideValueWild();
        }
    },

    PlaySpinColumn(timeDistanceColumn) {
        this.countFallOut = 0;
        this.isFreeDom = false;
        this._super(timeDistanceColumn);
    },

    OnFallOutDone() {
        this.countFallOut += 1;
        if(this.countFallOut == 5) {
            if(this.stateGetResult == 2) {
                this.OnCheckStopSpin();
            } else {
                this.isFreeDom = true;
                this.countTimeFreeDom = 0;
            }
            
        }
    },


    DropMatrix(matrixNew, winMoneyStep, index){
        //roi theo ma tran moi
        //ma tran moi = matrixNew
        //ma tran cu = this.cacheMatrix
        //list vi tri an = this.slotView.drawLineManager.listLineWin[0]; //vi tri 0 la all cac vi tri an
        // vi tri cac item ? = this.slotView.drawLineManager.listPosExtraFree //(no tu an khong can match theo line nen tinh rieng)
        
        //------------
        //de ma tran moi vao cache
        let oldMatrix = this.cacheMatrix;
        let listIndex = [];
        this.toDoList.CreateList();
        if(this.slotView.drawLineManager.listPosExtraFree > 0){
            this.toDoList.AddWork(()=>{
                this.characterZeus.playAnimation("active", 1);
            },false);
            this.toDoList.Wait(0.5);
        }
        //show bien mat item va danh set xuong
        this.toDoList.AddWork(()=>{
            if(this.slotView.drawLineManager.listLineWin.length > 0) {
                for(let i = 0; i < this.slotView.drawLineManager.listLineWin[0].length; i++) {
                    let index = this.slotView.drawLineManager.listLineWin[0][i];
                    this.listItem[index].node.active = false;
                    this.CreateEffectDestroyItem(this.listItem[index].node.getPosition());
                    oldMatrix[index] = -1;
                    listIndex[listIndex.length] = index;
                }
                this.slotView.playBoomSound();
            }
            let list = this.slotView.drawLineManager.listPosExtraFree;
            for(let i = 0; i < list.length; i++) {
                let index = list[i];
                this.listItem[index].node.active = false;
                let startPos = this.listItem[index].node.getPosition();
                this.CreateEffectDestroyItem(startPos);
                this.CreateEffectLighting(startPos);
                oldMatrix[index] = -1;
                listIndex[listIndex.length] = index;
            }
        }, false);
        //create show tien thang cung luot

        if(this.slotView.drawLineManager.listPosExtraFree > 0){
            this.toDoList.AddWork(()=>{
                this.characterZeus.playAnimation("waiting", 0);
            },false);
            this.toDoList.Wait(0.5);
        }
        this.toDoList.Wait(0.5);
        //show multi
        let listMulti = this.slotView.normalManager.listMultiExtraFree[index-1];
        if(listMulti != null){
            for(let temp in listMulti){
                this.toDoList.AddWork(()=>{
                    let pos = parseInt(temp)
                    let startPos = this.listItem[pos].node.getPosition();
                    this.CreateExtraItem(startPos, parseInt(listMulti[temp]));
                    this.CreateEffectLightFly(startPos, parseInt(listMulti[temp]));
                }, false);
                this.toDoList.Wait(0.5);
            }
            if(listMulti.length > 0)
                this.toDoList.Wait(0.5);
        }
        this.toDoList.AddWork(()=>{
            for(let i = 0; i < this.listEffect.length; i++) {
                this.listEffect[i].destroy();
            }
            this.listEffect = [];
        }, false);
        //xu ly cong diem cho effect bay anh sang xong
        if(listMulti != null){
            this.toDoList.AddWork(()=>{
                for(let temp in listMulti){
                    let value = parseInt(listMulti[temp])
                    this.IncreaseValueExtra(value);
                }
            }, false);
        }
        this.toDoList.AddWork(()=>{
            //đếm số ô biến mất ở mỗi cột và lấy vị trí của ô biến mất dưới cùng (thấp nhất)
            let listMin = [];
            let listCountIndex = [];
            for(let i = 0; i < this.NUMBER_COLUMN; i++) {
                listCountIndex[i] = 0;
            }
            for(let i = 0; i < listIndex.length; i++) {
                let indexColumn = listIndex[i] % this.NUMBER_COLUMN;
                listCountIndex[indexColumn] += 1;
                if(listMin[indexColumn] != null) {
                    if(listMin[indexColumn] < listIndex[i])
                        listMin[indexColumn] = listIndex[i];
                } else {
                    listMin[indexColumn] = listIndex[i];
                }
            }
            let countDelay = [];
            //gắn numbAbove = số ô biến mất
            for(let i = 0; i < listCountIndex.length; i++) {
                this.listSpinObj[i].numbAbove = listCountIndex[i];
            }
            for(let i = 0; i < listMin.length; i++) {
                if(listMin[i] != null) {
                    //đếm số ô bị ảnh hưởng phía trên
                    let countAbove = parseInt(listMin[i] / this.NUMBER_COLUMN);
                    //tính số ô sẽ di chuyển thực tế (= số ô biến mất)
                    let step = 1;
                    let stepEnd = [];
                    countDelay[i] = 0;
                    for(let j = 0; j < countAbove; j++) {
                        let currentIndex = listMin[i]-(j+1)*this.NUMBER_COLUMN;
                        let value = oldMatrix[currentIndex];
                        //giá trị ô phía trên bị biến mất thì tăng số step lên
                        if(value == -1) {
                            step += 1;
                        } else {
                            stepEnd[currentIndex] = step;
                            this.scheduleOnce(()=>{
                                this.listItem[currentIndex].node.active = false;
                                //đếm số ô biến mất ở cột đó và cho những item ở ngoài màn hình rơi xuống = số ô biến mất
                                this.listSpinObj[i].AddBelowItem(stepEnd[currentIndex],currentIndex,this.cacheMatrix, countDelay[i]);
                                countDelay[i] += 1;
                            } , i*DELAY_COLUM_DROP);  
                        }
                    }
                }
            }
            for(let i = 0; i < listCountIndex.length; i++) {
                this.scheduleOnce(()=>{
                    //truyền vào vị trí ô sẽ rơi và quãng đường nó đi (cho những ô vốn đang ở trong màn hình)
                    this.listSpinObj[i].AddAboveItem(listCountIndex[i], matrixNew, countDelay[i]);
                } , i*DELAY_COLUM_DROP);  
            }
        }, false);
        this.toDoList.Wait(0.1+7*DELAY_COLUM_DROP);
        this.toDoList.AddWork(()=>{
            for(let i = 0; i < this.listSpinObj.length; i++) {
                this.listSpinObj[i].EndFall();
            }
            for(let i = 0; i < this.listItem.length; i++) {
                this.listItem[i].node.active = true;
            }
            this.cacheMatrix = matrixNew;
            for(let i = 0; i < this.cacheMatrix.length; i++) {
                this.slotView.itemManager.SetImage(this.cacheMatrix[i], this.listItem[i], i);
            }
            //chay tiep tuc list work show line
            this.slotView.toDoList.DoWork();
        }, false);
        this.toDoList.Play();
    },

    OnFallRandomDone(index) {
        this.listIndexRandom[index] = null;
        this.OnCheckStopSpin();
    },

    OnCheckStopSpin() {
        if(!this.isFreeDom && this.stateGetResult == 2) {
            let check = true;
            for(let i = 0; i < this.listIndexRandom.length; i++) {
                if(this.listIndexRandom[i] != null) {
                    check = false;
                    break;
                }
            }
            if(check) {
                this.OnStopSpin(this.listSpinObj);
            }
        }
    },

    CreateRandomItemFall() {
        for(let i = 0; i < this.NUMBER_COLUMN; i++) {
            this.listIndexRandom[i] = i;
            this.scheduleOnce(()=>{
                this.listSpinObj[i].CreateItemWait(i);
            } , 0.05 * i); 
        }
    },

    OnCheckSpinSuccess() {
        this.stateGetResult += 1;
        if(this.stateGetResult == 2) {
            this.isFreeDom = false;
            if(this.countFallOut == 5)
                this.OnCheckStopSpin();
        }
    },

    update(dt) {
        if(this.isFreeDom) {
            this.countTimeFreeDom += dt;
            if(this.countTimeFreeDom >= 0.6) {
                this.countTimeFreeDom = 0;
                this.CreateRandomItemFall();
            }
        }
    },

    getNameLighting(){
        let listName = ["do","xanhduong","tim","xanhla"]
        let rItem = Global.RandomNumber(0,listName.length-1);
        let name = listName[rItem];

        return name;
    },

    CreateEffectDestroyItem(pos){
        let eff = cc.instantiate(this.effectDestroyItem);
        eff.parent = this.effectDestroyItem.parent;
        eff.setPosition(pos);
        eff.active = true;
        eff.getComponent(dragonBones.ArmatureDisplay).playAnimation("animtion0", 1);
        this.listEffect[this.listEffect.length] = eff;
    },

    CreateEffectLighting(pos){
        let eff = cc.instantiate(this.effectLighting);
        eff.parent = this.effectLighting.parent;
        eff.setPosition(pos);
        eff.active = true;
        eff.getComponent(dragonBones.ArmatureDisplay).playAnimation(this.getNameLighting(), 1);
        this.listEffect[this.listEffect.length] = eff;
    },

    CreateExtraItem(pos, value){
        let eff = cc.instantiate(this.effectShowExtraItem);
        eff.parent = this.effectShowExtraItem.parent;
        eff.setPosition(pos);
        eff.active = true;
        eff.getComponent(cc.Label).string = this.GetStringExtraByValue(value);
        eff.getComponent(cc.Animation).play("AnimExtraItem");
        this.listEffect[this.listEffect.length] = eff;
    },

    CreateEffectLightFly(pos, value){
        //light bay
        let eff = cc.instantiate(this.effectLight);
        eff.parent = this.effectLight.parent;
        eff.setPosition(pos);
        eff.active = true;
        eff.runAction(cc.moveTo(0.5,this.listEndPosLight[this.GetPosEndByValue(value)].getPosition()));
        this.listEffect[this.listEffect.length] = eff;
    },

    GetStringExtraByValue(value){
        let textContent = "";
        if(value < 10){
            textContent = "+"+value+" FREE";
        }else if(value < 100){
            textContent = value *  this.slotView.GetBetValue();
        }else if(value == 111){
            textContent = "1X";
        }
        return textContent;
    },

    GetPosEndByValue(value){
        let pos = 0;
        if(value < 10){
            pos = 0;
        }else if(value < 100){
            pos = 1;
        }else if(value == 111){
            pos = 2;
        }
        return pos;
    },

    IncreaseValueExtra(value){
        if(value < 10){
            this.slotView.UpdateNumberFreeDrop(value);
        }else if(value < 100){
            this.slotView.SetLastPrizeDrop(value);
        }else if(value == 111){
            this.slotView.UpdateNumberMultiDrop();
        }
    },

    FlyLightToResultFree(){
        let eff = cc.instantiate(this.effectLight);
        eff.parent = this.effectLight.parent;
        eff.setPosition(this.listEndPosLight[2].getPosition());
        eff.active = true;
        eff.runAction(cc.moveTo(1,this.endEffLightResultFree.getPosition()));
        this.listEffect[this.listEffect.length] = eff;
    },

    ClearLightResultFree(){
        for(let i = 0; i < this.listEffect.length; i++) {
            this.listEffect[i].destroy();
        }
        this.listEffect = [];
    },

    CreateWinMoneyStep(pos, value){
        let eff = cc.instantiate(this.effectShowExtraItem);
        eff.parent = this.effectShowExtraItem.parent;
        eff.setPosition(pos);
        eff.active = true;
        eff.getComponent(cc.Label).string = "+"+ Global.Helper.formatNumber(value *  this.slotView.GetBetValue());
        eff.getComponent(cc.Animation).play("AnimWinMoneyStep");
        this.listEffect[this.listEffect.length] = eff;
    },

});
