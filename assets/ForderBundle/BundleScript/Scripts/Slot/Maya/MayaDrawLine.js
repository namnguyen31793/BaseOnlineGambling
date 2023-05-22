cc.Class({
    extends: require("CaChepDrawLine"),

    properties: {
        effectWinFree : [cc.Node],
    },

    ctor() {
        this.LENGTH_MATIRX = 15;
        this.NUM_COLUMN_MATRIX = 5;
    },

    InitPayLine() {
        this.listSpecialWild = [2];
        this.timeLoopShowLine = 1.5;
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

    DrawLine(listPoint) {
        this._super(listPoint);
        for(let i = 0; i < listPoint.length; i++) {
            if(this.effectWinFree[listPoint[i]])
                this.effectWinFree[listPoint[i]].active = true;
        }
    },

    HideAllLine() {
        this._super();
        for(let i = 0; i < this.effectWinFree.length; i++) {
            if(this.effectWinFree[i])
                this.effectWinFree[i].active = false;
        }
    }
});
