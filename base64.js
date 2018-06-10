/*
 @desc：base64编解码函数
 @param data 待转换参数
 */
function base64(data){
    this.data = data
    this.table = new Array(
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
            'I', 'J', 'K', 'L', 'M', 'N', 'O' ,'P',
            'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
            'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
            'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
            'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
            'w', 'x', 'y', 'z', '0', '1', '2', '3',
            '4', '5', '6', '7', '8', '9', '+', '/'
    )
    /*
     @desc：内部方法，utf16转utf8
     @param data utf16字符串
     */
    this.utf16toutf8 = function(data) {
        var res = [], len = data.length
        for (var i = 0; i < len; i++) {
            var code = data.charCodeAt(i)
            if (code > 0x0000 && code <= 0x007F) {
                res.push(data.charAt(i));
            } else if (code >= 0x0080 && code <= 0x07FF) {
                var byte1 = 0xC0 | ((code >> 6) & 0x1F)
                var byte2 = 0x80 | (code & 0x3F)
                res.push(
                    String.fromCharCode(byte1), 
                    String.fromCharCode(byte2)
                )
            } else if (code >= 0x0800 && code <= 0xFFFF) {
                var byte1 = 0xE0 | ((code >> 12) & 0x0F)
                var byte2 = 0x80 | ((code >> 6) & 0x3F)
                var byte3 = 0x80 | (code & 0x3F)
                res.push(
                    String.fromCharCode(byte1), 
                    String.fromCharCode(byte2), 
                    String.fromCharCode(byte3)
                )
            } else if (code >= 0x00010000 && code <= 0x001FFFFF) {
            } else if (code >= 0x00200000 && code <= 0x03FFFFFF) {
            } else {
            }
        }
        return res.join('')
    }
    /*
     @desc：内部方法，utf8转utf16
     @param data utf8字符串
     */
    this.utf8toutf16 = function(data) {
        var res = [], len = data.length
        var i = 0
        for (var i = 0; i < len; i++) {
            var code = data.charCodeAt(i)
            if (((code >> 7) & 0xFF) == 0x0) {
                res.push(data.charAt(i))
            } else if (((code >> 5) & 0xFF) == 0x6) {
                var code2 = data.charCodeAt(++i)
                var byte1 = (code & 0x1F) << 6
                var byte2 = code2 & 0x3F
                var utf16 = byte1 | byte2
                res.push(String.fromCharCode(utf16))
            } else if (((code >> 4) & 0xFF) == 0xE) {
                var code2 = data.charCodeAt(++i)
                var code3 = data.charCodeAt(++i)
                var byte1 = (code << 4) | ((code2 >> 2) & 0x0F)
                var byte2 = ((code2 & 0x03) << 6) | (code3 & 0x3F)
                var utf16 = ((byte1 & 0x00FF) << 8) | byte2
                res.push(String.fromCharCode(utf16))
            } else if (((code >> 3) & 0xFF) == 0x1E) {
            } else if (((code >> 2) & 0xFF) == 0x3E) {
            } else {
            }
        }
        return res.join('')
    }
    /*
     @desc：编码
     */
    this.encode = function() {
        var data = this.data
        if (!data) {
            return ''
        }
        var utf8 = this.utf16toutf8(data)
        var i = 0
        var len = utf8.length
        var res = []
        while (i < len) {
            var c1 = utf8.charCodeAt(i++) & 0xFF
            res.push(this.table[c1 >> 2])
            if (i == len) {
                res.push(this.table[(c1 & 0x3) << 4])
                res.push('==')
                break
            }
            var c2 = utf8.charCodeAt(i++)
            if (i == len) {
                res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)])
                res.push(this.table[(c2 & 0x0F) << 2])
                res.push('=')
                break
            }
            var c3 = utf8.charCodeAt(i++)
            res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)])
            res.push(this.table[((c2 & 0x0F) << 2) | ((c3 & 0xC0) >> 6)])
            res.push(this.table[c3 & 0x3F])
        }
        return res.join('')
    }
    /*
     @desc：解码
     */
    this.decode = function(data) {
        var data = this.data
        if (!data) {
            return ''
        }
        var len = data.length
        var i   = 0
        var res = []
        while (i < len) {
            code1 = this.table.indexOf(data.charAt(i++))
            code2 = this.table.indexOf(data.charAt(i++))
            code3 = this.table.indexOf(data.charAt(i++))
            code4 = this.table.indexOf(data.charAt(i++))
            c1 = (code1 << 2) | (code2 >> 4)
            res.push(String.fromCharCode(c1))
            if (code3 != -1) {
                c2 = ((code2 & 0xF) << 4) | (code3 >> 2)
                res.push(String.fromCharCode(c2))
            }
            if (code4 != -1) {
                c3 = ((code3 & 0x3) << 6) | code4
                res.push(String.fromCharCode(c3))
            }
        }
        return this.utf8toutf16(res.join(''))
    }
}
// var data = '小火柴'
// var base64 = new base64(data)
// var ret = base64.encode()
// console.log(ret)