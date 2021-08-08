/*backtest
start: 2021-07-01 00:00:00
end: 2021-07-22 00:00:00
period: 1m
basePeriod: 1m


根据浮亏比例下单
*/

//初始止盈比例 //已提出变量
//let INIT_PROFIT_RATIO = 0.005;
//是否开启动态止盈  已提出变量
//var IS_OPEN_PROFIT = true;

//动态止盈步进,这个参数是直接加在止盈比例上的,
// 例如初始止盈比例是0.005，步进是-0.001则触发动态止盈后，下一次止盈比例是0.005-0.001=0.004
//var PROFIT_STEP = -0.001;
//动态止盈触发保证金占比1.3%---5.5%--14%---23%------37%
//var JUDGE_DYNAMIC_PROFIT_RATIO = 5.5,14,32,70;

//补仓比率-下跌或者上涨就补仓
//已提出变量
//var INIT_REPLENISHMENT_RATIO = 0.008;

//是否开启动态补仓
//var IS_OPEN_REPLENISHMENT_RATIO = true;
//动态补仓步进比例,这个参数是直接加在补仓比例上的，
// 例如初始是0.008，则下一次补仓比例就是0.009，负数就是0.007
//var REPLENISHMENT_STEP = 0.001

//止损比例---相对于总仓位，1就是全仓才触发止损
//var STOP_LOSS_RELATIVE_ALL_POS = 1;
//止损比例---亏损多少触发止损，类似于扛单到浮亏多少割。1.2就是浮亏20%
//var STOP_LOSS_RATIO = 1.2;

//是否开启直接止损，即当触发止损时，直接全部平浮亏的单
//var IS_OPEN_ALL_LOSS = true;

//当不开启直接止损时，当触发止损时，平一部分单。0.5就是平50%的单
//var PART_LOSS_RATIO = 0.5;

//杠杆倍数 已提出变量
//var MARGIN_LEVEL = 20;
//重置数据 已提出变量
//var IS_RESET = true;
//价格精度  已提出变量
//var PRICE_PRECISION = 3;
//下单数量精度  已提出变量
//var AMOUNT_PRECISION = 2;

//是否开启复利  已提出变量
//var COMPOUND_INTEREST = true;

//初始下单金额占总金额的比例  已提出变量
//var INIT_BUY_PROPORTION = 0.0005;
//首次下单金额占总金额的比例
//var FIRST_BUY_PROPORTION = 0.0005;

//是不是v5模拟盘 已提出变量
//var IS_SIMULATE = false;

//是不是回测盘 已提出变量
//var IS_HUICHE = true;

//均线策略
//var MA_TYPE = MA|EMA
//开仓快线周期
//var FAST_PERIOD=3;
//开仓慢线周期
//var SLOW_PERIOD=7;
//死叉上涨时观察周期
//var MANY_PERIOD = 1;
//金叉下跌时观察周期
//var SHORT_PERIOD = 2;

//触发判断价差自适应补仓的阈值
var AUTO_ADD_POS_THRESHOLD = 5;
var AUTO_ADD_POS_THRESHOLD_ARR = [2,5];


//开启模拟资金
//var IS_OPEN_SIMULATED_FUNDS = true;
//var INIT_SIMULATED_FUNDS = 1000;

//账户初始总权益
let totalEq = -1;

//账户当前中权益
let CURR_TOTAL_EQ = totalEq;
//止损保证金阈值
let POS_BOND_LOSS = 0;
//为了保证下单时能吃单，手动加价比例
//var ADD_PRICE_PROPORTION = 0.0001;

//贪心算法，在达到止盈点时，不止盈，不断将止盈点上移
//var OPEN_GREEDY = true;
//贪心间隔（下移），例如10%止盈，当达到10%时，将止盈点下移20%变成8%止盈，当利润变成11%时，止盈点上移至9%
//var GREEDY_INTERVAL_DOWN = 0.2;
//贪心间隔（上浮）
//var GREEDY_INTERVAL_UP = 0.1;
//贪心算法下新的多单止盈下限
var MANY_GREEDY_PROFIT_RATIO_DOWN = 0;
//贪心算法下新的多单止盈上浮标记点
var MANY_GREEDY_PROFIT_RATIO_UP = 0;
//贪心算法下新的空单止盈下限
var SHORT_GREEDY_PROFIT_RATIO_DOWN = 0;
//贪心算法下新的空单止盈上浮标记点
var SHORT_GREEDY_PROFIT_RATIO_UP = 0;


//多仓浮赢/亏比例
let MANY_PROFIT = 0;
//空仓浮赢/亏比例
let SHORT_PROFIT = 0;

//当前多仓保证金
var MANY_POS_BOND = 0;
//当前空仓保证金
var SHORT_POS_BOND = 0;

//当前多仓保证金占比
var MANY_POS_BOND_RATIO = 0;
//当前空仓保证金占比
var SHORT_POS_BOND_RATIO = 0;

//动态止盈比例-多
let MANY_PROFIT_RATIO = INIT_PROFIT_RATIO;
//动态止盈比例-空
let SHORT_PROFIT_RATIO = INIT_PROFIT_RATIO;
//动态止盈比例变动次数-多
let MANY_PROFIT_RATIO_COUNT = 0;
//动态止盈比例变动次数-空
let SHORT_PROFIT_RATIO_COUNT = 0;


//动态补仓比例-多
let REPLENISHMENT_MANY_RATIO = INIT_REPLENISHMENT_RATIO;
//动态补仓比例-空
let REPLENISHMENT_SHORT_RATIO = INIT_REPLENISHMENT_RATIO;
//动态补仓比例变动次数-多
let REPLENISHMENT_MANY_COUNT = 0;
//动态补仓比例变动次数-空
let REPLENISHMENT_SHORT_COUNT = 0;

//当前持仓均价-多
var MANY_PRICE = 0;
//多仓止盈价格
var MANY_PROFIT_PRICE = 0;
//当前持仓均价-空
var SHORT_PRICE = 0;
//空仓止盈价格
var SHORT_PROFIT_PRICE = 0;

//当前持仓数量-多
var MANY_POS_NUM = 0;
//当前持仓数量-空
var SHORT_POS_NUM = 0;

//rsi判断是否处于超卖状态
var RSI_SUPER_SELL = false;
//rsi判断是否处于超买状态
var RSI_SUPER_BUY = false;

//均线判断上涨或者下跌  UP/DOWN
var DIRECTION = "";
//	盘口统计深度,按1元为阶梯, 统计合并后的深度数量
var DEPTH_LEVEL = 20;
//观察周期,连续指定周期都满足条件, 就触发交易
var ENTER_PERIOD = 2;
//观察轮询周期(秒),每次观察后暂停的时间
var CALC_INTERVAL = 10;
//	币量倍数,买卖双方币数总和大的一方是另一方的这么多倍时,
var DIFF_RATIO = 1.5;

var MA_TYPE = "MA";

//var DELAY = 200;

var b = 0; //开仓
var b1 = 0;  //检测次数
var a = 0; //平仓
var a1 = 0;  //检测次数
//关机
var STOP_ROBOT_STATUS = false;

//止盈后不再下单
var CLOSE_BUY = false;

//分页
var LIMIT = 50;
//第几页
var OFFSET = 0;
//是否排序
var ORDER_STATUS = false;
//排序条件，保证金
var BOND_VALUE = 0;
//筛选条件，币种
var COIN_VALUE = "";

//价格精度
var PRICE_PRECISION = 0;
//数量精度
var AMOUNT_PRECISION = 0;


//默认k线周期
var PERIOD = PERIOD_M15;
//k线周期单位  0分钟，1小时，2天
var PERIOD_TYPE = 0;
//上一次执行的定时任务分钟
var SCHEDULED_MINUTE = 0;
//上一次执行的定时任务小时
var SCHEDULED_HOUR = 0;


//是否开启锁仓功能
var OPEN_LOCK_POS = true;
//锁仓判定条件--加仓次数
var LOCK_POS_STEP = 12;
//锁仓状态
var LOCK_POS_STATUS = false;

function getPos(ex) {
  if (IS_OPEN_SIMULATED_FUNDS) {
    var coin = ex.GetCurrency();
    return _G(coin + "pos");
  } else {
    return _C(ex.GetPosition);
  }
}

function createPos(price, quantity, type, ex) {
  var coin = ex.GetCurrency();
  var available_funds = _G("available_funds");
  if (available_funds >= _N(price * quantity / MARGIN_LEVEL, 2)) {
    var pos = getPos(ex);
    // var occupyMargin = 0;
    if (pos && pos.length > 0) {
      if (pos.length == 1) {
        if (pos[0].Type == type) {
          var oldAmount = pos[0].Amount;
          var oldPrice = pos[0].Price;
          var oldMargin = pos[0].Margin;

          pos[0].Amount = oldAmount + quantity;
          pos[0].Price = _N(
              (oldPrice * oldAmount + price * quantity) / pos[0].Amount, _G(coin + "pricePrecision"));
          pos[0].Margin = _N(pos[0].Price * pos[0].Amount / MARGIN_LEVEL, 2);
          if (type == PD_LONG) {
            pos[0].Profit = pos[0].Margin * ((price - pos[0].Price)
                / pos[0].Price) * MARGIN_LEVEL;
          } else {
            pos[0].Profit = pos[0].Margin * ((pos[0].Price - price)
                / pos[0].Price) * MARGIN_LEVEL;
          }
          // occupyMargin = price * quantity / MARGIN_LEVEL;
          _G(coin + "pos", pos);

        } else {
          var posNew = {
            'Amount': quantity,       // 持仓量，OKEX合约交易所，表示合约的份数(整数且大于1，即合约张数)
            'Price': price,     // 持仓均价
            'Profit': 0,         // 持仓浮动盈亏(数据货币单位：BTC/LTC，传统期货单位:RMB，股票不支持此字段，注:OKEX合约全仓情况下指实现盈余,并非持仓盈亏,逐仓下指持仓盈亏)
            'Type': type,         // PD_LONG为多头仓位(CTP中用closebuy_today平仓)，PD_SHORT为空头仓位(CTP用closesell_today)平仓，(CTP期货中)PD_LONG_YD为咋日多头仓位(用closebuy平)，PD_SHORT_YD为咋日空头仓位(用closesell平)
            'Margin': _N(price * quantity / MARGIN_LEVEL, 2)          //仓位占用的保证金
          };
          pos.push(posNew);
          _G(coin + "pos", pos);
          // occupyMargin = posNew.Margin;
        }
      } else {
        for (var i = 0; i < pos.length; i++) {
          if (pos[i].Type == type) {
            var oldAmount = pos[i].Amount;
            var oldPrice = pos[i].Price;
            var oldMargin = pos[0].Margin;

            pos[i].Amount = oldAmount + quantity;
            pos[i].Price = _N(
                (oldPrice * oldAmount + price * quantity) / pos[i].Amount, _G(coin + "pricePrecision"));
            pos[i].Margin = _N(pos[i].Price * pos[i].Amount / MARGIN_LEVEL, 2);
            if (type == PD_LONG) {
              pos[i].Profit = pos[i].Margin * ((price - pos[i].Price) / pos[i].Price) * MARGIN_LEVEL;
            } else {
              pos[i].Profit = pos[i].Margin * ((pos[i].Price - price) / pos[i].Price) * MARGIN_LEVEL;
            }
            // occupyMargin = price * quantity / MARGIN_LEVEL;
          }
        }
        _G(coin + "pos", pos);
      }
    } else {
      pos = new Array();
      var posNew = {
        'Amount': quantity,       // 持仓量，OKEX合约交易所，表示合约的份数(整数且大于1，即合约张数)
        'Price': price,     // 持仓均价
        'Profit': 0,         // 持仓浮动盈亏(数据货币单位：BTC/LTC，传统期货单位:RMB，股票不支持此字段，注:OKEX合约全仓情况下指实现盈余,并非持仓盈亏,逐仓下指持仓盈亏)
        'Type': type,         // PD_LONG为多头仓位(CTP中用closebuy_today平仓)，PD_SHORT为空头仓位(CTP用closesell_today)平仓，(CTP期货中)PD_LONG_YD为咋日多头仓位(用closebuy平)，PD_SHORT_YD为咋日空头仓位(用closesell平)
        'Margin': _N(price * quantity / MARGIN_LEVEL, 2)          //仓位占用的保证金
      };
      // occupyMargin = posNew.Margin;
      pos.push(posNew);
      _G(coin + "pos", pos);
    }
    var occupyMargin = price * quantity / MARGIN_LEVEL;
    available_funds = available_funds - occupyMargin;
    _G("available_funds", available_funds);
  } else {
    Log("可用资金不足，下单失败", "#ff0000");
  }
}

