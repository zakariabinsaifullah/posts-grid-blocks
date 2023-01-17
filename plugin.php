<?php
/**
 * Plugin Name:       Post Grid Blocks
 * Description:       A collection of Gutenberg custom blocks to show posts in grid.
 * Requires at least: 5.7
 * Requires PHP:      7.0
 * Version:           1.0.0
 * Author:            Zakaria Binsaifullah
 * Author URI:        https://makegutenblock.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       post-grid-blocks
 */

 /**
  * @package Zero Configuration with @wordpress/create-block
  *  [pstgb] && [PSTGB] ===> Prefix
  */

// Stop Direct Access 
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Blocks Final Class
 */

final class PSTGB_BLOCKS_CLASS {
	public function __construct() {

		// define constants
		$this->pstgb_define_constants();

		// block initialization
		add_action( 'init', [ $this, 'pstgb_blocks_init' ] );

		// blocks category
		if( version_compare( $GLOBALS['wp_version'], '5.7', '<' ) ) {
			add_filter( 'block_categories', [ $this, 'pstgb_register_block_category' ], 10, 2 );
		} else {
			add_filter( 'block_categories_all', [ $this, 'pstgb_register_block_category' ], 10, 2 );
		}

	}

	/**
	 * Initialize the plugin
	 */

	public static function init(){
		static $instance = false; 
		if( ! $instance ) {
			$instance = new self();
		}
		return $instance;
	}

	/**
	 * Define the plugin constants
	 */
	private function pstgb_define_constants() {
		define( 'PSTGB_VERSION', '1.0.0' );
	}

	/**
	 * Blocks Registration 
	 */

	public function pstgb_register_block( $name, $options = array() ) {
		register_block_type( __DIR__ . '/build/blocks/' . $name, $options );
	 }

	/**
	 * Blocks Initialization
	*/
	public function pstgb_blocks_init() {
		// register single block
		$this->pstgb_register_block( 'post-grid', [
			'render_callback' => [
				$this, 'pstgb_render_post_grid_block'
			],
		] );
	}
	/**
	 * Register Inline Style
	 */
	public function pstgb_inline_css($handle, $css){
		wp_register_style( $handle, false );
		wp_enqueue_style( $handle );
		wp_add_inline_style( $handle, $css );
	}

	/**
	 * Render Post Grid Block
	 */
	public function pstgb_render_post_grid_block($attributes, $content){
		require_once __DIR__ . '/templates/post-grid.php';
		$handle = 'pstgb-'.$attributes['uniqueId'];
		$this->pstgb_inline_css( $handle, pstgb_grid_callback($attributes));

		// block props
		$blockProps = get_block_wrapper_attributes([
			'class' => $attributes['uniqueId'],
		]);
		
		/**
		 * Posts query
		 */
		
		 $args = [
			'post_type' => 'post',
			'posts_per_page' => $attributes['numberOfPosts'],
			'order' => $attributes['order'],
			'orderby' => $attributes['orderBy'],
		 ];

		 if( isset ($attributes['categories']) ) {
			 $args['category__in'] = array_column( $attributes['categories'], 'id' );
		 }

		 $posts = new WP_Query( $args );
		 
		// grid content structure
		$content = '<div '.$blockProps.'>';
			$content .= '<div class="pstgb-grid">';
		 		/**
				 * Posts loop
				 */
		 		if( $posts->have_posts() ) {
					$counter = 0;
					while ( $posts->have_posts() ) {
						$posts->the_post();
						$counter++;

						$content .= '<div class="grid-item">';
							$content .= '<div class="grid-item-box">';
								if( has_post_thumbnail( get_the_ID() ) ) {
									$content .= '<div class="grid-img-wrap">';
										$content .= '<a href="'.get_the_permalink().'">';
											$content .= get_the_post_thumbnail( get_the_ID(), 'full' );
										$content .= '</a>';
										$content .= '<div class="grid-category">';
											$content .= get_the_category_list( ' ' );
										$content .='</div>';
									$content .= '</div>';
								}

								$content .= '<div class="grid-content">';
									$content .='<div class="grid-content-wrap">';

										$content .= '<div class="grid-meta">';
											$content .= '<div class="grid-author-wrap">';
												$content .= '<a href="'.get_author_posts_url( get_the_author_meta( 'ID' ) ).'">';
													$content .= 'By ' . get_the_author();
												$content .= '</a>';
											$content .= '</div>';
											$content .='<span class="grid-separator">//</span>';
											$content .= '<div class="grid-flex grid-flex-middle">';
												$content .= '<div class="grid-featured-list-date">'.get_the_date().'</div>';
											$content .= '</div>';
										$content .='</div>';

										$content .= '<h3 class="grid-title">';
											$content .= '<a href="'.get_the_permalink().'">'.get_the_title().'</a>';
										$content .= '</h3>';
										
										$content .= '<div class="grid-text">'.get_the_excerpt().'</div>';

										$content .='<div class="grid-counter">'.($counter < 10 ? '0'.$counter : $counter).'</div>';
									$content .='</div>';
								$content .= '</div>';

							$content .= '</div>';
						$content .= '</div>';
					}
					wp_reset_postdata();
				} else {
					$content .= '<p>'.__('No posts found', 'post-grid-blocks').'</p>';
				}

			$content .='</div>';
		$content .='</div>';

		return $content;
	}

	/**
	 * Register Block Category
	 */

	public function pstgb_register_block_category( $categories, $post ) {
		return array_merge(
			array(
				array(
					'slug'  => 'pstgb-blocks',
					'title' => __( 'Post Blocks', 'post-grid-blocks' ),
				),
			),
			$categories,
		);
	}

}

/**
 * Kickoff
*/

PSTGB_BLOCKS_CLASS::init();
