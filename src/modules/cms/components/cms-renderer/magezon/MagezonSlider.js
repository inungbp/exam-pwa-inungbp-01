/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-return-assign */

import Image from '@common_image';
import MagezonButton from '@core_modules/cms/components/cms-renderer/magezon/MagezonButton';
import MagezonHeading from '@core_modules/cms/components/cms-renderer/magezon/MagezonHeading';
import MagezonLink from '@core_modules/cms/components/cms-renderer/magezon/MagezonLink';
import { getStoreHost } from '@helpers/config';
import ChevronLeft from '@heroicons/react/20/solid/ChevronLeftIcon';
import ChevronRight from '@heroicons/react/20/solid/ChevronRightIcon';
import { BREAKPOINTS } from '@core/theme/vars';
import cx from 'classnames';
import React, { useRef, useState, Fragment } from 'react';
import Slider from 'react-slick';
import useMediaQuery from '@hook/useMediaQuery';

const VideoContent = (props) => {
    const {
        background_type, youtube_id, vimeo_id, local_link, autoplay, loop, control, mute,
    } = props;
    let videoUrl;

    const additionalVideoProps = `${autoplay ? '&autoplay=1' : ''}${loop ? '&loop=1' : ''}${control ? '&controls=1' : ''}${mute ? '&mute=1' : ''}`;

    if (background_type === 'youtube') videoUrl = `https://www.youtube.com/embed/${youtube_id}?${additionalVideoProps}`;
    if (background_type === 'vimeo') videoUrl = `https://player.vimeo.com/video/${vimeo_id}?${additionalVideoProps}`;
    if (background_type === 'local') {
        return (
            <video autoPlay={autoplay} controls={control} muted={mute} loop={loop}>
                <source src={local_link} />
                <track kind="captions" />
                Sorry, your browser does not support embedded videos.
            </video>
        );
    }

    return (
        <iframe
            style={{ width: '100%', height: '100%' }}
            src={videoUrl}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded Video"
        />
    );
};

