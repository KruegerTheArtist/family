/** Получить сколько недель и дней прошло с дня Х ( день Х захардкожен) */
export function getCurrentNumberWeeksAndDays(curr = new Date()) {
    let firstDate = new Date("2023-04-25");
    curr.setHours(0);
    curr.setMinutes(0);
    curr.setSeconds(0);
    curr.setMilliseconds(0);
    var weeks = Math.floor((curr as any - (firstDate as any)) / 604800000);
    const days = (curr as any - (firstDate as any)) / (1000 * 60 * 60 * 24);
    let displayDays = (Math.ceil(days) - weeks * 7);
    if (displayDays === 7) {
        weeks += 1;
        displayDays = 0;
    }
    let strDay = displayDays === 0 ? '' : ` и ${displayDays} дн.`;
    return `. ${weeks} нед. ${strDay}`
}