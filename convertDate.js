
export function convertDate(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate()
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear()
    const formattedDate = `${month} ${day}, ${year}`
    return formattedDate
}