function deletePos(type, ex) {
  var coin = ex.GetCurrency();
  var pos = _G(coin + "pos");
  if (type == 9) {
    pos = [];
  } else {
    var newPos = [];
    for (var i = 0; i < pos.length; i++) {
      if (pos[i].Type == type) {
        var available_funds = _G("available_funds");
        available_funds = available_funds + pos[i].Margin + pos[i].Profit;
        _G("available_funds", available_funds);
        continue;
      }
      newPos.push(pos[i]);
    }
    pos = newPos;
  }
  _G(coin + "pos", pos);
}

function deletePartPos(type, amount, price, ex) {
  var coin = ex.GetCurrency();
  var pos = _G(coin + "pos");
  if (type == 9) {
    pos = [];
  } else {
    var newPos = [];
    for (var i = 0; i < pos.length; i++) {
      if (pos[i].Type == type) {
        var oldAmount = pos[i].Amount;
        var oldPrice = pos[i].Price;
        var oldMargin = pos[i].Margin;
        var available_funds = _G("available_funds");
        if (oldAmount == amount) {
          available_funds = available_funds + oldMargin + pos[i].Profit;
        } else {
          var nowAmount = oldAmount - amount;
          // var nowPrice = (oldAmount * oldPrice - amount * price) / nowAmount;
          var nowPrice = oldPrice;
          var nowMargin = _N(nowAmount * nowPrice / MARGIN_LEVEL, 2);
          var nowProfit = 0;
          if (type == PD_LONG) {
            nowProfit = nowMargin * ((price - nowPrice) / nowPrice) * MARGIN_LEVEL;
            available_funds = available_funds + (oldMargin - nowMargin) + (oldMargin - nowMargin) * ((price - oldPrice) / oldPrice) * MARGIN_LEVEL;
          } else {
            nowProfit = nowMargin * ((nowPrice - price) / nowPrice) * MARGIN_LEVEL;
            available_funds = available_funds + (oldMargin - nowMargin) + (oldMargin - nowMargin) * ((oldPrice - price) / oldPrice) * MARGIN_LEVEL;
          }
          var pos1 = {
            'Amount': nowAmount,       // 持仓量，OKEX合约交易所，表示合约的份数(整数且大于1，即合约张数)
            'Price': nowPrice,     // 持仓均价
            'Profit': nowProfit,         // 持仓浮动盈亏(数据货币单位：BTC/LTC，传统期货单位:RMB，股票不支持此字段，注:OKEX合约全仓情况下指实现盈余,并非持仓盈亏,逐仓下指持仓盈亏)
            'Type': type,         // PD_LONG为多头仓位(CTP中用closebuy_today平仓)，PD_SHORT为空头仓位(CTP用closesell_today)平仓，(CTP期货中)PD_LONG_YD为咋日多头仓位(用closebuy平)，PD_SHORT_YD为咋日空头仓位(用closesell平)
            'Margin': nowMargin         //仓位占用的保证金
          };
          newPos.push(pos1);

        }

        _G("available_funds", available_funds);
        continue;
      }
      newPos.push(pos[i]);
    }
    pos = newPos;
  }
  _G(coin + "pos", pos);
}

function updatePos(ex) {
  var coin = ex.GetCurrency();
  var pos = _G(coin + "pos");
  var ticker = _C(ex.GetTicker);
  for (var i = 0; i < pos.length; i++) {
    if (pos[i].Type == PD_LONG) {
      pos[i].Profit = pos[i].Margin * ((ticker.Last - pos[i].Price)
          / pos[i].Price) * MARGIN_LEVEL;
    } else {
      pos[i].Profit = pos[i].Margin * ((pos[i].Price - ticker.Last)
          / pos[i].Price) * MARGIN_LEVEL;
    }
  }
  _G(coin + "pos", pos);
}

//获取k线交叉
function getCross(ex) {

  var coin = ex.GetCurrency();
  let r = _C(ex.GetRecords, PERIOD);

  //************均线EMA****************
  let emaChart1 = TA.EMA(r, FAST_PERIOD);
  let emaChart2 = TA.EMA(r, SLOW_PERIOD);

  //0处于刚突破未稳定状态，1上涨，2下跌
  var status = _G(coin + "crossStatus");

  var n = _Cross(emaChart1, emaChart2);
  if (n > 0) {
    //正在上涨
    //观察周期
    if (n - MANY_PERIOD >= 0) {
      status = 1;
    } else {
      status = 0;
    }
  } else if (n < 0) {
    //正在下跌
    if (Math.abs(n) - SHORT_PERIOD >= 0) {
      status = 2;
    } else {
      status = 0;
    }

  } else {
    status = 0;
  }

  _G(coin + "crossStatus", status);
}

//根据选择的k线周期，定时获取k线交叉
function scheduledTaskCross(ex) {

  //当前时间
  var startTime = new Date();
  if (PERIOD_TYPE == 0) {
    //当前分钟
    var m = startTime.getMinutes();
    if (m == 0) {
      getCross(ex);
      SCHEDULED_MINUTE = m;
      return;
    }

    if (m == SCHEDULED_MINUTE) {
      return;
    }
    SCHEDULED_MINUTE = m;
    //k线是多少分钟
    var k = PERIOD / 60;
    if (m == k || m % k == 0) {
      getCross(ex);
    }
  } else if (PERIOD_TYPE == 1) {
    //当前小时
    var h = startTime.getHours();
    if (h == 0) {
      getCross(ex);
      SCHEDULED_HOUR = h;
      return;
    }
    if (h == SCHEDULED_HOUR) {
      return;
    }
    SCHEDULED_HOUR = h;
    //k线是多少小时
    var k = PERIOD / 60 / 60;
    if (h == k || h % k == 0) {
      getCross(ex);
    }
  }
}

//获取深度挂单总数量
function calcDepth(orders) {
  //卖1价或者买1价
  var base = parseFloat(orders[0].Price);
  var allAmount = 0;
  var n = 0;
  for (var i = 0; i < orders.length && n < DEPTH_LEVEL; i++) {
    //深度价格
    var p = parseFloat(orders[i].Price);
    if (p != base) {
      n++;
      base = p;
    }
    allAmount += orders[i].Amount;
  }
  return allAmount;
}
//价格*数量
function sumDept(orders) {
  //总价值
  var allPrice = 0;
  var allAmount = 0;
  for (var i = 0; i < orders.length && i < DEPTH_LEVEL; i++) {
    //深度价格
    var price = parseFloat(orders[i].Price);
    var amount = orders[i].Amount;
    all += price*amount;
    allAmount += orders[i].Amount;
  }
  if (allAmount == 0) {
    return 0;
  }
  return allPrice/allAmount;
}
//挂单深度
//默认取深度20
//获取这20个深度的平均数
function getDept(ticker, ex) {
  Sleep(5 * DELAY);
  var n = 0;
  while (Math.abs(n) < ENTER_PERIOD) {
    //市场深度
    var depth = _C(ex.GetDepth);
    //如果深度不存在或者卖盘深度小于盘口统计深度 或者买盘深度小于盘口统计深度，继续下次循环
    if (!depth || depth.Asks.length < DEPTH_LEVEL || depth.Bids.length
        < DEPTH_LEVEL) {
      Sleep(5 * DELAY);
      continue;
    }
    //卖单平均价值
    var asksPrice = sumDept(depth.Asks);
    //卖单平均价值
    var bidsPrice = sumDept(depth.Bids);
    //返回卖单比买单多或者买单比买单多的比例
    var ratio = Math.max(asksPrice / bidsPrice, bidsPrice / asksPrice);
    if (ratio > DIFF_RATIO) {
      if (asksPrice > bidsPrice) {
        //卖单多，要跌
        n = n < 0 ? 0 : n + 1;
      } else {
        //买单多，要涨
        n = n > 0 ? 0 : n - 1;
      }
    } else {
      n = 0;
    }


    // //卖单总数
    // var asksAmount = calcDepth(depth.Asks);
    // //买单总数
    // var bidsAmount = calcDepth(depth.Bids);
    // //返回卖单比买单多或者买单比买单多的比例
    // var ratio = Math.max(asksAmount / bidsAmount, bidsAmount / asksAmount);
    // //大于设置的比例时，入场
    // if (ratio > DIFF_RATIO) {
    //   if (asksAmount > bidsAmount) {
    //     //卖单多，要跌
    //     Log("当前卖/买单深度比：" + ratio);
    //     n = n < 0 ? 0 : n + 1;
    //   } else {
    //     //买单多，要涨
    //     Log("当前买/卖单深度比：" + ratio);
    //     n = n > 0 ? 0 : n - 1;
    //   }
    // } else {
    //   n = 0;
    // }
    // LogStatus("买量:", _N(asksAmount), "卖量:", _N(bidsAmount), "比例: ",
    //     _N(ratio * 100, 4) + '%', "持续周期:", n);
    Sleep(CALC_INTERVAL * DELAY * 5);
  }
  return n;
}

function getRsi(ex) {
  var records = _C(ex.GetRecords, PERIOD_M1);
  var rsi6 = TA.RSI(records, 6);
  return rsi6;
}

//根据rsi判断多仓是否可以开
function checkManyRsi(ex) {
  var coin = ex.GetCurrency();
  var rsi6 = getRsi(ex);
  if (rsi6[rsi6.length - 1] <= 30 && rsi6[rsi6.length - 2] <= 30
      && rsi6[rsi6.length - 3] <= 30) {
    // Log(rsi6);
    var rsiSuperSell = _G(coin + "rsiSuperSell");
    if (rsiSuperSell == 0) {
      Log(coin + "超卖状态，暂停开多！", "#FF0000");
    }
    _G(coin + "rsiSuperSell", 1);
  } else {
    _G(coin + "rsiSuperSell", 0);
  }
}

//根据rsi判断空仓是否可以开
function checkShortRsi(ex) {
  var coin = ex.GetCurrency();
  var rsi6 = getRsi(ex);
  if (rsi6[rsi6.length - 1] >= 70 && rsi6[rsi6.length - 2] >= 70
      && rsi6[rsi6.length - 3] >= 70) {
    // Log(rsi6);
    var rsiSuperBuy = _G(coin + "rsiSuperBuy");
    if (rsiSuperBuy == 0) {
      Log(coin + "超买状态，暂停开空！", "#FF0000");
    }
    _G(coin + "rsiSuperBuy", 1);
  } else {
    _G(coin + "rsiSuperBuy", 0);
  }
}

//更新程序运行时间
function updateRunTime() {
  var startTime = _G("startTime");
  var nowTime = Unix();
  var runtime = nowTime - startTime;
  var hours = _N(runtime / (3600), 1);
  _G("hours", hours);
}

//斐波那契数列计算，传入仓位，即可返回该仓位需要下单的数量倍数
function fibonacci(n) {
  if (n < 3) {
    return 1;
  }
  var n1 = 1;
  var n2 = 1;
  var sum = 0;
  for (let i = 2; i < n; i++) {
    sum = n1 + n2;
    n1 = n2;
    n2 = sum
  }
  return sum
}

//缓存记录一些数据
function recodeDetail(posDirection, price, ex) {
  var coin = ex.GetCurrency();
  if (posDirection == PD_LONG) {
    var manyStatus = _G(coin + "manyStatus");
    if (!manyStatus || manyStatus == 0) {
      _G(coin + "manyStartTime", _D());
      _G(coin + "manyStartPrice", price);
      _G(coin + "manyStatus", 1);
    }
    _G(coin + "manyEndTime", _D());
    _G(coin + "manyEndPrice", price);

  } else if (posDirection == PD_SHORT) {
    var shortStatus = _G(coin + "shortStatus");
    if (!shortStatus || shortStatus == 0) {
      _G(coin + "shortStartTime", _D());
      _G(coin + "shortStartPrice", price);
      _G(coin + "shortStatus", 1);
    }
    _G(coin + "shortEndTime", _D());
    _G(coin + "shortEndPrice", price);
  }
}

