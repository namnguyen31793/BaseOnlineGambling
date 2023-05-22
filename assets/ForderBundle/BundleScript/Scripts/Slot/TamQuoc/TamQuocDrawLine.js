

cc.Class({
    extends: require("DrawLineControl"),

    InitPayLine() {
        this.payLine = [
            [1,  2,  3,  4,  5],   // line 1 
            [6,  7,  8,  9,  10],  // line 2 
            [11, 12, 13, 14, 15],  // line 3 
            [15, 9,  3,  7,  11],  // line 4 
            [5,  9,  13, 7,  1],   // line 5 
            [10, 4,  3,  2,  6],   // line 6 
            [10, 14, 13, 12, 6],   // line 7 
            [1,  2,  8,  14, 15],  // line 8 
            [11, 12, 8,  4,  5],   // line 9 
            [6,  2,  8,  14, 10],  // line 10
            [10, 4,  8,  12, 6],   // line 11
            [5,  9,  8,  7,  1],   // line 12
            [15, 9,  8,  7,  11],  // line 13
            [1,  7,  3,  9,  5],   // line 14
            [11, 7,  13, 9,  15],  // line 15
            [10, 9,  3,  7,  6],   // line 16
            [10, 9,  13, 7,  6],   // line 17
            [5,  4,  13, 2,  1],   // line 18
            [15, 14, 3,  12, 11],  // line 19
            [1,  12, 13, 14, 5],   // line 20
            [11, 2,  3,  4,  15],  // line 21
            [6,  2,  13, 4,  10],  // line 22
            [10, 14, 3,  12, 6],   // line 23
            [5,  14, 3,  12, 1],   // line 24
            [15, 4,  13, 2,  11],  // line 25
        ];
    },

    InitConfig() {
        this.xBonus = -this.parentItemSlot.x;
        this.yBonus = 20;
        this.lineWidth = 6;
    },

});
