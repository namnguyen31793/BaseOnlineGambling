

cc.Class({
    extends: require("DrawLineControl"),

    ctor() {
        this.LENGTH_MATIRX = 15;
        this.NUM_COLUMN_MATRIX = 5;
        this.ID_WILD = 3;
        this.ID_GOLD_QUEEN = 40;
    },

    properties: {
        listEffectWin :{
            default : [],
            type : cc.Node
        },
    },

    InitPayLine() {
        this.listSpecialWild = [3, 33, 34];
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
        // if(this.slotView.isFree){
        //     return this._super(listLine);
        // }
        let matrix = this.slotView.spinManager.cacheMatrix;
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
            if(matrix[startPos] != this.ID_WILD && matrix[startPos] != 33 && matrix[startPos] != 34)
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
                if(idCheckMatch == -1 && matrix[linePos[j]-1] != this.ID_WILD  && matrix[linePos[j]-1] != 33 && matrix[linePos[j]-1] != 34)
                    idCheckMatch = matrix[linePos[j]-1];
                if(this.slotView.isFree){
                    if(idCheckMatch != -1)
                        break;
                    if(matrix[linePos[j]-1] != this.ID_WILD && matrix[linePos[j]-1] != 33 && matrix[linePos[j]-1] != 34)
                        break;
                }
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

    DrawLine(listPoint) {
        let listItem = this.listEffectWin;
        for(let i = 0; i < listPoint.length; i++) {
            listItem[listPoint[i]].active = true;;
        }
        this._super(listPoint);
    },

    HideAllLine() {
        let listItem = this.listEffectWin;
        for(let i = 0; i < listItem.length; i++) {
            listItem[i].active = false;;
        }
        this._super();
    },
});