//查询详细交易日志
function getDetailLog(limit, offset, order, bond, coin) {
  var sql = "";
  if (!order) {
    if (coin) {
      sql = "SELECT * FROM DETAIL_TRANSACTION_RECORD "
          + " WHERE COIN = '" + coin
          + "' ORDER BY STARTTIME DESC LIMIT "
          + limit
          + " OFFSET "
          + offset + ";";
    } else {
      sql = "SELECT * FROM DETAIL_TRANSACTION_RECORD ORDER BY STARTTIME DESC LIMIT "
          + limit
          + " OFFSET "
          + offset + ";";
    }
  } else {
    if (coin) {
      sql = "SELECT * FROM DETAIL_TRANSACTION_RECORD "
          + "where COIN = '" + coin
          + "' and BOND >= " + bond
          + " ORDER BY BOND DESC "
    } else {
      sql = "SELECT * FROM DETAIL_TRANSACTION_RECORD where BOND >= "
          + bond
          + " ORDER BY BOND DESC "
    }

  }

  return DBExec(sql);
}

function countDetailLog() {
  var sql = "SELECT COUNT(*) FROM DETAIL_TRANSACTION_RECORD";
  var res = DBExec(sql);
  var count = 0;
  if (res) {
    count = res.values[0];
  }
  return count;
}

//插入详细交易日志
function insertDetail(posDirection, avgPrice, lastPrice, bond, profit, ex) {
  var coin = ex.GetCurrency();
  if (posDirection == PD_LONG) {
    //币种，方向，起始时间，结束时间，起始下单价格，最终下单价格，持仓均价，成交时标记价格，波动率，仓位保证金，收益
    var direction = "多";
    var manyStartTime = _G(coin + "manyStartTime");
    var manyEndTime = _G(coin + "manyEndTime");
    var manyStartPrice = _G(coin + "manyStartPrice");
    var manyEndPrice = _G(coin + "manyEndPrice");
    var maxManyLostProfit = _G(coin + "maxManyLostProfit") + "%";
    var volatility = _N((manyEndPrice - manyStartPrice) / manyStartPrice * 100,
        2);
    var sql = "INSERT INTO DETAIL_TRANSACTION_RECORD "
        + "(COIN,DIRECTION,STARTTIME,ENDTIME,STARTPRICE,ENDPRICE,AVERAGEPRICE,CLOSEPOSPRICE,MAXSHORTLOSTPROFIT,VOLATILITY,BOND,PROFIT) "
        + "VALUES ('" + coin + "','" + direction + "','" + manyStartTime
        + "','" + manyEndTime + "'," + manyStartPrice + "," + manyEndPrice + ","
        + avgPrice
        + "," + lastPrice + ",'" + maxManyLostProfit + "','" + volatility + "%'," + _N(bond, 2) + "," + _N(profit,
            2) + ");";
    DBExec(sql);

  } else if (posDirection == PD_SHORT) {
    var direction = "空";
    var shortStartTime = _G(coin + "shortStartTime");
    var shortEndTime = _G(coin + "shortEndTime");
    var shortStartPrice = _G(coin + "shortStartPrice");
    var shortEndPrice = _G(coin + "shortEndPrice");
    var maxShortLostProfit = _G(coin + "maxShortLostProfit") + "%";
    var volatility = _N(
        (shortEndPrice - shortStartPrice) / shortStartPrice * 100, 2) + "%";
    var sql = "INSERT INTO DETAIL_TRANSACTION_RECORD "
        + "(COIN,DIRECTION,STARTTIME,ENDTIME,STARTPRICE,ENDPRICE,AVERAGEPRICE,CLOSEPOSPRICE,MAXSHORTLOSTPROFIT,VOLATILITY,BOND,PROFIT) "
        + "VALUES ('" + coin + "','" + direction + "','" + shortStartTime
        + "','" + shortEndTime + "'," + shortStartPrice + "," + shortEndPrice
        + "," + avgPrice
        + "," + lastPrice + ",'" + maxShortLostProfit + "','" + volatility + "'," + _N(bond, 2) + "," + _N(profit,
            2) + ");";
    DBExec(sql);
  }
}

// OKEX V5 获取总权益
function getTotalEquity_OKEX_V5() {
  var totalEquity = null;
  var ret = exchanges[0].IO("api", "GET", "/api/v5/account/balance", "ccy=USDT");
  if (ret) {
    try {
      totalEquity = parseFloat(ret.data[0].details[0].eq);
    } catch (e) {
      Log("获取账户总权益失败！");
      return null
    }
  }
  return totalEquity
}

// 币安期货
function getTotalEquity_Binance() {
  var totalEquity = null;
  var ret = _C(exchanges[0].GetAccount);
  if (ret) {
    try {
      totalEquity = parseFloat(ret.Info.totalWalletBalance)
    } catch (e) {
      Log("获取账户总权益失败！");
      return null
    }
  }
  return totalEquity
}

function getHuicheEquity() {
  var ret = exchanges[0].GetAccount();
  // Log(ret);
  return ret.Balance;
}

function getTotalEquity() {
  var exName = exchanges[0].GetName();
  var eq = 0;
  if (IS_HUICHE) {
    eq = getHuicheEquity();
  } else if (IS_OPEN_SIMULATED_FUNDS) {
    eq = _G("simulatedEq");
  } else {
    if (exName == "Futures_OKCoin") {
      eq = getTotalEquity_OKEX_V5()
    } else if (exName == "Futures_Binance") {
      eq = getTotalEquity_Binance()
    } else {
      throw "不支持该交易所"
    }
  }
  CURR_TOTAL_EQ = eq;
  //盈利
  _G("eq", eq - totalEq);
  return eq;

}

//统计收益
function statisticEq() {

  var currTotalEq = getTotalEquity();
  if (currTotalEq < 0) {
    Log("爆仓", "#ff0000");
    throw "爆仓---大侠请重新来过"
  }
  if (currTotalEq) {
    LogProfit(currTotalEq - totalEq, "当前总权益：", currTotalEq);
    Log("当前总权益：", currTotalEq);
    //复利模式下更新根据保证金止损的阈值
    if (COMPOUND_INTEREST) {
      POS_BOND_LOSS = currTotalEq * POS_BOND_LOSS_RATIO;
    }
    return currTotalEq;
  }

}

function cancelAll(ex) {
  while (1) {
    var orders = _C(ex.GetOrders)
    if (orders.length == 0) {
      break
    }
    for (var i = 0; i < orders.length; i++) {
      ex.CancelOrder(orders[i].Id, orders[i])
      Sleep(DELAY)
    }
    Sleep(DELAY)
  }
}

//更新浮动赢亏
function updateProfit(ex) {
  var coin = ex.GetCurrency();
  if (IS_OPEN_SIMULATED_FUNDS) {
    updatePos(ex);
  }
  var pos = getPos(ex);
  if (!pos || pos.length == 0) {
    _G(coin + "manyProfit", 0);
    _G(coin + "shortProfit", 0);
  }
  for (var i = 0; i < pos.length; i++) {
    var bond = pos[i].Margin;
    var profit = pos[i].Profit;
    var price = pos[i].Price;
    var amount = pos[i].Amount;
    if (pos[i].Type == PD_LONG) {
      _G(coin + "manyPosBond", bond);
      if (COMPOUND_INTEREST) {
        _G(coin + "manyPosBondRatio", _N(bond / CURR_TOTAL_EQ * 100, 2))
      } else {
        _G(coin + "manyPosBondRatio", _N(bond / totalEq * 100, 2));
      }
      var manyProfit = _N(profit / bond * 100, 2);
      _G(coin + "manyProfit", manyProfit);
      var maxManyLostProfit = _G(coin + "maxManyLostProfit");
      if (manyProfit < 0 && Math.abs(manyProfit) > Math.abs(maxManyLostProfit)) {
        _G(coin + "maxManyLostProfit", manyProfit);
      }
      _G(coin + "manyPrice", price);
      _G(coin + "manyPosNum", amount);


    } else if (pos[i].Type == PD_SHORT) {
      _G(coin + "shortPosBond", bond);
      if (COMPOUND_INTEREST) {
        _G(coin + "shortPosBondRatio", _N(bond / CURR_TOTAL_EQ * 100, 2));
      } else {
        _G(coin + "shortPosBondRatio", _N(bond / totalEq * 100, 2));
      }
      var shortProfit = _N(profit / bond * 100, 2);
      _G(coin + "shortProfit", shortProfit);
      var maxShortLostProfit = _G(coin + "maxShortLostProfit");

      if (shortProfit < 0 && Math.abs(shortProfit) > Math.abs(maxShortLostProfit)) {
        _G(coin + "maxShortLostProfit", shortProfit);
      }

      _G(coin + "shortPrice", price);
      _G(coin + "shortPosNum", amount);
    }
  }
}

//分组
function groupBy(array, f) {
  let groups = {};
  array.forEach( function( o ) {
      let group = JSON.stringify( f(o) );
      groups[group] = groups[group] || [];
      groups[group].push( o );
  });
  return Object.keys(groups).map( function( group ) {
      return groups[group];
  });
}

//更新表格
function updateTable() {
  var nowTime = _D();
  var runTime = _G("hours");
  var initEq = totalEq;
  var nowEq = getTotalEquity();
  var available_funds = _N(_G("available_funds"), 2);
  var eq = _G("eq");
  var dayEq = '--';
  var monthEq = '--';
  var yearEq = '--';
  if (runTime > 24) {
    dayEq = _N((eq / initEq * 100) / (runTime / 24), 2);
    monthEq = _N(dayEq * 30, 2);
    yearEq = _N(dayEq * 365, 2);
  }
  var table1 = {
    type: 'table',
    title: '用户收益',
    cols: ['当前时间', '运行时间', '初始投资额', '当前余额', '可用保证金', '当前收益', '预估日化(约)',
      '预估月化(约)', '预估年化(约)', '操作'],
    rows: [
      [nowTime, runTime, _N(initEq, 2), _N(nowEq, 2), available_funds,
        _N(eq, 2) + "|" + _N(eq / initEq * 100, 2) + "%", dayEq + "%",
        monthEq + "%", yearEq + "%",
        {'type': 'button', 'cmd': 'sellAll', 'name': '一键平仓'}]
    ]
  };

  var table2Arr = new Array();

  for (var j = 0; j < exchanges.length; j++) {
    var currCoin = exchanges[j].GetCurrency();
    var bondMany = 0;
    var priceMany = 0;
    var nowPriceMany = 0;
    var profitMany = 0;
    var profitManyRatio = '';

    var bondShort = 0;
    var priceShort = 0;
    var nowPriceShort = 0;
    var profitShort = 0;
    var profitShortRatio = '';

    var pos = getPos(exchanges[j]);
    var ticker = _C(exchanges[j].GetTicker);
    if (pos) {
      for (var i = 0; i < pos.length; i++) {
        if (pos[i].Type == PD_LONG) {
          bondMany = pos[i].Margin;
          priceMany = pos[i].Price;
          nowPriceMany = ticker.Last;
          profitMany = pos[i].Profit;
          // MANY_PROFIT = _N((nowPriceMany-priceMany)/priceMany*100*MARGIN_LEVEL,2);
          profitManyRatio = _N(profitMany / bondMany * 100, 2) + '%';
        } else if (pos[i].Type == PD_SHORT) {
          bondShort = pos[i].Margin;
          priceShort = pos[i].Price;
          nowPriceShort = ticker.Last;
          profitShort = pos[i].Profit;
          // SHORT_PROFIT = _N((priceShort-nowPriceShort)/priceShort*100*MARGIN_LEVEL,2);
          profitShortRatio = _N(profitShort / bondShort * 100, 2) + '%';
        }
      }
    }
    var arr1 = [currCoin, '多', _N(bondMany, 2), priceMany, nowPriceMany, _N(profitMany, 2) + "|" + profitManyRatio];
    var arr2 = [currCoin, '空', _N(bondShort, 2), priceShort, nowPriceShort, _N(profitShort, 2) + "|" + profitShortRatio];
    table2Arr.push(arr1);
    table2Arr.push(arr2);
  }


  var table2 = {
    type: 'table',
    title: '持仓信息',
    cols: ['币种', '方向', '仓位保证金', '持仓均价', '当前标记价格', '浮盈/亏'],
    rows: table2Arr
  };
  if (!IS_HUICHE) {
    var vet = getDetailLog(LIMIT, OFFSET, ORDER_STATUS, BOND_VALUE, COIN_VALUE);
    let coinArry = groupBy(vet.values, function(item){
      return [item[0]];
    });

    let tables = [];
    coinArry.forEach( function( coin ) {
      let count = coin.length;
      let table = {
        type: 'table',
        title: coin[0][0] + '_详细成交信息，共(' + count + ')条',
        cols: ['币种', '方向', '起始下单时间', '最终下单时间', '起始下单价格', '最终下单价格', '持仓均价', '成交时标记价格',
          '最大浮亏', '波动率%', '仓位保证金', '收益'],
        rows: coin
      };
      tables.push(table);
    });

    LogStatus('`' + JSON.stringify([table1, table2]) + '`\n' + '`' + JSON.stringify(tables) + '`');
    return;
  }
  LogStatus('`' + JSON.stringify([table1, table2]) + '`')
}

