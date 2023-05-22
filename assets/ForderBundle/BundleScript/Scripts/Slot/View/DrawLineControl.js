var TIME_DRAW = 1;
cc.Class({
    extends: cc.Component,
    /*PayLine Matrix:   0  0  0  0  0       1  2  3  4  5
                        1  1  1  1  1  ->   6  7  8  9  10
                        2  2  2  2  2       11 12 13 14 15
         */
    ctor() {
        this.payLine = [];
        this.slotView = null;
        this.listAction = [];
        this.listSpecialWild = [];
        this.toDoList = null;
        this.timeLoopShowLine = 1;
    },

    properties: {

    },

    Init(slotView) {
        this.slotView = slotView;
        this.toDoList = this.node.addComponent("ToDoList");
        this.InitPayLine();
    },

    InitPayLine() {
        //khoi tao list id WILD, neu không có để rỗng
        this.listSpecialWild = [2, 16, 17];
        this.timeLoopShowLine = 1;
        this.payLine = [
            [1,  2,  3,  4,  5],  // line 1 - 1, 2, 3, 4, 5
            [6,  7,  8,  9,  10],  // line 2 - 6, 7, 8, 9, 10
            [11, 12, 13, 14, 15], // line 3 - 11,12,13,14,15
            [1,  7,  13, 9,  5],  // line 4 - 1, 7, 13,9, 5
            [11, 7,  3,  9,  15], // line 5 - 11,7, 3, 9, 15
            [1,  2,  8,  4,  5],  // line 6 - 1, 2, 8, 4, 5
            [11, 12, 8,  14, 15], // line 7 - 11,12,8, 14,15
            [6,  7,  3,  9,  10], // line 8 - 6, 7, 3, 9, 10
            [6,  7,  13, 9,  10], // line 9 - 6, 7, 13,9, 10
            [6,  2,  8,  4,  10], // line 10- 6, 2, 8, 4, 10
            [1,  7,  3,  9,  5],  // line 11- 1, 7, 3, 9, 5
            [1,  12, 13, 14, 5],  // line 12- 1, 12,13,14,5
            [6,  12, 8,  14, 10], // line 13- 6, 12,8, 14,10
            [11, 2,  3,  4,  15], // line 14- 11,2, 3, 4, 15
            [6,  2,  8,  14, 10], // line 15- 6, 2, 8, 14,10
            [6,  12, 8,  4,  10], // line 16- 6, 12,8, 4, 10
            [6,  12, 13, 14, 10], // line 17- 6, 12,13,14,10
            [6,  2,  3,  4,  10], // line 18- 6, 2, 3, 4, 10
            [11, 7,  8,  9,  15], // line 19- 11,7, 8, 9, 15
            [1,  7,  8,  9,  5]   // line 20- 1, 7, 8, 9, 5
        ];
    },


    StopDraw() { 
        this.toDoList.StopWork();
        this.HideAllLine();
    },

    ShowLineWin(listLine) {
        cc.log("------------------ShowLineWin");
        cc.log(listLine);
        this.StopDraw();
        if(listLine.length == 0)
            return;
        let listLineWin = this.GetListPosRuleAllWay(listLine);
        this.toDoList.CreateList();
        for(let i = 0; i < listLineWin.length; i++) {
            this.toDoList.AddWork(()=>{
                this.DrawLine(listLineWin[i]);
            }, false);
            this.toDoList.Wait(this.timeLoopShowLine);
            this.toDoList.AddWork(()=>{
                this.HideAllLine();
            }, false);
            this.toDoList.Wait(0.5);
        }
        this.toDoList.PlayRepeat();
    },

    GetListPosRuleAllWay(listLine){
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
        cc.log(outLineWin);
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

    DrawLine(listPoint) {
        let listItem = this.slotView.spinManager.listItem;
        for(let i = 0; i < listPoint.length; i++) {
            this.slotView.itemManager.ActiveItem(listItem[listPoint[i]], true);
            listItem[listPoint[i]].ShowEffectWin();
        }
    },

    HideAllLine() {
        let listItem = this.slotView.spinManager.listItem;
        for(let i = 0; i < listItem.length; i++) {
            this.slotView.itemManager.ActiveItem(listItem[i], false);
            listItem[i].HideEffectWin();
        }
    },
});
