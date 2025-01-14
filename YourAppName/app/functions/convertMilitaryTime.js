export default function convertMilitaryTime(militaryTime) {
    console.log(militaryTime);
    // split into hours & mins
    let [hours, minutes] = militaryTime.split(':').map(Number);
    // am or pm
    const suffix = hours >= 12 ? 'PM' : 'AM';
    // hours to 12 hr format
    hours = hours % 12 || 12;

    return `${hours}:${minutes.toString().padStart(2, '0')} ${suffix}`;
}