import { getTokenValue, interval } from "./CalendarUtils";

export type CalendarType = "centurydecade" | "centuryyear" | "yearmonth" | "monthday" | "weekday" | "dayhour" | "hourminute";
export const CalendarTypeValues=["centurydecade" , "centuryyear" , "yearmonth" , "monthday" , "weekday" , "dayhour" , "hourminute"]
export type CalendarIntervalType = "century" | "year" | "quarter" | "month" | "week" | "day" | "hour" | "minute" | "second";
export type CalendarIntervalTypeValues = ["century" , "year" , "quarter" , "month" , "week" , "day" , "hour" , "minute" , "second"];
export type Nullable<T> = T | null
export type Nullish<T> = T | null | undefined | false | 0 | ""
export type CalendarLocale = "af"|"am"|"ar"|"az"|"bg"|"bn"|"bs"|"ca"|"cs"|"da"|"de"|"el"|"en"|"es"|"et"|"fa"|"fi"|"fr"|"gu"|"he"|"hi"|"hr"|"hu"|"id"|"it"|"ja"|"kn"|"ko"|"lt"|"lv"|"ml"|"ro"|"mr"|"ms"|"nb"|"nl"|"no"|"pa"|"pl"|"pt"|"ru"|"sr-Latn"|"sk"|"sl"|"sr"|"sv"|"sw"|"ta"|"te"|"th"|"fil"|"tr"|"uk"|"ur"|"uz"|"vi"|"zh"
export const CalendarLocaleValues:CalendarLocale[] = ["af","am","ar","az","bg","bn","bs","ca","cs","da","de","el","en","es","et","fa","fi","fr","gu","he","hi","hr","hu","id","it","ja","kn","ko","lt","lv","ml","ro","mr","ms","nb","nl","no","pa","pl","pt","ru","sr-Latn","sk","sl","sr","sv","sw","ta","te","th","fil","tr","uk","ur","uz","vi","zh"]


export class CalendarInterval{
    public static monthInterval = (y,m) =>{
        const first=new Date(`${y}-${(m+1).toString().padStart(2,"0")}-01`)
        const last=new Date(`${y}-${(m+1).toString().padStart(2,"0")}-01`)
        last.setMonth(last.getMonth()+1)
        last.setDate(0);
        return {start:first,end:last,length:Math.round((last.getTime()-first.getTime())/24/3600/1000)}
    }
    public static weekInterval= ((y,m,d) => {
        const first=new Date(`${y}-${(m+1).toString().padStart(2,"0")}-${d}`)
        const last=new Date(`${y}-${(m+1).toString().padStart(2,"0")}-${d}`)
        first.setDate(first.getDate()-7-first.getDay()+1)
        last.setDate(last.getDate()-first.getDay()+2)
        last.setSeconds(-1)
        const length=Math.round((last.getTime()-first.getTime())/24/3600/1000)
        return {start:first,end:last,length}
    })
    public static getComponents(currentValue:Date|number){
        return {
            Y: getTokenValue(currentValue,'YYYY'),
            M: getTokenValue(currentValue,'MM'),
            W: getTokenValue(currentValue,'WK'),
            D: getTokenValue(currentValue,'DD'),
            H: getTokenValue(currentValue,'HH24'),
            MI: getTokenValue(currentValue,'MI'),
            S: getTokenValue(currentValue,'SS'),
        }
    }
    public static of(start:Date,end:Date):CalendarInterval{
        return new CalendarInterval(start,end);
    }
    public static fromValueAndIntervalType(currentValue:number|Date,type:CalendarIntervalType|CalendarType):CalendarInterval{
        const dt = new Date(currentValue)
        const {Y,M,W,D,H,MI,S} = CalendarInterval.getComponents(currentValue)
        let intv;
        switch(type){
            case "centuryyear":
            case "century":
                intv = interval(dt.getFullYear(),100)
                return CalendarInterval.of(
                    new Date(`${intv.start}-01-01`),
                    new Date(`${intv.end}-12-31`),
                )
            case "yearmonth":
            case "year":
                return CalendarInterval.of(
                    new Date(`${Y}-01-01`),
                    new Date(`${Y}-12-31`),
                )
            case "monthday":
            case "month":
                intv=CalendarInterval.monthInterval(Y,M)
                return CalendarInterval.of(
                    intv.start,
                    intv.end,
                )
            case "weekday":
            case "week":
                intv=CalendarInterval.weekInterval(Y,M,D)
                return CalendarInterval.of(
                    intv.start,
                    intv.end,
                )
            case "dayhour":
            case "day":
                intv = interval(dt.getTime(),24*3600*1000)
                return CalendarInterval.of(
                    intv.start,
                    intv.end,
                )
            case "hourminute":
            case "hour":
                intv = interval(dt.getTime(),3600*1000)
                return CalendarInterval.of(
                    intv.start,
                    intv.end,
                )
            case "minute":
                intv = interval(dt.getTime(),60*1000)
                return CalendarInterval.of(
                    intv.start,
                    intv.end,
                )
            case "second":
                intv = interval(dt.getTime(),60*1000)
                return CalendarInterval.of(
                    intv.start,
                    intv.end,
                )
        }
    }
    public currentValue:Date
    public start:Date
    public end:Date
    
