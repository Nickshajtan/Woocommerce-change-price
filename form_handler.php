<?php
/*
* Handler for HCC WC form
*
*/

add_action( 'wp_ajax_hcc_wc_ajax', 'hcc_wc_ajax_function' );
add_action( 'wp_ajax_nopriv_hcc_wc_ajax', 'hcc_wc_ajax_function' );
function hcc_wc_ajax_function(){    
     $_POST = empty($_POST) ? $_GET : $_POST;
     try{
          $response = ['error'=>false, 'errors'=>[], 'success'=>false, 'successes'=>[]];
          if( empty( $_POST['data'] ) || $_POST['data'] == false ){
              $response['error'] = true;
              $response['errors']['data_empty'] = __('Empty data','hcc-wc');
              throw new Exception( __('Exception: empty POST data', 'hcc-wc') );
              echo json_encode( $response );
              
              die;
          }
          else{
              
              foreach ($_POST['data'] as $key => $value) {
                    $postData[ $value['name'] ] = trim( $value['value'] );
              }
              
              if( empty( $postData['hcc-wc-id'] ) || $postData['hcc-wc-id'] == false ){
                  $response['error'] = true;
                  $response['errors']['id_empty'] = __('Empty id','hcc-wc');
                  throw new Exception( __('Exception: product ID not found', 'hcc-wc') );
                  echo json_encode( $response );
                  die;
              }
              else{
                  if( function_exists('wc_get_product') ){
                      $wc_product = wc_get_product( (int)htmlspecialchars( trim( $postData['hcc-wc-id'] ) ) );
                      if( $wc_product ){
                        $product_arr    = $wc_product;
                        $product        = trim( $product_arr->id );    
                      }
                  }
                  else{
                        $wc_product = get_post( (int)htmlspecialchars( trim( $postData['hcc-wc-id'] ) ) );
                        if( $wc_product ){
                            $product = $wc_product->ID;
                        }
                  }
              }
              
              if( empty( $postData['hcc-wc-price'] ) || $postData['hcc-wc-price'] == false ){
                   $response['error'] = true;
                   $response['errors']['price_empty'] = __('Empty price','hcc-wc');
                   throw new Exception( __('Exception: product PRICE not found', 'hcc-wc') );
                   echo json_encode( $response );
                   die;
               }
              
              foreach ($postData as $key => $value) {

                    if( $key === 'hcc-wc-id' ){    
                        $id = (int)htmlspecialchars( trim( $value ) );
                        
                        if( empty( $id ) || !$wc_product ){
                             $response['error'] = true;
                             $response['error']['not_found'] = __('Product not found','hcc-wc');
                             throw new Exception( __('Exception: product not found', 'hcc-wc') );
                        }

                        if( !function_exists('wc_get_product') ){
                             $response['error'] = true;
                             $response['error']['wc_error'] = __('Can not get a product','hcc-wc');
                             throw new Exception( __('Exception: can not get a product', 'hcc-wc') );
                        }

                        if( !empty( $id ) && function_exists('wc_get_product') && $wc_product ){
                    
                            if( !empty( $product ) ){
                                $response['success'] = true;
                                $response['successes']['product_id'] = $product;
                                $response['successes']['wc_success'] = __('Product ID ' . $product, 'hcc-wc');
                                update_option('hcc-wc-id', $product);
                            }
                            else{
                                $response['error'] = true;
                                $response['errors']['wc_error'] = __('Can not get a product','hcc-wc');
                                throw new Exception( __('Exception: can not get a product', 'hcc-wc') );
                            }
                        }
                    }
                    if( $key === 'hcc-wc-price' ){
                        $new_price = (float)htmlspecialchars( trim( $value ) );
                        if( isset( $product_arr ) ){
                            update_post_meta( $product, '_regular_price', $new_price);
                            update_post_meta( $product, '_price', $new_price);
                        }
                        else{
                            $response['error'] = true;
                            $response['errors']['not_found'] = __('Product not found','hcc-wc');
                            throw new Exception( __('Exception: product not found', 'hcc-wc') );
                        }
                  
                    }
                    /* -- Request -- */
                    if( isset( $product_arr ) ){
                        $saved_one =  number_format( (float)get_post_meta( $product, '_regular_price', true), 2, '.', '' );
                        $saved_two =  number_format( (float)get_post_meta( $product, '_price', true), 2, '.', '' );
                        $response['success'] = true;
                        if( $saved_one ){
                            $response['successes']['saved_regular'] = $saved_one;
                            $response['successes']['price_one_success'] = __('Regular price ' . $saved_one, 'hcc-wc');
                        }
                        if( $saved_two ){
                            $response['successes']['saved_price'] = $saved_two;
                            $response['successes']['price_two_success'] = __('Price ' . $saved_two, 'hcc-wc');
                        }
                        if( !empty( $saved_one ) ){
                            update_option('hcc-wc-price', $saved_one);
                        }
                        elseif( !empty( $saved_two ) ){
                            update_option('hcc-wc-price', $saved_two);
                        }
                    }
                    else{
                        $response['error'] = true;
                        $response['errors']['not_found'] = __('Product not found','hcc-wc');
                        throw new Exception( __('Exception: product not found', 'hcc-wc') );
                    }

          }
          
          if( $response['error'] || $response['success'] ){
              echo json_encode( $response );
          }
         
        }
     }
     catch (Exception $e){
          if( !$response['errors'] ){
                $response['error'] = true;
                $response['errors']['throws'] = $e->getMessage();   
          }
          echo json_encode( $response );
    }
    
    die;
}

 
