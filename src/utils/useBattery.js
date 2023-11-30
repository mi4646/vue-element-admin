
export function useBattery() {
  const state = {
    charging: false, // 当前电池是否正在充电
    chargingTime: 10, // 距离充电完毕还需多少秒，如果为0则充电完毕
    dischargingTime: 6600, // 代表距离电池耗电至空且挂起需要多少秒
    level: 95 // 代表电量的放大等级，这个值在 0.0 至 1.0 之间
  }

  state.charging = true

  // 计算电池剩余可用时间
  const calcDischargingTime = (() => {
    const hours = Math.floor(state.dischargingTime / 60)
    const minutes = Math.round(state.dischargingTime % 60)
    return `${hours}小时${minutes}分钟`
  })()

  // 计算电池充满剩余时间
  const calcChargingTime = (() => {
    const hours = Math.floor(state.chargingTime / 60)
    const minutes = Math.round(state.chargingTime % 60)
    return `${hours}小时${minutes}分钟`
  })()

  // 电池状态
  const batteryStatus = (() => {
    if (state.charging && state.level >= 100) {
      return '已充满'
    } else if (state.charging) {
      return '充电中'
    } else {
      return '已断开电源'
    }
  })()

  return { state, calcDischargingTime, calcChargingTime, batteryStatus }
}

