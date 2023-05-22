cc.Class({
    extends: cc.Component,

    properties: {
        icon: cc.Node,
        arrSprite: {
            default: [],
            type: [cc.SpriteFrame]
        }
    },

    itemIndex: null,
    randomSprite: null,

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.createRandomIcon();
    },

    randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    // init as server data to this spin
    initItem(data) {
        this.itemIndex = parseInt(data) - 1;
        this.icon.getComponent(cc.Sprite).spriteFrame = this.arrSprite[this.itemIndex];
        this.adapterItem(this.itemIndex);
    },

    adapterItem(iconId) {
        this.icon.scale = 0.9;
        return;
        switch (iconId) {
            case 0:
                this.icon.scale = 0.8;
                break;
            case 1:
            case 2:
            case 3:
                this.icon.scale = 1;
                break;
            default:
                break;
        }
    },

    // create random icon for each visit game play
    createRandomIcon() {
        this.randomSprite = this.randomBetween(0, 5);  // Mini Slot has 6 big Icons
        this.icon.getComponent(cc.Sprite).spriteFrame = this.arrSprite[this.randomSprite];
        this.adapterItem(this.randomSprite);
    },

    // update (dt) {},
});