const MagezonSliderContent = (props) => {
    const {
        heading,
        heading_animation,
        heading_bg_color,
        heading_color,
        heading_font_size,
        heading_line_height,
        heading_padding,
        heading_font_weight,
        heading_type,
        caption1,
        caption1_animation,
        caption1_bg_color,
        caption1_color,
        caption1_font_size,
        caption1_font_weight,
        caption1_line_height,
        caption1_padding,
        caption1_type,
        caption2,
        caption2_animation,
        caption2_bg_color,
        caption2_color,
        caption2_font_size,
        caption2_font_weight,
        caption2_line_height,
        caption2_padding,
        caption2_type,
        content_align,
        content_padding,
        content_position,
        content_width,
        content_wrapper_width,
        youtube_id,
        vimeo_id,
        local_link,
        image,
        background_type,
        slider_height,
        slider_height_mobile,
        button1,
        button1_font_size,
        button2,
        button1_bg_color,
        button2_bg_color,
        button1_color,
        button2_color,
        button2_font_size,
        button1_link,
        button2_link,
        button1_size,
        button2_size,
        button1_border_style,
        button2_border_style,
        button1_border_color,
        button1_border_width,
        button1_hover_bg_color,
        button1_hover_border_color,
        button1_hover_color,
        button2_border_color,
        button2_border_width,
        button2_hover_bg_color,
        button2_hover_border_color,
        button2_hover_color,
        link_type,
        storeConfig,
        preload,
        width,
        height,
        width_mobile,
        height_mobile,
        autoplay,
        loop,
        control,
        mute,
    } = props;
    const mediaUrl = `${getStoreHost()}media`;
    const { isMobile } = useMediaQuery();
    const sliderHeight = isMobile ? `${slider_height_mobile}` : `${slider_height}px`;

    const otherButton1Props = {
        button_border_color: button1_border_color,
        button_border_width: button1_border_width,
        button_hover_background_color: button1_hover_bg_color,
        button_hover_border_color: button1_hover_border_color,
        button_hover_color: button1_hover_color,
    };
    const otherButton2Props = {
        button_border_color: button2_border_color,
        button_border_width: button2_border_width,
        button_hover_background_color: button2_hover_bg_color,
        button_hover_border_color: button2_hover_border_color,
        button_hover_color: button2_hover_color,
    };
    const otherVideoProps = {
        autoplay,
        loop,
        control,
        mute,
    };

    return (
        <>
            {background_type !== 'image' ? (
                <div style={{ height: sliderHeight }}>
                    <VideoContent
                        background_type={background_type}
                        youtube_id={youtube_id}
                        vimeo_id={vimeo_id}
                        local_link={local_link}
                        {...otherVideoProps}
                    />
                </div>
            ) : (
                <div className="magezon-slide">
                    <div
                        className={cx('magezon-slide-captions', 'relative', 'z-10', 'w-full', 'h-full', {
                            'justify-center': content_position.indexOf('center') !== -1,
                            'items-center': content_position.indexOf('middle') !== -1,
                        })}
                    >
                        <div
                            className={cx('absolute', {
                                'right-[10%]': content_position.indexOf('right') !== -1,
                                'left-[10%]': content_position.indexOf('left') !== -1,
                                'top-[10%]': content_position.indexOf('top') !== -1,
                                'bottom-[10%]': content_position.indexOf('bottom') !== -1,
                            })}
                        >
                            {heading && (
                                <div className="magezon-slide-heading" data-animate={heading_animation}>
                                    <MagezonHeading
                                        text={heading}
                                        heading_type={heading_type}
                                        font_size={heading_font_size}
                                        color={heading_color}
                                        font_weight={heading_font_weight}
                                    />
                                </div>
                            )}
                            {caption1 && (
                                <div className="magezon-slide-caption1" data-animate={caption1_animation}>
                                    <MagezonHeading
                                        text={caption1}
                                        heading_type={caption1_type}
                                        font_size={caption1_font_size}
                                        color={caption1_color}
                                        font_weight={caption1_font_weight}
                                    />
                                </div>
                            )}
                            {caption2 && (
                                <div className="magezon-slide-caption2" data-animate={caption2_animation}>
                                    <MagezonHeading
                                        text={caption2}
                                        heading_type={caption2_type}
                                        font_size={caption2_font_size}
                                        color={caption2_color}
                                        font_weight={caption2_font_weight}
                                    />
                                </div>
                            )}
                            {link_type === 'button' && (
                                <div
                                    className={cx('magezon-slide-button', {
                                        'justify-start': content_align === 'left',
                                        'justify-end': content_align === 'right',
                                        'justify-center': content_align === 'center',
                                    })}
                                >
                                    {button1 && (
                                        <MagezonButton
                                            link={button1_link}
                                            title={button1}
                                            button_size={button1_size}
                                            button_font_size={button1_font_size}
                                            button_color={button1_color}
                                            button_background_color={button1_bg_color}
                                            button_border_style={button1_border_style}
                                            button_align="center"
                                            {...otherButton1Props}
                                        />
                                    )}
                                    {button2 && (
                                        <MagezonButton
                                            link={button2_link}
                                            title={button2}
                                            button_size={button2_size}
                                            button_font_size={button2_font_size}
                                            button_color={`${button2_color || '#333'}`}
                                            button_background_color={`${button2_bg_color || '#e3e3e3'}`}
                                            button_border_style={button2_border_style}
                                            button_align="center"
                                            {...otherButton2Props}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="magezon-slide-image">
                        <Image
                            src={`${mediaUrl}/${image}`}
                            srcMobile={`${mediaUrl}/${image}`}
                            alt={heading}
                            width={width}
                            height={height}
                            widthMobile={width_mobile}
                            heightMobile={height_mobile}
                            useContainer={false}
                            storeConfig={storeConfig}
                            preload={preload}
                            className="flex w-full h-full"
                            style={{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                objectFit: 'cover',
                            }}
                        />
                    </div>
                </div>
            )}
            <style jsx>
                {`
                    .magezon-slide {
                        height: ${slider_height}px;
                    }
                    .magezon-slide-image {
                        height: ${slider_height}px;
                        overflow: hidden;
                    }
                    @media screen and (min-width: ${BREAKPOINTS.xs}px) and (max-width: ${BREAKPOINTS.md}px) {
                        .magezon-slide {
                            height: 310px;
                        }
                        .magezon-slide-image {
                            height: 310px;
                        }
                    }
                    .magezon-slide-image img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                    .magezon-slide-content-wrapper {
                        display: flex;
                        justify-content: flex-start;
                    }
                    .magezon-slide-captions {
                        display: flex;
                        margin: 0 auto;
                        ${content_wrapper_width ? `max-width: ${content_wrapper_width}px;` : ''}
                    }
                    .magezon-slide-captions > div {
                        ${content_width ? `max-width: ${content_width}px;` : ''}
                        text-align: ${content_align};
                        ${content_padding ? `padding: ${content_padding}px;` : ''}
                    }
                    .magezon-slide-heading {
                        background-color: ${heading_bg_color};
                    }
                    .magezon-slide-caption1 {
                        background-color: ${caption1_bg_color};
                    }
                    .magezon-slide-caption2 {
                        background-color: ${caption2_bg_color};
                    }
                    .magezon-slide-heading {
                        margin-bottom: 15px;
                    }
                    .magezon-slide-heading :global(.magezon-heading :is(h1, h2, h3, h4, h5, h6)) {
                        ${heading_line_height ? `line-height: ${heading_line_height}px;` : ''}
                        ${heading_padding ? `padding: ${heading_padding}px;` : ''}
                        margin: 0;
                    }
                    .magezon-slide-caption1 :global(.magezon-heading :is(h1, h2, h3, h4, h5, h6)) {
                        ${caption1_line_height ? `line-height: ${caption1_line_height}px;` : ''}
                        ${caption1_padding ? `padding: ${caption1_padding}px;` : ''}
                        margin: 0;
                    }
                    .magezon-slide-caption2 :global(.magezon-heading :is(h1, h2, h3, h4, h5, h6)) {
                        ${caption2_line_height ? `line-height: ${caption2_line_height}px;` : ''}
                        ${caption2_padding ? `padding: ${caption2_padding}px;` : ''}
                        margin: 0;
                    }
                    .magezon-slide-captions :global(.magezon-heading) {
                        justify-content: center;
                    }
                    .magezon-slide-button {
                        display: flex;
                        gap: 10px;
                    }
                `}
            </style>
        </>
    );
};

const useHoverStyle = (hoverEffect) => {
    let unhoverStyle = '';
    let hoverStyle = '';
    if (hoverEffect === 'zoomin' || hoverEffect === 'zoomout') {
        unhoverStyle = 'transition: transform 1s, filter 2s ease-in-out; transform-origin: center; transform: scale(1);';
        hoverStyle = 'transition: transform 1s, filter 2s ease-in-out; transform-origin: center;';
    }
    if (hoverEffect === 'zoomin') hoverStyle += 'transform: scale(1.02);';
    if (hoverEffect === 'zoomout') hoverStyle += 'transform: scale(0.98);';

    return { unhoverStyle, hoverStyle };
};

const MagezonSlider = (props) => {
    const {
        items,
        image_hover_effect,
        content_position,
        owl_nav,
        owl_lazyLoad,
        owl_loop,
        owl_autoplay,
        owl_autoplay_timeout,
        owl_rtl,
        owl_nav_size,
        owl_nav_position,
        owl_animate_in,
        owl_animate_out,
        owl_active_background_color,
        owl_background_color,
        owl_color,
        owl_hover_background_color,
        owl_hover_color,
        owl_dots_insie,
        slider_height,
        storeConfig,
    } = props;

    const [slideIdx, setSlideIndex] = useState(0);
    const { unhoverStyle, hoverStyle } = useHoverStyle(image_hover_effect);

    let slideHeight = storeConfig.pwa?.magezon_slider_desktop_height;
    let slideWidth = storeConfig.pwa?.magezon_slider_desktop_width;
    let slideHeightMobile = storeConfig.pwa?.magezon_slider_mobile_height;
    let slideWidthMobile = storeConfig.pwa?.magezon_slider_mobile_width;
    slideHeight = typeof slideHeight === 'string' ? parseInt(slideHeight, 10) : slideHeight;
    slideWidth = typeof slideWidth === 'string' ? parseInt(slideWidth, 10) : slideWidth;
    slideHeightMobile = typeof slideHeightMobile === 'string' ? parseInt(slideHeightMobile, 10) : slideHeightMobile;
    slideWidthMobile = typeof slideWidthMobile === 'string' ? parseInt(slideWidthMobile, 10) : slideWidthMobile;

    const navSize = owl_nav_size === 'mini' ? 10 : owl_nav_size === 'small' ? 15 : owl_nav_size === 'normal' ? 20 : 25;
    let sliderRef = useRef();

    const settings = {
        arrows: false,
        infinite: owl_loop,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: owl_autoplay,
        autoplaySpeed: owl_autoplay_timeout || 2000,
        adaptiveHeight: false,
        pauseOnHover: true,
        lazyLoad: owl_lazyLoad,
        rtl: owl_rtl,
        beforeChange: (oldIdx, newIdx) => {
            setSlideIndex(newIdx);

            const containerEl = sliderRef.innerSlider.list.querySelector(`[data-index="${newIdx}"] > div > div`);
            const prevContainerEl = sliderRef.innerSlider.list.querySelector(`[data-index="${oldIdx}"] > div > div`);

            if (owl_animate_out) {
                prevContainerEl.classList.add('animate__animated', `animate__${owl_animate_out}`);
                containerEl.classList.add('animate__animated', `animate__${owl_animate_in}`);

                if (prevContainerEl.classList.contains(`animate__${owl_animate_in}`)) {
                    prevContainerEl.classList.remove('animate__animated', `animate__${owl_animate_in}`);
                    prevContainerEl.classList.add('animate__animated', `animate__${owl_animate_out}`);
                }

                if (containerEl.classList.contains(`animate__${owl_animate_out}`)) {
                    containerEl.classList.remove('animate__animated', `animate__${owl_animate_out}`);
                    containerEl.classList.add('animate__animated', `animate__${owl_animate_in}`);
                }
            }

            const el = sliderRef.innerSlider.list.querySelectorAll(`
                [data-index="${newIdx}"] .magezon-slide-heading,
                [data-index="${newIdx}"] .magezon-slide-caption1,
                [data-index="${newIdx}"] .magezon-slide-caption2
            `);
            const prevEl = sliderRef.innerSlider.list.querySelectorAll(`
                [data-index="${oldIdx}"] .magezon-slide-heading,
                [data-index="${oldIdx}"] .magezon-slide-caption1,
                [data-index="${oldIdx}"] .magezon-slide-caption2
            `);

            prevEl.forEach((element) => {
                element.classList.remove('animate__animated', `animate__${element.dataset.animate}`);
            });

            setTimeout(() => {
                el.forEach((element) => {
                    const animValue = element.dataset.animate;
                    if (animValue) {
                        element.classList.add('animate__animated', `animate__${element.dataset.animate}`);
                    }
                });
            }, 1000);
        },
    };

    return (
        <>
            <div className="magezon-slider group flex flex-col relative">
                {owl_nav ? (
                    <div
                        className={cx('flex', 'justify-between', 'pointer-events-none', {
                            'order-3': owl_nav_position.indexOf('bottom') !== -1,
                            '!justify-start': owl_nav_position.indexOf('left') !== -1,
                            '!justify-end': owl_nav_position.indexOf('right') !== -1,
                            '!justify-center': owl_nav_position === 'bottom_center',
                            'opacity-100 max-tablet:opacity-0 absolute w-full top-[50%] -translate-y-[50%] z-[2]':
                                owl_nav_position === 'center_split',
                        })}
                    >
                        <div
                            className={cx(
                                'magezon-slider--button-nav-item',
                                'cursor-pointer',
                                'pointer-events-auto',
                                'text-[1.5rem]',
                                '!bg-[rgba(18,18,18,0.40)]',
                                'p-[10px]',
                                'rounded-[50%]',
                                'flex-col',
                                'justify-center',
                                'items-center',
                                'w-[40px]',
                                'h-[40px]',
                                'cursor-pointer',
                                'hidden',
                                'group-hover:flex',
                                'shadow-md',
                                'ml-10',
                            )}
                            onClick={() => sliderRef.slickPrev()}
                        >
                            <ChevronLeft className="w-6 h-6 text-neutral-white" />
                        </div>
                        <div
                            className={cx(
                                'magezon-slider--button-nav-item',
                                'cursor-pointer',
                                'pointer-events-auto',
                                'text-[1.5rem]',
                                '!bg-[rgba(18,18,18,0.40)]',
                                'p-[10px]',
                                'rounded-[50%]',
                                'flex-col',
                                'justify-center',
                                'items-center',
                                'w-[40px]',
                                'h-[40px]',
                                'cursor-pointer',
                                'hidden',
                                'group-hover:flex',
                                'shadow-md',
                                'mr-10',
                            )}
                            onClick={() => sliderRef.slickNext()}
                        >
                            <ChevronRight className="w-6 h-6 text-neutral-white" />
                        </div>
                    </div>
                ) : null}
                <div className="magezon-slider-inner z-auto">
                    <Slider ref={(slider) => (sliderRef = slider)} {...settings}>
                        {items.map((item, i) => (
                            <Fragment key={i}>
                                {item?.link_type !== 'full' ? (
                                    <MagezonSliderContent
                                        key={i}
                                        slider_height={slideHeight}
                                        slider_height_mobile={slideHeightMobile}
                                        content_position={content_position}
                                        height={slideHeight}
                                        width={slideWidth}
                                        height_mobile={slideHeightMobile}
                                        width_mobile={slideWidthMobile}
                                        storeConfig={storeConfig}
                                        {...item}
                                        preload={i === 0}
                                    />
                                ) : (
                                    <MagezonLink link={item?.slide_link}>
                                        <MagezonSliderContent
                                            key={i}
                                            slider_height={slideHeight}
                                            slider_height_mobile={slideHeightMobile}
                                            content_position={content_position}
                                            height={slideHeight}
                                            width={slideWidth}
                                            height_mobile={slideHeightMobile}
                                            width_mobile={slideWidthMobile}
                                            storeConfig={storeConfig}
                                            {...item}
                                            preload={i === 0}
                                        />
                                    </MagezonLink>
                                )}
                            </Fragment>
                        ))}
                    </Slider>
                </div>
                <div
                    className={cx('magezon-slider--dot-nav', 'hidden', 'z-auto', 'flex', 'justify-center', 'items-center', 'mt-[10px]', 'min-h-[20px]', {
                        'absolute bottom-[24px] left-0 right-0': owl_dots_insie,
                    })}
                >
                    {items.map((item, id) => (
                        <div
                            key={id}
                            className={cx(
                                'magezon-slider--dot-nav-item',
                                'cursor-pointer',
                                'rounded-full',
                                'shadow-base',
                                'w-[6px] tablet:w-[10px] desktop:w-3',
                                'h-[6px] tablet:h-[10px] desktop:h-3',
                                'mx-[6px]',
                                {
                                    'magezon-slider--dot-nav-item-active': slideIdx === id,
                                    'bg-primary-100 !shadow-[0_0_0_3px] !shadow-primary': slideIdx === id,
                                    'bg-neutral-white': slideIdx !== id,
                                },
                            )}
                            onClick={() => sliderRef.slickGoTo(id)}
                        />
                    ))}
                </div>
            </div>
            <style jsx>
                {`
                    .magezon-slider {
                        position: relative;
                    }
                    .magezon-slider-inner {
                        height: ${slider_height}px;
                    }
                    .magezon-slider-inner :global(.slick-slide) {
                        height: auto;
                    }
                    .magezon-slider-inner :global(.slick-track) {
                        height: ${slider_height}px;
                        display: flex;
                        flex-direction: row;
                        flex-wrap: nowrap;
                        align-items: center;
                        justify-content: center;
                    }
                    @media screen and (min-width: ${BREAKPOINTS.xs}px) and (max-width: ${BREAKPOINTS.md}px) {
                        .magezon-slider-inner {
                            height: 310px;
                        }
                        .magezon-slider-inner :global(.slick-track) {
                            height: 310px;
                        }
                    }
                    .magezon-slider-inner :global(.slick-arrow:before) {
                        font-size: 20px;
                    }
                    .magezon-slider-inner :global(.slick-arrow) {
                        z-index: 99;
                        ${owl_nav ? '' : 'display: none !important;'}
                    }
                    .magezon-slider-inner :global(.slick-arrow.slick-prev) {
                        left: 12px;
                    }
                    .magezon-slider-inner :global(.slick-arrow.slick-next) {
                        right: 12px;
                    }
                    .magezon-slider-inner :global(.magezon-slide) {
                        text-align: center;
                        position: relative;
                        background-color: #ddd;
                        background-position: center;
                        background-size: cover;
                        background-repeat: no-repeat;
                        margin: 0 1px;
                        ${unhoverStyle}
                    }
                    .magezon-slider-inner :global(.magezon-slide:hover) {
                        ${hoverStyle}
                    }
                    @media screen and (min-width: 768px) {
                        .magezon-slider-inner :global(.slick-arrow:before) {
                            font-size: 24px;
                        }
                        .magezon-slider-inner :global(.slick-arrow.slick-prev) {
                            left: 16px;
                        }
                        .magezon-slider-inner :global(.slick-arrow.slick-next) {
                            right: 16px;
                        }
                    }
                    .magezon-slider--button-nav-item {
                        position: relative;
                        background-color: ${owl_background_color || '#eee'};
                        width: ${navSize * 2}px;
                        height: ${navSize * 2}px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition:
                            opacity 0.3s ease-in-out,
                            background-color 0.3s ease-in-out,
                            color 0.3s ease-in-out;
                    }
                    .magezon-slider--button-nav-item :global(svg) {
                        color: ${owl_color};
                    }
                    .magezon-slider--button-nav-item:hover {
                        ${owl_hover_background_color ? `background-color: ${owl_hover_background_color};` : ''}
                    }
                    .magezon-slider--button-nav-item:hover :global(svg) {
                        ${owl_hover_color ? `color: ${owl_hover_color};` : ''}
                    }
                    .magezon-slider-nav-bottom {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                    .magezon-slider-inner :global(.custom-slick-dots) {
                        width: 10px;
                        height: 10px;
                        background-color: ${owl_background_color || '#eee'};
                        border-radius: 50px;
                        transition: transform 0.5s;
                    }
                    .magezon-slider--dot-nav-item {
                        ${owl_active_background_color
            ? `
                            background-color: ${owl_background_color} !important;
                            border: unset !important;
                        `
            : ''};
                    }
                    .magezon-slider--dot-nav-item-active {
                        ${owl_active_background_color
            ? `
                            background-color: ${owl_active_background_color} !important;
                            border: unset !important;
                        `
            : ''};
                    }
                `}
            </style>
        </>
    );
};

export default MagezonSlider;
