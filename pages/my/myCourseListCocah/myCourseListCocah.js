const $common = require('../../../common/common.js');
Page({
  data: {
    pageIndex: 1,
    pageSize: 5,
    corInfos: [],
    teaSrc: $common.config.teaSrc,
    flag: true,
  },
  skipCourseDetail(e) {
    let corInfos = this.data.corInfos;
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: `/pages/shop/courseDetail/courseDetail?corId=${corInfos[index].CorId}&isGroup=1`,
    })
  },
  init(isReach) {
    $common.loading();
    let pageIndex = 1,
      pageSize = this.data.pageSize;
    isReach && (pageIndex = this.data.pageIndex);
    $common.api.request(
      'POST',
      $common.config.GetGroupCorInfos,
      {
        openId: wx.getStorageSync('openId'),
        pageIndex: pageIndex,
        pageSize: pageSize
      },
      (res) => {
        if (res.data.res) {
          let corInfos = [];
          let arr = res.data.corInfos;
          isReach && (corInfos = this.data.corInfos);
          for (let i = 0, len = arr.length; i < len; i++) {
            arr[i].image = arr[i].CoaHeadPic;
            arr[i].name = arr[i].CorName;
            arr[i].price = arr[i].CorRePrice;
            arr[i].oldPrice = arr[i].CorPrice;
            arr[i].info = arr[i].CorAbstract;
            let start = $common.api.timeStamp(arr[i].CctStaTime);
            let end = $common.api.timeStamp(arr[i].CctEndTime);
            arr[i].showTime = `${start.y}-${start.m}-${start.d} ${start.h}:${start.mi}-${end.h}:${end.mi}`;
            corInfos.push(arr[i]);
          }
          arr.length >= pageSize && (this.data.pageIndex++);
          corInfos = $common.api.unique(corInfos, 'CorId');
          this.setData({
            corInfos: corInfos
          })
        } else {
          if (res.data.errType != 6) {
            $common.err1();
          }
        }
      },
      (res) => {
        $common.err2();
      },
      (res) => {
        this.data.flag = true;
        $common.hide();
      },
      wx.getStorageSync('Ticket')
    )
  },
  onLoad: function (options) {
    this.init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.init();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.flag) return;
    this.data.flag = false;
    this.init(true);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return $common.api.share();
  }
})