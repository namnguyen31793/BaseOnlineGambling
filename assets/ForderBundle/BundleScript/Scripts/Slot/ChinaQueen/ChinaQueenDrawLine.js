

cc.Class({
    extends: require("DrawLineControl"),

    ctor() {
        this.LENGTH_MATIRX = 30;
        this.NUM_COLUMN_MATRIX = 5;
        this.ID_GOLD_QUEEN = 4;
        this.ID_QUEEN = 3;
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
                            index++;
                            let list = [i, j, k, l, m];
                            this.payLine[index] = this.GetPosByColum(list);
                        }
                    }
                }
            }
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
        let listLengthmatrix = this.slotView.spinManager.listLengthmatrix;
        let listLineWin = [];
        //list tong hop
        let listPoin = {};
        listPoin["0"] = [];

        let outLineWin = [];
        //chay tung line win
        for(let i = 0; i < listLine.length; i++) {
            let listPosInLine = this.payLine[listLine[i]];
            
            var startPos = (listPosInLine[0]-1);
            //add all
            if(!(startPos.toString() in listPoin)) {
                listPoin[startPos.toString()] = [];
                listPoin[startPos.toString()].push(startPos);
            }
            if(!listPoin["0"].includes(startPos))
                listPoin["0"].push(startPos);
            //lay id cac vi tri check
            let listRs = []
            listRs[0] = startPos;
            for(let j = 1; j < listPosInLine.length; j++){
                //check trong cot an khong
                var pos = listPosInLine[j]-1;
                if((pos/this.NUM_COLUMN_MATRIX) <= ((this.LENGTH_MATIRX/this.NUM_COLUMN_MATRIX)-listLengthmatrix[j]))
                    break;
                var itemCheck = matrix[startPos];
                var item = matrix[pos];
                if(!this.slotView.isFree)
                    if(item % 20 != itemCheck % 20 && !this.CheckSpecialItem(item % 20 ) && !this.CheckIsQueenItem(itemCheck, item))
                        break;
                else{
                    if(!this.CheckSpecialItem(item % 20 &&!this.CheckIsQueenItem(itemCheck, item)) )
                        break;
                }
                listRs[j] = pos;
                if(!listPoin[startPos.toString()].includes(pos))
                    listPoin[startPos.toString()].push(pos);
                if(!listPoin["0"].includes(pos))
                    listPoin["0"].push(pos);
            }
            listLineWin[i] = listRs;
        }
        for( var line in listPoin){
            outLineWin[outLineWin.length] = listPoin[line];
        }
        return outLineWin;
    },

    CheckIsQueenItem(startid, idCheck){
        let isQueenItem = false;
        if((startid % 20 == this.ID_GOLD_QUEEN || startid % 20 == this.ID_QUEEN || startid >= 40) && (idCheck % 20 == this.ID_GOLD_QUEEN || idCheck % 20 == this.ID_QUEEN || idCheck >= 40))
            isQueenItem = true;
        return isQueenItem;
    },
});
