var side_length = 10//边长
var mine_num = 10 //雷的数目
var clean_mine_num = 0 //已清的雷数
var remain_mine_num = mine_num //剩余雷数
var level_config = {
    1:{
        'side_length':8,
        'mine_num':8,
    },
    2:{
        'side_length':16,
        'mine_num':16,
    },
    3:{
        'side_length':24,
        'mine_num':24,
    },
} //等级配置