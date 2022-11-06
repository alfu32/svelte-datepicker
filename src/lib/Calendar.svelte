<script lang=ts>
    import { CalendarInterval, type CalendarLocale, type CalendarType, type Nullable } from "./CalendarTypes";
    import {createEventDispatcher, onMount} from 'svelte'
    import { dateformat, getTokenValue, getLocales, snappingTimeInterval } from "./CalendarUtils";
    import { start_hydrating } from "svelte/internal";
    let emit=createEventDispatcher();

    let clazz:Nullable<string>=null
    export { clazz as class }
    export let style:Nullable<string>=null;
    export let type:CalendarType="monthday"
    export let initialValue:number=Date.now();
    export let currentValue:number=initialValue;
    export let locale:CalendarLocale="en"
    onMount(()=>{
        // console.log(getLocales().map( l => `"${l}"`).join("|"))
        // console.log(getLocales([locale,"en"]).map( l => `"${l}"`).join("|"))
        console.log({type,timeWindow:timeWindow(type,currentValue)})
    })
    $: timeWindow2 = CalendarInterval.fromValueAndIntervalType(currentValue,type)
    const timeWindow=(type,cValue=null)=>{
        const dt=new Date(cValue||currentValue);
        const {Y,M,W,D,H,MI,S} = CalendarInterval.getComponents(dt)
        const lastMonthDay = (y,m) =>{
            const first=new Date(`${y}-${(m+1).toString().padStart(2,"0")}-01`)
            const last=new Date(`${y}-${(m+1).toString().padStart(2,"0")}-01`)
            last.setMonth(last.getMonth()+1)
            last.setDate(0);
            return last.getDate()
        }
        const monthWeekStartEnd= ((y,m) => {
            const first=new Date(`${y}-${(m+1).toString().padStart(2,"0")}-01`)
            const last=new Date(`${y}-${(m+1).toString().padStart(2,"0")}-01`)
            last.setMonth(last.getMonth()+1)
            last.setDate(0);
            first.setDate(first.getDate()-first.getDay()+1)
            last.setDate(last.getDate()+7-last.getDay()+1)
            const length=Math.round((last.getTime()-first.getTime())/24/3600/1000)
            return {first,last,length}
        })(Y,M)
        const weekStartEnd= ((y,m,d) => {
            const first=new Date(`${y}-${(m+1).toString().padStart(2,"0")}-${d} 00:00:00`)
            const last=new Date(`${y}-${(m+1).toString().padStart(2,"0")}-${d} 23:59:59`)
            if(first.getDay()===0){
                first.setDate(first.getDate()-6)
            }else{
                first.setDate(first.getDate()-first.getDay()+1)
            }
            last.setDate(first.getDate()+6)
            const length=7
            return {first,last,length}
        })(Y,M,D)
        console.log({monthWeekStartEnd,weekStartEnd})
        switch(type){
            case "centuryyear": return Array(100).fill({}).map((v,i) => ({
                start:new Date(`${Y+i-50}-01-01 00:00:00`),
                end:new Date(`${Y+i-50}-12-31 23:59:59`),
                isSelected:(d:number|Date)=>{
                    const dd=new Date(d);
                    return this.start.getTime()<=dd.getTime() && this.end.getTime()>=dd.getTime()
                }
            }))
            case "yearmonth": return Array(12).fill({}).map((v,i) => ({start:new Date(`${Y}-${(i+1).toString().padStart(2,"0")}-01 00:00:00`),end:new Date(`${Y}-${(i+1).toString().padStart(2,"0")}-${lastMonthDay(Y,i).toString().padStart(2,"0")} 23:59:59`)}))
            case "monthday": return (Array(monthWeekStartEnd.length).fill({}).map((v,i) => ({start:new Date(monthWeekStartEnd.first.getTime()+i*24*3600*1000),end:new Date(monthWeekStartEnd.first.getTime()+(i+1)*24*3600*1000-1)})))
            case "weekday": return Array(7).fill({}).map((v,i) => ({start:new Date(weekStartEnd.first.getTime()+i*24*3600*1000),end:new Date(weekStartEnd.first.getTime()+(i+1)*24*3600*1000-1)}))
            case "dayhour": return Array(24).fill({}).map((v,i) => ({start:new Date(`${Y}-${(M+1).toString().padStart(2,"0")}-${D.toString().padStart(2,"0")} ${i}:00:00`),end:new Date(`${Y}-${(M+1).toString().padStart(2,"0")}-${D.toString().padStart(2,"0")} ${i.toString().padStart(2,"0")}:59:59`)}))
            case "hourminute":
            default: return Array(60).fill({}).map((v,i) => ({start:new Date(`${Y}-${M}-${D} ${H}:${i}:00`),end:new Date(`${Y}-${M}-${D} ${H}:${i}:59`)}))
        }
    }
    function getDay(date:number|Date){
        const dd=new Date(date);
        return dd.toLocaleDateString(locale,{weekday:"long"})
    }
