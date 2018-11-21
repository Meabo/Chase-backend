module.exports = robustPointInPolygon;

let orient = require('./robust-point-polygon/orientation')

function robustPointInPolygon(vs, point)
{
    let x = point[0]
    let y = point[1]
    let n = vs.length
    let inside = 1
    let lim = n

    for(let i = 0, j = n-1; i<lim; j=i++)
    {
        let a = vs[i]
        let b = vs[j]
        let yi = a[1]
        let yj = b[1]
        if(yj < yi) {
            if(yj < y && y < yi) {
                let s = orient(a, b, point)
                if(s === 0) {
                    return 0
                } else {
                    inside ^= (0 < s)|0
                }
            } else if(y === yi) {
                let c = vs[(i+1)%n]
                let yk = c[1]
                if(yi < yk) {
                    let s = orient(a, b, point)
                    if(s === 0) {
                        return 0
                    } else {
                        inside ^= (0 < s)|0
                    }
                }
            }
        } else if(yi < yj) {
            if(yi < y && y < yj) {
                let s = orient(a, b, point)
                if(s === 0) {
                    return 0
                } else {
                    inside ^= (s < 0)|0
                }
            } else if(y === yi) {
                let c = vs[(i+1)%n]
                let yk = c[1]
                if(yk < yi) {
                    let s = orient(a, b, point)
                    if(s === 0) {
                        return 0
                    } else {
                        inside ^= (s < 0)|0
                    }
                }
            }
        } else if(y === yi) {
            let x0 = Math.min(a[0], b[0])
            let x1 = Math.max(a[0], b[0])
            if(i === 0) {
                while(j>0) {
                    let k = (j+n-1)%n
                    let p = vs[k]
                    if(p[1] !== y) {
                        break
                    }
                    let px = p[0]
                    x0 = Math.min(x0, px)
                    x1 = Math.max(x1, px)
                    j = k
                }
                if(j === 0) {
                    if(x0 <= x && x <= x1) {
                        return 0
                    }
                    return 1
                }
                lim = j+1
            }
            let y0 = vs[(j+n-1)%n][1]
            while(i+1<lim) {
                let p = vs[i+1]
                if(p[1] !== y) {
                    break
                }
                let px = p[0]
                x0 = Math.min(x0, px)
                x1 = Math.max(x1, px)
                i += 1
            }
            if(x0 <= x && x <= x1) {
                return 0
            }
            let y1 = vs[(i+1)%n][1]
            if(x < x0 && (y0 < y !== y1 < y)) {
                inside ^= 1
            }
        }
    }
    return 2 * inside - 1
}