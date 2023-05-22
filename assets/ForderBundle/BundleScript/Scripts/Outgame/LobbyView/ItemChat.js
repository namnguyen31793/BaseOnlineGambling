// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
    },

    initItem(info){
        var lb = this.node.getComponent(cc.RichText);
        let str1 = "";
        let str2 = "";
        let str3 = "";
        let nickName = info.Nickname;
        let content = info.ChatContent;
        if(info.Type == 1) {
            // str1 = "";//<img src='V%v'/>".replace("%v" , vip) ";
            str2 = "<color=#ffdd69>" + nickName ;
            str3 = "<color=#FFFFFF>"+": " + content + "</c>" ;
        } else if(info.Type == 2) {
            str2 = "<color=#FF0000>" + nickName+" "+content +"</color>";
        } else if(info.Type == 3) {
            str1 = "<color=#ffdd69>" + nickName+"</color>" ;
            str2 = " đã ủng hộ ";
            str3 = "<color=#FFEB00>" + content+"</color>" ;
        }

        lb.string = str1 + str2 + str3;
        this.node.height = info.height;
     
    },
    unuse(){
        this.node.height = 0;
    }
});