//获取当前币种最小下单数量
function getMinQuantity(ex) {

  var minQuantity = 0;
  var currCoin = ex.GetCurrency();
  var currCoinMinQuantity = _G(currCoin);
  if (currCoinMinQuantity) {
    minQuantity = currCoinMinQuantity;
  } else {
    if (IS_SIMULATE) {
      //v5模拟盘
      var ret = ex.IO("api", "GET", "/api/v5/public/instruments");
      minQuantity = ret.data[0].minSz;

    } else if (IS_HUICHE) {
      if (currCoin == "BTC_USDT") {
        minQuantity = 0.001;
      } else if (currCoin == "LTC_USDT") {
        minQuantity = 0.001;
      } else if (currCoin == "ETH_USDT") {
        minQuantity = 0.001;
      } else if (currCoin == "ETC_USDT") {
        minQuantity = 0.01;
      } else if (currCoin == "BCH_USDT") {
        minQuantity = 0.001;
      } else if (currCoin == "EOS_USDT") {
        minQuantity = 0.1;
      }
    } else {
      //币安
      while (true) {
        var ret = ex.IO("api", "GET", "/fapi/v1/exchangeInfo");
        if (!ret) {
          continue;
        }
        var aa = ret.symbols;
        for (var i = 0; i < aa.length; i++) {
          if (aa[i].symbol == currCoin.replace("_", "")) {
            minQuantity = aa[i].filters[1].minQty;
          }
        }
        _G(currCoin, minQuantity);
        break
      }
    }
  }
  return minQuantity;
}

//获取下单精度
function updatePricePrecision(ex) {
  var coin = ex.GetCurrency();
  var ticker = _C(ex.GetTicker);
  var price1 = (ticker.Last).toString();
  var price1Precision = 0;
  if (price1.indexOf(".") != -1) {
    var c = price1.split(".");
    price1Precision = c[1].length;
  }
  var price2 = (ticker.Sell).toString();
  var price2Precision = 0;
  if (price2.indexOf(".") != -1) {
    var c = price2.split(".");
    price2Precision = c[1].length;
  }
  var price3 = (ticker.Buy).toString();
  var price3Precision = 0
  if (price3.indexOf(".") != -1) {
    var c = price3.split(".");
    price3Precision = c[1].length;
  }
  var pricePrecision = price1Precision;
  if (price1Precision <= price2Precision) {
    pricePrecision = price2Precision;
  }
  if (price2Precision <= price3Precision) {
    pricePrecision = price3Precision;
  }
  _G(coin + "pricePrecision", pricePrecision);

}

//获取最小下单数量
function getQuantity(ex) {
  var ticker = _C(ex.GetTicker);
  var quantity = 0;
  //当前总权益
  var totalEqNew = 0;
  //是否复利
  if (COMPOUND_INTEREST) {
    //当前账户总权益
    totalEqNew = getTotalEquity();
  } else {
    //非复利则使用初始总金额计算
    if (totalEq != -1) {
      totalEqNew = totalEq;
    } else {
      totalEqNew = getTotalEquity();
    }
  }

  //根据当前币价格计算下单数量--初始状态

  var initQuantity = 0;
  var quantityPrecision = 0;

  var minQuantity = getMinQuantity(ex);

  var b = minQuantity.toString();
  if (b.indexOf(".") != -1) {
    var c = b.split(".");
    quantityPrecision = c[1].length;
  }

  // var q = (totalEqNew * INIT_BUY_PROPORTION * MARGIN_LEVEL / ticker.Last).toString();
  // if (q.indexOf(".") != -1) {
  //     var d = q.split(".");
  //     if (parseInt(d[0]) > 0) {
  //         quantityPrecision = 0;
  //     }
  // }
  initQuantity = _N(
      totalEqNew * INIT_BUY_PROPORTION * MARGIN_LEVEL / ticker.Last,
      quantityPrecision);
  //头寸
  var toucun = _N(totalEqNew * INIT_BUY_PROPORTION * MARGIN_LEVEL, 2);
  if (toucun < 5) {
    Log("最小下单金额*杠杆倍数小于5U，自动调整最小下单金额，建议重新设置相关参数");
    initQuantity = _N(5.1 / ticker.Last, quantityPrecision);
  }
  if (FIRST_BUY_PROPORTION < INIT_BUY_PROPORTION) {
    FIRST_BUY_PROPORTION = INIT_BUY_PROPORTION;
  }
  var firstBuyQuantity = _N(totalEqNew * FIRST_BUY_PROPORTION * MARGIN_LEVEL / ticker.Last, quantityPrecision);

  var coin = ex.GetCurrency();
  _G(coin + "firstBuyQuantity", firstBuyQuantity);

  return initQuantity;
}

//判断是否存在订单
function checkPos(posDirection, ex) {
  var pos = getPos(ex);
  if (pos) {
    if (pos.length == 2) {
      return true;
    }
    if (pos.length == 1) {
      if (pos[0].Type == posDirection) {
        return true;
      }
    }
  }
  return false;
}

//判断价差，
function checkPriceDifference(posDirection, ex) {
  var coin = ex.GetCurrency();
  var q = getQuantity(ex);
  var ticker = _C(ex.GetTicker);
  updateProfit(ex);
  //自适应补仓，在该币种当前仓位保证金大于每次补仓金额*50时，每次补仓降低浮亏为差的浮亏/2
  var b = 0;
  if  (COMPOUND_INTEREST) {
    b = CURR_TOTAL_EQ * INIT_BUY_PROPORTION * 50;
  } else {
    b = totalEq * INIT_BUY_PROPORTION * 50;
  }
  if (posDirection == PD_LONG) {
    var manyProfit = _G(coin + "manyProfit");
    var replenishmentManyRatio = _G(coin + "replenishmentManyRatio");
    if (manyProfit < 0 && Math.abs(manyProfit) > replenishmentManyRatio * MARGIN_LEVEL * 100) {
      //当前浮亏超过补仓比例的值
      var threshold = Math.abs(manyProfit) - replenishmentManyRatio * MARGIN_LEVEL * 100;
      var manyPosBond = _G(coin + "manyPosBond");
      if (manyPosBond >= b) {
        //超过补仓比例2个点的浮亏，就吧当前超过的浮亏补仓到减半
        var targetManyPrice = 0;
        if (threshold >= 2) {
          targetManyPrice = _N(ticker.Last * (1 + replenishmentManyRatio + threshold/2/ MARGIN_LEVEL / 100 ), _G(coin + "pricePrecision"));
          //低于2个点直接补到补仓比例
        } else {
          targetManyPrice = _N(ticker.Last * (1 + replenishmentManyRatio ), _G(coin + "pricePrecision"));
        }
        //当前持仓均价
        var oldManyPrice = _G(coin + "manyPrice");
        //当前持仓数量
        var oldManyPosNum = _G(coin + "manyPosNum");
        Log(coin+"自适应补仓");
        // Log("targetManyPrice:" + targetManyPrice + ";oldManyPrice:" + oldManyPrice + ";oldManyPosNum:" + oldManyPosNum);
        //需要补仓的数量
        var n  = _N(Math.abs(oldManyPosNum * (oldManyPrice - targetManyPrice) / (targetManyPrice - ticker.Last)), _G(coin + "amountPrecision"));
        if (n > q) {
          q = n;
        }
      } else {
        //超过补仓比例5个点的浮亏
        if (threshold >= 5) {
          //（当前价格*要补的数量 + 当前平均持仓价格*持仓数量）/补仓后总持仓数量 = 补仓后均价
          //补仓后均价/补仓后标记价格*20*100=补仓后浮赢/亏
          //补仓后浮赢/亏要<= replenishmentManyRatio
          //补仓后标记价格=预计浮赢/亏
          //一次性补齐太容易没钱补，每次触发时，降低3个浮亏点，例如浮亏17%时，降低到14%
          //补仓后目标持仓价格
          var targetManyPrice = _N(ticker.Last * (1 + replenishmentManyRatio + threshold/2/ MARGIN_LEVEL / 100 ), _G(coin + "pricePrecision"));
          //当前持仓均价
          var oldManyPrice = _G(coin + "manyPrice");
          //当前持仓数量
          var oldManyPosNum = _G(coin + "manyPosNum");
          Log(coin+"自适应补仓");
          // Log("targetManyPrice:" + targetManyPrice + ";oldManyPrice:" + oldManyPrice + ";oldManyPosNum:" + oldManyPosNum);
          //需要补仓的数量
          var n  = _N(Math.abs(oldManyPosNum * (oldManyPrice - targetManyPrice) / (targetManyPrice - ticker.Last)), _G(coin + "amountPrecision"));
          if (n > q) {
            q = n;
          }
        } else if (threshold >= 2) {
          q = q * 2;
        }
      }
    }
  } else if (posDirection == PD_SHORT) {
    var shortProfit = _G(coin + "shortProfit");
    var replenishmentShortRatio = _G(coin + "replenishmentShortRatio");
    if (shortProfit < 0 && Math.abs(shortProfit) > replenishmentShortRatio * MARGIN_LEVEL * 100) {
      var threshold = Math.abs(shortProfit) - replenishmentShortRatio * MARGIN_LEVEL * 100;
      //当该币种的浮亏大于补仓一定比例，或者改币种仓位大于一定比例，这个时候补仓一般来不及
      var shortPosBond = _G(coin + "shortPosBond");
      if (shortPosBond >= b) {
        //补仓后目标持仓价格
        var targetShortPrice = 0;
        if (threshold >= 2) {
          targetShortPrice = _N(ticker.Last * (1 - replenishmentShortRatio - threshold/2/ MARGIN_LEVEL / 100), _G(coin + "pricePrecision"));
        } else {
          targetShortPrice = _N(ticker.Last * (1 - replenishmentShortRatio), _G(coin + "pricePrecision"));
        }
        //当前持仓均价
        var oldShortPrice = _G(coin + "shortPrice");
        //当前持仓数量
        var oldShortPosNum = _G(coin + "shortPosNum");
        Log(coin+"自适应补仓");
        // Log("targetShortPrice:" + targetShortPrice + ";oldShortPrice:" + oldShortPrice + ";oldShortPosNum:" + oldShortPosNum);
        //需要补仓的数量
        var n = _N(Math.abs(oldShortPosNum * (targetShortPrice - oldShortPrice) / (ticker.Last - targetShortPrice)), _G(coin + "amountPrecision"));
        if (n > q) {
          q = n;
        }
      } else {
        if (threshold >= 5) {
          //补仓后目标持仓价格
          var targetShortPrice = _N(ticker.Last * (1 - replenishmentShortRatio - threshold/2/ MARGIN_LEVEL / 100), _G(coin + "pricePrecision"));
          //当前持仓均价
          var oldShortPrice = _G(coin + "shortPrice");
          //当前持仓数量
          var oldShortPosNum = _G(coin + "shortPosNum");
          Log(coin+"自适应补仓");
          // Log("targetShortPrice:" + targetShortPrice + ";oldShortPrice:" + oldShortPrice + ";oldShortPosNum:" + oldShortPosNum);
          //需要补仓的数量
          var n = _N(Math.abs(oldShortPosNum * (targetShortPrice - oldShortPrice) / (ticker.Last - targetShortPrice)), _G(coin + "amountPrecision"));
          if (n > q) {
            q = n;
          }
        } else if (threshold >= 2) {
          q = q * 2;
        }
      }
    }
  }
  return q;
}

