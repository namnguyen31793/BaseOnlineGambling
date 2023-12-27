var AllwayLineManager = cc.Class({
    statics: {
        getIns() {
            if (this.self == null) {
                this.self = new AllwayLineManager();
                this.self.setup();
            }
            return this.self;
        }
    },

    setup() {
        const columns = [
            [0, 5, 10],
            [1, 6, 11],
            [2, 7, 12],
            [3, 8, 13],
            [4, 9, 14]
        ];

        this.listSpecialWild = [];
        this.rewardLine = [];
        let lineId = 0;
        columns[0].forEach(col1 => {
            columns[1].forEach(col2 => {
                columns[2].forEach(col3 => {
                    columns[3].forEach(col4 => {
                        columns[4].forEach(col5 => {
                            // You can choose any column to be the lineId
                            this.rewardLine.push({ lineId, values: [col1, col2, col3, col4, col5] });
                            lineId++;
                        });
                    });
                });
            });
        });

        
    },

    InitPayLine() {
        this.listSpecialWild = [this.ID_WILD];
        this.payLine = [];
        let index = 0;
        for (let i = 0; i < this.NUMBER_ROW; i++) {
            for (let j = 0; j < this.NUMBER_ROW; j++) {
                for (let k = 0; k < this.NUMBER_ROW; k++) {
                    for (let l = 0; l < this.NUMBER_ROW; l++) {
                        for (let m = 0; m < this.NUMBER_ROW; m++) {
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
            let pos = listPosColum[i] + 1;
            listPos[i] = pos;
        }
        return listPos;
    },

    getValueByLineId(lineId) {
        const line = this.rewardLine.find(entry => entry.lineId === lineId);
        return line ? line.values : null;
    },
    checkWinningLine(itemId, winningLineId) {  
        const values = this.getValueByLineId(winningLineId);
        if (values) {
            const positionInLine = values.indexOf(itemId);
            return positionInLine !== -1; // Return true if the item is found in the winning line
        }
    
        return false; // Return false if the winning line does not exist
    },
    CheckSpecialItem(id){
        var isSpecialWild = false;
        for(let i = 0; i < this.listSpecialWild.length; i++){
            if(id == this.listSpecialWild[i])
            isSpecialWild = true;
        }
        return isSpecialWild;
    },
    
    GetListPosRuleAllWay(listLineString,matrixString,idWild){
        this.listSpecialWild = [];
        this.listSpecialWild = [idWild];
        let matrix = matrixString.split(',').map(numString => Math.floor(parseInt(numString, 10)));
        let listLine = listLineString.split(',').map(numString => Math.floor(parseInt(numString, 10)));
    
        let listLineWin = [];
    
        let listPoin = {};
        listPoin["0"] = [];
    
        for (let i = 0; i < listLine.length; i++) {
            let lineId = listLine[i] - 1;
            let lineRewardData = this.rewardLine.find(entry => entry.lineId === lineId);
            if(lineRewardData == null)
            return;
            let linePos = lineRewardData.values;
            var startPos = linePos[0];
    
            var idCheckMatch = -1;
            if (matrix[startPos] != idWild) 
                idCheckMatch = matrix[startPos];
    
            if (!(startPos.toString() in listPoin)) {
                listPoin[startPos.toString()] = [];
                listPoin[startPos.toString()].push(startPos);
            }
            if (!listPoin["0"].includes(startPos)) listPoin["0"].push(startPos);
    
            let listRs = [];
            listRs[0] = startPos;
    
            for (let j = 1; j < linePos.length; j++) {
                if (idCheckMatch == -1 && matrix[linePos[j]] != idWild) 
                    idCheckMatch = matrix[linePos[j]];
    
                if ((idCheckMatch != -1 && matrix[linePos[j]] != idCheckMatch && !this.CheckSpecialItem(matrix[linePos[j]])))
                    break;
    
                listRs[j] = linePos[j];
    
                if (!listPoin[startPos.toString()].includes((linePos[j])))
                    listPoin[startPos.toString()].push(linePos[j]);
                if (!listPoin["0"].includes((linePos[j])))
                    listPoin["0"].push(linePos[j]);
            }
            listLineWin = [...listLineWin, ...listRs];
        }
    
        // Loại bỏ các phần tử trùng nhau bằng cách chuyển đổi thành Set và sau đó trở lại mảng
        listLineWin = Array.from(new Set(listLineWin));
    
        return listLineWin;
    },
    findLineID(inputString) {
        for (const line of this.rewardLine) {
            let lineData = line.values.join(',');
          if (this.checkSubstrings(lineData,inputString)) {
            return line.lineId;
          }
        }
        return null;
    },
     checkSubstrings(rootString, checkString) {
        let bElements = checkString.split(',');
        for (let element of bElements) {
          if (!rootString.includes(element)) {
            return false;
          }
        }
        return true;
      },

      checkCompareStrings(rootString, checkString) {
        if(rootString === checkString)
            return true;
        return false;
      }


    

});