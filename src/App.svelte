<script lang="ts">
  import Counter from './lib/Counter.svelte'
  import Calendar from './lib/Calendar.svelte'
    import { CalendarLocaleValues, type CalendarLocale } from './lib/CalendarTypes';
    import { onMount } from 'svelte';
    import { dateformat, dateToJson, jsonToDate, modifyDate } from './lib/CalendarUtils';
    import { detach_dev, get_all_dirty_from_scope, start_hydrating } from 'svelte/internal';

  let selectedLocale:CalendarLocale="en"
  $:locales=CalendarLocaleValues.reduce( (pairs,v) => {
    pairs.push({k:v,v:new Intl.DisplayNames([selectedLocale], { type: 'language' }).of(v)})
    return pairs
  },[])
  onMount(()=>{
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
      <div class="flexcell" class:selected={isSelected} slot="year" let:year let:isSelected on:keypress on:click={(e)=>{
        const {Y}=dateToJson(new Date(year.start));
        value=modifyDate(new Date(value),{Y}).getTime()
      }}>{year.start.getFullYear()}</div>
    </Calendar>

    <h1>Year/Months</h1>
    <Calendar bind:currentValue={value} locale={selectedLocale} type=yearmonth class="flexgrid3">
      <div class="gridcell" class:selected={isSelected} slot="month" let:month let:isSelected on:keypress on:click={(e)=>{
        const {Y,M}=dateToJson(new Date(month.start));
        value=modifyDate(new Date(value),{Y,M}).getTime()
      }}>{dateformat(month.start,'YYYY/MM')}</div>
    </Calendar>

    <h1>Month/Days</h1>
    <Calendar bind:currentValue={value} locale={selectedLocale} type=monthday class="flexgrid7">
      <div class="gridcell" class:selected={isSelected} slot="dayOfMonthLabel" let:isSelected let:dayOfMonthLabel on:keypress on:click={(e)=>{
        const dd=new Date(value);
      }}>{dayOfMonthLabel.long}</div>
      <div class="gridcell" class:current={isInside} class:outside={!isInside} class:selected={isSelected} slot="dayOfMonth" let:isInside let:dayOfMonth let:isSelected on:keypress on:click={(e)=>{
        const {Y,M,D}=dateToJson(new Date(dayOfMonth.start));
        value=modifyDate(new Date(value),{Y,M,D}).getTime()
      }}>{dateformat(dayOfMonth.start,'YYYY/MM/DD')}</div>
    </Calendar>

    <h1>Week/Days</h1>
    <Calendar bind:currentValue={value} locale={selectedLocale} type=weekday class="flexgrid-transposed7">
      <div class="gridcell" class:selected={isSelected} slot="dayOfWeekLabel" let:dayOfWeek let:isSelected>{dateformat(dayOfWeek.start,'DD/MM')}</div>
      <div class="gridcell" class:selected={isSelected} slot="dayOfWeek" let:dayOfWeek let:isSelected>{dayOfWeek.start.toLocaleDateString(selectedLocale,{"weekday":"long"})}</div>
      <div class="gridcell" class:selected={isSelected} slot="dayOfWeekHour" let:dayOfWeek let:dayOfWeekHour let:isSelected on:keypress on:click={(e)=>{
        const {Y,M,D,H}=dateToJson(new Date(dayOfWeekHour.start));
        value=modifyDate(new Date(value),{Y,M,D,H}).getTime()
      }}>{dateformat(dayOfWeekHour.start,'HH24')}<sup>{dateformat(dayOfWeekHour.start,'MI')}</sup></div>
    </Calendar>

    <h1>Day/Hours</h1>
    <Calendar bind:currentValue={value} locale={selectedLocale} type=dayhour class="flexlist">
      <div class=flexcell slot="dayHour" class:selected={isSelected} let:dayHour let:isSelected on:keypress on:click={(e)=>{
        const {Y,M,D,H,MI}=dateToJson(new Date(dayHour.start));
        value=modifyDate(new Date(value),{Y,M,D,H,MI}).getTime()
      }}>{dateformat(dayHour.start,'HH24')}<sup>{dateformat(dayHour.start,'MI')}</sup></div>
    </Calendar>

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