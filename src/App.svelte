<script lang="ts">
  import Counter from './lib/Counter.svelte'
  import Calendar from './lib/Calendar.svelte'
    import { CalendarLocaleValues, type CalendarLocale } from './lib/CalendarTypes';
    import { onMount } from 'svelte';
    import { dateformat } from './lib/CalendarUtils';
    import { detach_dev, get_all_dirty_from_scope, start_hydrating } from 'svelte/internal';

  let selectedLocale:CalendarLocale="en"
  $:locales=CalendarLocaleValues.reduce( (pairs,v) => {
    pairs.push({k:v,v:new Intl.DisplayNames([selectedLocale], { type: 'language' }).of(v)})
    return pairs
  },[])
  onMount(()=>{
    console.log(locales)
  })
  let value=Date.now()
</script>

<main>
  <div class="card">
    <select bind:value={selectedLocale}>
      {#each locales as locale}
        <option value={locale.k} selected={locale.k==selectedLocale?true:null}>{locale.v}</option>
      {/each}
    </select>
  </div>
  <div class="card">
    <h1>Years</h1>
    <Calendar bind:currentValue={value} locale={selectedLocale} type=centuryyear class="flexlist">
      <div class="flexcell {
        dateformat(interval.start,'YYYY')===dateformat(value,'YYYY')?"selected":""
      }" slot="years-cell" let:interval on:keypress on:click={(e)=>{
        const dd=new Date(value);
        dd.setFullYear(interval.start.getFullYear())
        value=dd.getTime()
      }}>{interval.start.getFullYear()}</div>
    </Calendar>
    <h1>Year/Months</h1>
    <Calendar bind:currentValue={value} locale={selectedLocale} type=yearmonth class="flexgrid3">
      <div class="gridcell {
        dateformat(interval.start,'YYYY-MM')===dateformat(value,'YYYY-MM')?"selected":""
      }" slot="months-cell" let:interval on:keypress on:click={(e)=>{
        const dd=new Date(value);
        dd.setFullYear(interval.start.getFullYear())
        dd.setMonth(interval.start.getMonth())
        value=dd.getTime()
      }}>{dateformat(interval.start,'YYYY/MM')}</div>
    </Calendar>
    <h1>Month/Days</h1>
    <Calendar bind:currentValue={value} locale={selectedLocale} type=monthday class="flexgrid7">
      <div class="gridcell" slot="daylabel-cell" let:dayLabel on:keypress on:click={(e)=>{
        const dd=new Date(value);
      }}>{dayLabel}</div>
      <div class="gridcell {
        dateformat(interval.start,'YYYY-MM')===dateformat(value,'YYYY-MM')?"current":"outside"
      } {
        dateformat(interval.start,'YYYY-MM-DD')===dateformat(value,'YYYY-MM-DD')?"selected":""
      }" slot="days-cell" let:interval on:keypress on:click={(e)=>{
        const dd=new Date(value);
        dd.setFullYear(interval.start.getFullYear())
        dd.setMonth(interval.start.getMonth())
        dd.setDate(interval.start.getDate())
        value=dd.getTime()
      }}>{dateformat(interval.start,'YYYY/MM/DD')}</div>
    </Calendar>
    <h1>Week/Days</h1>
    <Calendar bind:currentValue={value} locale={selectedLocale} type=weekday class="flexgrid-transposed7">
      <div class="gridcell {
        dateformat(interval.start,'YYYY-MM-DD')===dateformat(value,'YYYY-MM-DD')?"selected":""
      }" slot="weekdays-cell" let:interval>{dateformat(interval.start,'DD/MM')}</div>
      <div class="gridcell" slot="daylabel-cell" let:dayLabel>{dayLabel}</div>
      <div class="gridcell {
        dateformat(hour.start,'YYYYMMDD.HH24')===dateformat(value,'YYYYMMDD.HH24')?"selected":""
      }" slot="dayhour-cell" let:hour let:interval on:keypress on:click={((hour)=>(e)=>{
        const dd=new Date(value);
        dd.setFullYear(hour.start.getFullYear())
        dd.setMonth(hour.start.getMonth())
        dd.setDate(hour.start.getDate())
        dd.setHours(hour.start.getHours())
        value=hour.start.getTime()
        value=dd.getTime()
      })(hour)}>{dateformat(hour.start,'HH24')}<sup>{dateformat(hour.start,'MI')}</sup></div>
    </Calendar>
    <h1>Day/Hours</h1>
    <Calendar bind:currentValue={value} locale={selectedLocale} type=dayhour/>
    <h1>Hour/Minute</h1>
    <Calendar bind:currentValue={value} locale={selectedLocale} type=hourminute/>
    </div>    
  <div class="card">
    <Counter />
  </div>
</main>

<style lang=scss>
  :global.selected{
    color:#005;
    background:#EEE;
    text-decoration: underline;
    font-weight: bold;
  }
  :global.flexgrid3{
    display: grid;
    
    grid-template-columns: repeat(3,1fr);
    gap: 10px;
    .gridcell{
      font-size: 16px;
      padding:4px 16px;
      max-width: 100px;
      cursor:pointer;
    }
    .gridcell:hover{
      background-color: #CCC;
    }
  }
  :global.flexgrid7{
    display: grid;
    
    grid-template-columns: repeat(7,1fr);
    gap: 10px;
    .current{
      color:#000;
    }
    .outside{
      color:#777
    }
    .gridcell{
      font-size: 16px;
      padding:4px 16px;
      max-width: 100px;
      cursor:pointer;
    }
    .gridcell:hover{
      background-color: #CCC;
    }
  }
  :global.flexgrid-transposed7{
    display: grid;
    
    grid-template-columns: repeat(7,1fr);
    gap: 10px;
    .current{
      color:#000;
    }
    .outside{
      color:#777
    }
    .gridcell{
      font-size: 16px;
      padding:4px 16px;
      max-width: 100px;
      cursor:pointer;
    }
    .gridcell:hover{
      background-color: #CCC;
    }
  }
  :global.flexlist{
    display:flex;
    align-items: center;
    justify-content: flex-start;
    align-content: space-between;
    flex-wrap: wrap;
    max-height: 200px;
    overflow-y: scroll;
    .flexcell{
      font-size: 16px;
      padding:4px 16px;
      max-width: 100px;
      cursor:pointer;
    }
    .flexcell:hover{
      background-color: #CCC;
    }
  }
</style>