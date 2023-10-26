/*
mavonEditor -一个基于Vue的降价编辑器，支持各种个性化功能
文档：https://github.com/hinesboy/mavonEditor
主题：https://github.com/hinesboy/mavonEditor/blob/master/src/lib/core/hljs/lang.hljs.css.js
*/

export const mavonEditor = {
  toolbars: {
    bold: true, // 粗体
    italic: true, // 斜体
    header: true, // 标题
    underline: true, // 下划线
    strikethrough: true, // 中划线
    mark: true, // 标记
    superscript: true, // 上角标
    subscript: true, // 下角标
    quote: true, // 引用
    ol: true, // 有序列表
    ul: true, // 无序列表
    link: true, // 链接
    imagelink: true, // 图片链接
    code: true, // code
    table: true, // 表格
    fullscreen: true, // 全屏编辑
    readmodel: true, // 沉浸式阅读
    htmlcode: true, // 展示html源码
    help: true, // 帮助
    /* 1.3.5 */
    undo: true, // 上一步
    redo: true, // 下一步
    trash: true, // 清空
    save: true, // 保存（触发events中的save事件）
    /* 1.4.2 */
    navigation: true, // 导航目录
    /* 2.1.8 */
    alignleft: true, // 左对齐
    aligncenter: true, // 居中
    alignright: true, // 右对齐
    /* 2.2.1 */
    subfield: true, // 单双栏模式
    preview: true // 预览
  },
  codeStyle: 'monokai-sublime', // 主题  solarized-dark
  fontSize: '18px', // 文字大小
  /*
  xss规则配置 开启后会对HTML标签进行过滤，默认过滤所有HTML标签属性，配置白名单减少被攻击的可能。
  https://jsxss.com/zh/options.html
 */
  xssOptions: {
    // stripIgnoreTagBody: true, // 不在白名单中的标签以及标签里面的内容直接删除
    whiteList: {
      h1: ['style'],
      h2: ['style'],
      h3: ['style'],
      h4: ['style'],
      h5: ['style'],
      h6: ['style'],
      hr: ['style'],
      span: ['style'],
      strong: ['style'],
      b: ['style'],
      i: ['style'],
      br: [],
      p: ['style'],
      pre: ['style'],
      code: ['style'],
      a: ['style', 'target', 'href', 'title', 'rel'],
      img: ['style', 'src', 'title'],
      div: ['style'],
      table: ['style', 'width', 'border'],
      tr: ['style'],
      td: ['style', 'width', 'colspan'],
      th: ['style', 'width', 'colspan'],
      tbody: ['style'],
      ul: ['style'],
      li: ['style'],
      ol: ['style'],
      dl: ['style'],
      dt: ['style'],
      em: ['style'],
      cite: ['style'],
      section: ['style'],
      header: ['style'],
      footer: ['style'],
      blockquote: ['style'],
      audio: ['autoplay', 'controls', 'loop', 'preload', 'src'],
      video: [
        'autoplay',
        'controls',
        'loop',
        'preload',
        'src',
        'height',
        'width'
      ]
    },
    css: {
      // 因为上面白名单中允许了标签的style属性，所以需要防止攻击者使用此途径进行攻击
      whiteList: {
        color: true,
        'background-color': true,
        width: true,
        height: true,
        'max-width': true,
        'max-height': true,
        'min-width': true,
        'min-height': true,
        'font-size': true
      }
    }
  }
}
