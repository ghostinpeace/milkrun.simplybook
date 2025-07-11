//console.log('I was summoned from GitHub.')
//console.log(Date.now());

console.log('applying patch alpha')
setIcon();
setTippingOptions();

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
    // server enforces _availabelTips values between 0 and 15

    TipsView.prototype._availableTips = [5, 10, 15, 12];
    console.log('attaching TipsView to window');
    window.TipsView = TipsView;
  })
}