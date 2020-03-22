<?php
/**
 * Plugin Name: HCC Woocommerce Addon
 * Description: Implement test task of Yozma Tech Company
 * Author:      Nikita
 * Version:     1.0
 *
 * Text Domain: 'hcc-wc'
 * Domain Path: /languages
 *
 *
 * Network:     true
 */
defined( 'ABSPATH' ) || exit;

if ( !defined( 'HCC_WC_PLUGIN_FILE' ) ) {
	define( 'HCC_WC_PLUGIN_FILE', str_replace( '\\', '/', __FILE__ ) );
}
if( !defined( 'PLUGINS_URL' ) ){
    define( 'PLUGINS_URL', plugins_url() );
}
if( !defined( 'SITE_URL' ) ){
    define( 'SITE_URL', site_url() );
}

require_once ABSPATH . 'wp-admin/includes/plugin.php';

if ( is_plugin_active( 'woocommerce/woocommerce.php' ) || in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) ) ) {

    include_once( dirname( HCC_WC_PLUGIN_FILE ) . '/menu_page.php' );
    include_once( dirname( HCC_WC_PLUGIN_FILE ) . '/form_handler.php' );

}
else{
    add_action('plugins_loaded', 'hcc_wc_notices');
}
 
function hcc_wc_notices(){
        
        if (!class_exists('WooCommerce')) { 
       
            add_action('admin_notices', function(){
                    echo '<div class="error notice-error"><p>' .  __('This plugin use Woocommerce. Please, will have active it.', 'hcc-wc') . '</p></div>';
            });   
        
        }
        
        return false;
}