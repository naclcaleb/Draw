(function () {
  'use strict';

  var MaterialSelectfield = function MaterialSelectfield(element) {
    this.element_ = element;
    this.setDefaults_();
    // Initialize instance.
    this.init();
  };
  window['MaterialSelectfield'] = MaterialSelectfield;

  MaterialSelectfield.prototype.CssClasses_ = {
    LABEL: 'mdl-selectfield__label',
    SELECT: 'mdl-selectfield__select',
    SELECTED_BOX: 'mdl-selectfield__box',
    SELECTED_BOX_VALUE: 'mdl-selectfield__box-value',
    LIST_OPTION_BOX: 'mdl-selectfield__list-option-box',
    IS_DIRTY: 'is-dirty',
    IS_FOCUSED: 'is-focused',
    IS_DISABLED: 'is-disabled',
    IS_INVALID: 'is-invalid',
    IS_UPGRADED: 'is-upgraded',
    IS_SELECTED: 'is-selected'
  };

  MaterialSelectfield.prototype.Keycodes_ = {
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32,
    UP_ARROW: 38,
    DOWN_ARROW: 40
  };

  MaterialSelectfield.prototype.setDefaults_ = function () {
    this.options_ = [];
    this.optionsMap_ = {};
    this.optionsArr_ = [];
    this.closing_ = true;
    this.keyDownTimerId_ = null;
    this.observer_ = null;
  };

  MaterialSelectfield.prototype.onFocus_ = function (event) {
    this.closing_ && this.show_(event);
  };

  MaterialSelectfield.prototype.onBlur_ = function (event) {
    !this.closing_ && this.hide_();
  };

  MaterialSelectfield.prototype.fireEventChange_ = function () {
    var evt;

    if (typeof window.Event === 'function') {
      evt = new Event('change', {
        bubbles: true
        ,cancelable: true
      });
    } else if (typeof document.createEvent === 'function') {
      evt = document.createEvent('HTMLEvents');
      evt.initEvent('change', true, true);
    }
    evt && this.select_.dispatchEvent(evt);
  };

  MaterialSelectfield.prototype.onSelected_ = function (event) {    
    if(event.target && event.target.nodeName === 'LI') {
      var option = this.options_[event.target.getAttribute('data-value')];

      if(option.disabled) {
        event.stopPropagation();
        return false;
      }

      this.selectedOptionValue_.textContent = option.textContent;
      option.selected = true;

      //fire event change
      this.fireEventChange_();

      if(option.textContent !== '') {
        this.element_.classList.add(this.CssClasses_.IS_DIRTY);
        var selectedItem = this.listOptionBox_.querySelector('.' + this.CssClasses_.IS_SELECTED);
        selectedItem && selectedItem.classList.remove(this.CssClasses_.IS_SELECTED);
        event.target.classList.add(this.CssClasses_.IS_SELECTED);
      }
      else {
        this.element_.classList.remove(this.CssClasses_.IS_DIRTY);
        var selectedItem = this.listOptionBox_.querySelector('.' + this.CssClasses_.IS_SELECTED);
        selectedItem && selectedItem.classList.remove(this.CssClasses_.IS_SELECTED);
      }
    }
  };

  MaterialSelectfield.prototype.onClick_ = function (event) {
    this.toggle(event);
  };

  MaterialSelectfield.prototype.update_ = function () {
    var itemSelected = false;

    if(this.options_ && this.options_.length > 0) {
      for (var i = 0; i < this.options_.length; i++) {
        var item = this.options_[i];
        if (item.selected && item.value !== "") {
          itemSelected = true;
          this.element_.classList.add(this.CssClasses_.IS_DIRTY);
          this.listOptionBox_.querySelector('.' + this.CssClasses_.IS_SELECTED).classList.remove(this.CssClasses_.IS_SELECTED);
          this.listOptionBox_.querySelectorAll('LI')[i].classList.add(this.CssClasses_.IS_SELECTED);
        }
      }
    }

    if(!itemSelected) {
      this.element_.classList.remove(this.CssClasses_.IS_DIRTY);
    }

    this.checkDisabled();
    this.checkValidity();
  };

  MaterialSelectfield.prototype.checkValidity = function() {
    if (this.select_.validity) {
      if (this.select_.validity.valid) {
        this.element_.classList.remove(this.CssClasses_.IS_INVALID);
      } else {
        this.element_.classList.add(this.CssClasses_.IS_INVALID);
      }
    }
  };
  MaterialSelectfield.prototype['checkValidity'] =
    MaterialSelectfield.prototype.checkValidity;

  MaterialSelectfield.prototype.checkDisabled = function() {
    if (this.select_.disabled) {
      this.element_.classList.add(this.CssClasses_.IS_DISABLED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    }
  };
  MaterialSelectfield.prototype['checkDisabled'] =
    MaterialSelectfield.prototype.checkDisabled;

  /**
   * Disable select field.
   *
   * @public
   */
  MaterialSelectfield.prototype.disable = function() {
    this.select_.disabled = true;
    this.update_();
  };
  MaterialSelectfield.prototype['disable'] = MaterialSelectfield.prototype.disable;

  /**
   * Enable select field.
   *
   * @public
   */
  MaterialSelectfield.prototype.enable = function() {
    this.select_.disabled = false;
    this.update_();
  };
  MaterialSelectfield.prototype['enable'] = MaterialSelectfield.prototype.enable;

  MaterialSelectfield.prototype.isDescendant_ = function (parent, child) {
    var node = child.parentNode;
    while (node !== null) {
      if (node === parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  };

  MaterialSelectfield.prototype.toggle = function (event) {
    if(!this.element_.classList.contains(this.CssClasses_.IS_FOCUSED)) {
      this.show_(event)
    }
    else if(event.target && event.target.nodeName === 'LI' && this.isDescendant_(this.listOptionBox_, event.target)) {
      this.onSelected_(event)
    }
    else {
      this.hide_()
    }
  };

  MaterialSelectfield.prototype.show_ = function(event) {
    this.checkDisabled();
    if(this.element_.classList.contains(this.CssClasses_.IS_DISABLED)) return;

    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
    this.closing_ = false;
    this.strSearch_ = "";

    var selectedItem = this.listOptionBox_ && this.listOptionBox_.querySelector('.' + this.CssClasses_.IS_SELECTED);
    if(selectedItem) selectedItem.parentElement.parentElement.scrollTop = selectedItem.offsetTop;

    this.boundKeyDownHandler_ = this.onKeyDown_.bind(this);
    this.boundClickDocHandler_ = function(e) {      
      if (e !== event && !this.closing_ && !(e.target.parentNode === this.element_ || e.target.parentNode === this.selectedOption_) ) {
        this.hide_();
      }
    }.bind(this);

    document.addEventListener('keydown', this.boundKeyDownHandler_);
    document.addEventListener('click', this.boundClickDocHandler_);
  };

  MaterialSelectfield.prototype.onKeyDown_ = function(evt) {
    var items = this.listOptionBox_.querySelectorAll('li:not([disabled])');

    if (items && items.length > 0 && !this.closing_) {
      var currentIndex = Array.prototype.slice.call(items).indexOf(this.listOptionBox_.querySelectorAll('.' + this.CssClasses_.IS_SELECTED)[0]);
      var selectedItem;

      if(evt.keyCode === this.Keycodes_.UP_ARROW || evt.keyCode === this.Keycodes_.DOWN_ARROW) {
        if(currentIndex !== -1) {
          items[currentIndex].classList.remove(this.CssClasses_.IS_SELECTED);
        }

        if (evt.keyCode === this.Keycodes_.UP_ARROW) {
          evt.preventDefault();
          if (currentIndex > 0) {
            selectedItem = items[currentIndex - 1];
          } else {
            selectedItem = items[items.length - 1];
          }
        } else {
          evt.preventDefault();
          if (items.length > currentIndex + 1) {
            selectedItem = items[currentIndex + 1];
          } else {
            selectedItem = items[0];
          }
        }

        if(selectedItem) {
          selectedItem.classList.add(this.CssClasses_.IS_SELECTED);
          this.listOptionBox_.scrollTop = selectedItem.offsetTop;
          this.lastSelectedItem_ = selectedItem;
        }
      }
      else if ((evt.keyCode === this.Keycodes_.SPACE || evt.keyCode === this.Keycodes_.ENTER) && this.lastSelectedItem_) {
        evt.preventDefault();
        // Send mousedown and mouseup to trigger ripple.
        var ev;

        if(document.createEvent) {
          ev = document.createEvent("MouseEvent");
          ev.initMouseEvent("click",true,true,window,0,0,0,0,0,false,false,false,false,0,null);
        }
        else {
          ev = new MouseEvent("mousedown");
        }
        this.lastSelectedItem_.dispatchEvent(ev);
        if(!document.createEvent) {
          ev = new MouseEvent('mouseup');
          this.lastSelectedItem_.dispatchEvent(ev);
        }
        // Send click.
        //this.lastSelectedItem_.click();
      }
      else if (evt.keyCode === this.Keycodes_.ESCAPE) {
        evt.preventDefault();
        var ev;

        if(document.createEvent) {
          ev = document.createEvent("MouseEvent");
          ev.initMouseEvent("click",true,true,window,0,0,0,0,0,false,false,false,false,0,null);
        }
        else {
          ev = new MouseEvent("mousedown");
        }
        document.body.dispatchEvent(ev);
        if(!document.createEvent) {
          ev = new MouseEvent('mouseup');
          document.body.dispatchEvent(ev);
        }
        document.body.click();
      }
      else if (this.validKeyCode_(evt.keyCode)) {
        var charCode = evt.which || evt.keyCode;

        this.strSearch_ += String.fromCharCode(charCode);

        if(this.keyDownTimerId_) clearTimeout(this.keyDownTimerId_);

        this.keyDownTimerId_ = setTimeout((function() {
          this.keyDownTimerId_ = null;
          this.strSearch_ = "";
        }).bind(this), 300);

        var ind = this.searchByStrIndex_(0);

        if (ind > -1) {
          if(currentIndex !== -1) {
            items[currentIndex].classList.remove(this.CssClasses_.IS_SELECTED);
          }
          selectedItem = items[ind];
          selectedItem.classList.add(this.CssClasses_.IS_SELECTED);
          this.listOptionBox_.scrollTop = selectedItem.offsetTop;
          this.lastSelectedItem_ = selectedItem;
        }
      }
    }
  };

  MaterialSelectfield.prototype.searchByStrIndex_ = function(key) {
    var srchStr = this.strSearch_;
    var isPresent = new RegExp('^' + srchStr +'.');
    var indx = -1;
    var arr = this.optionsArr_;

    for(var i = 0; i < arr.length; i++) {
      if(isPresent.test(arr[i])) {
        indx = i;
        break;
      }
    }

    return indx != -1 ? this.optionsMap_[this.optionsArr_[indx]] : -1;
  };

  MaterialSelectfield.prototype.validKeyCode_ = function(keycode) {
    return (keycode > 47 && keycode < 58)   || // number keys
      keycode === 32 || keycode === 13   || // spacebar & return key(s) (if you want to allow carriage returns)
      (keycode > 64 && keycode < 91)   || // letter keys
      (keycode > 95 && keycode < 112)  || // numpad keys
      (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
      (keycode > 218 && keycode < 223);   // [\]' (in order)
  };

  MaterialSelectfield.prototype.hide_ = function() {
    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
    this.closing_ = true;
    this.strSearch_ = "";
    this.boundClickDocHandler_ && document.removeEventListener('click', this.boundClickDocHandler_);
    this.boundKeyDownHandler_ && document.removeEventListener('keydown', this.boundKeyDownHandler_);
    this.update_();
  };

  MaterialSelectfield.prototype.init = function () {
    if (this.element_) {
      this.element_.classList.remove(this.CssClasses_.IS_DIRTY);
      this.lastSelectedItem_ = null;
      this.label_ = this.element_.querySelector('.' + this.CssClasses_.LABEL);
      this.select_ = this.element_.querySelector('.' + this.CssClasses_.SELECT);
      var selectedOption = document.createElement('div');
      selectedOption.classList.add(this.CssClasses_.SELECTED_BOX);
      selectedOption.tabIndex = 1;
      this.selectedOption_ = selectedOption;
      var iconContainer = document.createElement('span');
      iconContainer.tabIndex = -1;
      iconContainer.classList.add('mdl-selectfield__arrow-down__container');
      var icon = document.createElement('span');
      icon.classList.add('mdl-selectfield__arrow-down');
      icon.tabIndex = -1;
      iconContainer.appendChild(icon);
      selectedOption.appendChild(iconContainer);
      var value = document.createElement('span');
      value.classList.add(this.CssClasses_.SELECTED_BOX_VALUE);
      value.tabIndex = -1;
      selectedOption.appendChild(value);
      this.selectedOptionValue_ = value;
      this.element_.appendChild(this.selectedOption_);

      var invalid = this.element_.classList.contains(this.CssClasses_.IS_INVALID);

      this.makeElements_();

      this.boundClickHandler = this.onClick_.bind(this);
      this.boundFocusHandler = this.onFocus_.bind(this);
      this.boundBlurHandler = this.onBlur_.bind(this);
      this.element_.addEventListener('click', this.boundClickHandler);
      this.select_.addEventListener('focus', this.boundFocusHandler);
      this.select_.addEventListener('blur', this.boundBlurHandler);
      if (invalid) {
        this.element_.classList.add(this.CssClasses_.IS_INVALID);
      }
      this.checkDisabled();
    }
  };

  MaterialSelectfield.prototype.refreshOptions = function () {
    this.mdlDowngrade_();
    this.setDefaults_();
    this.init();
  };

  MaterialSelectfield.prototype.clearElements_ = function () {

  };

  MaterialSelectfield.prototype.makeElements_ = function () {
    if (this.select_) {
      this.options_ = this.select_.querySelectorAll('option');
      this.select_.style.opacity = "0";
      this.select_.style.zIndex = "-1";

      if(this.options_.length === 0) {
        this.options_ = [document.createElement('option')]
      }

      if (this.options_.length) {
        var listOptionBox = document.createElement('div')
          ,ul = '<ul tabindex="-1">'
          ,liHTML = ''
          ;

        listOptionBox.classList.add(this.CssClasses_.LIST_OPTION_BOX);
        listOptionBox.tabIndex = '-1';

        for (var i = 0; i < this.options_.length; i++) {
          var item = this.options_[i]
            ,itemText = (item.textContent || '').toUpperCase().replace(/( )|(\n)/g, "")
            ,liClass = ''
            ;

          this.optionsMap_[itemText] = i;
          this.optionsArr_.push(itemText);

          if(item.selected && item.textContent !== "") {
            this.element_.classList.add(this.CssClasses_.IS_DIRTY);
            this.selectedOptionValue_.textContent = item.textContent;
            liClass += this.CssClasses_.IS_SELECTED;
          }

          if(item.disabled) {
            liClass += liClass !== '' ? ' ' + this.CssClasses_.IS_DISABLED : this.CssClasses_.IS_DISABLED
          }

          liHTML += '<li class="' + liClass + '" data-value="'+ i +'" tabindex="-1">' + item.textContent + '</li>';
        }

        ul += liHTML + '</ul>';

        listOptionBox.innerHTML = ul;
        this.element_.appendChild(listOptionBox);
        this.listOptionBox_ = listOptionBox;

        if(window.MutationObserver) {
          this.observer_ = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
              if (mutation.type === 'childList') {
                this.refreshOptions()
              }
            }.bind(this));
          }.bind(this));
          this.observer_.observe(this.select_, {attributes: true, childList: true, characterData: true})
        }
      }
    }
  };

  MaterialSelectfield.prototype.mdlDowngrade_ = function() {
    this.element_.removeEventListener('click', this.boundClickHandler);
    this.select_.removeEventListener('focus', this.boundFocusHandler);
    this.select_.removeEventListener('blur', this.boundBlurHandler);
    this.listOptionBox_ && this.element_.removeChild(this.listOptionBox_);
    this.selectedOption_ && this.element_.removeChild(this.selectedOption_);
    this.element_.removeAttribute('data-upgraded');
    this.select_.style.opacity = "1";
    this.select_.style.zIndex = "inherit";
    this.observer_ && this.observer_.disconnect();
  };

  /**
   * Public alias for the downgrade method.
   *
   * @public
   */
  MaterialSelectfield.prototype.mdlDowngrade =
    MaterialSelectfield.prototype.mdlDowngrade_;

  MaterialSelectfield.prototype['mdlDowngrade'] =
    MaterialSelectfield.prototype.mdlDowngrade;

  MaterialSelectfield.prototype.change_ = function (value) {
    var option = null;

    for (var i = 0; i < this.options_.length; i++) {
      if (this.options_[i].value === value) {
        option = this.options_[i];
        break;
      }
    }

    if (option === null) return;

    this.selectedOptionValue_.textContent = option.textContent;
    option.selected = true;

    this.update_();
    this.fireEventChange_();
  };

  /**
   * Update the selected option.
   *
   * @param {string} value The value of the option which is selected.
   * @public
   */
  MaterialSelectfield.prototype.change =
    MaterialSelectfield.prototype.change_;

  MaterialSelectfield.prototype['change'] =
    MaterialSelectfield.prototype.change;


  componentHandler.register({
    constructor: MaterialSelectfield,
    classAsString: 'MaterialSelectfield',
    cssClass: 'mdl-js-selectfield',
    widget: true
  });
})();