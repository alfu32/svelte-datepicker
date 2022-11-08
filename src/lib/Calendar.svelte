<script lang=ts>
    // import { type CalendarInterval, type CalendarLocale, type CalendarType, type Nullable } from "./CalendarTypes";
    import {createEventDispatcher, onMount} from 'svelte'
    import type { CalendarLocale, CalendarType, Nullable } from './CalendarTypes';
    import { dateformat, getTokenValue, getLocales, snappingTimeInterval } from "./CalendarUtils";
    import { Interval } from "./Interval";
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
        // console.log({type,timeWindow:timeWindow(type,currentValue)})
    })
    $:timeWindow=getTimeWindow(currentValue)
    function getTimeWindow(currentValue):Interval{
        switch(type){
            case "hourminute":return Interval.hour(new Date(currentValue));
            case "dayhour":return Interval.day(new Date(currentValue));
            case "weekday":return Interval.week(new Date(currentValue),locale);
            case "monthday":{
                let month = Interval.month(new Date(currentValue))
                month.start = Interval.week(month.start,locale).start
                month.end = Interval.week(month.end,locale).end
                return month;
            }
            case "yearmonth":return Interval.year(new Date(currentValue));
            case "centuryyear":return Interval.century(new Date(currentValue));
        }
    }
    $:daylabels=getDayLabels(locale);
    function getDayLabels(locale){
        const dayNames=Interval.week(new Date(currentValue),locale).days().map( d => ({
            long:d.start.toLocaleDateString(locale,{weekday:"long"}),
            short:d.start.toLocaleDateString(locale,{weekday:"short"}),
            narrow:d.start.toLocaleDateString(locale,{weekday:"narrow"}),
        }))
        return dayNames;
    }
</script>
<!--
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
-->
{#if type=="centuryyear"}
    <div class="wrapper {clazz}" {style}>
        <slot name="years" timeWindow={timeWindow}>
            {#each timeWindow.years() as year,ix}
                <slot name="year" {year} isSelected={year.contains(currentValue)}>{dateformat(year.start,'YYYY')}</slot>
            {/each}
        </slot>
    </div>
{:else if type=="yearmonth"}
<div class="wrapper {clazz}" {style}>
    <slot name="months" timeWindow={timeWindow}>
        {#each timeWindow.months() as month,ix}
            <slot name="month" {month} isSelected={month.contains(currentValue)}>{dateformat(month.start,'YYYY/MM')}</slot>
        {/each}
    </slot>
</div>
{:else if type=="monthday"}
<div class="wrapper {clazz}" {style}>
<slot name="daysOfMonth" daysOfMonth={timeWindow.days()} timeWindow={timeWindow}>
    {#each daylabels as dayOfMonthLabel}
        <slot name="dayOfMonthLabel" {dayOfMonthLabel} isSelected={dayOfMonthLabel.long===new Date(currentValue).toLocaleDateString(locale,{weekday:"long"})}>{dayOfMonthLabel.long}</slot>
    {/each}
    {#each timeWindow.days() as dayOfMonth,ix}
        <slot name="dayOfMonth" {dayOfMonth}
            isInside={dayOfMonth.contains(currentValue)}
            isSelected={dayOfMonth.contains(currentValue)}
        >{dateformat(dayOfMonth.start,'YYYY/MM/DD')}</slot>
    {/each}
</slot>
</div>
{:else if type=="weekday"}
<div class="wrapper {clazz}" {style}>
<slot name="daysOfWeek" timeWindow={timeWindow}>
    {#each timeWindow.days() as dayOfWeek,ix}
    <div>
        <slot name="dayOfWeek" {dayOfWeek} isSelected={dayOfWeek.contains(currentValue)}>{dateformat(dayOfWeek.start,'YYYY/MM/DD')}</slot>
        <slot name="dayOfWeekLabel" {dayOfWeek} isSelected={dayOfWeek.start.toLocaleDateString(locale,{weekday:"long"})===new Date(currentValue).toLocaleDateString(locale,{weekday:"long"})}>{dayOfWeek.start.toLocaleDateString(locale,{"weekday":"long"})}</slot>
        {#each dayOfWeek.hours() as dayOfWeekHour,i}<!-- slice(14400000) -->
            <slot name="dayOfWeekHour" {dayOfWeekHour} {dayOfWeek} isSelected={dayOfWeekHour.contains(currentValue)}><div>{dateformat(dayOfWeekHour.start,'MM HH24:MI')}</div></slot>
        {/each}
    </div>
    {/each}
</slot>
</div>
{:else if type=="dayhour"}
<div class="wrapper {clazz}">
    {#each timeWindow.slice(5*60000) as dayHour,ix}
        <slot name="dayHour" {dayHour} isSelected={dayHour.contains(currentValue)}>{dateformat(dayHour.start,"HH24:MI")}</slot>
    {/each}
</div>
{:else if type=="hourminute"}
<div class="wrapper {clazz}">
    {#each timeWindow.minutes() as hourMinute,ix}
        <slot name="hourMinute" {hourMinute} isSelected={hourMinute.contains(currentValue)}>{dateformat(hourMinute.start,"HH24:MI")}</slot>
    {/each}
</div>
{:else}
<div>{dateformat(currentValue,'YYYY-MM-DD HH24:MI:SS.MCRO')}</div>
{/if}


