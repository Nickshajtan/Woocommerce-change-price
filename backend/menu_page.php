<?php
/*
* Register menu page for plugin
*
*/

/*-- Add page --*/
add_action( 'admin_menu', 'hcc_wc_register_addon_menu_page' );
function hcc_wc_register_addon_menu_page(){
	$option_page = add_theme_page( __('HCC: WC Addons', 'hcc-wc'), __('HCC WC addons', 'hcc-wc'), 'manage_options', 'hcc-wc-addons', 'hcc_wc_addon_html' );
    add_action( 'admin_init', 'hcc_wc_options' );
    add_action( 'admin_print_scripts-' . $option_page, 'hcc_wc_load_plugin_assets' );
}

/*-- Register settings --*/
function hcc_wc_options(){
    register_setting( 'hcc-wc-options', 'hcc-wc-id');
    register_setting( 'hcc-wc-options', 'hcc-wc-price');
}

/*-- Add plugin styles & scripts --*/
add_action( 'admin_init', 'hcc_wc_plugin_assets_init' );
function hcc_wc_plugin_assets_init(){
    wp_register_script( 'hcc_wc_ajax', PLUGINS_URL . '/hcc-woo-addon/js/woo_ajax.min.js', array(), null, true );
    wp_localize_script( 'hcc_wc_ajax', 'hcc_wc_ajax_params', array(
		'ajaxurl' => SITE_URL . '/wp-admin/admin-ajax.php',
        'err_msg' => __('Error on Ajax request: please, try again later', 'hcc'),
    ));
    wp_register_style( 'hcc_wc_ajax', PLUGINS_URL . '/hcc-woo-addon/css/woo_ajax.min.css');
    wp_register_script( 'hcc_wc_script', PLUGINS_URL . '/hcc-woo-addon/js/woo_script.min.js', array(), null, true );
}
function hcc_wc_load_plugin_assets(){
    wp_enqueue_script( 'hcc_wc_script' );
    wp_enqueue_script( 'hcc_wc_ajax' );
    wp_enqueue_style( 'hcc_wc_ajax' );
}

/*-- HTML Render --*/
function hcc_wc_addon_html(){
    echo '<div class="wrap"><form method="post" class="hcc_woo_form" action="">'; ?>
    <table class="form-table">
            <?php settings_fields( 'hcc-wc-options' ); ?>
			<tr valign="top">
				<th><?php echo __('HCC: WC Addons', 'hcc-wc'); ?></th>
				<td>
					<p class="description"><?php echo __("Enter product ID & price:", 'hcc-wc'); ?></p>
				</td>
			</tr>
			<tr><td colspan="2"><hr></td></tr>
			<tr>
				<th><label for="hcc-wc-id"><?php echo __('Product ID', 'hcc'); ?></label></th>
				<td>
					<p class="description"><?php echo __('Enter product ID', 'hcc'); ?></p>
					<p><input id="hcc-wc-id" name="hcc-wc-id" type="number" step="1" value="<?php echo (int)get_option('hcc-wc-id'); ?>" placeholder="<?php _e('ID', 'hcc-wc'); ?>" /></p> 
				</td>
			</tr>
			<tr>
				<th><label for="hcc-wc-price"><?php echo __('Product Price', 'hcc'); ?></label></th>
				<td>
					<p class="description"><?php echo __('Enter new price.', 'hcc'); ?></p>
					<p><input id="hcc-wc-price" name="hcc-wc-price" type="number" step="0.01" value="<?php echo number_format( (float)get_option('hcc-wc-price'), 2, '.', '' ); ?>" placeholder="<?php _e('Many dollars...', 'hcc-wc'); ?>" /></p> 
				</td>
			</tr>
			<tr><td colspan="2"><hr></td></tr>
            <tr>
                <th><label for="hcc-wc-id" class="header-response"><?php echo __('Attention!', 'hcc'); ?></label></th>
                <td><p class="description response-msg"></p></td>
            </tr>
    </table>
    <div style="clear: both;">
                        <?php submit_button(null, 'primary'); ?>
                        <input type="hidden" name="hcc-settings-submit" value="Y" />
    </div>
    <?php echo '</form></div>';   

}
