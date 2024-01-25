/**
 * 将带有过期时间的数据存储在本地存储中
 * @param {string} key - 键名
 * @param {*} value - 值
 * @param {number} expirationMinutes - 过期时间（以分钟为单位），如果为空，则表示永久有效
 */
export function setItemWithExpiration(key, value, expirationMinutes) {
  // 计算过期时间的毫秒数，如果 expirationMinutes 为空，则设为 null 表示永久有效
  const expirationMS = expirationMinutes ? expirationMinutes * 60 * 1000 : null
  // 创建记录对象，包含值和过期时间
  const record = { value: value, expiration: expirationMS ? new Date().getTime() + expirationMS : null }
  // 将记录对象转为 JSON 字符串并存储到本地存储中
  localStorage.setItem(key, JSON.stringify(record))
}

/**
 * 从本地存储中获取带有过期时间的数据
 * @param {string} key - 键名
 * @returns {*} 值，如果数据不存在或已过期，则返回 null
 */
export function getItemWithExpiration(key) {
  const record = JSON.parse(localStorage.getItem(key))
  // 检查记录是否存在，并检查过期时间是否存在以及是否已过期
  if (!record || (record.expiration && new Date().getTime() > record.expiration)) {
    // 数据不存在或已过期
    return null
  }
  return record.value
}
