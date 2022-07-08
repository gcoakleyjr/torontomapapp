let elem = document.querySelector('.infinite-scroll-container');
let infScroll = new InfiniteScroll( elem, {
  // options
  path: '.pagination__next',
  append: '.post-infinite',
  history: false,
});

console.log("hi")

// element argument can be a selector string
//   for an individual element
