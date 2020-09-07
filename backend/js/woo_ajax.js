jQuery(function($){
    var ajaxurl = hcc_wc_ajax_params.ajaxurl;
    var err_msg = hcc_wc_ajax_params.err_msg;
    HCC_WOO_Ajax();
});

function HCC_WOO_Ajax(){
    var $ = jQuery;
    let form = $('form.hcc_woo_form');
    form.on('submit', function(e){
        e.preventDefault();
        e.stopPropagation();
        
        if (typeof functionName == 'customValid'){
            customValid();   
        }
        
        let $data         = $(this).serializeArray();
        let inputId       = $(this).find('input[name="hcc-wc-id"]');
        let inputPr       = $(this).find('input[name="hcc-wc-price"]');
        let input         = $(this).find('input').not('input[type="submit"]');
        let respContainer = $(this).find('.response-msg');
        let respHeader    = $(this).find('.header-response');
        $.ajax({
                      type: "POST",
                      url: ajaxurl,
                      data: {
                            action : 'hcc_wc_ajax',
                            data : $data,
                      },
                      error: (function() {
                          try{
                              input.val('');
                              respContainer.removeClass('hcc-wc-scs').addClass('hcc-wc-err');
                              respHeader.addClass('hcc-wc-err').removeClass('hcc-wc-scs');
                              if( typeof err_msg !=="undefined" ){
                                  respContainer.append(err_msg);
                              }
                          }
                          catch(e){
                              console.log('Error with POST request');
                          }
                      }),
                      beforeSend: (function (){
                          try{
                              respContainer.html('');
                              respHeader.removeClass('hcc-wc-scs hcc-wc-err');
                              console.log( 'Sending: ' + $data );
                          }
                          catch(e){
                              console.log('Can not find required element');
                          }
                      }),
                      success: (function ( result ){     
                          try{
                              if( result ){
                                  console.log('Data: ' + result);
                                  var data = JSON.parse(result);
                                  console.log('Data parse: ' + data);
                                  
                                  if (data.error) {
                                        let errors = "";
                                        for (let error in data.errors) {
                                            errors += '<span class="er-mes">' + data.errors[error] + '</span><br/>';
                                        }  
                                        try{
                                            input.val('');
                                            respContainer.append(errors);
                                            respContainer.removeClass('hcc-wc-scs').addClass('hcc-wc-err');
                                            respHeader.removeClass('hcc-wc-scs').addClass('hcc-wc-err');
                                        }
                                        catch(e){
                                            console.log('Can not find required element');
                                            if( typeof err_msg !=="undefined" ){
                                                respContainer.append(err_msg);
                                            }
                                        }
                                  }
                                  
                                  if( data.success ){
                                       let successes = "";
                                       let inputIdVal = false;
                                       let inputPrVal = false;
                                       for (let success in data.successes) {
                                            if( success === 'product_id' ){
                                                inputIdVal = data.successes[success];
                                            }
                                            else if( success === 'saved_regular' || success === 'saved_price' ){
                                                inputPrVal = data.successes[success];
                                            }
                                            else{
                                                successes += '<span class="scs-mes">' + data.successes[success] + '</span><br/>';
                                            }
                                       } 
                                       try{
                                           if( inputIdVal && typeof inputIdVal !=="undefined" ){
                                               inputId.val( inputIdVal );
                                           }
                                           if( inputPrVal && typeof inputPrVal !=="undefined"){
                                               inputPr.val( inputPrVal );
                                           }
                                           respContainer.append(successes);
                                           respContainer.removeClass('hcc-wc-err').addClass('hcc-wc-scs');
                                           respHeader.addClass('hcc-wc-scs').removeClass('hcc-wc-err');
                                       }
                                      catch(e){
                                          console.log('Can not find required element');
                                          if( typeof err_msg !=="undefined" ){
                                              respContainer.append(err_msg);
                                          }
                                      }
                                  }
                              }
                              else{
                                  console.log('Error with POST result:2');
                                  if( typeof err_msg !=="undefined" ){
                                      respContainer.append(err_msg);
                                  }
                              }
                          }
                          catch(e){
                              console.log('Error with POST result:1');
                              if( typeof err_msg !=="undefined" ){
                                  respContainer.append(err_msg);
                              }
                          }
                      }),
                      complete: (function (){
                          try{}
                          catch(e){
                              console.log('Error with POST complete');
                              if( typeof err_msg !=="undefined" ){
                                  respContainer.append(err_msg);
                              }
                          }
                      })
        }).done(function (data) {
            try{
                console.log('End of ajax request');
            }
            catch(e){
                if( typeof err_msg !=="undefined" ){
                    console.log(err_msg);
                    respContainer.append(err_msg);
                }
            }
        });
        
        return false;
    });
}

