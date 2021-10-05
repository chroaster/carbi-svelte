<link rel="stylesheet" href="./loaders.min.css" />
<main>
  <div class="loader-inner ball-pulse-sync">
    <div />
    <div />
    <div />
  </div>
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ball-pulse-sync > div {
    background-color: #281e44;
    border-width: 0;
    margin: auto;
  }

  .loader-inner {
    transform: scale(0.5, 0.5);
  }
</style>
