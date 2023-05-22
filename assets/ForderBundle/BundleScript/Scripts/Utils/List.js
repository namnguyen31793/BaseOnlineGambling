var List = cc.Class({
    statics: {
        getIns() {
            if (this.self == null) this.self = new List();
            return this.self;
        }
    },

    ctor() {
        this.listValue = [];
    },

    Import(list) {
        for(let i = 0; i < list.length; i++) {
            this.Add(list[i]);
        }
    },

    Add(item) {
        this.listValue.push(item);
    },

    Get(index) {
        return this.listValue[index];
    },

    Find(item) {
        return this.listValue.indexOf(item);
    },

    RemoveAt(index) {
        return this.listValue.splice(index, 1);
        // for(let i = index; i < this.listValue.length-1; i++) {
        //     this.listValue[i] = this.listValue[i+1];
        // }
        // this.listValue.length = this.listValue.length-1;
    },

    InsertAt(index, item) {
        let length = this.listValue.length;
        for(let i = length; i > index; i--) {
            let temp = this.listValue[i-1];
            this.listValue[i] = temp;
        }
        this.listValue[index] = item;
    },

    Clear() {
        this.listValue = [];
    },

    Clone(list) {
        this.listValue = list.slice();
    },

    CloneOtherList(list) {
        this.listValue = list.listValue.slice();
    },

    GetCount() {
        return this.listValue.length;
    },

});
module.exports = List;
