import { users } from '../users'

interface ITimerConfig  {
    [id:string]: NodeJS.Timer 
}
interface IDelays {
    [id:string]: number
}

export function onlineTimer(callback: Function, delay: number) {

    const timeoutId = {} as ITimerConfig
    const intervalId = {} as ITimerConfig
    

    async function timeout(id:string, ...args: any[]) {
                
        if(!users[id].timeLeftToGift){
            users[id].timeLeftToGift = delay
        }
        timeoutId[id] =setTimeout( async () => {
            await callback(...args) 
            clearInterval(intervalId[id] as NodeJS.Timer)
            users[id].timeLeftToGift = delay
            timeout(id, ...args)
        }, users[id].timeLeftToGift as number *1000);

        interval(id)
    }


    function interval(id:string) {
        intervalId[id]  = setInterval(() => {       
            (users[id]!.timeLeftToGift as number)--
            // console.log(users[id]!.timeLeftToReward)
        }, 1000)
    }


    function clear(id:string) {
        clearTimeout(timeoutId[id])
        clearInterval(intervalId[id])
    }

    return {
        timeout,
        interval,
        clear
    }
}
// export class OnlineTimer {

//     constructor( public callback: Function, public delay: number) {
        
//     }
//     public timeoutId:any 
//     public intervalId:any
//     public newDelay = this.delay

//     timeout(){
//         this.timeoutId = setTimeout(() =>{
//             this.callback()
//             this.newDelay = this.delay
//             clearInterval(this.intervalId)
//             this.timeout()
//         }, this.newDelay * 1000);
//         this.interval()
//     }

    
//     interval(){
//         this.intervalId = setInterval(() =>{
//             this.newDelay--
//             console.log(this.newDelay)
//         }, 1000)
//     }

//     clear(){
//         clearTimeout(this.timeoutId)
//         clearInterval(this.intervalId)
//     }
// }