export default function Calendar(options) {
  if (!(this instanceof Calendar)) {
    return new Calendar(options)
  }
  this.options = options
  this.mouths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  this.today = this.getToday()
  this.currentYear = this.getFullYear()
  this.currentMonth = this.getMonth()
  this.leap()
  return this
}

Calendar.prototype = {
  constructor: Calendar,
  // 闰月
  leap(year) {
    this.currentYear = year || this.currentYear
    if (this.currentYear % 400 === 0 || this.currentYear % 4 === 0) {
      this.mouths[1] = 29
    } else {
      this.mouths[1] = 28
    }
  },
  getDate() {
    return new Date().getDate()
  },
  //周几
  getDay() {
    return new Date().getDay()
  },
  getFullYear() {
    return new Date().getFullYear()
  },
  getMonth() {
    return new Date().getMonth()
  },
  getToday(){
    return `${this.getFullYear()}-${this.getMonth() + 1}-${this.getDate()}`
  },
  // 几月几号周几
  getPosDay(year, month, day = 1) {
    return new Date(year, month, day, 0, 0, 0).getDay()
  },
  nextMonth(month) {
    let nextMonthDays = month + 1
    let isNotNextYear = nextMonthDays < this.mouths.length
    let index = isNotNextYear ? nextMonthDays : 0
    let days = new Array(this.mouths[index] + 1).join('*').split('').map((o, i) => i + 1)
    return {
      isNextYear: !isNotNextYear,
      days,
      index
    }
  },
  prevMonth(month) {
    let prevMonthDays = month - 1
    let isPrevYear = prevMonthDays < 0
    let index = isPrevYear ? 11 : prevMonthDays
    let days = new Array(this.mouths[index] + 1).join('*').split('').map((o, i) => i + 1)
    return {
      isPrevYear,
      days,
      index
    }
  },
  //获取上个与下个月的天数
  getOtherMonth(month) {
    return {
      nextMonthDays: this.nextMonth(month),
      prevMonth: this.prevMonth(month)
    }
  },
  /**
   *  绘制 执行注册的函数
   * @param {*} month 
   * @param {*} year 
   */
  paint(month, year) {
    this.currentYear = year || this.currentYear
    this.currentMonth = month || this.currentMonth
    this.leap()
    let currentDays = this.mouths[this.currentMonth] + 1
    let paint = this.getCalendar(currentDays, this.currentYear, this.currentMonth)
    this.options.callback && this.options.callback(paint)
    return this
  },
  next() {
    let isNotNextYear = this.currentMonth + 1 < this.mouths.length
    this.currentMonth = isNotNextYear ? this.currentMonth + 1 : 0
    if (!isNotNextYear) this.currentYear = this.currentYear + 1
    return this
  },
  prev() {
    let isPrevYear = this.currentMonth - 1 < 0
    this.currentMonth = isPrevYear ? 11 : this.currentMonth - 1
    if (isPrevYear) this.currentYear = this.currentYear - 1
    return this
  },
  toYear(year) {
    this.currentYear = year
    return this
  },
  init() {
    this.currentYear = this.getFullYear()
    this.currentMonth = this.getMonth()
    return this
  },
  meta(data) {
    return this.options && this.options.meta && this.options.meta(data)
  },
  /**
   *  获取日历数据
   * @param {*} currentDays 当前月的天数
   * @param {*} year 当前年
   * @param {*} month 当前月
   */
  getCalendar(currentDays, year, month) {

    let posDay = this.getPosDay(year, month)
    let otherMonth = this.getOtherMonth(this.currentMonth)
    let nextPosDay = this.getPosDay(year, month, currentDays - 1)
    let prevMonthDays = posDay !== 0 ? otherMonth.prevMonth.days.slice(-posDay) : []
    let nextMonthDays = otherMonth.nextMonthDays.days.slice(0, 6 - nextPosDay)

    let prevYear = otherMonth.prevMonth.isPrevYear ? year - 1 : year
    let nextYear = otherMonth.nextMonthDays.isNextYear ? year + 1 : year
    let today = this.getToday()

    let calendarData = []
    // 上个月
    for (let i = 0; i < prevMonthDays.length; i++) {
      let prev = {
        target: 'prev',
        isAction: false,
        isToday: `${prevYear}-${otherMonth.prevMonth.index + 1}-${prevMonthDays[i]}` === today,
        date: new Date(prevYear, otherMonth.prevMonth.index, prevMonthDays[i], 0, 0, 0),
        dateStr: `${prevYear}-${otherMonth.prevMonth.index + 1}-${prevMonthDays[i]}`,
        year: prevYear,
        month: otherMonth.prevMonth.index + 1,
        day: prevMonthDays[i]
      }
      prev.meta = this.meta(prev)
      calendarData.push(prev)
    }
    //当前月
    for (let i = 1; i < currentDays; i++) {
      let current = {
        target: 'current',
        isAction: false,
        isToday: `${year}-${month + 1}-${i}` === today,
        date: new Date(year, month, i, 0, 0, 0),
        dateStr: `${year}-${month + 1}-${i}`,
        year: year,
        month: month + 1,
        day: i
      }
      current.meta = this.meta(current)
      calendarData.push(current)
    }

    // 下个月

    for (let i = 0; i < nextMonthDays.length; i++) {
      let next = {
        target: 'next',
        isAction: false,
        isToday: `${nextYear}-${otherMonth.nextMonthDays.index + 1}-${nextMonthDays[i]}` === today,
        date: new Date(nextYear, otherMonth.nextMonthDays.index, nextMonthDays[i], 0, 0, 0),
        dateStr: `${nextYear}-${otherMonth.nextMonthDays.index + 1}-${nextMonthDays[i]}`,
        year: nextYear,
        month: otherMonth.nextMonthDays.index + 1,
        day: nextMonthDays[i]
      }
      next.meta = this.meta(next)
      calendarData.push(next)
    }
    return calendarData

  },
  year() {
    return this.currentYear
  },
  month() {
    return this.currentMonth + 1
  }

}