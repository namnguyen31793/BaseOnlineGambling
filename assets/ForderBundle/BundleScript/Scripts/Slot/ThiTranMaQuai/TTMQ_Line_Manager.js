// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
   ctor()
   {
        this.LineNumber_Array = [];
        this.Item_Pos_Array = [];
        this.LinePos_Info_Array = [];
        this.MAX_LINE = 25;
        this.MAX_ITEM = 15;
        this.defaultLine = this.MAX_LINE;
        this.isDraw = false;
   },
    properties: {
        /*
        LineNumber_Array : [cc.Node],
        Item_Pos_Array : [cc.Node],
        */
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.graphics = this.node.getComponent(cc.Graphics);
        this.Handle_Draw_ClearAllLine();
          // Tạo một mảng chứa các điểm (x, y)
          this.pointsLines = [];
          this.pointsItems = [];
          this.Load_posItem();
          this.Load_LineInfo();
          
          /*
        const foundEntry = this.LinePos_Info_Array.find(entry => entry.lineId === 1);
        this.drawConnectedLines( foundEntry.pos);
        */
      
    },
    onEnable()
    {
        this.Handle_Draw_ClearAllLine();
        //this.Handle_Draw_ShowLine();
    },

    start () {

    },
    Load_posItem() {
        for (let i = 1; i <= this.MAX_LINE; i++) {
            const objectName = `LineNumber_${i}`;
            const loadedObject = this.node.getChildByName(objectName);
            if (loadedObject) {
                this.LineNumber_Array.push(loadedObject); // Thêm đối tượng vào mảng LineNumber_Array
                this.pointsLines.push(loadedObject.getPosition());
            }
        }

        for (let i = 1; i <= this.MAX_ITEM; i++) {
            const objectName = `item_${i}_Pos`;
            const loadedObject = this.node.getChildByName(objectName);
            if (loadedObject) {
                this.Item_Pos_Array.push(loadedObject); // Thêm đối tượng vào mảng LineNumber_Array
                this.pointsItems.push(loadedObject.getPosition());
            }
        }
    },

    Load_LineInfo()
    {
        // this.pointsLine.push({ id: index, positions: [{ x: worldPosition.x, y: worldPosition.y }] });
        //Line 1
        //
        this.LinePos_Info_Array.push({ lineId: 1, pos:[this.getPosByLines(1),this.getPosByItem(6),this.getPosByItem(7),this.getPosByItem(8),this.getPosByItem(9),this.getPosByItem(10)]});
        //
        this.LinePos_Info_Array.push({ lineId: 2, pos:[this.getPosByLines(2),this.getPosByItem(1),this.getPosByItem(2),this.getPosByItem(3),this.getPosByItem(4),this.getPosByItem(5)]});
        //	
        this.LinePos_Info_Array.push({ lineId: 3, pos:[this.getPosByLines(3),this.getPosByItem(11),this.getPosByItem(12),this.getPosByItem(13),this.getPosByItem(14),this.getPosByItem(15)]});
        //	
        this.LinePos_Info_Array.push({ lineId: 4, pos:[this.getPosByLines(4),this.getPosByItem(11),this.getPosByItem(7),this.getPosByItem(3),this.getPosByItem(9),this.getPosByItem(15)]});
        //	
        this.LinePos_Info_Array.push({ lineId: 5, pos:[this.getPosByLines(5),this.getPosByItem(1),this.getPosByItem(7),this.getPosByItem(13),this.getPosByItem(9),this.getPosByItem(5)]});
        //	
        this.LinePos_Info_Array.push({ lineId: 6, pos:[this.getPosByLines(6),this.getPosByItem(6),this.getPosByItem(2),this.getPosByItem(3),this.getPosByItem(4),this.getPosByItem(10)]});
        //	
        this.LinePos_Info_Array.push({ lineId: 7, pos:[this.getPosByLines(7),this.getPosByItem(6),this.getPosByItem(12),this.getPosByItem(13),this.getPosByItem(14),this.getPosByItem(10)]});  
        //	
        this.LinePos_Info_Array.push({ lineId: 8, pos:[this.getPosByLines(8),this.getPosByItem(1),this.getPosByItem(2),this.getPosByItem(8),this.getPosByItem(14),this.getPosByItem(15)]});
        //	
        this.LinePos_Info_Array.push({ lineId: 9, pos:[this.getPosByLines(9),this.getPosByItem(11),this.getPosByItem(12),this.getPosByItem(8),this.getPosByItem(4),this.getPosByItem(5)]});
        //
        this.LinePos_Info_Array.push({ lineId: 10, pos:[this.getPosByLines(10),this.getPosByItem(6),this.getPosByItem(12),this.getPosByItem(8),this.getPosByItem(4),this.getPosByItem(10)]});
        //
        this.LinePos_Info_Array.push({ lineId: 11, pos:[this.getPosByLines(11),this.getPosByItem(6),this.getPosByItem(2),this.getPosByItem(8),this.getPosByItem(14),this.getPosByItem(10)]});
        //	
        this.LinePos_Info_Array.push({ lineId: 12, pos:[this.getPosByLines(12),this.getPosByItem(1),this.getPosByItem(7),this.getPosByItem(8),this.getPosByItem(9),this.getPosByItem(5)]});
        //	
        this.LinePos_Info_Array.push({ lineId: 13, pos:[this.getPosByLines(13),this.getPosByItem(11),this.getPosByItem(7),this.getPosByItem(8),this.getPosByItem(9),this.getPosByItem(15)]});
        //
        this.LinePos_Info_Array.push({ lineId: 14, pos:[this.getPosByItem(1),this.getPosByItem(7),this.getPosByItem(3),this.getPosByItem(9),this.getPosByItem(5),this.getPosByLines(14)]});
        //	
        this.LinePos_Info_Array.push({ lineId: 15, pos:[this.getPosByItem(11),this.getPosByItem(7),this.getPosByItem(13),this.getPosByItem(9),this.getPosByItem(15),this.getPosByLines(15)]});
        //	
        this.LinePos_Info_Array.push({ lineId: 16, pos:[this.getPosByItem(6),this.getPosByItem(7),this.getPosByItem(3),this.getPosByItem(9),this.getPosByItem(10),this.getPosByLines(16)]});
        //
        this.LinePos_Info_Array.push({ lineId: 17, pos:[this.getPosByItem(6),this.getPosByItem(7),this.getPosByItem(13),this.getPosByItem(9),this.getPosByItem(10),this.getPosByLines(17)]});
        //	
        this.LinePos_Info_Array.push({ lineId: 18, pos:[this.getPosByItem(1),this.getPosByItem(2),this.getPosByItem(13),this.getPosByItem(4),this.getPosByItem(5),this.getPosByLines(18)]});
        //	
        this.LinePos_Info_Array.push({ lineId: 19, pos:[this.getPosByItem(11),this.getPosByItem(12),this.getPosByItem(3),this.getPosByItem(14),this.getPosByItem(15),this.getPosByLines(19)]});
        //	
        this.LinePos_Info_Array.push({ lineId: 20, pos:[this.getPosByItem(1),this.getPosByItem(12),this.getPosByItem(13),this.getPosByItem(14),this.getPosByItem(5),this.getPosByLines(20)]});
        //
        this.LinePos_Info_Array.push({ lineId: 21, pos:[this.getPosByItem(11),this.getPosByItem(2),this.getPosByItem(3),this.getPosByItem(4),this.getPosByItem(15),this.getPosByLines(21)]});
        //	
        this.LinePos_Info_Array.push({ lineId: 22, pos:[this.getPosByItem(6),this.getPosByItem(2),this.getPosByItem(13),this.getPosByItem(4),this.getPosByItem(10),this.getPosByLines(22)]});
        //
        this.LinePos_Info_Array.push({ lineId: 23, pos:[this.getPosByItem(6),this.getPosByItem(12),this.getPosByItem(3),this.getPosByItem(14),this.getPosByItem(10),this.getPosByLines(23)]});
        //	
        this.LinePos_Info_Array.push({ lineId: 24, pos:[this.getPosByItem(1),this.getPosByItem(12),this.getPosByItem(3),this.getPosByItem(14),this.getPosByItem(5),this.getPosByLines(24)]});
        //	
        this.LinePos_Info_Array.push({ lineId: 25, pos:[this.getPosByItem(11),this.getPosByItem(2),this.getPosByItem(13),this.getPosByItem(4),this.getPosByItem(15),this.getPosByLines(25)]});

    },

    getPosByLines(lineID)
    {
        return this.pointsLines[lineID - 1];
    },
    getPosByItem(itemID)
    {
        return this.pointsItems[itemID - 1];
    },

    drawConnectedLines(lineInfo) {
        cc.log("Line Info: ");
        cc.log(lineInfo);
        if(this.graphics == null)
        this.graphics = this.node.getComponent(cc.Graphics);


        // Thiết lập màu và độ rộng của đường thẳng
        this.graphics.lineWidth = 5;
        this.graphics.strokeColor = new cc.Color(0, 204, 255, 255);

       
        lineInfo.forEach(element =>{
            let points = element.pos;
            this.graphics.moveTo(points[0].x, points[0].y);

            // Vẽ đường thẳng nối các điểm
            for (let i = 1; i < points.length; i++) {
                this.graphics.lineTo(points[i].x, points[i].y);
            }
            // Vẽ đường thẳng
            this.graphics.stroke();
        });
        this.isDraw = true;
       
    },

    Handle_Draw_ShowLine()
    { 
        this.Handle_Draw_ClearAllLine();
        this.defaultLine++;
        if(this.defaultLine > this.MAX_LINE)
            this.defaultLine = 1;      

        const lineArray = this.LinePos_Info_Array.filter(entry => entry.lineId <=  this.defaultLine);
    
        this.drawConnectedLines(lineArray);
        return this.defaultLine;

    },
    Get_CurrentLineAmount()
    {
        return this.defaultLine;
    },
    Handle_Draw_ClearAllLine()
    {
        if(!this.isDraw)
            return;
        if(this.graphics!= null)
            this.graphics.clear();
    },

    DrawLine_RewardSpin(listLineWinData)
    {
                // Tách chuỗi thành mảng các phần tử
        const elementsArray = listLineWinData.split('|');

        // Mảng kết quả chứa giá trị đầu tiên của mỗi phần tử
        const firstValuesArray = [];

        // Lặp qua từng phần tử và trích xuất giá trị đầu tiên
        elementsArray.forEach(element => {
            const values = element.split(',');
            const firstValue = parseInt(values[0], 10); // Parse thành int với radix 10
            firstValuesArray.push(firstValue);
        });
        if(firstValuesArray.length == 0)
        return;
        
        firstValuesArray.forEach((firstValue,index)=>{
            // Sử dụng setTimeout để tạo độ trễ
            setTimeout(() => {
                const lineArray = [this.LinePos_Info_Array.find(entry => entry.lineId ===  firstValue)];
                this.drawConnectedLines(lineArray);
            }, index * 250); // Mỗi lần lặp, độ trễ tăng lên 2s
        });

       



    }

});
