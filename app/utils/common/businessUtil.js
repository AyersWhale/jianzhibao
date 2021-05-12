export function workTypeByCode(code) {
    switch (code) {
        case 'FQRZ': return '兼职';
        case 'LSYG': return '合伙人';
        case 'LWPQ': return '抢单';
        case 'CHYW': return '撮合';
        case 'QRZ': return '全日制'
        default: return '其他'
    }
}

export function workTypeByValue(value) {
    switch (value) {
        case '兼职': return 'FQRZ';
        case '合伙人': return 'LSYG';
        case '抢单': return 'LWPQ';
        case '撮合': return 'CHYW';
        case '全日制': return 'QRZ'
        default: return ''
    }
}