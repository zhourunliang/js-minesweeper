// 复制一个 square
var clonedSquare = function(array) {
    var s = []
    for (var i = 0; i < array.length; i++) {
        var line = []
        for (var j = 0; j < array[i].length; j++) {
            line.push(array[i][j])
        }
        s.push(line)
    }
    return s
}

//构建空行
var blankLine = function(n) {
    var l = []
    for (var i = 0; i < n; i++) {
        l.push(0)
    }
    return l
}

// 生成空数组
var blankSquare = function(n) {
    var square = []
    for (var i = 0; i < n; i++) {
        var line = blankLine(n)
        square.push(line)
    }
    return square
}

// 给出地雷数量让后随机写入地雷
var writeInMine = function (array, num) {
    var square = clonedSquare(array)
    var r = square.length
    // 随机位置写入
    var randomLocation = function () {
        var x = Math.floor(Math.random() * r)
        var y = Math.floor(Math.random() * r)
        // console.log( ':', x, y);
        if (square[x][y] !== 9) {
            square[x][y] = 9
        } else {
            randomLocation()
        }
    }
    for (var i = 0; i < num; i++) {
        randomLocation()
    }
    return square
}


// 辅助函数, 给数字 +1
// 这里会判断下标是否合法
var plus1 = function(array, x, y) {
    var n = array.length
    if (x >= 0 && x < n && y >= 0 && y < n) {
        if (array[x][y] !== 9) {
            array[x][y] += 1
        }
    }
}

// 辅助函数, 用来给 9 周边的 8 个格子 +1
var markAround = function(array, x, y) {
    /*
    ###
    #+#
    ###
    */
    if (array[x][y] === 9) {
        // 左边 3 个
        plus1(array, x - 1, y - 1)
        plus1(array, x - 1, y)
        plus1(array, x - 1, y + 1)
        // 上下 2 个
        plus1(array, x, y - 1)
        plus1(array, x, y + 1)
        // 右边 3 个
        plus1(array, x + 1, y - 1)
        plus1(array, x + 1, y)
        plus1(array, x + 1, y + 1)
    }
}

//标记数组雷的数量
var markedSquare = function(array) {
    /*
    array 是一个「包含了『只包含了 0 9 的 array』的 array」
    返回一个标记过的 array
    ** 注意, 使用一个新数组来存储结果, 不要直接修改老数组

    范例如下, 这是 array
    [
        [0, 9, 0, 0],
        [0, 0, 9, 0],
        [9, 0, 9, 0],
        [0, 9, 0, 0],
    ]

    这是标记后的结果
    [
        [1, 9, 2, 1],
        [2, 4, 9, 2],
        [9, 4, 9, 2],
        [2, 9, 2, 1],
    ]

    规则是, 0 会被设置为四周 8 个元素中 9 的数量
    */
    var square = clonedSquare(array)
    for (var i = 0; i < square.length; i++) {
        var line = square[i]
        for (var j = 0; j < line.length; j++) {
            markAround(square, i, j)
        }
    }
    return square
}

//生成html
var drawHtml = function(square){
    //生成雷的页面
    var box = document.querySelector('.game-box')
    var html = ''
    for (let i = 0; i < square.length; i++) {
        var line = square[i]
        html += `<ul class="row">`
        for (let j = 0; j < line.length; j++) {
            n = square[i][j]
            if (n == 0) {
                n = ''
            }  
            html += `
            <li class="col" data-x="${i}" data-y="${j}" data-num="${n}" id="x-${i}-y-${j}">
                <span>${n}</span>
                <img src="img/flag.png" class="img-flag hide">
            </li>
            `   
        }
        html += `</ul>`
    }
    box.innerHTML = html

}

// 更新剩余雷数
var updateRemainMine = function() {
    var remain = document.querySelector('.remain')
    remain.innerText = `${remain_mine_num}`
}

//判断是否成功
var checkSuccess = function() {
    if (clean_mine_num == side_length * side_length - mine_num) {
        alert('Success')
    }
}

//显示所有的雷
var showAllMine = function() {
    var col = document.querySelectorAll('.col')
    for (let i = 0; i < col.length; i++) {
        if (col[i].children[0].innerText === '9') {
            col[i].classList.add('boom')
        }
    }

}

