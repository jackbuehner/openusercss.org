import InvalidSessionsTask from './tasks/invalid-sessions'

const tasks = [
  new InvalidSessionsTask(),
]

export default () => {
  return tasks.forEach((task) => task.schedule())
}
