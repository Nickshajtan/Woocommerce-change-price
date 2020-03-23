<?php
/*
* Add custom contact method for users
*
*/

add_filter( 'user_contactmethods', 'hcc_new_contact_methods', 10, 1 );
function hcc_new_contact_methods( $contactmethods ){ 
    $contactmethods['phone'] = __('Phone Number', 'hcc'); 
    return $contactmethods; 
} 
/*
* Add custom columns into users table
*
*/
add_filter( 'manage_users_columns', 'hcc_add_custom_user_table', 10, 1 );
function hcc_add_custom_user_table( $columns ){ 
    $num = 2; // number for starting
    $new_columns = array(
        'first_name' => __('First name', 'hcc'),
        'last_name'  => __('Last name', 'hcc'),
        'phone'      => __('Phone', 'hcc'),
    );
    unset( $columns['name'] );
    
    return array_merge( array_slice( $columns, 0, $num ), $new_columns, array_slice( $columns, $num ) );
}  

/*
* Render custom columns into users table
*
*/
add_filter( 'manage_users_custom_column', 'hcc_render_custom_user_table', 10, 3 );
function hcc_render_custom_user_table( $val, $column_name, $user_id ){ 
    
    try{
        $user_info = get_userdata( $user_id );

        if( empty( $user_info ) || is_wp_error( $user_info ) ){
            throw new Exception( __('Error with user data on getting', 'hcc') );
        }

        if( !empty( $user_info ) ){

            $first_name = ( $user_info->get('user_firstname') )    ? $user_info->get('user_firstname')    : '—';
            $last_name  = ( $user_info->get('user_lastname') )     ? $user_info->get('user_lastname')     : '—';
            $phone      = ( $user_info->get('phone') )             ? $user_info->get('phone')             : '—';

            switch($column_name){ 
                case 'first_name' : 
                    if( !empty( $first_name ) ){
                        return $first_name;
                    }
                    break;
                case 'last_name' :
                    if( !empty( $last_name ) ){
                        return $last_name;
                    }
                    break;
                case 'phone' :
                    if( !empty( $phone ) ){
                        return $phone;
                    }
                    break;
            }    
        }
    }
    catch (Exception $e) {
        hcc_user_tables_notices( $e->getMessage() );
    }
    
    return $val;
} 

/*
* Set "orderby" parameter of sorting by column. 
*
*/
add_action( 'pre_get_users', 'hcc_orderby_user_column' );
function hcc_orderby_user_column( $query ) {
    
    if( !is_admin() || get_current_screen()->id !== 'users' ){
        return;
    }
    
    $orderby = $query->get( 'orderby' );
    switch( $orderby ){ 
            case 'first_name' :
                $query->set('meta_key','first_name');
                $query->set('orderby','meta_value');
                break;
            case 'last_name' :
                $query->set('meta_key','last_name');
                $query->set('orderby','meta_value');
                break;
            case 'phone' :
                $query->set('meta_key','phone');
                $query->set('orderby','meta_value_num');
                break;
    }
}

/*
* Implement sorting by column. 
*
*/
add_filter( 'manage_users_sortable_columns', 'hcc_sortable_user_column' );
function hcc_sortable_user_column( $columns ){
    
    $new_sort = array(
        'first_name' => array('first_name', false),
        'last_name'  => array('last_name', false),
        'phone'      => array('phone', false),
    );
    return array_merge( $columns, $new_sort );
    
}

/*
* Notice function for users table
*
*/
function hcc_user_tables_notices( $message ){
    
    if( !empty( $message ) ){
        $message = $message . "\n";
        add_action('admin_notices', function( $message ){
            echo '<div class="notice-error"><p>' . $message . '</p></div>';
        });
    }
    
}

