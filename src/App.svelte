<script lang="ts">
  import Counter from './lib/Counter.svelte'
  import Calendar from './lib/Calendar.svelte'


</script>

<main>
  <div class="card">
    <Calendar type=years/>
    <Calendar type=yearmonth/>
    <Calendar type=monthday/>
    <Calendar type=weekday/>
    <Calendar type=dayhour/>
    <Calendar type=hourminute/>
    </div>    
  <div class="card">
    <Counter />
  </div>
</main>

<style lang=scss>
</style>