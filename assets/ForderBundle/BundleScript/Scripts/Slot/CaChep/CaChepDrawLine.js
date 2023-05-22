cc.Class({
    extends: require("DrawLineControl"),

    ctor() {
        this.LENGTH_MATIRX = 20;
        this.NUM_COLUMN_MATRIX = 5;
    },

    InitPayLine() {
        this.listSpecialWild = [2,16,17];
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
});
