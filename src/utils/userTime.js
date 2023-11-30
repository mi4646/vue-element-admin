import { Solar, Lunar } from 'lunar-javascript'

/**
 * 获取一周前日期列表
 * @returns
 */
export function generateLastWeekDates() {
  const dates = []
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const formattedDate = `${year}-${month}-${day}`
    dates.push(formattedDate)
  }

  return dates
}

/**
 * 获取当前时间的时间段（早上、中午、晚上）
 * @returns
 */
export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

/**
 * 随机问候语
 * @returns
 */
export function welcome() {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '开始您一天的工作吧！', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 获取当前日期（阴历）-及农历日期-节气
 * @returns
 */
export function getDayInfo() {
  const solar = Solar.fromDate(new Date())
  const day = solar.toString()
  const week = solar.getWeekInChinese()

  const lunar = Lunar.fromDate(new Date())
  const lunarMonth = lunar.getMonthInChinese()
  const lunarDay = lunar.getDayInChinese()

  const jieqi = lunar.getPrevJieQi().getName()
  const next = lunar.getNextJieQi()
  const nextJieqi = next.getName() + ' ' + next.getSolar().toYmd()

  return `${day} 星期${week}，农历${lunarMonth}${lunarDay}（当前${jieqi}，${nextJieqi} )`
}

/**
 * 获取当前日期的年-月-日-时-分-秒
 * @returns
 */
export function useTime() {
  const lunarDate = Lunar.fromDate(new Date()) // 使用当前日期创建一个Lunar对象

  // 获取农历日期的各个属性
  const month = lunarDate.getMonth()
  const day = lunarDate.getDay()
  const hour = lunarDate.getHour()
  const minute = lunarDate.getMinute()
  const second = lunarDate.getSecond()
  const week = lunarDate.getWeek()

  return { month, day, hour, minute, second, week }
}
