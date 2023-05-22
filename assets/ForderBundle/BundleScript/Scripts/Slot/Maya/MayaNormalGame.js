

cc.Class({
    extends: require("CaChepNormalGame"),

    ctor() {
        this.listItemBonus = [];
        this.listJackpot = {};
        this.listBonus = {};
    },

    CheckBonus() {
        if(this.slotView.isBonus) {
            let listItem = this.slotView.spinManager.listItem;
            for(let temp in this.listBonus){
                if(this.listItemBonus[temp] == null) {
                   let bonusObj = cc.instantiate(this.itemBonus);
                   bonusObj.parent = this.bonusContainer;
                   bonusObj.active = false;
                   bonusObj.setPosition(listItem[temp].node.getPosition());
                   this.listItemBonus[temp] = bonusObj.getComponent("ItemSlotView");
                   this.listItemBonus[temp].item = listItem[temp];
                   this.slotView.itemManager.SetImage(3, this.listItemBonus[temp], temp);
                   this.listItemBonus[temp].PlayAnimationBonus();
               } 
                this.listItemBonus[temp].prizeValue = parseInt(this.listBonus[temp]) *  this.slotView.GetBetValue();
           }

           for(let temp in this.listJackpot){
            if(this.listItemBonus[temp] == null) {
               let jackpotObj = cc.instantiate(this.itemBonus);
               jackpotObj.parent = this.bonusContainer;
               jackpotObj.active = false;
               jackpotObj.setPosition(listItem[temp].node.getPosition());
               this.listItemBonus[temp] = jackpotObj.getComponent("ItemSlotView");
               this.listItemBonus[temp].item = listItem[temp];
               this.slotView.itemManager.SetImage(1, this.listItemBonus[temp], temp);
           } 
       }
        }
    },

    EndBonus() { 
        if(!this.slotView.isBonus) {
            for(let i = 0; i < this.listItemBonus.length; i++) {
                if(this.listItemBonus[i] != null) {
                    this.listItemBonus[i].node.destroy();
                }
            }
            this.listItemBonus = [];
        }
        
    },

    ParseMatrix(matrixData) {
        let matrixStr = matrixData.split(",");
        // matrixStr[1] = "1.500";
        // if(this.test == 2)
        // matrixStr[2] = "5.400";
        // if(this.test == 3)
        // matrixStr[4] = "5.800";
        let matrix = [];
        for(let i = 0; i < matrixStr.length; i++) {
            matrix[i] = parseInt(matrixStr[i]);
            if(matrix[i] == 3) {
                let value = matrixStr[i].split(".")
                this.listBonus[i.toString()] = value[1];
            }
            if(matrix[i] == 1) {
                let value = matrixStr[i].split(".")
                this.listJackpot[i.toString()] = value[1];
            }
        }
        // this.test++;
        return matrix;
    },
});
