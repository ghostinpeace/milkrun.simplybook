define('plugin/tips/view/TipsView',['require','lib/view/ModalRegion','marionette','lib/model/BaseModel','plugin/tips/view/TipsCustomDialogView'],function (require) {
  var ModalRegion = require('lib/view/ModalRegion');
  var Marionette = require('marionette');
  var BaseModel = require('lib/model/BaseModel');
  var TipsCustomDialogView = require('plugin/tips/view/TipsCustomDialogView');

  /**
   * Tips view
   *
   * @class TipsView
   */
  return Marionette.ItemView.extend({

    template: '#tips_view',
    //in percent
    _availableTips: [5,10,15],
    ui: {
      btn: '#sb_tips_apply_btn',
      input: '.sb-tips-item:not(.disabled)',
      customTip: '#add-custom-tip-btn',
    },
    events: {
      'click @ui.input': 'applyTips',
      'click @ui.customTip': 'addCustomTip',
    },
    modelEvents: {
      'error:tips': 'render'
    },

    applyTips: function (event) {
      var $el = $(event.target);
      if(!$el.data('tip')){
        $el = $el.parent();
      }
      //console.log($el);
      this.triggerMethod('apply:tips', this.model, $el.data('tip'));
    },

    addCustomTip: function (event) {
      var _this = this;
      //var $el = $(event.target);
      var tipModel = null;
      this.model.get('lines').each(function (model) {
        if (model.get('type') === 'tip') {
          tipModel = model;
        }
      });
      var tipAmount = 0;
      if(tipModel) {
        tipAmount = tipModel.get('tip_amount');
      }

      if(!tipAmount && tipModel) {
        tipAmount = tipModel.get('amount');
      }

      var model = new BaseModel({
        amount: tipAmount
      });
      var region = new ModalRegion();
      var dialog = new TipsCustomDialogView({
        model: model
      });
      region.show(dialog);

      this.listenTo(dialog, 'confirm', function (){
        _this.triggerMethod('apply:custom:tips', this.model, model.get('amount'));
      });

    },

    serializeData: function () {
      //console.log(this.model);
      var data = Marionette.ItemView.prototype.serializeData.apply(this);
      var isCustomAmount = false;

      // lines are entries in the invoice (type: booking, tip, ...)
      this.model.get('lines').each(function (model) {
        if (model.get('type') === 'tip' && model.get('tip_ratio') === 0 && model.get('tip_amount') > 0) {
          isCustomAmount = true;
        }
      });

      return _.extend(data, {
        tips: this._getAvailableTips(),
        is_custom_amount: isCustomAmount,
        tips_error: this.model.getTipsError()
      });
    },

    _getAvailableTips: function () {
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
          selectedRatio = model.get('tip_ratio'); // relative
          selectedAmount = model.get('tip_amount'); // absolute
        }
      });
      var list = [];
      if(amount > 0.001){
        list = this._availableTips.map(function (tip) {
          var isSelected = parseInt(tip) === parseInt(selectedRatio);
          return {
            amount: isSelected?tipAmount:Math.round(amount * tip / 100 * 100) / 100,
            percent: tip,
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
    }

  });

});
