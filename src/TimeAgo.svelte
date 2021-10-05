<script>
  import TimeAgo from "javascript-time-ago";
  import en from "javascript-time-ago/locale/en";
  
  export let startTime;
  
  TimeAgo.addDefaultLocale(en);
  const timeAgoInstance = new TimeAgo('en-US');

  let timeAgo = "";

  const update = setInterval(() => {
    const now = Date.now();
    timeAgo = timeAgoInstance.format(now - (now - startTime), 'round');
  }, 500);
</script>

{timeAgo}
