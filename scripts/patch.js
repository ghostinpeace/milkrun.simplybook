//console.log('I was summoned from GitHub.')
//console.log(Date.now());

function setIcon(href) {
  const linkEl = document.createElement('link');
  linkEl.setAttribute('rel', 'icon');
  linkEl.setAttribute('href', href);
  document
    .querySelector('title')
    .insertAdjacentElement('afterend', linkEl); 
}

function setTippingOptions() {
  if (typeof 'require' === 'undefined') {
    console.log("'require' is not defined");
    return;
  }
  require(['plugin/tips/view/TipsView'], TipsView => {
    TipsView.prototype._availableTips = [5, 10, 15, 100];
  })
}