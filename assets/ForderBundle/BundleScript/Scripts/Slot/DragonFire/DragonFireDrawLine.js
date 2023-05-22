

cc.Class({
    extends: require("DrawLineControl"),

    ctor() {
        this.LENGTH_MATIRX = 24;
        this.NUM_COLUMN_MATRIX = 8;
        
    },

    properties: {
        
    },

    InitPayLine() {
        this.listSpecialWild = [1];
        this.payLine = [];
        let numberRowMatrix = this.LENGTH_MATIRX / this.NUM_COLUMN_MATRIX;
        let index = 0;
        for (let i = 0; i < numberRowMatrix; i++) {
            for (let j = 0; j < numberRowMatrix; j++) {
                for (let k = 0; k < numberRowMatrix; k++) {
                    for (let l = 0; l < numberRowMatrix; l++) {
                        for (let m = 0; m < numberRowMatrix; m++) {
                            for (let n = 0; n < numberRowMatrix; n++) {
                                for (let o = 0; o < numberRowMatrix; o++) {
                                    for (let p = 0; p < numberRowMatrix; p++) {
                                        index++;
                                        let list = [i, j, k, l, m, n, o, p];
                                        this.payLine[index] = this.GetPosByColum(list);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    //ke thua tu SlotView de khong xoa show line
    StopDraw() { 
        // this.toDoList.StopWork();
        // this.HideAllLine();
    },

    StopDrawDragon() { 
        this.HideAllLine();
    },

    ShowLineWin(listLine) {
        this.StopDraw();
        if(listLine.length == 0)
            return;
        let listLineWin = this.GetListPosRuleAllWay(listLine);
        if(listLineWin.length > 0) {
            this.DrawLine(listLineWin[0]);
        }
    },

    DrawLine(listPoint) {
        let listItem = this.slotView.spinManager.listItem;
        this.slotView.ActiveColorButtonNormalGame(false);
        for(let i = 0; i < listPoint.length; i++) {
            this.slotView.itemManager.SetColorActive(listItem[listPoint[i]], true);
            listItem[listPoint[i]].ShowEffectWin();
        }
    },

    GetPosByColum(listPosColum) {
        let listPos = [];
        //chay theo tung cot
        for (let i = 0; i < listPosColum.length; i++)
        {
            let pos = this.NUM_COLUMN_MATRIX * listPosColum[i] + (i + 1);
            listPos[i] = pos;
        }
        return listPos;
    },

    GetListPosRuleAllWay(listLine){
        let matrix = this.slotView.spinManager.cacheMatrix;
        let listLineWin = [];
        //list tong hop
        let listPoin = {};
        listPoin["0"] = [];
        let outLineWin = [];
        //chay tung line win
        for(let i = 0; i < listLine.length; i++) {
            let linePos = this.payLine[listLine[i]];
            
            var startPos = linePos[0]-1;
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
                //check trong cot an khong
                if((j) >= this.slotView.normalManager.extandMatrixThisTurn)
                    break;
                if(matrix[linePos[j]-1] != matrix[startPos] && !this.CheckSpecialItem(matrix[linePos[j]-1]) )
                    break;
                listRs[j] = linePos[j]-1;
                if(!listPoin[startPos.toString()].includes((linePos[j]-1)))
                    listPoin[startPos.toString()].push(linePos[j]-1);
                if(!listPoin["0"].includes((linePos[j]-1)))
                    listPoin["0"].push(linePos[j]-1);
            }
            listLineWin[i] = listRs;
        }
        for( var line in listPoin){
            outLineWin[outLineWin.length] = listPoin[line];
        }

        return outLineWin;
    },
    
});
