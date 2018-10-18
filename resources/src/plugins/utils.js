
/*工具类函数*/

const utils={
    /**
     *
     * @param date
     * @param format
     * @returns 经过格式化的日期
     * 例如:dareFormat(new Date(),'yyyy-MM-dd hh:mm:ss')  返回  2017-12-21 09:38:15
     */
     dateFormat:function(date, format) {
          var o = {
              'M+': date.getMonth() + 1,
              'd+': date.getDate(),
              'h+': date.getHours(),
              'm+': date.getMinutes(),
              's+': date.getSeconds()
          };
          if (/(y+)/.test(format)) {
              format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
          }

          for (var k in o) {
              if (new RegExp('(' + k + ')').test(format)) {
                  format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
              }
          }
          return format;
      },
    /**
     * 富文本转义
     * @param  {String} name 参数名
     * @return {String}      参数值
     *
     */
    html_encode:function (name) {
        var re = name+'';
        var exp = {
            '&':'&amp;',
            '<':'&lt;',
            '>':'&gt;',
            '"':'&quot;',
            ' ':'&nbsp;',
            '“':'&ldquo;',
            '”':'&rdquo;'
        }
        for(var item in exp)
            re = re.replace(new RegExp(item,'g'),exp[item]);
        return re;
    },
    /**
     * 富文本解析
     * @param  {String} name 参数名
     * @return {String}      参数值
     *
     */
    html_decode:function (name) {
        var re = name+'';
        var exp = {
            '&amp;':'&',
            '&lt;':'<',
            '&gt;':'>',
            '&quot;':'"',
            '&nbsp;':' ',
            '&ldquo;':'“',
            '&rdquo;':'”'
        };
        for(var item in exp)
            re = re.replace(new RegExp(item,'g'),exp[item]);
        return re;
    },
};

export  default  utils;
