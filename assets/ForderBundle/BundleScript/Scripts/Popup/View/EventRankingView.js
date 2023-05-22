

cc.Class({
    extends: cc.Component,

    properties: {
        element1 : cc.Label,
        element2 : cc.Label,
        element3 : cc.Label,
        bg : cc.Sprite,
    },

    SetInfo(index, data1, data2, data3, isMe) {
        this.element1.string = data1;
        this.element2.string = data2;
        this.element3.string = data3;

        if (!isMe) {
            if (index % 2 == 0) {
                // bg.color = cc.Color.rgb2hsv(42, 29, 38, 255);
            } else {
                // bg.color = cc.Color.rgb2hsv(107, 65, 12, 0);
            }
        } else {
            // bg.color = cc.Color.rgb2hsv(6, 176, 0, 255);
            if(this.element1.string == "0")
                this.element1.string = "N/A";
        }
    },
    
});