</script>

<div>
    initialValue : {dateformat(initialValue,`YYYY-MM-DD HH24`)}<sup>{dateformat(initialValue,`MI:SS.MLLI`)}</sup>{dateformat(initialValue,`TZSTZH:TZM`)}
</div>
<div>
    currentValue : {dateformat(currentValue,`YYYY-MM-DD'T'HH24:MI:SS.MLLI TZSTZH:TZM`)}
</div>
<div>
    type : {type}
</div>
<div>
    locale : {locale}
</div>  
{#if type=="centuryyear"}
    <div>{dateformat(currentValue,'YYYY')}</div>
    <div class="wrapper {clazz}" {style}>
    <slot name="years-series" timeWindow={timeWindow2.divideInto("year")}>
        {#each timeWindow(type,currentValue) as interval,ix}
            <slot name="years-cell" {interval}>{dateformat(interval.start,'YYYY')}</slot>
        {/each}
    </slot>
    </div>
{:else if type=="yearmonth"}
<div>{dateformat(currentValue,'YYYY-MM')}</div>
<div class="wrapper {clazz}" {style}>
<slot name="months-series" timeWindow={timeWindow}>
    {#each timeWindow(type,currentValue) as interval,ix}
        <slot name="months-cell" {interval}>{dateformat(interval.start,'YYYY/MM')}</slot>
    {/each}
</slot>
</div>
{:else if type=="monthday"}
<div>{dateformat(currentValue,'YYYY-MM-DD')}</div>
<div class="wrapper {clazz}" {style}>
<slot name="days-series" timeWindow={timeWindow}>
    {#each ["L","M","M","J","V","S","D"] as dayLabel}
        <slot name="daylabel-cell" {dayLabel}>{dayLabel}</slot>
    {/each}
    {#each timeWindow(type,currentValue) as interval,ix}
        <slot name="days-cell" {interval}>{dateformat(interval.start,'YYYY/MM/DD')}</slot>
    {/each}
</slot>
</div>
{:else if type=="weekday"}
<div>{dateformat(currentValue,`YYYY/MM/DD 'week' WK 'day' WD`)}</div>
<div class="wrapper {clazz}" {style}>
<slot name="days-series" timeWindow={timeWindow}>
    {#each timeWindow(type,currentValue) as interval,ix}
    <div>
        <slot name="daylabel-cell" {interval} dayLabel={getDay(interval.start)}>{getDay(interval.start)}</slot>
        <slot name="weekdays-cell" {interval}>{dateformat(interval.start,'YYYY/MM/DD')}</slot>
        {#each timeWindow("dayhour",interval.start) as hour,i}
            <slot name="dayhour-cell" {hour} {interval}><div>{dateformat(hour.start,'MM HH24:MI')}</div></slot>
        {/each}
    </div>
    {/each}
</slot>
</div>
{:else if type=="dayhour"}
<div>{dateformat(currentValue,'YYYY-MM-DD HH24')}</div>
{:else if type=="hourminute"}
<div>{dateformat(currentValue,'YYYY-MM-DD HH24:MI:SS')}</div>
{:else}
<div>{dateformat(currentValue,'YYYY-MM-DD HH24:MI:SS.MCRO')}</div>
{/if}


