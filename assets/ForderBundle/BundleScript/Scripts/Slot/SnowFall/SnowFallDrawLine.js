

cc.Class({
    extends: require("DrawLineControl"),

    ctor() {
        this.LENGTH_MATIRX = 20;
        this.NUM_COLUMN_MATRIX = 5;
        this.ID_EXTRA_FREE = 3;
        this.listLineWin = [];
        this.listPosExtraFree = [];
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
        this.GetListPosExtraFree();
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

    GetListPosExtraFree(){
        let matrix = this.slotView.spinManager.cacheMatrix;
        this.listPosExtraFree = [];
        for(let i = 0; i < matrix.length; i++){
            if(matrix[i] == this.ID_EXTRA_FREE)
                this.listPosExtraFree[this.listPosExtraFree.length] = i;
        }
    },
    
});
