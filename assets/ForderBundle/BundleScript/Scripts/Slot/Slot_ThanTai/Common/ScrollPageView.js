// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    onLoad: function () {
        this.timeSwitchPage = 1;

        this.pageView = this.node.getComponent(cc.PageView);
        this.totalPages = this.pageView.getPages().length;
        this.currentPageIndex = this.pageView.getCurrentPageIndex();
    },

    switchPageClicked: function(event, data) {
        var index = parseInt(data.toString());
        this.currentPageIndex = this.pageView.getCurrentPageIndex();
        if (index > 0) {
            if (this.currentPageIndex === this.totalPages - 1) {
                this.currentPageIndex = 0;
            } else {
                this.currentPageIndex++;
            }
        } else {
            if (this.currentPageIndex === 0) {
                this.currentPageIndex = this.totalPages - 1;
            } else {
                this.currentPageIndex--;
            }
        }

        this.pageView.scrollToPage(this.currentPageIndex, this.timeSwitchPage);
    }
});
