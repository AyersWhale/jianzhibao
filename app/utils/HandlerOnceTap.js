let isCalled = false, timer;

/** 
 * 防止多次点击触发事件，可用于按钮与push页面
 * @param functionTobeCalled method 对调函数体
 * @param interval  定时器
 */
export default HandlerOnceTap = (functionTobeCalled, interval = 1000) => {
    if (!isCalled) {
        isCalled = true;
        clearTimeout(timer);
        timer = setTimeout(() => {
            isCalled = false;
        }, interval);
        return functionTobeCalled();
    }
};