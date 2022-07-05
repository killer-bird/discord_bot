interface ITimerConfig  {
    [id:string]: NodeJS.Timer
}
interface IDelays {
    [id:string]: number
}

export function onlineTimer(callback: Function, delay: number) {

    const timeoutId = {} as ITimerConfig
    const intervalId = {} as ITimerConfig
    const delays = {} as IDelays
    

    function timeout(id:string) {
        delays[id] = delay
        
        timeoutId[id] =setTimeout(() => {
            callback()
            clearInterval(intervalId[id])
            timeout(id)
        }, delays[id]*1000);
        interval(id)
    }


    function interval(id:string) {
        console.log(id)
        intervalId[id]  = setInterval(() => {       
            delays[id]--
            console.log(delays[id])
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