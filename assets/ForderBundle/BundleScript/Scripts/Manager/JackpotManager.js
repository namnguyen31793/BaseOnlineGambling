var JackpotManager = cc.Class({
	statics: {
        getIns() {
            if (this.self == null) this.self = new JackpotManager();
            return this.self;
        }
    },

    properties: {
        jackpotValueFish1: 0,
        jackpotValueFish2 : 0,
        jackpotValueSlot1Room1 : 0,
        jackpotValueSlot1Room2 : 0,
        jackpotValueSlot1Room3 : 0,
        jackpotValueSlot2Room1 : 0,
        jackpotValueSlot2Room2 : 0,
        jackpotValueSlot2Room3 : 0,
        jackpotValueSlot3Room1 : 0,
        jackpotValueSlot3Room2 : 0,
        jackpotValueSlot3Room3 : 0,
        jackpotValueSlot4Room1 : 0,
        jackpotValueSlot4Room2 : 0,
        jackpotValueSlot4Room3 : 0,
        jackpotValueMiniSlotRoom1 : 0,
        jackpotValueMiniSlotRoom2 : 0,
        jackpotValueMiniSlotRoom3 : 0,
        jackpotValueMiniPokerRoom1 : 0,
        jackpotValueMiniPokerRoom2 : 0,
        jackpotValueMiniPokerRoom3 : 0,
        
    },

    SetValueJackpotFish(jackpotValue) {
        this.jackpotValueFish1 = jackpotValue;
    },

    SetValueJackpotSlot1Room1(jackpotValue) {
        this.jackpotValueSlot1Room1 = jackpotValue;
    },

    SetValueJackpotSlot1Room2(jackpotValue) {
        this.jackpotValueSlot1Room2 = jackpotValue;
    },

    SetValueJackpotSlot1Room3(jackpotValue) {
        this.jackpotValueSlot1Room3 = jackpotValue;
    },

    SetValueJackpotSlot2Room1(jackpotValue) {
        this.jackpotValueSlot2Room1 = jackpotValue;
    },

    SetValueJackpotSlot2Room2(jackpotValue) {
        this.jackpotValueSlot2Room2 = jackpotValue;
    },

    SetValueJackpotSlot2Room3(jackpotValue) {
        this.jackpotValueSlot2Room3 = jackpotValue;
    },

    SetValueJackpotSlot3Room1(jackpotValue) {
        this.jackpotValueSlot3Room1 = jackpotValue;
    },

    SetValueJackpotSlot3Room2(jackpotValue) {
        this.jackpotValueSlot3Room2 = jackpotValue;
    },

    SetValueJackpotSlot3Room3(jackpotValue) {
        this.jackpotValueSlot3Room3 = jackpotValue;
    },

    SetValueJackpotSlot4Room1(jackpotValue) {
        this.jackpotValueSlot4Room1 = jackpotValue;
    },

    SetValueJackpotSlot4Room2(jackpotValue) {
        this.jackpotValueSlot4Room2 = jackpotValue;
    },

    SetValueJackpotSlot4Room3(jackpotValue) {
        this.jackpotValueSlot4Room3 = jackpotValue;
    },

    SetValueJackpotMiniSlotRoom1(jackpotValue) {
        this.jackpotValueMiniSlotRoom1 = jackpotValue;
    },

    SetValueJackpotMiniSlotRoom2(jackpotValue) {
        this.jackpotValueMiniSlotRoom2 = jackpotValue;
    },

    SetValueJackpotMiniSlotRoom3(jackpotValue) {
        this.jackpotValueMiniSlotRoom3 = jackpotValue;
    },

    SetValueJackpotMiniPokerRoom1(jackpotValue) {
        this.jackpotValueMiniPokerRoom1 = jackpotValue;
    },

    SetValueJackpotMiniPokerRoom2(jackpotValue) {
        this.jackpotValueMiniPokerRoom2 = jackpotValue;
    },

    SetValueJackpotMiniPokerRoom3(jackpotValue) {
        this.jackpotValueMiniPokerRoom3 = jackpotValue;
    },


    GetValueJackpotFish() {
        return this.jackpotValueFish1;
    },

    GetValueJackpotFish2() {
        return this.jackpotValueFish2;
    },

    GetValueJackpotSlot1Room1() {
        return this.jackpotValueSlot1Room1;
    },

    GetValueJackpotSlot1Room2() {
        return this.jackpotValueSlot1Room2;
    },

    GetValueJackpotSlot1Room3() {
        return this.jackpotValueSlot1Room3;
    },

    GetValueJackpotSlot2Room1() {
        return this.jackpotValueSlot2Room1;
    },

    GetValueJackpotSlot2Room2() {
        return this.jackpotValueSlot2Room2;
    },

    GetValueJackpotSlot2Room3() {
        return this.jackpotValueSlot2Room3;
    },

    GetValueJackpotSlot3Room1() {
        return this.jackpotValueSlot3Room1;
    },

    GetValueJackpotSlot3Room2() {
        return this.jackpotValueSlot3Room2;
    },

    GetValueJackpotSlot3Room3() {
        return this.jackpotValueSlot3Room3;
    },

    GetValueJackpotSlot4Room1() {
        return this.jackpotValueSlot4Room1;
    },

    GetValueJackpotSlot4Room2() {
        return this.jackpotValueSlot4Room2;
    },

    GetValueJackpotSlot4Room3() {
        return this.jackpotValueSlot4Room3;
    },

    GetValueJackpotMiniSlotRoom1() {
        return this.jackpotValueMiniSlotRoom1;
    },

    GetValueJackpotMiniSlotRoom2() {
        return this.jackpotValueMiniSlotRoom2;
    },

    GetValueJackpotMiniSlotRoom3() {
        return this.jackpotValueMiniSlotRoom3;
    },

    GetValueJackpotMiniPokerRoom1() {
        return this.jackpotValueMiniPokerRoom1;
    },

    GetValueJackpotMiniPokerRoom2() {
        return this.jackpotValueMiniPokerRoom2;
    },

    GetValueJackpotMiniPokerRoom3() {
        return this.jackpotValueMiniPokerRoom3;
    },
    
    
});
module.exports = JackpotManager;
