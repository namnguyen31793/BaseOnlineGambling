

cc.Class({
    extends: require("DrawLineControl"),

    InitPayLine() {
        this.payLine = [
            [1,  2,  3],   // line 1 
            [1,  2,  6],  // line 2 
            [1,  2,  9],  // line 3 
            [1,  5,  3],  // line 4 
            [1,  5,  6],   // line 5 
            [1,  5,  9],   // line 6 
            [1,  8,  3],   // line 7 
            [1,  8,  6],  // line 8 
            [1,  8,  9],   // line 9 
            [4,  2,  3],  // line 10
            [4,  2,  6],   // line 11
            [4,  2,  9],   // line 12
            [4,  5,  3],  // line 13
            [4,  5,  6],   // line 14
            [4,  5,  9],  // line 15
            [4,  8,  3],   // line 16
            [4,  8,  6],   // line 17
            [4,  8,  9],   // line 18
            [7,  2,  3],  // line 19
            [7,  2,  6],   // line 20
            [7,  2,  9],  // line 21
            [7,  5,  3],  // line 22
            [7,  5,  6],   // line 23
            [7,  5,  9],   // line 24
            [7,  8,  3],  // line 25
            [7,  8,  6],  // line 26
            [7,  8,  9],  // line 27
        ];
    },

    InitConfig() {
        this.xBonus = -5;
        this.yBonus = 10;
        this.lineWidth = 6;
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
        let outLineWin = [];
        for(let i = 0; i < listLine.length; i++) {
            outLineWin.push(listLine[i].Items)
        }
        cc.log(outLineWin);
        return outLineWin;
    },

    DrawLine(listPoint) {
        let listItem = this.slotView.spinManager.listItem;
        for(let i = 0; i < listPoint.length; i++) {
            this.slotView.itemManager.ActiveItem(listItem[listPoint[i]-1], true);
            listItem[listPoint[i]-1].ShowEffectWin();
        }
    },

});
