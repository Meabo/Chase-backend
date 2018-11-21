"use strict"

const twoProduct = require("two-product")
const robustSum = require("robust-sum")
const robustScale = require("robust-scale")
const robustSubtract = require("robust-subtract")

let NUM_EXPAND = 5

const EPSILON     = 1.1102230246251565e-16
const ERRBOUND3   = (3.0 + 16.0 * EPSILON) * EPSILON
const ERRBOUND4   = (7.0 + 56.0 * EPSILON) * EPSILON

function cofactor(m, c)
{
    let result = new Array(m.length-1)
    for(let i=1; i<m.length; ++i) {
        let r = result[i-1] = new Array(m.length-1)
        for(let j=0,k=0; j<m.length; ++j) {
            if(j === c) {
                continue
            }
            r[k++] = m[i][j]
        }
    }
    return result
}

function matrix(n)
{
    let result = new Array(n)
    for(let i=0; i<n; ++i) {
        result[i] = new Array(n)
        for(let j=0; j<n; ++j) {
            result[i][j] = ["m", j, "[", (n-i-1), "]"].join("")
        }
    }
    return result
}

function sign(n)
{
    if(n & 1) {
        return "-"
    }
    return ""
}

function generateSum(expr)
{
    if(expr.length === 1) {
        return expr[0]
    } else if(expr.length === 2) {
        return ["sum(", expr[0], ",", expr[1], ")"].join("")
    } else {
        let m = expr.length>>1
        return ["sum(", generateSum(expr.slice(0, m)), ",", generateSum(expr.slice(m)), ")"].join("")
    }
}

function determinant(m) {
    if(m.length === 2) {
        return [["sum(prod(", m[0][0], ",", m[1][1], "),prod(-", m[0][1], ",", m[1][0], "))"].join("")]
    } else {
        let expr = []
        for(let i=0; i<m.length; ++i) {
            expr.push(["scale(", generateSum(determinant(cofactor(m, i))), ",", sign(i), m[0][i], ")"].join(""))
        }
        return expr
    }
}

function orientation(n)
{
    let pos = []
    let neg = []
    let m = matrix(n)
    let args = []
    for(let i=0; i<n; ++i) {
        if((i&1)===0) {
            pos.push.apply(pos, determinant(cofactor(m, i)))
        } else {
            neg.push.apply(neg, determinant(cofactor(m, i)))
        }
        args.push("m" + i)
    }
    let posExpr = generateSum(pos)
    let negExpr = generateSum(neg)
    let funcName = "orientation" + n + "Exact"
    let code = ["function ", funcName, "(", args.join(), "){let p=", posExpr, ",n=", negExpr, ",d=sub(p,n);\
return d[d.length-1];};return ", funcName].join("")
    let proc = new Function("sum", "prod", "scale", "sub", code)
    return proc(robustSum, twoProduct, robustScale, robustSubtract)
}

let orientation3Exact = orientation(3)
let orientation4Exact = orientation(4)

let CACHED = [
    function orientation0() { return 0 },
    function orientation1() { return 0 },
    function orientation2(a, b) {
        return b[0] - a[0]
    },
    function orientation3(a, b, c) {
        let l = (a[1] - c[1]) * (b[0] - c[0])
        let r = (a[0] - c[0]) * (b[1] - c[1])
        let det = l - r
        let s
        if(l > 0) {
            if(r <= 0) {
                return det
            } else {
                s = l + r
            }
        } else if(l < 0) {
            if(r >= 0) {
                return det
            } else {
                s = -(l + r)
            }
        } else {
            return det
        }
        let tol = ERRBOUND3 * s
        if(det >= tol || det <= -tol) {
            return det
        }
        return orientation3Exact(a, b, c)
    },
    function orientation4(a,b,c,d) {
        let adx = a[0] - d[0]
        let bdx = b[0] - d[0]
        let cdx = c[0] - d[0]
        let ady = a[1] - d[1]
        let bdy = b[1] - d[1]
        let cdy = c[1] - d[1]
        let adz = a[2] - d[2]
        let bdz = b[2] - d[2]
        let cdz = c[2] - d[2]
        let bdxcdy = bdx * cdy
        let cdxbdy = cdx * bdy
        let cdxady = cdx * ady
        let adxcdy = adx * cdy
        let adxbdy = adx * bdy
        let bdxady = bdx * ady
        let det = adz * (bdxcdy - cdxbdy)
            + bdz * (cdxady - adxcdy)
            + cdz * (adxbdy - bdxady)
        let permanent = (Math.abs(bdxcdy) + Math.abs(cdxbdy)) * Math.abs(adz)
            + (Math.abs(cdxady) + Math.abs(adxcdy)) * Math.abs(bdz)
            + (Math.abs(adxbdy) + Math.abs(bdxady)) * Math.abs(cdz)
        let tol = ERRBOUND4 * permanent
        if ((det > tol) || (-det > tol)) {
            return det
        }
        return orientation4Exact(a,b,c,d)
    }
]

function slowOrient(args) {
    let proc = CACHED[args.length]
    if(!proc) {
        proc = CACHED[args.length] = orientation(args.length)
    }
    return proc.apply(undefined, args)
}

function generateOrientationProc() {
    while(CACHED.length <= NUM_EXPAND) {
        CACHED.push(orientation(CACHED.length))
    }
    let args = []
    let procArgs = ["slow"]
    for(let i=0; i<=NUM_EXPAND; ++i) {
        args.push("a" + i)
        procArgs.push("o" + i)
    }
    let code = [
        "function getOrientation(", args.join(), "){switch(arguments.length){case 0:case 1:return 0;"
    ]
    for(let i=2; i<=NUM_EXPAND; ++i) {
        code.push("case ", i, ":return o", i, "(", args.slice(0, i).join(), ");")
    }
    code.push("}let s=new Array(arguments.length);for(let i=0;i<arguments.length;++i){s[i]=arguments[i]};return slow(s);}return getOrientation")
    procArgs.push(code.join(""))

    let proc = Function.apply(undefined, procArgs)
    module.exports = proc.apply(undefined, [slowOrient].concat(CACHED))
    for(let i=0; i<=NUM_EXPAND; ++i) {
        module.exports[i] = CACHED[i]
    }
}

generateOrientationProc()