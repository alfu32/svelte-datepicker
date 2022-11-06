<script lang=ts>
    import type { CalendarType } from "./CalendarTypes";
    import {createEventDispatcher} from 'svelte'
    import { dateformat } from "./CalendarUtils";
    let emit=createEventDispatcher();

    export let type:CalendarType="monthday"
    export let initialValue:number=Date.now();
    
</script>

<div>
    initialValue : {dateformat(initialValue,`YYYY-MM-DD'T'HH24:MI:SS.MLLI TZSTZH:TZM`)}
</div>
<div>
    type : {type}
</div>    
{#if type=="years"}
    <div>{dateformat(initialValue,'YYYY')}</div>
{:else if type=="yearmonth"}
<div>{dateformat(initialValue,'YYYY-MM')}</div>
{:else if type=="monthday"}
<div>{dateformat(initialValue,'YYYY-MM-DD')}</div>
{:else if type=="weekday"}
<div>{dateformat(initialValue,'YYYY/MM/DD WK WD')}</div>
{:else if type=="dayhour"}
<div>{dateformat(initialValue,'YYYY-MM-DD HH24')}</div>
{:else if type=="hourminute"}
<div>{dateformat(initialValue,'YYYY-MM-DD HH24:MI:SS')}</div>
{:else}
<div>{dateformat(initialValue,'YYYY-MM-DD HH24:MI:SS.MCRO')}</div>
{/if}


