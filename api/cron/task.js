import log from 'chalk-console'
import {scheduleJob,} from 'node-schedule'
import moment from 'moment'
import {parseExpression,} from 'cron-parser'
import fetch from 'node-fetch'

const formatDate = (date) => {
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

const strDate = (date) => JSON.stringify(date).replace(/"/g, '')

export default class Task {
  schedule () {
    const iterator = parseExpression(this.cron, {
      'iterator': false,
    })
    const nextIteration = iterator.next()
    const nextRun = strDate(nextIteration)
    const zerothRun = strDate(iterator.next())

    log.info([
      `Scheduling task ${this.name} (${this.cron})`,
      `First occurrence at: ${nextRun}`,
      `First occurrence in: about ${moment(nextRun).to(moment(), true)}`,
      `Interval: ${moment(zerothRun).diff(nextRun, 'seconds')} seconds`,
    ].join('\n\t'))

    scheduleJob(this.cron, async (date) => {
      log.info([
        `Job ${this.name} is running`,
        `Date: ${formatDate()}`,
        `Difference: ${moment().diff(date, 'seconds')} seconds`,
      ].join('\n\t'))

      try {
        await this.run()
      } catch (error) {
        log.error(`Job ${this.name} ran into an error:\n${error.stack}`)
      }

      if (this.ping) {
        await fetch(this.ping)
        log.info(`Job ${this.name} has ping URL, pinged`)
      }

      log.info(`Job ${this.name} completed in ${moment().diff(date, 'ms')} ms`)
    })
  }
}