//获取止盈比例-止盈比例为动态的--------依据斐波那契比例，加仓最大打15次，16次在复利模式下加不到，15次的时候约为7~8层仓位
//斐波那契加仓次数为1,1,2,3,5,8,13,21,34,55,89,144,233,377,610,
//由于取消了加仓次数这个概念，所以切换为相对全仓的比例
//默认动态止盈触发为保证金占比5.5%--14%---32%------70%
//即保证金占比到5.5%时，止盈比例变为0.005-0.001=0.004
function updateProfitRatio(posDirection, ex) {
  var coin = ex.GetCurrency();
  var dynamic_profit_ratio = JUDGE_DYNAMIC_PROFIT_RATIO.split(',').map(Number);

  if (posDirection == PD_LONG) {
    var manyPosBondRatio = _G(coin + "manyPosBondRatio");

    if (IS_OPEN_PROFIT) {
      var manyProfitRatioCount = _G(coin + "manyProfitRatioCount");
      var manyProfitRatio = _G(coin + "manyProfitRatio");
      if (manyPosBondRatio > dynamic_profit_ratio[manyProfitRatioCount]) {
        manyProfitRatio = manyProfitRatio + PROFIT_STEP;
        manyProfitRatioCount++;
        _G(coin + "manyProfitRatioCount", manyProfitRatioCount);
        _G(coin + "manyProfitRatio", manyProfitRatio);
      }
    }

    if (IS_OPEN_REPLENISHMENT_RATIO) {
      var replenishmentManyCount = _G(coin + "replenishmentManyCount");
      var replenishmentManyRatio = _G(coin + "replenishmentManyRatio");

      if (manyPosBondRatio > dynamic_profit_ratio[replenishmentManyCount]) {
        replenishmentManyRatio = replenishmentManyRatio + REPLENISHMENT_STEP;
        replenishmentManyCount++;
        _G(coin + "replenishmentManyCount", replenishmentManyCount);
        _G(coin + "replenishmentManyRatio", replenishmentManyRatio);
      }
    }
  } else if (posDirection == PD_SHORT) {
    var shortPosBondRatio = _G(coin + "shortPosBondRatio");
    if (IS_OPEN_PROFIT) {
      var shortProfitRatioCount = _G(coin + "shortProfitRatioCount");
      var shortProfitRatio = _G(coin + "shortProfitRatio");
      if (shortPosBondRatio > dynamic_profit_ratio[shortProfitRatioCount]) {
        shortProfitRatio = shortProfitRatio + PROFIT_STEP;
        shortProfitRatioCount++;
        _G(coin + "shortProfitRatioCount", shortProfitRatioCount);
        _G(coin + "shortProfitRatio", shortProfitRatio);
      }
    }
    if (IS_OPEN_REPLENISHMENT_RATIO) {
      var replenishmentShortCount = _G(coin + "replenishmentShortCount");
      var replenishmentShortRatio = _G(coin + "replenishmentShortRatio");
      if (shortPosBondRatio
          > dynamic_profit_ratio[replenishmentShortCount]) {
        replenishmentShortRatio = replenishmentShortRatio
            + REPLENISHMENT_STEP;
        replenishmentShortCount++;
        _G(coin + "replenishmentShortCount", replenishmentShortCount);
        _G(coin + "replenishmentShortRatio", replenishmentShortRatio);
      }
    }
  }
}

//锁仓，当加仓层数超过设定值时，依据指标判断是否锁仓
function lockPos(ex) {
  var coin = ex.GetCurrency();
  if (MANY_STEP >= LOCK_POS_STEP || SHORT_STEP >= LOCK_POS_STEP) {
    //计算ma，计算深度比例，计算rsi
    //回测盘下无深度
    getLine();
    checkManyRsi(ex);
    checkShortRsi();
    var rsiSuperSell = _G(coin + "rsiSuperSell");
    var rsiSuperBuy = _G(coin + "rsiSuperBuy");
    if (IS_HUICHE) {
      Log("RSI_SUPER_SELL:" + RSI_SUPER_SELL + "RSI_SUPER_BUY:" + RSI_SUPER_BUY + ":DIRECTION:" + DIRECTION);
      if (MANY_STEP >= LOCK_POS_STEP) {
        if (rsiSuperSell == 1 && DIRECTION == "DOWN") {
          Log("触发多仓锁仓");
          //这个时候还要跌，反手一个空仓
          var pos = _C(ex.GetPosition);
          shortBuy(_C(ex.GetTicker), pos[0].Amount);
          LOCK_POS_STATUS = true;
        }

      } else {
        if (rsiSuperBuy == 1 && DIRECTION == "UP") {
          Log("触发空仓锁仓");
          //这个时候还要涨，反手一个多仓
          var pos = _C(ex.GetPosition);
          manyBuy(_C(ex.GetTicker), pos[0].Amount);
          LOCK_POS_STATUS = true;
        }
      }
    } else {
      var n = getDept(_C(ex.GetTicker));
      if (MANY_STEP >= LOCK_POS_STEP) {
        if (rsiSuperSell == 1 && DIRECTION == "DOWN" && n > 0) {
          Log("触发多仓锁仓");
          //这个时候还要跌，反手一个空仓
          var pos = _C(ex.GetPosition);
          shortBuy(_C(ex.GetTicker), pos[0].Amount);
          LOCK_POS_STATUS = true;
        }

      } else {
        if (rsiSuperBuy == 1 && DIRECTION == "UP" && n < 0) {
          Log("触发空仓锁仓");
          //这个时候还要涨，反手一个多仓
          var pos = _C(ex.GetPosition);
          manyBuy(_C(ex.GetTicker), pos[0].Amount);
          LOCK_POS_STATUS = true;
        }
      }
    }
  }
}

//解除锁仓
function unlockPos(ex) {
  if (LOCK_POS_STATUS) {
    getLine();
    checkManyRsi(ex);
    checkShortRsi();
    if (IS_HUICHE) {
      if (MANY_STEP >= LOCK_POS_STEP) {
        if (RSI_SUPER_BUY || DIRECTION == "UP") {
          Log("多仓解锁");
          LOCK_POS_STATUS = false;
        }

      } else if (SHORT_STEP >= LOCK_POS_STEP) {
        if (RSI_SUPER_SELL || DIRECTION == "DOWN") {
          Log("空仓解锁");
          LOCK_POS_STATUS = false;
        }
      }
    } else {
      var n = getDept(_C(ex.GetTicker));

      if (MANY_STEP >= LOCK_POS_STEP) {
        if (RSI_SUPER_BUY || DIRECTION == "UP" || n < 0) {
          Log("多仓解锁");
          LOCK_POS_STATUS = false;
        }

      } else if (SHORT_STEP >= LOCK_POS_STEP) {
        if (RSI_SUPER_SELL || DIRECTION == "DOWN" || n > 0) {
          Log("空仓解锁");
          LOCK_POS_STATUS = false;
        }
      }
    }
  }
}

//合约资金划转到现货
function usdtTransfer(cur, amount, type) {
  try {
    var base = '';
    var params = '';
    // 1: 现货账户向USDT合约账户划转
    // 2: USDT合约账户向现货账户划转
    // 3: 现货账户向币本位合约账户划转
    // 4: 币本位合约账户向现货账户划转
    var 划转类型 = type;
    //划转到现货
    //POST /sapi/v1/futures/transfer
    base = "https://api.binance.com";
    exchanges[0].SetBase(base);
    var timestamp = new Date().getTime();
    params = "asset=" + cur + "&amount=" + amount + "&type=" + type + "&timestamp" + timestamp;
    // params ={
    //     "asset": cur ,
    //     "amount": amount,
    //     "type" : type,
    //     "timestamp" : new Date().getTime()
    // }
    Log("交易对:", cur, "划转数量:", amount, "划转类型:", type,"#FF0000");
    //var ret1 = exchanges[0].IO("api", "POST", "/sapi/v1/futures/transfer" ,"",  JSON.stringify( params ) )
    var ret1 = exchanges[0].IO("api", "POST", "/sapi/v1/futures/transfer", params);
    base = "https://fapi.binance.com";
    e.SetBase(base);
    return ret1
  } catch (error) {
    Log(error)
  }
}


//贪心算法
function greedy(type, ex) {
  var coin = ex.GetCurrency();
  updateProfit(ex);
  if (type == PD_LONG) {
    _G(coin + "manyGreedyStatus", 1);
    var manyProfit = _G(coin + "manyProfit");
    var manyGreedyProfitRatioDown = _G(coin + "manyGreedyProfitRatioDown");
    var manyGreedyProfitRatioUp = _G(coin + "manyGreedyProfitRatioUp");

    if (manyGreedyProfitRatioDown == 0) {
      manyGreedyProfitRatioDown = manyProfit * (1 - GREEDY_INTERVAL_DOWN);
      manyGreedyProfitRatioUp = manyProfit * (1 + GREEDY_INTERVAL_UP);
      _G(coin + "manyGreedyProfitRatioDown", manyGreedyProfitRatioDown);
      _G(coin + "manyGreedyProfitRatioUp", manyGreedyProfitRatioUp);
    }
    if (manyProfit >= manyGreedyProfitRatioUp) {
      manyGreedyProfitRatioDown = manyProfit * (1 - GREEDY_INTERVAL_DOWN);
      manyGreedyProfitRatioUp = manyProfit * (1 + GREEDY_INTERVAL_UP);
      Log(coin + "当前多单浮赢：" + manyProfit + ";贪心上限:" + manyGreedyProfitRatioUp + ";贪心下限:" + manyGreedyProfitRatioDown);
      _G(coin + "manyGreedyProfitRatioDown", manyGreedyProfitRatioDown);
      _G(coin + "manyGreedyProfitRatioUp", manyGreedyProfitRatioUp);
    } else if (manyProfit <= manyGreedyProfitRatioDown) {
      Log(coin + "多单触发贪心止盈:" + manyProfit + "%", "#FF0000");
      _G(coin + "manyGreedyStatus", 0);
      var quantity = getQuantity(ex);
      manySell(1, quantity, ex,1);
      if (!CLOSE_BUY) {
        //当前非超卖时，以当前价格开多
        var rsiSuperSell = _G(coin + "rsiSuperSell");
        if (rsiSuperSell == 0) {
          if (OPEN_CROSS_POS_ADD) {
            //根据均线判断当时头仓是否开大
            var status = _G(coin + "crossStatus");
            //均线趋势上涨，开大头仓
            //新增功能，加入深度判断，当买单深度/卖单深度大于一定比例时，才开大头仓
            if (status == 1) {
              var firstBuyQuantity = _G(coin + "firstBuyQuantity");
              if (!firstBuyQuantity || firstBuyQuantity == 0) {
                manyBuy(quantity, ex);
              } else {
                Log(coin + "当前趋势是涨，加大头仓", "#0000FF");
                manyBuy(firstBuyQuantity, ex);
                //降低该方向止盈比例，加快出仓速度，避免站岗
                _G(coin + "manyProfitRatio", INIT_PROFIT_RATIO + CROSS_PROFIT_STEP);

              }
            } else {
              //不稳定震荡和下跌趋势都开默认仓位
              manyBuy(quantity, ex);
            }
          } else {
            manyBuy(quantity, ex);
          }
        }
      }
    }
  } else if (type == PD_SHORT) {
    _G(coin + "shortGreedyStatus", 1);
    var shortProfit = _G(coin + "shortProfit");
    var shortGreedyProfitRatioDown = _G(coin + "shortGreedyProfitRatioDown");
    var shortGreedyProfitRatioUp = _G(coin + "shortGreedyProfitRatioUp");

    if (shortGreedyProfitRatioDown == 0) {
      shortGreedyProfitRatioDown = shortProfit * (1 - GREEDY_INTERVAL_DOWN);
      shortGreedyProfitRatioUp = shortProfit * (1 + GREEDY_INTERVAL_UP);
      _G(coin + "shortGreedyProfitRatioDown", shortGreedyProfitRatioDown);
      _G(coin + "shortGreedyProfitRatioUp", shortGreedyProfitRatioUp);

    }
    if (shortProfit >= shortGreedyProfitRatioUp) {
      shortGreedyProfitRatioDown = shortProfit * (1 - GREEDY_INTERVAL_DOWN);
      shortGreedyProfitRatioUp = shortProfit * (1 + GREEDY_INTERVAL_UP);
      Log(coin + "当前空单浮赢：" + shortProfit + ";贪心上限:" + shortGreedyProfitRatioUp + ";贪心下限:" + shortGreedyProfitRatioDown);
      _G(coin + "shortGreedyProfitRatioDown", shortGreedyProfitRatioDown);
      _G(coin + "shortGreedyProfitRatioUp", shortGreedyProfitRatioUp);
    } else if (shortProfit <= shortGreedyProfitRatioDown) {
      Log(coin + "空单触发贪心止盈:" + shortProfit + "%", "#FF0000");
      _G(coin + "shortGreedyStatus", 0);
      var quantity = getQuantity(ex);
      shortSell(1, quantity, ex,1);

      if (!CLOSE_BUY) {
        //以当前价格开空
        var rsiSuperBuy = _G(coin + "rsiSuperBuy");
        if (rsiSuperBuy == 0) {
          if (OPEN_CROSS_POS_ADD) {
            //根据均线判断当时头仓是否开大
            var status = _G(coin + "crossStatus");
            if (status == 2) {
              var firstBuyQuantity = _G(coin + "firstBuyQuantity");
              if (!firstBuyQuantity || firstBuyQuantity == 0) {
                shortBuy(quantity, ex);
              } else {
                Log(coin + "当前趋势是跌，加大头仓", "#0000FF");
                shortBuy(firstBuyQuantity, ex);
                //降低该方向止盈比例，加快出仓速度，避免站岗
                _G(coin + "shortProfitRatio", INIT_PROFIT_RATIO + CROSS_PROFIT_STEP);
              }
            } else {
              //不稳定震荡和下跌趋势都开默认仓位
              shortBuy(quantity, ex);
            }
          } else {
            shortBuy(quantity, ex);
          }
        }
      }
    }
  }
}

