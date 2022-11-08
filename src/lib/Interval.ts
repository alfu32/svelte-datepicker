import type { CalendarLocale } from "./CalendarTypes";

export class Interval{
    public static millisecond(point:Date){
        const s=new Date(point);
        const e=new Date(s);
        return new Interval(s,e)
    }
    public static second(point:Date){
        const s=new Date(point);
        s.setMilliseconds(0)
        const e=new Date(s);
        e.setMilliseconds(999)
        return new Interval(s,e)
    }
    public static minute(point:Date){
        const s=new Date(point);
        s.setMilliseconds(0)
        s.setSeconds(0)
        const e=new Date(s);
        e.setSeconds(60)
        e.setMilliseconds(-1)
        return new Interval(s,e)
    }
    public static hour(point:Date){
        const s=new Date(point);
        s.setMilliseconds(0)
        s.setSeconds(0)
        s.setMinutes(0)
        const e=new Date(s);
        e.setMinutes(60)
        e.setMilliseconds(-1)
        return new Interval(s,e)
    }
    public static day(point:Date){
        const s=new Date(point);
        s.setMilliseconds(0)
        s.setSeconds(0)
        s.setMinutes(0)
        s.setHours(0)
        const e=new Date(s);
        e.setHours(24)
        e.setMilliseconds(-1)
        return new Interval(s,e)
    }
    public static week(point:Date,locale:CalendarLocale){
        const s=new Date(point);
        s.setMilliseconds(0)
        s.setSeconds(0)
        s.setMinutes(0)
        s.setHours(0)
        const dayOrdModifier=(()=>{
            if(["en","uk"].indexOf(locale)>-1){
                return 0
            } else {
                return 1
            }
        })()
        s.setDate(s.getDate()-s.getDay()+dayOrdModifier)
        const e=new Date(s);
        e.setHours(24)
        e.setDate(s.getDate()+7)
        e.setMilliseconds(-1)
        return new Interval(s,e)
    }
    public static month(point:Date){
        const s=new Date(point);
        s.setMilliseconds(0)
        s.setSeconds(0)
        s.setMinutes(0)
        s.setHours(0)
        s.setDate(1)
        const e=new Date(s);
        e.setMonth(e.getMonth()+1)
        e.setMilliseconds(-1)
        return new Interval(s,e)
    }
    public static quarter(point:Date){
        const s=new Date(point);
        s.setMilliseconds(0)
        s.setSeconds(0)
        s.setMinutes(0)
        s.setHours(0)
        s.setDate(1)
        s.setMonth(Math.floor(s.getMonth()/3)*3)
        const e=new Date(s);
        e.setMonth(e.getMonth()+3)
        e.setMilliseconds(-1)
        return new Interval(s,e)
    }
    public static year(point:Date){
        const s=new Date(`${point.getFullYear()}-01-01 00:00:00.000`);
        const e=new Date(s);
        e.setMonth(12)
        e.setMilliseconds(-1)
        return new Interval(s,e)
    }
    public static decade(point:Date){
        const s=new Date(`${Math.floor(point.getFullYear()/10)*10}-01-01 00:00:00.000`);
        const e=new Date(`${Math.floor(point.getFullYear()/10+1)*10}-01-01 00:00:00.000`);
        e.setMilliseconds(-1)
        return new Interval(s,e)
    }
    public static century(point:Date){
        const s=new Date(`${Math.floor(point.getFullYear()/100)*100}-01-01 00:00:00.000`);
        const e=new Date(`${Math.floor(point.getFullYear()/100+1)*100}-01-01 00:00:00.000`);
        e.setMilliseconds(-1)
        return new Interval(s,e)
    }
    public constructor(
        public start:Date,
        public end:Date,
    ){}
    public position(date:Date|null|number){
        const d=new Date(date)
        return d.getTime()<this.start.getTime()?-1:d.getTime()>this.end.getTime()?1:0
    }
    public contains(date:Date|number):boolean{
        return this.position(date)===0
    }
    public lengthMilliseconds(){return Math.floor((this.end.getTime()-this.start.getTime()))}
    public lengthSeconds(){return Math.floor((this.end.getTime()-this.start.getTime())/1000)}
    public lengthMinutes(){return Math.floor((this.end.getTime()-this.start.getTime())/60/1000)}
    public lengthHours(){return Math.floor((this.end.getTime()-this.start.getTime())/3600/1000)}
    public lengthDays(){return Math.floor((this.end.getTime()-this.start.getTime())/24/3600/1000)}
    public lengthWeeks(){return Math.floor((this.end.getTime()-this.start.getTime())/7/24/3600/1000)}
    public lengthMonths(){return Math.floor(this.end.getFullYear()*12+this.end.getMonth()-this.start.getFullYear()*12-this.start.getMonth())}
    public lengthQuarters(){return Math.floor(this.lengthMonths()/3)}
    public lengthYears(){return Math.floor(this.end.getFullYear()-this.start.getFullYear())}
    public lengthDecades(){return Math.floor((this.end.getFullYear()-this.start.getFullYear())/10)}
    public lengthCenturies(){return Math.floor((this.end.getFullYear()-this.start.getFullYear())/100)}

