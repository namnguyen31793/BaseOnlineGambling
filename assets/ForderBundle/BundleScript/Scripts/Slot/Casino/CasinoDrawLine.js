

cc.Class({
    extends: require("DrawLineControl"),

    InitPayLine() {
        this.payLine = [
            [],
            [6,  7,  8,  9,  10],   // line 1 
            [1,  2,  3,  4,  5],    // line 2 
            [11, 12, 13, 14, 15],   // line 3 
            [6,  7,  3,  9,  10],   // line 4 
            [6,  7,  13, 9,  10],   // line 5 
            [1,  2,  8,  4,  5],    // line 6 
            [11, 12, 8,  14, 15],   // line 7 
            [1,  12, 3,  14, 5],    // line 8 
            [11, 2,  13, 4,  15],   // line 9 
            [6,  2,  13, 4,  10],   // line 10
            [11, 7,  3,  9,  15],   // line 11
            [1,  7,  13, 9,  5],    // line 12
            [6,  12, 8,  4,  10],   // line 13
            [6,  2,  8,  14, 10],   // line 14
            [11, 7,  8,  9,  15],   // line 15
            [1,  7,  8,  9,  5],    // line 16
            [6,  12, 13, 14, 10],   // line 17
            [6,  2,  3,  4,  10],   // line 18
            [11, 12, 8,  4,  5],    // line 19
            [1,  2,  8,  14, 15],   // line 20
        ];
    },

    InitConfig() {
        this.xBonus = 0;
        this.yBonus = 10;
        this.lineWidth = 6;
    },

});
