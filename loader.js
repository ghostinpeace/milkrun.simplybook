__loadPatch();

function __loadPatch() {
  if (!window.__patchLoaded) {
    let patchUrl = 'https://ghostinpeace.github.io/milkrun.simplybook/index.js';
    patchUrl += `?date=${Date.now()}`;
    const headEl = document.querySelector('head');
    const scriptEl = document.createElement('script');
    scriptEl.setAttribute('src', patchUrl);
    headEl.appendChild(scriptEl);
    window.__patchLoaded = true;
  } else {
    console.log('patch already loaded');
  }