function manyBuy(many_quantity, ex) {
  var coin = ex.GetCurrency();
  var ticker = _C(ex.GetTicker);
  if (many_quantity > 0) {
    if (IS_OPEN_SIMULATED_FUNDS) {
      //模拟下单
      Log(coin + "开多;价格:" + ticker.Last + ";数量:" + many_quantity);
      createPos(ticker.Last, many_quantity, PD_LONG, ex);
      updateTable();
      //更新均价,止盈价，下一次补仓价,仓位
      updateProfitRatio(PD_LONG, ex);
      updateProfit(ex);
      if (!IS_HUICHE) {
        recodeDetail(PD_LONG, ticker.Last, ex);
      }
    } else {
      var price = _N(ticker.Sell * (1 + ADD_PRICE_PROPORTION), _G(coin + "pricePrecision"));
      ex.SetDirection("buy");
      let orderId = ex.Buy(price, many_quantity);
      // let orderId = ex.Buy(-1, many_quantity);
      if (orderId) {
        //判断是否成交
        while (true) {
          Sleep(200);
          let order = ex.GetOrder(orderId);
          if (null === order) {
            Log(999);
            break
          }
          // 买入成功处理
          if (1 === order.Status || 2 === order.Status) {
            updateTable();
            //更新均价,止盈价，下一次补仓价,仓位
            updateProfitRatio(PD_LONG, ex);
            updateProfit(ex);
            if (!IS_HUICHE) {
              recodeDetail(PD_LONG, price, ex);
            }
            break
          } else {
            //取消挂单，重新下单
            ex.CancelOrder(orderId);
            Log(coin + "订单未成交，取消订单，重新下单");
            manyBuy(many_quantity, ex);
          }
        }
      } else {
        Log(coin + "下单失败，尝试再次下单");
        manyBuy(many_quantity, ex);
      }
    }
  } else {
    Log(coin + "下单失败，原因是下单数量为0");
  }
}

function shortBuy(short_quantity, ex) {
  var coin = ex.GetCurrency();
  var ticker = _C(ex.GetTicker);
  if (short_quantity > 0) {
    if (IS_OPEN_SIMULATED_FUNDS) {
      //模拟下单
      Log(coin + "开空;价格:" + ticker.Last + ";数量:" + short_quantity);
      createPos(ticker.Last, short_quantity, PD_SHORT, ex);
      updateTable();
      //更新均价,止盈价，下一次补仓价,仓位
      updateProfitRatio(PD_SHORT, ex);
      updateProfit(ex);

      if (!IS_HUICHE) {
        recodeDetail(PD_SHORT, ticker.Last, ex);
      }
    } else {
      ex.SetDirection("sell");
      var price = _N(ticker.Buy * (1 - ADD_PRICE_PROPORTION), _G(coin + "pricePrecision"));
      let orderId = ex.Sell(price, short_quantity);
      // let orderId = ex.Sell(-1, short_quantity);
      if (orderId) {
        //判断是否成交
        while (true) {
          Sleep(200);
          let order = ex.GetOrder(orderId);
          if (null === order) {
            Log(999);
            break
          }
          // 买入成功处理
          if (1 === order.Status || 2 === order.Status) {
            updateTable();
            //更新均价,止盈价，下一次补仓价,仓位
            updateProfitRatio(PD_SHORT, ex);
            updateProfit(ex);

            if (!IS_HUICHE) {
              recodeDetail(PD_SHORT, price, ex);
            }
            break
          } else {
            //取消挂单，重新下单
            ex.CancelOrder(orderId);
            Log(coin + "订单未成交，取消订单，重新下单");
            shortBuy(short_quantity, ex);
          }
        }
      } else {
        Log(coin + "下单失败，尝试再次下单");
        shortBuy(short_quantity, ex);
      }
    }

  } else {
    Log(coin + "下单失败，原因是下单数量为0");
  }
}

// 平多
function manySell(quantity, min_many_quantity, ex,greedyType) {
  var coin = ex.GetCurrency();
  var ticker = _C(ex.GetTicker);
  var pos = getPos(ex);
  if (!pos || pos.length == 0) {
    return
  }
  for (var i = 0; i < pos.length; i++) {
    if (pos[i].Type == PD_LONG) {
      if (IS_OPEN_SIMULATED_FUNDS) {

        Log(coin + "多头持仓均价:" + pos[i].Price + ";多头持仓保证金:" + pos[i].Margin + ";当前标记价格："
            + ticker.Last + "浮盈/亏:" + pos[i].Profit);
        var simulatedEq = _G("simulatedEq");
        simulatedEq = simulatedEq + _N(pos[i].Profit, 3);
        _G("simulatedEq", simulatedEq);

        if (quantity < 1) {
          var quantityPrecision = 0;
          if (min_many_quantity < 0) {
            var b = min_many_quantity.toString();
            if (b.indexOf(".") != -1) {
              var c = b.split(".");
              quantityPrecision = c[1].length;
            }
          }
          var amount = _N(pos[i].Amount * quantity, quantityPrecision);

          deletePartPos(PD_LONG, amount, ticker.Last, ex)

        } else {
          deletePos(PD_LONG, ex);
        }

        updateTable();
        updateProfit(ex);
        if (!IS_HUICHE) {
          insertDetail(PD_LONG, pos[i].Price, ticker.Last, pos[i].Margin, pos[i].Profit, ex);
          _G(coin + "manyStatus", 0);

          _G(coin + "maxManyLostProfit", 0);
        }
        _G(coin + "manyProfitRatio", INIT_PROFIT_RATIO);
        _G(coin + "manyProfitRatioCount", 0);
        _G(coin + "manyPosBond", 0);
        _G(coin + "manyProfit", 0);
        _G(coin + "manyPosBondRatio", 0);
        _G(coin + "replenishmentManyRatio", INIT_REPLENISHMENT_RATIO);
        _G(coin + "replenishmentManyCount", 0);

        _G(coin + "manyGreedyProfitRatioDown", 0);
        _G(coin + "manyGreedyProfitRatioUp", 0);

        _G(coin + "manyPrice", 0);
        _G(coin + "manyPosNum", 0);

        statisticEq();
      } else {
        ex.SetDirection("closebuy");
        var amount = 0;
        if (quantity < 1) {
          var quantityPrecision = 0;
          if (min_many_quantity < 0) {
            var b = min_many_quantity.toString();
            if (b.indexOf(".") != -1) {
              var c = b.split(".");
              quantityPrecision = c[1].length;
            }
          }
          amount = _N(pos[i].Amount * quantity, quantityPrecision);
        } else {
          amount = pos[i].Amount
        }
        var price = ticker.Buy * (1 - ADD_PRICE_PROPORTION);
        //如果是触发贪心止盈的，直接市价平
        if (greedyType == 1) {
          ex.Sell(-1, amount);
        } else {
          ex.Sell(price, amount);
        }

        Log(coin + "多头持仓均价:" + pos[i].Price + ";多头持仓保证金:" + pos[i].Margin + ";当前标记价格："
            + ticker.Last + "浮盈/亏:" + pos[i].Profit);
        updateTable();
        updateProfit(ex);

        if (!IS_HUICHE) {
          insertDetail(PD_LONG, pos[i].Price, ticker.Last, pos[i].Margin, pos[i].Profit, ex);
          _G(coin + "manyStatus", 0);
          _G(coin + "maxManyLostProfit", 0);
        }

        _G(coin + "manyProfitRatio", INIT_PROFIT_RATIO);
        _G(coin + "manyProfitRatioCount", 0);
        _G(coin + "manyPosBond", 0);
        _G(coin + "manyProfit", 0);
        _G(coin + "manyPosBondRatio", 0);
        _G(coin + "replenishmentManyRatio", INIT_REPLENISHMENT_RATIO);
        _G(coin + "replenishmentManyCount", 0);

        _G(coin + "manyGreedyProfitRatioDown", 0);
        _G(coin + "manyGreedyProfitRatioUp", 0);

        _G(coin + "manyPrice", 0);
        _G(coin + "manyPosNum", 0);

        statisticEq();
      }
    }
  }
}

//平空
function shortSell(quantity, min_short_quantity, ex,greedyType) {
  var coin = ex.GetCurrency();
  var ticker = _C(ex.GetTicker);
  var pos = getPos(ex);
  if (!pos || pos.length == 0) {
    return
  }
  for (var i = 0; i < pos.length; i++) {
    if (pos[i].Type == PD_SHORT) {
      if (IS_OPEN_SIMULATED_FUNDS) {
        Log(coin + "空头持仓均价:" + pos[i].Price + ";空头持仓保证金:" + pos[i].Margin + ";当前标记价格："
            + ticker.Last + "浮盈/亏:" + pos[i].Profit);
        var simulatedEq = _G("simulatedEq");
        simulatedEq = simulatedEq + _N(pos[i].Profit, 3);
        _G("simulatedEq", simulatedEq);

        if (quantity < 1) {
          var quantityPrecision = 0;
          if (min_short_quantity < 0) {
            var b = min_short_quantity.toString();
            if (b.indexOf(".") != -1) {
              var c = b.split(".");
              quantityPrecision = c[1].length;
            }
          }
          amount = _N(pos[i].Amount * quantity, quantityPrecision);

          deletePartPos(PD_SHORT, amount, ticker.Last, ex)
        } else {
          deletePos(PD_SHORT, ex);
        }


        updateTable();
        updateProfit(ex);

        if (!IS_HUICHE) {
          insertDetail(PD_SHORT, pos[i].Price, ticker.Last, pos[i].Margin, pos[i].Profit, ex);
          _G(coin + "shortStatus", 0);
          _G(coin + "maxShortLostProfit", 0);
        }

        _G(coin + "shortProfitRatio", INIT_PROFIT_RATIO);
        _G(coin + "shortProfitRatioCount", 0);
        _G(coin + "shortPosBond", 0);
        _G(coin + "shortProfit", 0);
        _G(coin + "shortPosBondRatio", 0);
        _G(coin + "replenishmentShortRatio", INIT_REPLENISHMENT_RATIO);
        _G(coin + "replenishmentShortCount", 0);

        _G(coin + "shortGreedyProfitRatioDown", 0);
        _G(coin + "shortGreedyProfitRatioUp", 0);

        _G(coin + "shortPrice", 0);
        _G(coin + "shortPosNum", 0);

        statisticEq();
      } else {
        ex.SetDirection("closesell");
        var amount = 0;
        if (quantity < 1) {
          var quantityPrecision = 0;
          if (min_short_quantity < 0) {
            var b = min_short_quantity.toString();
            if (b.indexOf(".") != -1) {
              var c = b.split(".");
              quantityPrecision = c[1].length;
            }
          }
          amount = _N(pos[i].Amount * quantity, quantityPrecision);
        } else {
          amount = pos[i].Amount;
        }
        // ex.Buy(-1,amount);
        var price = ticker.Sell * (1 + ADD_PRICE_PROPORTION);
        //如果触发贪心止盈，直接市价平
        if (greedyType == 1) {
          ex.Buy(-1,amount);
        } else {
          ex.Buy(price, amount);
        }

        Log(coin + "空头持仓均价:" + pos[i].Price + ";空头持仓保证金:" + pos[i].Margin + ";当前标记价格："
            + ticker.Last + "浮盈/亏:" + pos[i].Profit);
        updateTable();
        updateProfit(ex);

        if (!IS_HUICHE) {
          insertDetail(PD_SHORT, pos[i].Price, ticker.Last, pos[i].Margin, pos[i].Profit, ex);
          _G(coin + "shortStatus", 0);
          _G(coin + "maxShortLostProfit", 0);
        }

        _G(coin + "shortProfitRatio", INIT_PROFIT_RATIO);
        _G(coin + "shortProfitRatioCount", 0);
        _G(coin + "shortPosBond", 0);
        _G(coin + "shortProfit", 0);
        _G(coin + "shortPosBondRatio", 0);
        _G(coin + "replenishmentShortRatio", INIT_REPLENISHMENT_RATIO);
        _G(coin + "replenishmentShortCount", 0);

        _G(coin + "shortGreedyProfitRatioDown", 0);
        _G(coin + "shortGreedyProfitRatioUp", 0);

        _G(coin + "shortPrice", 0);
        _G(coin + "shortPosNum", 0);

        statisticEq();
      }
    }
  }
}

