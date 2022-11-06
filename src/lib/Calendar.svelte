<script lang=ts>
    import type { CalendarLocale, CalendarType, Nullable } from "./CalendarTypes";
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
        console.log({type,timeWindow})
    })
    $:timeWindow=(()=>{
        const dt=new Date(currentValue);
        const Y=getTokenValue(currentValue,'YYYY');
        const M=getTokenValue(currentValue,'MM');
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
        console.log({monthWeekStartEnd})
        const W=getTokenValue(currentValue,'WK');
        const D=getTokenValue(currentValue,'DD');
        const H=getTokenValue(currentValue,'HH24');
        const m=getTokenValue(currentValue,'MI');
        const S=getTokenValue(currentValue,'SS');
        switch(type){
            case "years": return Array(100).fill({}).map((v,i) => ({start:new Date(`${Y+i-50}-01-01 00:00:00`),end:new Date(`${Y+i-50}-12-31 23:59:59`)}))
            case "yearmonth": return Array(12).fill({}).map((v,i) => ({start:new Date(`${Y}-${(i+1).toString().padStart(2,"0")}-01 00:00:00`),end:new Date(`${Y}-${(i+1).toString().padStart(2,"0")}-${lastMonthDay(Y,i).toString().padStart(2,"0")} 23:59:59`)}))
            case "monthday": return (Array(monthWeekStartEnd.length).fill({}).map((v,i) => ({start:new Date(monthWeekStartEnd.first.getTime()+i*24*3600*1000),end:new Date(monthWeekStartEnd.first.getTime()+(i+1)*24*3600*1000-1)})))
            case "weekday": return Array(100).fill({}).map((v,i) => ({start:new Date(`${Y+i-50}-01-01 00:00:00`),end:new Date(`${Y+i-50}-12-31 23:59:59`)}))
            case "dayhour": return Array(100).fill({}).map((v,i) => ({start:new Date(`${Y+i-50}-01-01 00:00:00`),end:new Date(`${Y+i-50}-12-31 23:59:59`)}))
            case "hourminute":
            default: return Array(100).fill({}).map((v,i) => ({start:new Date(`${Y+i-50}-01-01 00:00:00`),end:new Date(`${Y+i-50}-12-31 23:59:59`)}))
        }
    })()
</script>

<div>
    currentValue : {dateformat(currentValue,`YYYY-MM-DD'T'HH24:MI:SS.MLLI TZSTZH:TZM`)}
</div>
<div>
    type : {type}
</div>
<div>
    locale : {locale}
</div>  
{#if type=="years"}
    <div>{dateformat(currentValue,'YYYY')}</div>
    <div class="wrapper {clazz}" {style}>
    <slot name="years-series" {timeWindow}>
        {#each timeWindow as interval,ix}
            <slot name="years-cell" {interval}>{dateformat(interval.start,'YYYY')}</slot>
        {/each}
    </slot>
    </div>
{:else if type=="yearmonth"}
<div>{dateformat(currentValue,'YYYY-MM')}</div>
<div class="wrapper {clazz}" {style}>
<slot name="months-series" {timeWindow}>
    {#each timeWindow as interval,ix}
        <slot name="months-cell" {interval}>{dateformat(interval.start,'YYYY/MM')}</slot>
    {/each}
</slot>
</div>
{:else if type=="monthday"}
<div>{dateformat(currentValue,'YYYY-MM-DD')}</div>
<div class="wrapper {clazz}" {style}>
<slot name="days-series" {timeWindow}>
    {#each ["L","M","M","J","V","S","D"] as dayLabel}
        <slot name="daylabel-cell" {dayLabel}>{dayLabel}</slot>
    {/each}
    {#each timeWindow as interval,ix}
        <slot name="days-cell" {interval}>{dateformat(interval.start,'YYYY/MM/DD')}</slot>
    {/each}
</slot>
</div>
{:else if type=="weekday"}
<div>{dateformat(currentValue,`YYYY/MM/DD 'week' WK 'day' WD`)}</div>
{:else if type=="dayhour"}
<div>{dateformat(currentValue,'YYYY-MM-DD HH24')}</div>
{:else if type=="hourminute"}
<div>{dateformat(currentValue,'YYYY-MM-DD HH24:MI:SS')}</div>
{:else}
<div>{dateformat(currentValue,'YYYY-MM-DD HH24:MI:SS.MCRO')}</div>
{/if}


