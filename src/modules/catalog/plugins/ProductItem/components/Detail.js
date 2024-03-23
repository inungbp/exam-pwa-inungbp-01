/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import RatingStar from '@common_ratingstar';
import Typography from '@common_typography';
import Link from 'next/link';
import React from 'react';
import cx from 'classnames';

import Show from '@common/Show';
import dynamic from 'next/dynamic';
import parser from 'html-react-parser';

const CmsRenderer = dynamic(() => import('@core_modules/cms/components/cms-renderer'));

const Detail = (props) => {
    const {
        handleClick,
        name,
        ratingValue,
        enableRating,
        storeConfig = {},
        seller,
        urlKey,
        showShortDescription = false,
        short_description,
        Pricing,
        isGrid = true,
        enableProductName = true,
    } = props;
    const showRating = typeof enableRating !== 'undefined' ? enableRating : storeConfig?.pwa?.rating_enable;
    const enableMultiSeller = storeConfig.enable_oms_multiseller === '1' || storeConfig.enable_oms_multiseller === 1;

    let shortDescription = '';

    if (typeof short_description === 'string') {
        shortDescription = '';
    } else if (short_description) {
        shortDescription = short_description.html;
    }

    return (
        <div className="flex flex-col gap-1 relative w-full">
            <Show when={enableMultiSeller && seller && seller?.seller_name}>
                <Link href={`/seller/${seller?.seller_path}`}>
                    <Typography
                        variant="bd-2"
                        className={cx(
                            'line-clamp-1 capitalize',
                            'leading-5',
                            isGrid && 'text-sm tablet:text-base',
                            !isGrid && 'text-xs tablet:text-base',
                        )}
                        color="text-primary"
                    >
                        {parser(seller?.seller_name || '')}
                    </Typography>
                </Link>
            </Show>
            <Show when={enableProductName}>
                <Link
                    href="/[...slug]"
                    as={`/${urlKey}`}
                    className="w-full min-h-12 plugin-productTitle-typography"
                    onClick={() => handleClick(props)}
                >
                    <Typography
                        className={cx(
                            'font-medium line-clamp-2 mb-[6px] capitalize text-center',
                            isGrid && 'text-[14px] tablet:text-[16px]',
                            !isGrid && 'text-sm tablet:text-[16px]',
                            'leading-lg tablet:leading-2lg',
                        )}
                    >
                        {parser(name)}
                    </Typography>
                </Link>
            </Show>
            <Show when={showShortDescription && shortDescription && !isGrid}>
                <div className="hidden tablet:flex !line-clamp-2 text-base text-neutral-500 leading-5">
                    <CmsRenderer content={shortDescription} />
                </div>
            </Show>

            <Show when={showRating}>
                <div className="flex justify-center">
                    <RatingStar value={ratingValue} sizeIcon="sm" prefixName={urlKey} />
                </div>
            </Show>
            {Pricing && Pricing}
        </div>
    );
};

export default Detail;