function tradeMany(many_quantity, ex) {
  var coin = ex.GetCurrency();

  var manyGreedyStatus = _G(coin + "manyGreedyStatus");
  if (manyGreedyStatus == 1) {
    greedy(PD_LONG, ex);
  } else {
    //判断是否存在仓位
    //如果存在多仓
    if (checkPos(PD_LONG, ex)) {
      updateProfit(ex);
      updateProfitRatio(PD_LONG, ex);
      getTotalEquity();
      //判断止盈/补仓/止损
      //当总仓位超过一定比例时，停止下单，等待止损或者止盈
      var available_funds = _G("available_funds");
      var manyPosBond = _G(coin + "manyPosBond");
      var manyProfit = _G(coin + "manyProfit");
      var manyProfitRatio = _G(coin + "manyProfitRatio");
      var replenishmentManyRatio = _G(coin + "replenishmentManyRatio");

      //开启根据保证金止损后
      //如果保证金超过一定比例，直接止损
      if (OPEN_POS_BOND_LOSS) {
        if (manyPosBond >= POS_BOND_LOSS) {
          if (IS_OPEN_ALL_LOSS) {
            Log(coin + "多单触发直接止损", "#FF0000@");
            manySell(1, many_quantity, ex,0);
          } else {
            Log(coin + "多单触发部分止损", "#FF0000@");
            manySell(PART_LOSS_RATIO, many_quantity, ex,0);
          }
          //判断rsi，当前是否属于超买状态，是就不下空单
          checkShortRsi(ex);
          return;
        }
      }
      if (available_funds <= CURR_TOTAL_EQ * (1 + 0.05 - STOP_LOSS_RELATIVE_ALL_POS)) {
        if (manyProfit < 0 && Math.abs(manyProfit) >= STOP_LOSS_RATIO * 100) {
          if (IS_OPEN_ALL_LOSS) {
            Log(coin + "多单触发直接止损", "#FF0000@");
            manySell(1, many_quantity, ex,0);
          } else {
            Log(coin + "多单触发部分止损", "#FF0000@");
            manySell(PART_LOSS_RATIO, many_quantity, ex,0);
          }
          //判断rsi，当前是否属于超卖状态，是就不下多单
          checkManyRsi(ex);
        } else {
          if (manyProfit > 0 && manyProfit >= manyProfitRatio
              * MARGIN_LEVEL * 100) {

            if (OPEN_GREEDY && manyPosBond >= GREEDY_BOND) {
              greedy(PD_LONG, ex);
            } else {
              Log(coin + "多单触发止盈:" + manyProfit + "%", "#FF0000");
              manySell(1, many_quantity, ex,0);
            }
            if (!CLOSE_BUY) {
              //当前非超卖时，以当前价格开多
              var rsiSuperSell = _G(coin + "rsiSuperSell");
              if (rsiSuperSell == 0) {
                if (OPEN_CROSS_POS_ADD) {
                  //根据均线判断当时头仓是否开大
                  var status = _G(coin + "crossStatus");
                  //均线趋势上涨，开大头仓
                  if (status == 1) {
                    var firstBuyQuantity = _G(coin + "firstBuyQuantity");
                    if (!firstBuyQuantity || firstBuyQuantity == 0) {
                      manyBuy(many_quantity, ex);
                    } else {
                      Log(coin + "当前趋势是涨，加大头仓", "#0000FF");
                      manyBuy(firstBuyQuantity, ex);
                      //降低该方向止盈比例，加快出仓速度，避免站岗
                      _G(coin + "manyProfitRatio", INIT_PROFIT_RATIO + CROSS_PROFIT_STEP);
                    }
                  } else {
                    //不稳定震荡和下跌趋势都开默认仓位
                    manyBuy(many_quantity, ex);
                  }
                } else {
                  manyBuy(many_quantity, ex);
                }
              }
            }

          }
        }
      } else {
        if (manyProfit > 0 && manyProfit >= manyProfitRatio
            * MARGIN_LEVEL * 100) {

          if (OPEN_GREEDY && manyPosBond >= GREEDY_BOND) {
            greedy(PD_LONG, ex);
          } else {
            Log(coin + "多单触发止盈:" + manyProfit + "%", "#FF0000");
            manySell(1, many_quantity, ex,0);

            if (!CLOSE_BUY) {
              //当前非超卖时，以当前价格开多
              var rsiSuperSell = _G(coin + "rsiSuperSell");
              if (rsiSuperSell == 0) {
                if (OPEN_CROSS_POS_ADD) {
                  //根据均线判断当时头仓是否开大
                  var status = _G(coin + "crossStatus");
                  //均线趋势上涨，开大头仓
                  if (status == 1) {
                    var firstBuyQuantity = _G(coin + "firstBuyQuantity");
                    if (!firstBuyQuantity || firstBuyQuantity == 0) {
                      manyBuy(many_quantity, ex);
                    } else {
                      Log(coin + "当前趋势是涨，加大头仓", "#0000FF");
                      manyBuy(firstBuyQuantity, ex);
                      //降低该方向止盈比例，加快出仓速度，避免站岗
                      _G(coin + "manyProfitRatio", INIT_PROFIT_RATIO + CROSS_PROFIT_STEP);
                    }
                  } else {
                    //不稳定震荡和下跌趋势都开默认仓位
                    manyBuy(many_quantity, ex);
                  }
                } else {
                  manyBuy(many_quantity, ex);
                }
              }
            }
          }
        } else if (manyProfit < 0 && Math.abs(manyProfit)
            >= replenishmentManyRatio * MARGIN_LEVEL * 100) {

          Log(coin + "补多：" + manyProfit + "%");
          var q = checkPriceDifference(PD_LONG, ex);
          //开启根据保证金止损后
          //如果补仓后，保证金超过一定比例，直接止损
          if (OPEN_POS_BOND_LOSS) {
            var ticker = _C(ex.GetTicker);
            var targetBond = manyPosBond + ticker.Last * q/MARGIN_LEVEL;
            if (targetBond >= POS_BOND_LOSS) {
              if (IS_OPEN_ALL_LOSS) {
                Log(coin + "多单触发直接止损", "#FF0000@");
                manySell(1, many_quantity, ex,0);
              } else {
                Log(coin + "多单触发部分止损", "#FF0000@");
                manySell(PART_LOSS_RATIO, many_quantity, ex,0);
              }
              //判断rsi，当前是否属于超买状态，是就不下空单
              checkShortRsi(ex);
              return;
            }
          }
          manyBuy(q, ex);
          updateProfit(ex);
        }
      }
    } else {
      if (!CLOSE_BUY) {
        checkManyRsi(ex);
        //当前非超卖时，以当前价格开多
        var rsiSuperSell = _G(coin + "rsiSuperSell");
        if (rsiSuperSell == 0) {
          if (OPEN_CROSS_POS_ADD) {
            //根据均线判断当时头仓是否开大
            var status = _G(coin + "crossStatus");
            //均线趋势上涨，开大头仓
            if (status == 1) {
              var firstBuyQuantity = _G(coin + "firstBuyQuantity");
              if (!firstBuyQuantity || firstBuyQuantity == 0) {
                manyBuy(many_quantity, ex);
              } else {
                Log(coin + "当前趋势是涨，加大头仓", "#0000FF");
                manyBuy(firstBuyQuantity, ex);
                //降低该方向止盈比例，加快出仓速度，避免站岗
                _G(coin + "manyProfitRatio", INIT_PROFIT_RATIO + CROSS_PROFIT_STEP);

              }
            } else {
              //不稳定震荡和下跌趋势都开默认仓位
              manyBuy(many_quantity, ex);
            }
          } else {
            manyBuy(many_quantity, ex);
          }
        }
      }
    }
  }
}

function tradeShort(short_quantity, ex) {
  var coin = ex.GetCurrency();
  var shortGreedyStatus = _G(coin + "shortGreedyStatus");
  if (shortGreedyStatus == 1) {
    greedy(PD_SHORT, ex);
  } else {
    //如果存在空仓
    if (checkPos(PD_SHORT, ex)) {
      updateProfit(ex);
      updateProfitRatio(PD_SHORT, ex);
      getTotalEquity();
      //判断止盈/补仓/止损
      //当总仓位超过一定比例时，停止下单，等待止损或者止盈
      var available_funds = _G("available_funds");
      var shortPosBond = _G(coin + "shortPosBond");
      var shortProfit = _G(coin + "shortProfit");
      var shortProfitRatio = _G(coin + "shortProfitRatio");
      var replenishmentShortRatio = _G(coin + "replenishmentShortRatio");

      //开启根据保证金止损后
      //如果保证金超过一定比例，直接止损
      if (OPEN_POS_BOND_LOSS) {
        if (shortPosBond >= POS_BOND_LOSS) {
          if (IS_OPEN_ALL_LOSS) {
            Log(coin + "空单触发直接止损", "#FF0000@");
            shortSell(1, short_quantity, ex,0);
          } else {
            Log(coin + "空单触发部分止损", "#FF0000@");
            shortSell(PART_LOSS_RATIO, short_quantity, ex,0);
          }
          //判断rsi，当前是否属于超买状态，是就不下空单
          checkShortRsi(ex);
          return;
        }
      }

      if (available_funds <= CURR_TOTAL_EQ * (1 + 0.05 - STOP_LOSS_RELATIVE_ALL_POS)) {
        if (shortProfit < 0 && Math.abs(shortProfit) >= STOP_LOSS_RATIO * 100) {
          if (IS_OPEN_ALL_LOSS) {
            Log(coin + "空单触发直接止损", "#FF0000@");
            shortSell(1, short_quantity, ex,0);
          } else {
            Log(coin + "空单触发部分止损", "#FF0000@");
            shortSell(PART_LOSS_RATIO, short_quantity, ex,0);
          }
          //判断rsi，当前是否属于超买状态，是就不下空单
          checkShortRsi(ex);
        } else {
          if (shortProfit > 0 && shortProfit >= shortProfitRatio
              * MARGIN_LEVEL * 100) {

            if (OPEN_GREEDY && shortPosBond >= GREEDY_BOND) {
              greedy(PD_SHORT, ex);
            } else {
              Log(coin + "空单触发止盈:" + shortProfit + "%", "#FF0000");
              shortSell(1, short_quantity, ex,0);
            }
            if (!CLOSE_BUY) {
              //以当前价格开空
              var rsiSuperBuy = _G(coin + "rsiSuperBuy");
              if (rsiSuperBuy == 0) {
                if (OPEN_CROSS_POS_ADD) {
                  //根据均线判断当时头仓是否开大
                  var status = _G(coin + "crossStatus");
                  if (status == 2) {
                    var firstBuyQuantity = _G(coin + "firstBuyQuantity");
                    if (!firstBuyQuantity || firstBuyQuantity == 0) {
                      shortBuy(short_quantity, ex);
                    } else {
                      Log(coin + "当前趋势是跌，加大头仓", "#0000FF");
                      shortBuy(firstBuyQuantity, ex);
                      //降低该方向止盈比例，加快出仓速度，避免站岗
                      _G(coin + "shortProfitRatio", INIT_PROFIT_RATIO + CROSS_PROFIT_STEP);
                    }
                  } else {
                    //不稳定震荡和下跌趋势都开默认仓位
                    shortBuy(short_quantity, ex);
                  }
                } else {
                  shortBuy(short_quantity, ex);
                }
              }
            }
          }
        }
      } else {
        if (shortProfit > 0 && shortProfit >= shortProfitRatio
            * MARGIN_LEVEL * 100) {

          if (OPEN_GREEDY && shortPosBond >= GREEDY_BOND) {
            greedy(PD_SHORT, ex);
          } else {
            Log(coin + "空单触发止盈:" + shortProfit + "%", "#FF0000");
            shortSell(1, short_quantity, ex,0);

            if (!CLOSE_BUY) {
              //以当前价格开空
              var rsiSuperBuy = _G(coin + "rsiSuperBuy");
              if (rsiSuperBuy == 0) {
                if (OPEN_CROSS_POS_ADD) {
                  //根据均线判断当时头仓是否开大
                  var status = _G(coin + "crossStatus");
                  if (status == 2) {
                    var firstBuyQuantity = _G(coin + "firstBuyQuantity");
                    if (!firstBuyQuantity || firstBuyQuantity == 0) {
                      shortBuy(short_quantity, ex);
                    } else {
                      Log(coin + "当前趋势是跌，加大头仓", "#0000FF");
                      shortBuy(firstBuyQuantity, ex);
                      //降低该方向止盈比例，加快出仓速度，避免站岗
                      _G(coin + "shortProfitRatio", INIT_PROFIT_RATIO + CROSS_PROFIT_STEP);
                    }
                  } else {
                    //不稳定震荡和下跌趋势都开默认仓位
                    shortBuy(short_quantity, ex);
                  }
                } else {
                  shortBuy(short_quantity, ex);
                }
              }
            }
          }
        } else if (shortProfit < 0 && Math.abs(shortProfit)
            >= replenishmentShortRatio * MARGIN_LEVEL * 100) {
          Log(coin + "补空：" + shortProfit + "%");
          var q = checkPriceDifference(PD_SHORT, ex);
          //开启根据保证金止损后
          //如果补仓后，保证金超过一定比例，直接止损
          if (OPEN_POS_BOND_LOSS) {
            var ticker = _C(ex.GetTicker);
            var targetBond = shortPosBond + ticker.Last * q/MARGIN_LEVEL;
            if (targetBond >= POS_BOND_LOSS) {
              if (IS_OPEN_ALL_LOSS) {
                Log(coin + "空单触发直接止损", "#FF0000@");
                shortSell(1, short_quantity, ex,0);
              } else {
                Log(coin + "空单触发部分止损", "#FF0000@");
                shortSell(PART_LOSS_RATIO, short_quantity, ex,0);
              }
              //判断rsi，当前是否属于超买状态，是就不下空单
              checkShortRsi(ex);
              return;
            }
          }
          shortBuy(q, ex);
          updateProfit(ex);
        }
      }
    } else {
      if (!CLOSE_BUY) {
        checkShortRsi(ex);
        //以当前价格开空
        var rsiSuperBuy = _G(coin + "rsiSuperBuy");
        if (rsiSuperBuy == 0) {
          if (OPEN_CROSS_POS_ADD) {
            //根据均线判断当时头仓是否开大
            var status = _G(coin + "crossStatus");
            if (status == 2) {
              var firstBuyQuantity = _G(coin + "firstBuyQuantity");
              if (!firstBuyQuantity || firstBuyQuantity == 0) {
                shortBuy(short_quantity, ex);
              } else {
                Log(coin + "当前趋势是跌，加大头仓", "#0000FF");
                shortBuy(firstBuyQuantity, ex);
                //降低该方向止盈比例，加快出仓速度，避免站岗
                _G(coin + "shortProfitRatio", INIT_PROFIT_RATIO + CROSS_PROFIT_STEP);
              }
            } else {
              //不稳定震荡和下跌趋势都开默认仓位
              shortBuy(short_quantity, ex);
            }
          } else {
            shortBuy(short_quantity, ex);
          }
        }
      }
    }
  }
}

