(function($){
    $.fn.extend({
        donetyping: function(callback,timeout){
            timeout = timeout || 500;
            var timeoutReference,
                doneTyping = function(el){
                    if (!timeoutReference) return;
                    timeoutReference = null;
                    callback.call(el);
                };
            return this.each(function(i,el){
                var $el = $(el);
                $el.is(':input') && $el.on('keyup keypress',function(e){
                    if (e.type=='keyup' && e.keyCode!=8) return;
                    if (timeoutReference) clearTimeout(timeoutReference);
                    timeoutReference = setTimeout(function(){
                        doneTyping(el);
                    }, timeout);
                }).on('blur',function(){
                    doneTyping(el);
                });
            });
        }
    });
})(jQuery);

formValidation = {
	init: function(){
		this.$form = $('.registration-form');
		this.$model = this.$form.find('input[name="model"]');
		this.$ID = this.$form.find('input[name="ID"]');
		this.$colour=this.$form.find('input[name="colour"]');
		this.$submitButton = this.$form.find('button.submit');
		
		this.validatedFields = {
			model: false,
			ID: false,
			colour: false,
			 
		};
		
		this.bindEvents();
	},
	bindEvents: function(){
		this.$model.donetyping(this.validatemodelHandler.bind(this));
		this.$ID.donetyping(this.validateIDHandler.bind(this));
		this.$colour.donetyping(this.validatecolourHandler.bind(this));
		
		this.$form.submit(this.submitFormHandler.bind(this));
	},
	validatemodelHandler: function(){
		this.validatedFields.model = this.validateText(this.$model);
	},
	validateIDHandler: function(){
		this.validatedFields.ID = this.validateText(this.$ID);
	},
	validatecolourHandler: function(){
		this.validatedFields.colour = this.validateText(this.$colour);
	},
	
	submitFormHandler: function(e){
		e.preventDefault();
		this.validatemodelHandler();
		this.validateIDHandler();
		this.validatecolourHandler();
		if(this.validatedFields.model && this.validatedFields.ID && this.validatedFields.colour){
			// Simulate Ajax loading
			this.$submitButton.addClass('loading').html('<span class="loading-spinner"></span>')
			setTimeout((function(){
				this.$submitButton.removeClass('loading').addClass('success').html('Welcome, '+this.$ID.val())
			}).bind(this), 1500);
		}else{
			this.$submitButton.text('Please Fix the Errors');
			setTimeout((function(){
				if(this.$submitButton.text() == 'Please Fix the Errors'){
					this.$submitButton.text('Sign Me Up');
				}
			}).bind(this), 3000)
		}
	},
	
	validateText: function($input){
		$input.parent().removeClass('invalid');
		$input.parent().find('span.label-text small.error').remove();
		if($input.val() != ''){
			return true;
		}else{
			$input.parent().addClass('invalid');
			$input.parent().find('span.label-text').append(' <small class="error">(Field is empty)</small>');
			return false;
		}
	},
	validateEmail: function($input){
		var regEx = /\S+@\S+\.\S+/;
		$input.parent().removeClass('invalid');
		$input.parent().find('span.label-text small.error').remove();
    if(regEx.test($input.val())){
			return true;
		}else{
			$input.parent().addClass('invalid');
			$input.parent().find('span.label-text').append(' <small class="error">(Email is invalid)</small>');
			return false;
		}
	},
	validatePassword: function($input){
			$input.parent().removeClass('invalid');
		$input.parent().find('span.label-text small.error').remove();
		if($input.val().length >= 8){
			return true;
		}else{
			$input.parent().addClass('invalid');
			$input.parent().find('span.label-text').append(' <small class="error">(Your password must longer than 7 characters)</small>');
			return false;
		}
	}
}.init();