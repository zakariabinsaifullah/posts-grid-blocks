<?php
/**
 * Post Grid Blocks 
 */
function pstgb_grid_callback($attributes){
    $handle = $attributes['uniqueId'];
    $pstgb_css = '';

    // content background
    if(isset($attributes['contentBg'])){
        $pstgb_css .= '.wp-block-pstgb-post-grid.'.$handle.' .grid-content{';
            $pstgb_css .= 'background-color: '.$attributes['contentBg'].';';
        $pstgb_css .= '}';
    }

    // Desktop 
    $pstgb_css .= '@media only screen and (min-width: 1024px){';
        $pstgb_css .= '.wp-block-pstgb-post-grid.'.$handle.' .pstgb-grid{';
            $pstgb_css .= 'grid-template-columns: repeat('.$attributes['gridCols']['desktop'].', 1fr);';
            $pstgb_css .= 'grid-gap: '.$attributes['gridGaps']['desktop'].'px;';
        $pstgb_css .= '}';
    $pstgb_css .= '}';

    // Tablet
    $pstgb_css .= '@media only screen and (min-width: 768px) and (max-width: 1023px){';
        $pstgb_css .= '.wp-block-pstgb-post-grid.'.$handle.' .pstgb-grid{';
            $pstgb_css .= 'grid-template-columns: repeat('.$attributes['gridCols']['tablet'].', 1fr);';
            $pstgb_css .= 'grid-gap: '.$attributes['gridGaps']['tablet'].'px;';
        $pstgb_css .= '}';
    $pstgb_css .= '}';

    // Mobile
    $pstgb_css .= '@media only screen and (max-width: 767px){';
        $pstgb_css .= '.wp-block-pstgb-post-grid.'.$handle.' .pstgb-grid{';
            $pstgb_css .= 'grid-template-columns: repeat('.$attributes['gridCols']['mobile'].', 1fr);';
            $pstgb_css .= 'grid-gap: '.$attributes['gridGaps']['mobile'].'px;';
        $pstgb_css .= '}';
    $pstgb_css .= '}';


    return $pstgb_css;
 }