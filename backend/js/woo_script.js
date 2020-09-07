jQuery(function($){
    customValid();
});

function customValid(){
    var $ = jQuery;
    $('input[type=number]').each(function(){
       try{
           $(this).val( $(this).val().replace(",",".") );
           $(this).attr('onkeypress', 'validateInt(event, this)'); 
           
           if( $(this).attr('name') === 'hcc-wc-id' ){
               this.onkeydown = function(e) {
                   keyNum = keyPress();
                   if ( keyNum == 46 || keyNum == 190 ){
                       e.preventDefault();
                       return;
                   }
               }
           }
       }
       catch(e){
           console.log('Problem with validation function');
       }
     
    });
}

function validateInt(evt, $this){
    try{
      keyNum = keyPress();
      if ( keyNum == 8 || keyNum == 9 || keyNum == 27 || (keyNum == 65 && keyNum === true) || (keyNum >= 35 && keyNum <= 39) ) {
                    evt.preventDefault();
                    return;
      }
    
      $this.oninput= function(e){
            if ($this.value.indexOf(".") != '-1') {
                $this.value=$this.value.substring(0, $this.value.indexOf(".") + 3);
            }
       }
       $this.onkeydown = function (e) {
            if (e.currentTarget.value.indexOf(".") != '-1' || e.currentTarget.value.indexOf(",") != '-1') { 
                return !(/[.,]/.test(e.key));
            }
       }
   
      var theEvent = evt || window.event;
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode( key );
      var regex = /[0-9]|\./;
      if( !regex.test(key) ) {
        theEvent.returnValue = false;
        if(theEvent.preventDefault) theEvent.preventDefault();
      }
    }
    catch(e){
           console.log('Problem with validation handler');
    }
}

function keyPress(e) {
    let keyNum;
    if (window.event) {
        keyNum = window.event.keyCode;
    }
    else if (e) {
        keyNum = e.which;
    }
    return keyNum;
}
