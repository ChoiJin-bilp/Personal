/**
 * 动态计算表格高度
 * */

import $ from 'jquery';
export default {
  data() {
    return {
      tableHeight: 'auto',
    };
  },
  // 创建组件时
  mounted() {
    this.$nextTick(() => {
      this.calculationHeight();
      window.addEventListener(
        'resize',
        () => {
          this.calculationHeight();
        },
        false
      );
    });
  },
  // 缓存组件内
  activated() {
    this.$nextTick(() => {
      this.calculationHeight();
      window.addEventListener(
        'resize',
        () => {
          this.calculationHeight();
        },
        false
      );
    });
  },
  methods: {
    calculationHeight() {
      // 分页 28px+8px上边距
      // 标题框下8px
      let titleHeight = this.$refs.titlebar ? this.$refs.titlebar.$el.offsetHeight : 0;
      // 查询框下 8px
      let searchHeight = this.$refs.searchbar ? 52 : 0;
      let h = $('.nstc-router-view').height();
      this.tableHeight = h - (8 + 28 + 8 + 10) - searchHeight - titleHeight;
    },
  },
};
