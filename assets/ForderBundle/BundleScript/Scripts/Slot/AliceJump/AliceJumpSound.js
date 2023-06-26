cc.Class({
    extends: require("SlotSoundControl"),

    properties: {		
        jumpWild : cc.AudioClip,
       
    },
    SetLink() {
        this._super();
        this.bgLink = Sound.SOUND_SLOT.ALICE_JUMP_BG;
    },

    HandleMatrixSound(matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn,freeSpinLeft, totalWin, accountBalance, 
        currentJackpotValue, isTakeJackpot, extendMatrixDescription)
    {
        if(!this.isPlaySound)
            return;
        let rowSize = 5;
    
        if(this.checkJumpWild(matrix))
        {
            this.scheduleOnce(()=>{
                cc.audioEngine.playEffect(this.jumpWild, false);       
            } , 0.9);  
        }
       
    },

    checkJumpWild(matrixString)
    {
        let matrixArray = matrixString.split(",");
        let searchString1 = "3";
  
        for (let i = 0; i < matrixArray.length; i++) {
            let number = matrixArray[i].trim(); // Loại bỏ khoảng trắng thừa
            
            if (number == searchString1 ) {
              
                return true;
            }
        }  
        
        return false;
    }

    
});