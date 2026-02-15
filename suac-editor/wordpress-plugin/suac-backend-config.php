<?php
/**
 * SUAC Portfolio Management Tool - Backend Configurations
 * Add this code to your theme's functions.php or a custom plugin.
 */

/*
Plugin Name: SUAC Portfolio Tool Backend
Description: Backend configurations for SUAC Portfolio (Custom Taxonomies, Meta, CORS, Auto-tagging)
Version: 1.1
Author: AntiGravity
*/

// 1. Register Custom Taxonomy "Restriction"
function suac_backend_tool_register_restriction_taxonomy() {
    if (!taxonomy_exists('restriction')) {
        register_taxonomy(
            'restriction', // singular
            ['works'], 
            [
                'label' => 'Restriction',
                'public' => true,
                'show_in_rest' => true, 
                'hierarchical' => true,
                'rewrite' => ['slug' => 'restriction'],
            ]
        );
    }

    // 初期ターム作成（suac-grad）
    if (!term_exists('suac-grad', 'restriction')) {
        wp_insert_term('suac-grad', 'restriction', ['slug' => 'suac-grad']);
    }
}
add_action('init', 'suac_backend_tool_register_restriction_taxonomy');

// 1.5 Register Custom Taxonomy "Creator"
function suac_backend_tool_register_creator_taxonomy() {
    if (!taxonomy_exists('creator')) {
        register_taxonomy(
            'creator',
            ['works'], 
            [
                'label' => 'Creator',
                'public' => true,
                'show_in_rest' => true,
                'hierarchical' => false,
                'rewrite' => ['slug' => 'creator'],
            ]
        );
    }
}
add_action('init', 'suac_backend_tool_register_creator_taxonomy');

// 1.7 Register Custom Taxonomies "Format", "Tool"
function suac_backend_tool_register_additional_taxonomies() {
    // フォーマット
    if (!taxonomy_exists('format')) {
        register_taxonomy('format', ['works'], [
            'label' => 'Format',
            'public' => true,
            'show_in_rest' => true,
            'hierarchical' => true,
        ]);
    }
    // ツール
    if (!taxonomy_exists('tool')) {
        register_taxonomy('tool', ['works'], [
            'label' => 'Tool',
            'public' => true,
            'show_in_rest' => true,
            'hierarchical' => false,
        ]);
    }
}
add_action('init', 'suac_backend_tool_register_additional_taxonomies');

// 1.6 Register Custom Meta
function suac_backend_tool_register_works_meta() {
    $metas = ['productiondate', 'concept', 'gallery', 'suac_meta_gallery', 'duration', 'client', 'url'];
    foreach ($metas as $key) {
        register_post_meta('works', $key, [
            'show_in_rest' => true,
            'single' => $key !== 'suac_meta_gallery', 
            'type' => $key === 'suac_meta_gallery' ? 'array' : 'string', 
            'auth_callback' => function() { return true; }
        ]);
    }
}
add_action('init', 'suac_backend_tool_register_works_meta');


// 2. Restrict API Access & Manager View
function suac_backend_tool_restrict_works_api_query($args, $request) {
    $params = $request->get_params();

    // ヘルパー: suac-grad タームIDを取得
    $term = get_term_by('slug', 'suac-grad', 'restriction');
    $term_id = $term ? $term->term_id : 0;

    // Special Mode: Manager View (Show ONLY suac-grad items)
    if (isset($params['suac_manager_view']) && $params['suac_manager_view'] === 'true' && is_user_logged_in()) {
         $tax_query = $args['tax_query'] ?? [];
         $tax_query[] = [
             'taxonomy' => 'restriction',
             'field'    => 'slug',
             'terms'    => ['suac-grad'],
             'operator' => 'IN',
         ];
         $args['tax_query'] = $tax_query;
         return $args;
    }

    // Default: Hide 'suac-grad' content from public unauthenticated requests
    if (!is_user_logged_in()) {
        $tax_query = $args['tax_query'] ?? [];
        // Use term_id if available, otherwise slug
        if ($term_id) {
            $tax_query[] = [
                'taxonomy' => 'restriction',
                'field'    => 'term_id',
                'terms'    => [$term_id],
                'operator' => 'NOT IN',
            ];
        } else {
             $tax_query[] = [
                'taxonomy' => 'restriction',
                'field'    => 'slug',
                'terms'    => ['suac-grad'],
                'operator' => 'NOT IN',
            ];
        }
        $args['tax_query'] = $tax_query;
    }
    
    return $args;
}

add_filter('rest_works_query', 'suac_backend_tool_restrict_works_api_query', 10, 2);

// [REMOVED] GraphQL filter was too aggressive. Handling exclusion in frontend.


// 3. CORS Handling
function suac_backend_tool_add_cors_http_header() {
    // Basic CORS is handled by Nginx now
}
add_action('init', 'suac_backend_tool_add_cors_http_header');

// 3.5 Fix Apache Authorization Header Stripping
function suac_backend_tool_fix_apache_auth_header() {
    if (function_exists('insert_with_markers') && file_exists(ABSPATH . '.htaccess')) {
        $rules = [
            'RewriteEngine On',
            'RewriteCond %{HTTP:Authorization} ^(.*)',
            'RewriteRule .* - [e=HTTP_AUTHORIZATION:%1]'
        ];
        insert_with_markers(ABSPATH . '.htaccess', 'SUAC_Auth_Fix', $rules);
    }
}
add_action('admin_init', 'suac_backend_tool_fix_apache_auth_header'); // Use admin_init as it's lighter than init for file ops, usually. Actually init is safer for frontend check but this writes file. admin_init is fine.


