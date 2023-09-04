

cc.Class({
    extends: require("DrawLineControl"),

    ctor() {
        this.LENGTH_MATIRX = 30;
        this.NUM_COLUMN_MATRIX = 6;
        this.ID_EXTRA_FREE = 2;
        this.listLineWin = [];
    },

    properties: {
        
    },

    InitPayLine() {
        this.listSpecialWild = [1];
        this.payLine = [];
        
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
        let listLineWin = [];
        //list tong hop
        let listPoin = {};//list position win + 1 all
        listPoin["0"] = [];
        let outLineWin = [];
        //chay tung line win la id win luon
        for(let i = 0; i < listLine.length; i++) {
            let linePos = this.GetPosByIdWin(matrix, listLine[i]);// list position line win
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

    GetPosByIdWin(matrix, idWin){
        this.payLine = [];
        for(let i = 0; i < matrix.length; i++){
            if(matrix[i] == idWin)
            this.payLine.push(i+1);
        }
        return this.payLine;
    },

    GetListPosExtraFree(){
        let matrix = this.slotView.spinManager.cacheMatrix;
        this.listPosExtraFree = [];
        for(let i = 0; i < matrix.length; i++){
            if(matrix[i] == this.ID_EXTRA_FREE)
                this.listPosExtraFree[this.listPosExtraFree.length] = i;
        }
    },
    
});
