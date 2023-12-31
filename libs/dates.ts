
const getDate = (ms: number) => {
    const date = new Date(ms);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}
const months = ['January','February','March','April','May','June','July','August','September','Octomber','November','December'];
//create a function that takes sql date and covnerts it to a string
export function parseDate(_date: Date){
    const date = new Date(_date);
    const now = new Date();
    if((now.getTime() - date.getTime()) > 1000*3600*24*7){
        return `${date.getDate().toString().padStart(2,'0')} ${months[date.getMonth()]} ${date.getFullYear()!==now.getFullYear() ? date.getFullYear() : ''} - ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;
    }
    const offset = now.getTime() - date.getTime();
    if(offset < 1000*60*60){
        const minutes = Math.floor(offset/(1000*60));
        return `${minutes} minute${minutes != 1 ? 's' : ''} ago`;
    }
    if(offset < 1000*60*60*24){
        const hours = Math.floor(offset/(1000*60*60));
        return `${hours} hour${hours != 1 ? 's' : ''} ago`;
    }
    if(offset < 1000*60*60*24*7){
        const days = Math.floor(offset/(1000*60*60*24));
        return `${days} day${days != 1 ? 's' : ''} ago`;
    }
}

export const formatNumber = (num: number) => {
    if(num < 1000) return num.toString();
    if(num < 1000000) return `${Math.floor(num/1000)}${(Math.floor(num/100))%10!=0 ? `.${(Math.floor(num/100))%10}` : ''}k`;
    return `${Math.floor(num/1000000)}${(Math.floor(num/100000))%10!=0 ? `.${(Math.floor(num/100000))%10}` : ''}m`;
}