// 4. Hook for Auto-Tagging, Creator, & Production Date
function suac_backend_tool_handle_insert($post, $request, $creating) {
    $params = $request->get_params();
    
    // Check for our tool's signature
    if (isset($params['suac_auto_tag']) && $params['suac_auto_tag'] === 'true') {
        
    // A. Force 'Restriction: suac-grad'
        if (taxonomy_exists('restriction')) {
            $term = get_term_by('slug', 'suac-grad', 'restriction');
            
            if (!$term) {
                 $new = wp_insert_term('suac-grad', 'restriction', ['slug' => 'suac-grad']); 
                 if (!is_wp_error($new)) $term = get_term($new['term_id']);
            }
            
            if ($term && !is_wp_error($term)) {
                // 1. Explicitly remove suac-fb if present (find by slug)
                $fb_term = get_term_by('slug', 'suac-fb', 'restriction');
                if ($fb_term) {
                    wp_remove_object_terms($post->ID, (int)$fb_term->term_id, 'restriction');
                }

                // 2. Set suac-grad (Replace mode, just in case)
                wp_set_object_terms($post->ID, (int)$term->term_id, 'restriction', false);
                
                // 3. Clear Cache
                clean_post_cache($post->ID);
            }
        }

        // A-2. Force 'Exhibition: suac-grad'
        if (taxonomy_exists('exhibition')) {
            $term_ex = get_term_by('slug', 'suac-grad', 'exhibition');
            if (!$term_ex) {
                 $new_ex = wp_insert_term('Graduation Works 2026', 'exhibition', ['slug' => 'suac-grad']); 
                 if (!is_wp_error($new_ex)) $term_ex = get_term($new_ex['term_id']);
            }
            if ($term_ex && !is_wp_error($term_ex)) {
                wp_set_object_terms($post->ID, (int)$term_ex->term_id, 'exhibition', true);
            }
        }

        // B. Handle Author Name -> Creator Taxonomy
        if (!empty($params['suac_creator_name']) && taxonomy_exists('creator')) {
            $creator_name = sanitize_text_field($params['suac_creator_name']);
            $term_info = term_exists($creator_name, 'creator');
            $term_id = 0;

            if ($term_info) {
                $term_id = is_array($term_info) ? $term_info['term_id'] : $term_info;
            } else {
                $new_term = wp_insert_term($creator_name, 'creator');
                if (!is_wp_error($new_term)) {
                    $term_id = $new_term['term_id'];
                }
            }
            if ($term_id > 0) {
                wp_set_object_terms($post->ID, (int)$term_id, 'creator');
            }
        }

        // B-2. Handle Format -> Format Taxonomy
        if (!empty($params['suac_format_name']) && taxonomy_exists('format')) {
            $format_name = sanitize_text_field($params['suac_format_name']);
            $term_info = term_exists($format_name, 'format');
            $term_id = 0;

            if ($term_info) {
                $term_id = is_array($term_info) ? $term_info['term_id'] : $term_info;
            } else {
                $new_term = wp_insert_term($format_name, 'format');
                if (!is_wp_error($new_term)) {
                    $term_id = $new_term['term_id'];
                }
            }
            if ($term_id > 0) {
                wp_set_object_terms($post->ID, (int)$term_id, 'format');
            }
        }

        // B-3. Handle Tool -> Tool Taxonomy (Comma separated)
        if (!empty($params['suac_tool_names']) && taxonomy_exists('tool')) {
            $tools = explode(',', $params['suac_tool_names']);
            $tool_ids = [];
            
            foreach ($tools as $tool_name) {
                $tool_name = trim(sanitize_text_field($tool_name));
                if (empty($tool_name)) continue;

                $term_info = term_exists($tool_name, 'tool');
                if ($term_info) {
                    $tool_ids[] = is_array($term_info) ? (int)$term_info['term_id'] : (int)$term_info;
                } else {
                    $new_term = wp_insert_term($tool_name, 'tool');
                    if (!is_wp_error($new_term)) {
                        $tool_ids[] = (int)$new_term['term_id'];
                    }
                }
            }
            
            if (!empty($tool_ids)) {
                wp_set_object_terms($post->ID, $tool_ids, 'tool');
            }
        }

        // C. Meta Fields
        $meta_mappings = [
            'suac_meta_concept' => 'concept',
            'suac_meta_productiondate' => 'productiondate',
            'suac_meta_duration' => 'duration',
            'suac_meta_client' => 'client',
            'suac_meta_url' => 'url',
            'suac_gallery' => 'gallery', // フロントエンドから直接送信されるURL文字列
        ];

        foreach ($meta_mappings as $param_key => $meta_key) {
            if (isset($params[$param_key])) {
                update_post_meta($post->ID, $meta_key, sanitize_text_field($params[$param_key]));
            }
        }

        // D. Fallback: Generate URL from legacy ID array (Only if frontend didn't send 'suac_gallery')
        // Future Refactoring Note: Eventually migrate fully to ID-based management if stability is guaranteed.
        if (empty($params['suac_gallery']) && !empty($params['suac_meta_gallery'])) {
            // メディアIDの配列をURL文字列（|区切り）に変換して保存
            $gallery_ids = $params['suac_meta_gallery'];
            $gallery_urls = [];
            foreach ($gallery_ids as $media_id) {
                $url = wp_get_attachment_url((int)$media_id);
                if ($url) {
                    $gallery_urls[] = $url;
                }
            }
            if (!empty($gallery_urls)) {
                update_post_meta($post->ID, 'gallery', implode('|', $gallery_urls));
            }
        }
    }
}
add_action('rest_insert_works', 'suac_backend_tool_handle_insert', 99, 3);
