

/*格式化日期 */
export const formateDate = (time) => {
    // if (!time)
    //     return ''
    let date = new Date(time)
    var year = date.getFullYear(),
        month = ("0" + (date.getMonth() + 1)).slice(-2),
        sdate = ("0" + date.getDate()).slice(-2),
        hour = ("0" + date.getHours()).slice(-2),
        minute = ("0" + date.getMinutes()).slice(-2),
        second = ("0" + date.getSeconds()).slice(-2);
    // 拼接
    var result = year + "-" + month + "-" + sdate + " " + hour + ":" + minute + ":" + second;
    // 返回
    return result;
}