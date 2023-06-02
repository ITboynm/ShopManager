const draggable = {
  bind: function (el) {
    console.log(el);
    // 设置元素的初始位置
    let startX, startY, initialMouseX, initialMouseY;

    // 设置元素为绝对定位，这样它就不会影响文本流
    el.style.position = 'absolute';

    // 鼠标按下事件处理
    function onMouseDown(e) {
      // 阻止默认事件和冒泡
      e.preventDefault();
      e.stopPropagation();

      // 获取初始鼠标位置和元素位置
      startX = el.offsetLeft;
      startY = el.offsetTop;
      initialMouseX = e.clientX;
      initialMouseY = e.clientY;

      // 监听鼠标移动和松开事件
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    // 鼠标移动事件处理
    function onMouseMove(e) {
      // 计算拖拽位移
      const dx = e.clientX - initialMouseX;
      const dy = e.clientY - initialMouseY;

      // 更新元素位置
      el.style.left = startX + dx + 'px';
      el.style.top = startY + dy + 'px';
    }

    // 鼠标松开事件处理
    function onMouseUp() {
      // 移除鼠标移动和松开事件监听
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    // 为元素添加鼠标按下事件监听
    el.addEventListener('mousedown', onMouseDown);
  },
};

// 拖拽操作自定义指令
export default {
  install(app) {
    app.directive('draggable', draggable);
  },
};