//显示空白的格子
var showWhite = function (x, y) {
    if (x < side_length && y < side_length && x >= 0 && y >= 0) {
        var el = document.querySelector(`#x-${x}-y-${y}`)
        // 需要注意这个 ！== 'white' ，如果不加这个就会进入无限循环
        if (el.style.background !== 'white') {
            el.style.background = 'white'
            el.children[0].style.opacity = '1'
            el.children[1].classList.add('hide')
            clean_mine_num++
            checkSuccess()
            if (el.innerText === '') {
                showNoMine(x, y)
            }
        }
    }
}

//显示周边8个位置无雷的格子
var showNoMine = function(x, y) {
    showWhite(x - 1, y + 1)
    showWhite(x - 1, y - 1)
    showWhite(x - 1, y)
    showWhite(x + 1, y + 1)
    showWhite(x + 1, y - 1)
    showWhite(x + 1, y)
    showWhite(x, y + 1)
    showWhite(x, y - 1)
}

//扫雷 左键点击事件
var cleanMine = function(){
    var row = document.querySelectorAll('.row')
    for (let i = 0; i < row.length; i++) {
        row[i].addEventListener('click', function(event){
            var el = event.target
            if (el.tagName != 'LI') {
                // 因为事件委托的原因
                // 如果点击到了 span 上面，那么就会出现 bug
                // 所以如果点击到 span 上面，那么 el 就等于 span 的父节点
                el = event.target.parentElement
            }
             // 已经被标记的不能点击
            var flag = el.children[1].classList.contains('hide')
            if (el.tagName === 'LI' && flag) {
                if (el.children[0].innerText !== '9' && el.style.background !== 'white') {
                    el.children[0].style.opacity = '1'
                    el.style.background = 'white'
                    // 点击空白
                    if (el.children[0].innerText == '') {
                        let x = parseInt(el.getAttribute('data-x')) 
                        let y = parseInt(el.getAttribute('data-y')) 
                        // log('data-x', x, 'data-y', y)
                        showNoMine(x, y)
                    }    
                    clean_mine_num++
                    checkSuccess()
                } else if (el.children[0].innerText === '9'){
                    el.classList.add('boom')
                    alert('Too young')
                    showAllMine()
                }
            }
            // log('el', el)
        });
    }
    // log(row)
}

//标记雷 右键点击事件
var markMine = function() {
    var row = document.querySelectorAll('.row')
    for (let i = 0; i < row.length; i++) {

        row[i].addEventListener('contextmenu', function(event){
            event.preventDefault()
            var el = event.target
            if (el.tagName != 'LI') {
                // 因为事件委托的原因
                // 如果点击到了 span 上面，那么就会出现 bug
                // 所以如果点击到 span 上面，那么 el 就等于 span 的父节点
                el = event.target.parentElement
            }
            if (el.tagName === 'LI') {
                var classList = el.children[1].classList
                // 已经被点击过的地方不能标记
                if (classList.contains('hide') && el.style.background !== 'white') {
                    classList.remove('hide')
                    remain_mine_num--
                } else if (el.style.background !== 'white') {
                    classList.add('hide')
                    remain_mine_num++
                }
                updateRemainMine()
            }
            // log('el', el)
        });
        
    }
}

//计时
var stopTime
var setTime = function(){
    var time = document.querySelector('.time')
    time.innerText = `0`
    var i = 1
    clearInterval(stopTime)
    stopTime = setInterval(function () {
        time.innerText = `${i++}`
    }, 1000)
}


//点击等级事件
var levelEvent = function() {
    var level = document.querySelectorAll('.level-btn')
    for (var i = 0; i < level.length; i++) {
        level[i].addEventListener('click', function (event) {
            var level = parseInt(event.target.getAttribute('level')) 
            side_length = level_config[level]['side_length']
            mine_num = level_config[level]['mine_num']
            clean_mine_num = 0 
            remain_mine_num = mine_num
            init()
        })
    }
}

//重新开始
var restartEvent = function() {
    var restart_btn = document.querySelector('.restart')
    restart_btn.addEventListener('click', function(event){
        init()
    })
}

//开始
var init = function(){
    var square = blankSquare(side_length)
    square = writeInMine(square, mine_num)
    square = markedSquare(square)
    drawHtml(square)
    updateRemainMine()
    cleanMine()
    markMine()
    setTime()
}

var __main = function() {
    // 这是主函数
    init()
    levelEvent()
    restartEvent()
}

__main()