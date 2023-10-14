

cc.Class({
    extends: require("DrawLineControl"),

    ctor() {
        this.LENGTH_MATIRX = 15;
        this.NUM_COLUMN_MATRIX = 5;
    },

    properties: {
        listLineImg :[cc.Node],
    },

    InitPayLine() {
        this.listSpecialWild = [3, 4];
        this.payLine = [];
        this.timeLoopShowLine = 1;
        
        this.payLine[1] = this.GetPosByColum([5, 6, 7, 8, 9]);
        this.payLine[2] = this.GetPosByColum([0, 1, 2, 3, 4 ]);
        this.payLine[3] = this.GetPosByColum([10, 11, 12, 13, 14 ]);
        this.payLine[4] = this.GetPosByColum([0, 6, 12, 8, 4]);
        this.payLine[5] = this.GetPosByColum([10, 6, 2, 8, 14 ]);
        this.payLine[6] = this.GetPosByColum([5, 1, 7, 3, 9  ]);
        this.payLine[7] = this.GetPosByColum([5, 11, 7, 13, 9]);
        this.payLine[8] = this.GetPosByColum([0, 6, 2, 8, 4 ]);
        this.payLine[9] = this.GetPosByColum([10, 6, 12, 8, 14 ]);
        this.payLine[10] =this.GetPosByColum( [ 5, 1, 2, 3, 9 ]);
        this.payLine[11] = this.GetPosByColum([5, 11, 12, 13, 9  ]);
        this.payLine[12] = this.GetPosByColum([10, 11, 7, 13, 14]);
        this.payLine[13] = this.GetPosByColum([0, 1, 7, 3, 4 ]);
        this.payLine[14] = this.GetPosByColum([ 10, 6, 7, 8, 14 ]);
        this.payLine[15] = this.GetPosByColum([ 0, 6, 7, 8, 4]);
        this.payLine[16] = this.GetPosByColum([ 0, 11, 2, 13, 4]);
        this.payLine[17] = this.GetPosByColum([ 10, 1, 12, 3, 14]);
        this.payLine[18] = this.GetPosByColum([ 5, 6, 2, 8, 9 ]);
        this.payLine[19] = this.GetPosByColum([ 5, 6, 12, 8, 9  ]);
        this.payLine[20] = this.GetPosByColum([ 10, 11, 2, 13, 14 ]);
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
    
    ShowLineWin(listLine) {
        cc.log("------------------ShowLineWin");
        cc.log(listLine);
        this.StopDraw();
        if(listLine.length == 0)
            return;
        if(listLine.length == 1 && listLine[0] == 0)
            return;
        this.toDoList.CreateList();
        for(let i = 0; i < listLine.length; i++) {
            if(listLine[i] == 0)
                continue;
            this.toDoList.AddWork(()=>{
                this.listLineImg[listLine[i]-1].active = true;
            }, false);
            this.toDoList.Wait(this.timeLoopShowLine);
            this.toDoList.AddWork(()=>{
                this.HideAllLine();
            }, false);
            this.toDoList.Wait(0.25);
        }
        this.toDoList.PlayRepeat();
    },

    HideAllLine() {
        this._super();
        for(let j = 0; j < this.listLineImg.length; j++){
            this.listLineImg[j].active = false;
        }
    },

    ShowAllLineStart(){
        this.toDoList.CreateList();
        for(let i = 0; i < this.listLineImg.length; i++) {
            this.toDoList.AddWork(()=>{
                this.listLineImg[i].active = true;
            }, false);
        }
        this.toDoList.Wait(1);
        this.toDoList.AddWork(()=>{
            for(let j = 0; j < this.listLineImg.length; j++){
                this.listLineImg[j].active = false;
            }
        }, false);
        this.toDoList.Play();
    },
});
