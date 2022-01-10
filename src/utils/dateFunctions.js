export function formatDate(date) {
    // Format date
    let formattedDate
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    const postsLifetime = date.getTime()
    const timeNow = Date.now()
    const elapsedTime = timeNow - postsLifetime
    const minute = 60 * 1000
    const hour = 60 * 60 * 1000
    const dayInMs = 24 * 60 * 60 * 1000
    const monthInMs = 30 * 24 * 60 * 60 * 1000

    if (elapsedTime < minute) {
        const seconds = Math.round((elapsedTime / 1000))
        return formattedDate = seconds + ' seconds ago'
    } else if (elapsedTime >= minute && elapsedTime < hour) {
        const minutes = Math.round((elapsedTime / 1000) / 60)
        return formattedDate = minutes + ' minutes ago'
    } else if (elapsedTime > hour && elapsedTime < dayInMs) {
        const hours = Math.round(((elapsedTime / 1000) / 60) / 60)
        return formattedDate = hours + ' hours ago'
    } else if (elapsedTime > dayInMs && elapsedTime < monthInMs) {
        const days = Math.round((((elapsedTime / 1000) / 60) / 60) / 24)
        return formattedDate = days + ' days ago'
    } else {
        return formattedDate = `${year}.${month + 1}.${day}`
    }
}