    public *eachMillisecond(){
        const len=this.lengthMilliseconds()
        const start=new Date(this.start);
        const end=new Date(this.end);
        for (let i = 0; i < len; i++) {
            const crt=new Date(start); crt.setMilliseconds(i+start.getMilliseconds())
            yield Interval.millisecond(crt);
        }
        if(len>0)yield Interval.millisecond(end);
    }
    public *eachSecond(){
        const len=this.lengthSeconds()
        const start=new Date(this.start);
        const end=new Date(this.end);
        yield Interval.second(start);
        for (let i = 1; i < len; i++) {
            const crt=new Date(start); crt.setSeconds(i+start.getSeconds())
            yield Interval.second(crt);
        }
        if(len>0)yield Interval.second(end);
    }
    public *eachMinute(){
        const len=this.lengthMinutes()
        const start=new Date(this.start);
        const end=new Date(this.end);
        yield Interval.minute(start);
        for (let i = 1; i < len; i++) {
            const crt=new Date(start); crt.setMinutes(i+start.getMinutes())
            yield Interval.minute(crt);
        }
        if(len>0)yield Interval.minute(end);
    }
    public *eachHour(){
        const len=this.lengthHours()
        const start=new Date(this.start);
        const end=new Date(this.end);
        yield Interval.hour(start);
        for (let i = 1; i < len; i++) {
            const crt=new Date(start); crt.setHours(i+start.getHours())
            yield Interval.hour(crt);
        }
        if(len>0)yield Interval.hour(end);
    }
    public *eachDay(){
        const len=this.lengthDays()
        const start=new Date(this.start);
        const end=new Date(this.end);
        yield Interval.day(start);
        for (let i = 1; i < len; i++) {
            const crt=new Date(start); crt.setDate(i+start.getDate())
            yield Interval.day(crt);
        }
        if(len>0)yield Interval.day(end);
    }
    public *eachWeek(locale:CalendarLocale){
        const start=Interval.week(this.start,locale).start;
        const end=Interval.week(this.end,locale).end;
        const len=new Interval(start,end).lengthWeeks()
        yield Interval.week(start,locale);
        for (let i = 1; i < len; i++) {
            const crt=new Date(start); crt.setDate(7*i+start.getDate())
            yield Interval.week(crt,locale);
        }
        if(len>0)yield Interval.week(end,locale);
    }
    public *eachMonth(){
        const len=this.lengthMonths()
        //console.log({scope:"*eachMonth",data:{len}})
        const start=new Date(this.start);
        const end=new Date(this.end);
        yield Interval.month(start);
        for (let i = 1; i < len; i++) {
            const crt=new Date(start); crt.setMonth(i+start.getMonth())
            yield Interval.month(crt);
        }
        if(len>0)yield Interval.month(end);
    }
    public *eachQuarter(){
        const len=this.lengthQuarters()
        //console.log({scope:"*eachQuarter",data:{len}})
        const start=new Date(this.start);
        const end=new Date(this.end);
        yield Interval.quarter(start);
        for (let i = 1; i < len; i++) {
            const crt=new Date(start); crt.setMonth(3*i+start.getMonth())
            yield Interval.quarter(crt);
        }
        if(len>0)yield Interval.quarter(end);
    }
    public *eachYear(){
        const len=this.lengthYears()
        //console.log({scope:"*eachQuarter",data:{len}})
        const start=new Date(this.start);
        const end=new Date(this.end);
        yield Interval.year(start);
        for (let i = 1; i < len; i++) {
            const crt=new Date(start); crt.setFullYear(i+start.getFullYear())
            yield Interval.year(crt);
        }
        if(len>0)yield Interval.year(end);
    }
    public *eachDecade(){
        const len=this.lengthDecades()
        //console.log({scope:"*eachDecade",data:{len}})
        const start=new Date(this.start);
        const end=new Date(this.end);
        yield Interval.decade(start);
        for (let i = 1; i < len; i++) {
            const crt=new Date(start); crt.setFullYear(10*i+start.getFullYear())
            yield Interval.decade(crt);
        }
        if(len>0)yield Interval.decade(end);
    }
    public *eachCentury(){
        const len=this.lengthCenturies()
        console.log({scope:"*eachCentury",data:{len}})
        const start=new Date(this.start);
        const end=new Date(this.end);
        yield Interval.century(start);
        for (let i = 1; i < len; i++) {
            const crt=new Date(start); crt.setFullYear(100*i+start.getFullYear())
            yield Interval.century(crt);
        }
        if(len>0)yield Interval.century(end);
    }
    public *each(milliseconds:number){
        const start=new Date(this.start);
        const end=new Date(this.end);
        const len=Math.floor(1+(end.getTime()-start.getTime())/milliseconds)
        for (let i = 0; i <= len; i++) {
            const crt=new Date(start.getTime()+i*milliseconds);
            const next = new Date(start.getTime()+(i+1)*milliseconds-1);
            yield new Interval(crt,next);
        }
    }
    public eachToArray(gen:Generator<Interval, void, unknown>):Interval[]{
        const vals = []
        for(let v of gen)vals.push(v)
        return vals
    }
    public slice(milliseconds:number):Interval[]{ return this.eachToArray(this.each(milliseconds)) }
    public milliseconds():Interval[]{ return this.eachToArray(this.eachMillisecond()) }
    public seconds():Interval[]{ return this.eachToArray(this.eachSecond()) }
    public minutes():Interval[]{ return this.eachToArray(this.eachMinute()) }
    public hours():Interval[]{ return this.eachToArray(this.eachHour()) }
    public days():Interval[]{ return this.eachToArray(this.eachDay()) }
    public weeks(locale:CalendarLocale):Interval[]{ return this.eachToArray(this.eachWeek(locale)) }
    public months():Interval[]{ return this.eachToArray(this.eachMonth()) }
    public quarters():Interval[]{ return this.eachToArray(this.eachQuarter()) }
    public years():Interval[]{ return this.eachToArray(this.eachYear()) }
    public decades():Interval[]{ return this.eachToArray(this.eachDecade()) }
    public centuries():Interval[]{ return this.eachToArray(this.eachCentury()) }
}
function test(){
    const locale:CalendarLocale = "de"
    const secondInterval = Interval.second(new Date())
    console.log({test:"Interval.second",secondInterval,millis:secondInterval.milliseconds().map(i => ({
        a:i.start.getTime()-secondInterval.start.getTime(),
        b:i.end.getTime()-secondInterval.start.getTime(),
    })),seconds:secondInterval.seconds()})
    /// for(let millisecond of secondInterval.eachMillisecond()){
    ///     console.log({test:"Interval.second.eachMillisecond",millisecond})
    /// }
    /// for(let second of secondInterval.eachSecond()){
    ///     console.log({test:"Interval.second.eachSecond",second})
    /// }

    const minuteInterval = Interval.minute(new Date())
    console.log({test:"Interval.minute",minuteInterval,seconds:minuteInterval.seconds(),minutes:minuteInterval.minutes()})
    /// for(let second of minuteInterval.eachSecond()){
    ///     console.log({test:"Interval.minute.eachSecond",second})
    /// }
    /// for(let minute of minuteInterval.eachMinute()){
    ///     console.log({test:"Interval.minute.eachMinute",minute})
    /// }

    const hourInterval = Interval.hour(new Date())
    console.log({test:"Interval.hour",hourInterval,minutes:hourInterval.minutes(),hours:hourInterval.hours()})
    /// for(let minute of hourInterval.eachMinute()){
    ///     console.log({test:"Interval.hour.eachMinute",minute})
    /// }
    /// for(let hour of hourInterval.eachHour()){
    ///     console.log({test:"Interval.hour.eachHour",hour})
    /// }

    const dayInterval = Interval.day(new Date())
    console.log({test:"Interval.day",dayInterval,hours:dayInterval.hours(),days:dayInterval.days()})
    /// for(let hour of dayInterval.eachHour()){
    ///     console.log({test:"Interval.day.eachHour",hour})
    /// }
    /// for(let day of dayInterval.eachDay()){
    ///     console.log({test:"Interval.day.eachDay",day})
    /// }

    const weekInterval = Interval.week(new Date(),locale)
    console.log({test:"Interval.week",weekInterval,days:weekInterval.days(),weeks:weekInterval.weeks(locale)})
    /// for(let day of weekInterval.eachDay()){
    ///     console.log({test:"Interval.weekInterval.eachDay",day})
    /// }
    /// for(let week of weekInterval.eachWeek()){
    ///     console.log({test:"Interval.weekInterval.eachWeek",week})
    /// }

    const monthInterval = Interval.month(new Date())
    console.log({test:"Interval.month",monthInterval,days:monthInterval.days(),weeks:monthInterval.weeks(locale)})
    /// for(let day of monthInterval.eachDay()){
    ///     console.log({test:"Interval.monthInterval.eachDay",day})
    /// }
    /// for(let week of monthInterval.eachWeek()){
    ///     console.log({test:"Interval.monthInterval.eachWeek",week})
    /// }
    for(let month of monthInterval.eachMonth()){
        console.log({test:"Interval.monthInterval.eachMonth",month,weeks:monthInterval.weeks(locale),months:monthInterval.months()})
    }

    const quarterInterval = Interval.quarter(new Date())
    console.log({test:"Interval.quarter",quarterInterval,weeks:quarterInterval.weeks(locale),months:quarterInterval.months(),quarters:quarterInterval.quarters()})
    /// for(let week of quarterInterval.eachWeek()){
    ///     console.log({test:"Interval.quarter.eachWeek",week})
    /// }
    /// for(let month of quarterInterval.eachMonth()){
    ///     console.log({test:"Interval.quarter.eachMonth",month})
    /// }
    for(let quarter of quarterInterval.eachQuarter()){
        console.log({test:"Interval.quarter.eachQuarter",quarter})
    }

    const yearInterval = Interval.year(new Date())
    console.log({test:"Interval.year",yearInterval,months:yearInterval.months(),quarters:yearInterval.quarters(),years:yearInterval.years()})
    /// for(let week of yearInterval.eachWeek()){
    ///     console.log({test:"Interval.year.eachWeek",week})
    /// }
    /// for(let month of yearInterval.eachMonth()){
    ///     console.log({test:"Interval.year.eachMonth",month})
    /// }
    for(let quarter of yearInterval.eachQuarter()){
        console.log({test:"Interval.year.eachQuarter",quarter})
    }
    for(let year of yearInterval.eachYear()){
        console.log({test:"Interval.year.eachYear",year})
    }

    const decadeInterval = Interval.decade(new Date())
    console.log({test:"Interval.decade",decadeInterval,years:decadeInterval.years(),decades:yearInterval.decades()})
    /// for(let quarter of decadeInterval.eachQuarter()){
    ///     console.log({test:"Interval.decade.eachQuarter",quarter})
    /// }
    /// for(let year of decadeInterval.eachYear()){
    ///     console.log({test:"Interval.decade.eachYear",year})
    /// }
    for(let decade of decadeInterval.eachDecade()){
        console.log({test:"Interval.decade.eachDecade",decade})
    }

    const centuryInterval = Interval.century(new Date())
    console.log({test:"Interval.century",centuryInterval,years:centuryInterval.years(),decades:centuryInterval.decades(),centuries:centuryInterval.centuries()})
    /// for(let year of centuryInterval.eachYear()){
    ///     console.log({test:"Interval.century.eachYear",year})
    /// }
    /// for(let decade of centuryInterval.eachDecade()){
    ///     console.log({test:"Interval.century.eachDecade",decade})
    /// }
    for(let century of centuryInterval.eachCentury()){
        console.log({test:"Interval.century.eachCentury",century})
    }
}
test();