    public constructor(
        _start:number|Date,
        _end:number|Date,
    ){
        this.start=new Date(_start)
        this.end=new Date(_end)
        this.currentValue=new Date((new Date(this.start).getTime()+new Date(this.end).getTime())>>1)
    }
    public divideInto(division:CalendarIntervalType):CalendarInterval[]{
        const dt=new Date(this.currentValue);
        const {Y,M,W,D,H,MI,S} = CalendarInterval.getComponents(this.currentValue)
        const monthWeekStartEnd = CalendarInterval.monthInterval(Y,M)
        const weekStartEnd = CalendarInterval.weekInterval(Y,M,D)
        console.log({monthWeekStartEnd,weekStartEnd})
        switch(division){
            case "century": return Array(this.length("year")).fill({}).map((v,i) => CalendarInterval.fromValueAndIntervalType(
                new Date(`${Y+i-50}-01-01`),"year")
            );
            case "year": return Array(this.length("month")).fill({})
            .map((v,i) => CalendarInterval.fromValueAndIntervalType(
                new Date(`${Y+i-50}-01-01`),"month")
            )
            case "month": return Array(monthWeekStartEnd.length).fill({})
                .map((v,i) => CalendarInterval.fromValueAndIntervalType(
                    new Date(monthWeekStartEnd.start.getTime()+i*24*3600*1000),"day")
                )
            case "week": return Array(7).fill({})
                .map((v,i) => CalendarInterval.fromValueAndIntervalType(
                    new Date(weekStartEnd.start.getTime()+i*24*3600*1000),"day")
                )
            case "day": return Array(24).fill({})
                .map((v,i) => CalendarInterval.fromValueAndIntervalType(
                    new Date(`${Y}-${M}-${D} ${i.toString().padStart(2,"0")}:00:00`),"hour")
                )
            case "hour":
            default: return Array(100).fill({})
            .map((v,i) => CalendarInterval.of(
                new Date(`${Y+i-50}-01-01 00:00:00`),
                new Date(`${Y+i-50}-12-31 23:59:59`)
                )
            )
        }

    }
    public length(division:CalendarIntervalType){
        const ds=new Date(this.start)
        const de=new Date(this.end)
        switch(division){
            case "century": return Math.floor((de.getFullYear()-ds.getFullYear())/100)+1;
            case "year": return Math.floor((de.getFullYear()-ds.getFullYear()))+1;
            case "month": return Math.floor((de.getFullYear()*12-ds.getFullYear()*12 + de.getMonth() - ds.getMonth() ))+1;
            case "week": return Math.floor((de.getTime()-ds.getTime())/7/24/3600/1000)+1
            case "day": return Math.floor((de.getTime()-ds.getTime())/24/3600/1000)+1
            case "hour":return Math.floor((de.getTime()-ds.getTime())/3600/1000)+1
            case "minute":return Math.floor((de.getTime()-ds.getTime())/60/1000)+1
            case "second":return Math.floor((de.getTime()-ds.getTime())/1000)+1
        }
    }
    public contains(d:number|Date):boolean{
        const dd=new Date(d);
        return new Date(this.start).getTime()<=dd.getTime() && new Date(this.end).getTime()>=dd.getTime()
    }
}