function onTick(ex) {
  // if (OPEN_LOCK_POS) {
  //     while (true) {
  //         if (!LOCK_POS_STATUS) {
  //             break;
  //         }
  //         unlockPos();
  //     }
  // }
  var quantity = getQuantity(ex);
  tradeMany(quantity, ex);
  tradeShort(quantity, ex);
  if (!IS_OPEN_SIMULATED_FUNDS) {
    var ret = _C(exchanges[0].GetAccount);
    var available_funds = ret.Balance;
    _G("available_funds", available_funds);
  }
  updateTable();
}

function handleCMD() {
  var cmd = GetCommand();
  if (cmd) {
    Log("cmd:", cmd);
    var arr = cmd.split(":");
    if (arr[0] == "limitPage") {
      LIMIT = arr[1];
    } else if (arr[0] == "nextPage") {
      var countDetail = countDetailLog();
      if (OFFSET + LIMIT < countDetail) {
        OFFSET = OFFSET + LIMIT;
      }
    } else if (arr[0] == "prePage") {
      if (OFFSET != 0) {
        OFFSET = OFFSET - LIMIT;
        if (OFFSET < 0) {
          OFFSET = 0;
        }
      }
    } else if (arr[0] == "reset") {
      OFFSET = 0;
      ORDER_STATUS = false;
      COIN_VALUE = "";
    } else if (arr[0] == "orderBy") {
      ORDER_STATUS = true;
      BOND_VALUE = arr[1];
    } else if (arr[0] == "selectCoin") {
      COIN_VALUE = arr[1];
    } else if (arr[0] == "sellAll") {
      Log("一键平仓");
      for (var i = 0; i < exchanges.length; i++) {
        var pos = getPos(exchanges[i]);
        var quantity = getQuantity(exchanges[i]);
        if (pos) {
          manySell(1, quantity, exchanges[i],0);
          shortSell(1, quantity, exchanges[i],0);
        }
      }
      STOP_ROBOT_STATUS = true;
    } else if (arr[0] == "closeBuy") {
      Log("止盈后不再下单");
      CLOSE_BUY = true;
    } else if (arr[0] == "openBuy") {
      Log("开始下单");
      CLOSE_BUY = false;
    }
  }
}

function initData(ex) {
  // 开合约
  var exName = ex.GetName();
  var coin = ex.GetCurrency();
  // 切换OKEX V5模拟盘
  if (IS_SIMULATE && exName == "Futures_OKCoin") {
    ex.IO("simulate", true)
  }
  ex.SetContractType("swap");
  ex.SetMarginLevel(MARGIN_LEVEL);
  //ex.IO("trade_super_margin");

  if (IS_RESET) {

    _G(coin + "maxShortLostProfit", 0);
    _G(coin + "maxManyLostProfit", 0);

    _G(coin + "shortStatus", 0);
    _G(coin + "manyStatus", 0);


    _G(coin + "manyProfitRatio", INIT_PROFIT_RATIO);
    _G(coin + "manyProfitRatioCount", 0);
    _G(coin + "manyPosBond", 0);
    _G(coin + "manyProfit", 0);
    _G(coin + "manyPosBondRatio", 0);
    _G(coin + "replenishmentManyRatio", INIT_REPLENISHMENT_RATIO);
    _G(coin + "replenishmentManyCount", 0);

    _G(coin + "manyGreedyProfitRatioDown", 0);
    _G(coin + "manyGreedyProfitRatioUp", 0);
    _G(coin + "manyGreedyStatus", 0);

    _G(coin + "manyPrice", 0);
    _G(coin + "manyPosNum", 0);

    _G(coin + "shortProfitRatio", INIT_PROFIT_RATIO);
    _G(coin + "shortProfitRatioCount", 0);
    _G(coin + "shortPosBond", 0);
    _G(coin + "shortProfit", 0);
    _G(coin + "shortPosBondRatio", 0);
    _G(coin + "replenishmentShortRatio", INIT_REPLENISHMENT_RATIO);
    _G(coin + "replenishmentShortCount", 0);

    _G(coin + "shortGreedyProfitRatioDown", 0);
    _G(coin + "shortGreedyProfitRatioUp", 0);
    _G(coin + "shortGreedyStatus", 0);

    _G(coin + "shortPrice", 0);
    _G(coin + "shortPosNum", 0);

    _G(coin + "crossStatus", 0);


  }
  //初始化当前币种k线交叉趋势
  getCross(ex);
  //更新价格精度
  updatePricePrecision(ex);
  //更新数量精度
  var amountPrecision = 0;
  var minQuantity = parseFloat(getMinQuantity(ex));
  var b = minQuantity.toString();
  if (b.indexOf(".") != -1) {
    var c = b.split(".");
    amountPrecision = c[1].length;
  }
  _G(coin + "amountPrecision", amountPrecision);
  ex.SetPrecision(_G(coin + "pricePrecision"), amountPrecision);
  Log("设置" + coin + "精度", _G(coin + "pricePrecision"), amountPrecision);
}


function main() {
  STOP_ROBOT_STATUS = false;
  CLOSE_BUY = false;

  if (IS_RESET) {
    _G(null);
    LogReset(1);
    LogProfitReset();
    LogVacuum();
    _G("startTime", Unix());

    if (IS_OPEN_SIMULATED_FUNDS) {
      _G("simulatedEq", INIT_SIMULATED_FUNDS);
    }
    if (!IS_HUICHE) {
      var sql = "DROP TABLE IF EXISTS DETAIL_TRANSACTION_RECORD;";
      DBExec(sql);
      //记录收益详细记录
      //币种，方向，起始时间，结束时间，起始下单价格，最终下单价格，持仓均价，成交时标记价格，波动率，仓位保证金，收益/%
      var strSql = [
        "CREATE TABLE DETAIL_TRANSACTION_RECORD(",
        "COIN TEXT NOT NULL,",
        "DIRECTION TEXT NOT NULL,",
        "STARTTIME TEXT NOT NULL,",
        "ENDTIME TEXT NOT NULL,",
        "STARTPRICE REAL NOT NULL,",
        "ENDPRICE REAL NOT NULL,",
        "AVERAGEPRICE REAL NOT NULL,",
        "CLOSEPOSPRICE REAL NOT NULL,",
        "MAXSHORTLOSTPROFIT TEXT NOT NULL,",
        "VOLATILITY TEXT NOT NULL,",
        "BOND REAL NOT NULL,",
        "PROFIT REAL NOT NULL)"
      ].join("");
      DBExec(strSql);
    }
    Log("重置所有数据", "#FF0000");
  }

  //设置k线周期
  if (K_LINE_PERIOD == 0) {
    PERIOD = PERIOD_M1;
  } else if (K_LINE_PERIOD == 1) {
    PERIOD = PERIOD_M5;
  } else if (K_LINE_PERIOD == 2) {
    PERIOD = PERIOD_M15;
  } else if (K_LINE_PERIOD == 3) {
    PERIOD = PERIOD_M30;
  } else if (K_LINE_PERIOD == 4) {
    PERIOD = PERIOD_H1;
    PERIOD_TYPE = 1;
  } else if (K_LINE_PERIOD == 5) {
    PERIOD = PERIOD_D1;
    PERIOD_TYPE = 2;
  }

  //多交易所
  for (var i = 0; i < exchanges.length; i++) {
    initData(exchanges[i]);
  }

  //总金额
  var currTotalEq = getTotalEquity();
  if (totalEq == -1) {
    var recoverTotalEq = _G("totalEq");
    if (!recoverTotalEq) {
      if (currTotalEq) {
        totalEq = currTotalEq;
        _G("totalEq", currTotalEq);
      } else {
        throw "获取初始权益失败"
      }
    } else {
      totalEq = recoverTotalEq
    }
    _G("available_funds", totalEq);
  }
  //初始化根据保证金止损的阈值
  if (COMPOUND_INTEREST) {
    POS_BOND_LOSS = currTotalEq * POS_BOND_LOSS_RATIO;
  } else {
    POS_BOND_LOSS = totalEq * POS_BOND_LOSS_RATIO;
  }
  Log(totalEq);

  while (true) {
    //记录程序运行时间
    updateRunTime();
    for (var i = 0; i < exchanges.length; i++) {
      //定时取K线数据判断趋势
      scheduledTaskCross(exchanges[i]);
      onTick(exchanges[i]);
    }
    //非模拟资金自动划转
    if (!IS_OPEN_SIMULATED_FUNDS && !IS_HUICHE && !IS_SIMULATE && OPRN_FUTURES_TRANSFER) {
      var available_funds = _G("available_funds");
      var eq = available_funds - totalEq;
      if (eq >= FUTURES_TRANSFER_THRESHOLD) {
        usdtTransfer("USDT",eq,2);
      }
    }
    // getLine();
    // getEMA();
    // lockPos();

    handleCMD();
    //关机
    if (STOP_ROBOT_STATUS) {
      break;
    }
    // Sleep函数主要用于数字货币策略的轮询频率控制，防止访问交易所API接口过于频繁
    Sleep(DELAY)
  }
}
