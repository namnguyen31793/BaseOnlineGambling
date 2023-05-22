

cc.Class({
    extends: require("DrawLineControl"),

    ctor() {
        this.LENGTH_MATIRX = 30;
        this.NUM_COLUMN_MATRIX = 5;
        this.ID_EXTRA_FREE = 3;
        this.listLineWin = [];
    },

    properties: {
        
    },

    InitPayLine() {
        this.listSpecialWild = [];
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

    ShowLineWin(listLine) {
        this.StopDraw();
        if(listLine.length == 0){
            this.listLineWin = [];
            this.slotView.toDoList.DoWork();
            return;
        }
        this.listLineWin = this.GetListPosRuleAllWay(listLine);
        this.toDoList.CreateList();
        if(this.listLineWin.length > 0){
            this.toDoList.AddWork(()=>{
                this.DrawLine(this.listLineWin[0]);
            }, false);
            this.toDoList.Wait(1);
            this.toDoList.AddWork(()=>{
                this.HideAllLine();
            }, false);
        }
        this.toDoList.AddWork(()=>
            this.slotView.toDoList.DoWork(),
        false);
        this.toDoList.Play();
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
            let linePos = this.payLine[listLine[i]];
            
            var startPos = (linePos[0]-1);
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
                var pos = linePos[j]-1;
                if((pos/this.NUM_COLUMN_MATRIX) < ((this.LENGTH_MATIRX/this.NUM_COLUMN_MATRIX)-listLengthmatrix))
                    break;
                if(matrix[linePos[j]-1]%20 != matrix[startPos]%20 && !this.CheckSpecialItem(matrix[linePos[j]-1]%20 ) )
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
