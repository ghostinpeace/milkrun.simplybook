//console.log('I was summoned from GitHub.')
//console.log(Date.now());

const __TIP_AMOUNTS = [.5, 1, 2];

function getIconUrl(size) {
  return `https://ghostinpeace.github.io/milkrun.simplybook/assets/icons/icon-${size}.png`;
}


const __TipsViewPatch = {
  events: {
    'click @ui.input': 'applyCustomTips',
    'click @ui.customTip': 'addCustomTip',
  },

  applyCustomTips: function (event) {
      var $el = $(event.target);
      if(!$el.data('amount')){
        $el = $el.parent();
      }
      //console.log($el);
      this.triggerMethod('apply:custom:tips', this.model, $el.data('amount'));
  },


  _getAvailableTips() {
    var amount = this.model.get('amount');

    if(this.model.get('rest_amount')){
      amount += this.model.get('rest_amount');
    }

    var selectedRatio = 0;
    var selectedAmount = 0;
    var tipAmount = 0;

    this.model.get('lines').each(function (model) {
      if (model.get('type') === 'tip') {
        tipAmount += model.get('amount');
        amount -= model.get('amount');
        selectedRatio = model.get('tip_ratio'); // relative tip chosen
        selectedAmount = model.get('tip_amount'); // absolute (custom) tip chosen
      }
    });
    let list = [];

    // @TODO: wait wut... if 0€ no tip?
    // how about GIFT CARD? must investigate
    // remove condition if necessary
    if(amount > 0.001){
      list = __TIP_AMOUNTS.map(function (amount) {
        // @todo: isSelected
        var isSelected = Math.abs(amount - selectedAmount) < .0001;
        return {
          amount,
          percent: 1, // must be non-null to prevent template "No tip" (or patch template)
          selected: isSelected
        }
      });
    }

    list = jQuery.merge([{
      amount: 0,
      percent: 0,
      // custom has selectedRatio === 0 but selectedAmount !== 0
      selected: parseInt(selectedRatio) === 0 && selectedAmount === 0
    }], list);

    return list;
  },

  serializeData() {
    var data = Marionette.ItemView.prototype.serializeData.apply(this);
    const availableTips = this._getAvailableTips();

    // lines are entries in the invoice (type: booking, tip, ...)
    let hasTip = false;
    
    for (let model of this.model.get('lines')) {
      if (model.get('type') === 'tip') {
        // currentAmount = model.get('tip_amount');
        console.log('has tip: ', model.get('tip_amount'));
        hasTip = true;
        break;
      }
    };

    let availableTipSelected = false;
    for (let tip of availableTips) {
      if (tip.selected) {
        availableTipSelected = true;
        break;
      }
    }

    return _.extend(data, {
      tips: this._getAvailableTips(),
      is_custom_amount: hasTip && !availableTipSelected,
      tips_error: this.model.getTipsError()
    });
  },
}




console.log('applying patch omega fix 2')
__setIcon(180, true);
__setIcon(192, false);
__setIcon(512, false);
__applyTipsViewPatch();


function __setIcon(size, apple = false) {
  const linkEl = document.createElement('link');
  linkEl.setAttribute('rel', apple ? 'apple-touch-icon' : 'icon');
  linkEl.setAttribute('type', 'image/png');
  linkEl.setAttribute('sizes', 'image/png');
  linkEl.setAttribute('href', __getIconUrl(size));
  document
    .querySelector('title')
    .insertAdjacentElement('afterend', linkEl); 
}

function __applyTipsViewPatch() {
  if (typeof 'require' === 'undefined') {
    console.log("'require' is not defined");
    return;
  }
  require(['plugin/tips/view/TipsView'], TipsView => {

    for (let patchKey in __TipsViewPatch) {
      TipsView.prototype[patchKey] = __TipsViewPatch[patchKey]; 
    }    

    console.log('attaching TipsView to window');
    window.TipsView = TipsView;
  })
}