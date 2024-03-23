/* eslint-disable camelcase */
/* eslint-disable no-nested-ternary */
import Typography from '@common_typography/index';
import { formatPrice } from '@helper_currency';
import useMediaQuery from '@hook/useMediaQuery';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import React from 'react';

const getLowestTierPrice = (tier_price) => {
    let lowestTierPrice;
    let min = Number.POSITIVE_INFINITY;
    tier_price.forEach((price) => {
        if (price.final_price.value < min) {
            min = price.final_price.value;
            lowestTierPrice = price;
        }
    });

    return lowestTierPrice;
};

const AsLowAsText = (textClassName) => {
    const { t } = useTranslation(['common']);
    return (
        <Typography variant="bd-3b" className={cx('price-text', 'text-neutral-500', textClassName)}>
            {` ${t('common:price:asLowAs')} `}
        </Typography>
    );
};

const StartingAt = (textClassName) => {
    const { t } = useTranslation(['common']);
    return (
        <Typography variant="bd-3b" className={cx('price-text', 'text-neutral-500', textClassName)}>
            {` ${t('common:price:startFrom')} `}
        </Typography>
    );
};

const SimpleProductTypePrice = ({
    variant = 'lg',
    productType,
    priceRange,
    priceTiers,
    specialFromDate,
    specialToDate,
    currencyCache,
    isPdp,
    isQuickView,
    additionalPrice = 0,
    textClassName = '',
}) => {
    const regularPrice = priceRange?.minimum_price?.regular_price || 0;
    const finalPrice = priceRange?.minimum_price?.final_price || 0;
    const otherPrice = additionalPrice || 0;
    const nowTime = new Date(Date.now());
    const startTime = new Date(specialFromDate);
    const endTime = new Date(specialToDate);
    const { isDesktop } = useMediaQuery();
    const isVariantLg = variant === 'lg';
    const priceVariantDesktopLabel = isVariantLg ? 'bd-1c' : 'bd-1a';
    const priceVariantDesktopLabelSub = isVariantLg ? 'bd-2b' : 'bd-3b';
    const priceVariantMobileLabel = isVariantLg ? (isPdp ? 'bd-1c' : 'h2') : 'bd-2';
    const priceVariantMobileLabelSub = isVariantLg ? 'bd-2b' : 'bd-3b';
    const priceLabelVariant = isDesktop ? priceVariantDesktopLabel : priceVariantMobileLabel;
    const priceLabelSubVariant = isDesktop ? priceVariantDesktopLabelSub : priceVariantMobileLabelSub;
    let validSpecial = true;
    if (specialFromDate && specialToDate) {
        validSpecial = nowTime >= startTime && nowTime <= endTime;
    }

    if (productType === 'GroupedProduct') {
        return (
            <div className="price-case-grouped">
                <StartingAt textClassName={textClassName} />
                <Typography variant={priceLabelVariant} className={cx('price-text', textClassName)}>
                    {formatPrice(finalPrice.value + otherPrice, finalPrice.currency, currencyCache)}
                </Typography>
            </div>
        );
    }

    // if has tierprice
    if (priceTiers && priceTiers.length) {
        const lowestPriceTier = getLowestTierPrice(priceTiers);
        // if there are several tierprices
        if (priceTiers.length > 1) {
            // case 1: if has no discount
            if (regularPrice.value === finalPrice.value) {
                return (
                    <div className="price-case-1">
                        {/* case 1 */}
                        <Typography variant={priceLabelVariant} className={cx('price-text', textClassName)}>
                            {formatPrice(finalPrice.value + otherPrice, finalPrice.currency, currencyCache)}
                        </Typography>
                        {!isPdp && !isQuickView && (
                            <div>
                                <AsLowAsText textClassName={textClassName} />
                                <Typography variant={priceLabelSubVariant} className={cx('price-text', 'text-neutral-600', textClassName)}>
                                    {formatPrice(lowestPriceTier.final_price.value + otherPrice, lowestPriceTier.final_price.currency, currencyCache)}
                                </Typography>
                            </div>
                        )}
                    </div>
                );
            }
            // case 2: if final price is lowest than lowest tier price
            if (finalPrice.value < lowestPriceTier.final_price.value) {
                return (
                    <div className="price-case-2">
                        {/* case 2 */}
                        <Typography variant={priceLabelVariant} className={cx('price-text', textClassName)}>
                            {formatPrice(finalPrice.value + otherPrice, finalPrice.currency, currencyCache)}
                        </Typography>
                        <Typography variant={priceLabelSubVariant} className={cx('price-text', textClassName)}>
                            <strike>{formatPrice(regularPrice.value + otherPrice, regularPrice.currency, currencyCache)}</strike>
                        </Typography>
                    </div>
                );
            }
            // case 3: if final price is higher than lowest tier price
            return (
                <div className="price-case-3">
                    {/* case 3 */}
                    <div className="flex flex-col">
                        <Typography variant={priceLabelVariant} className={cx('price-text', textClassName)}>
                            {formatPrice(finalPrice.value + otherPrice, finalPrice.currency, currencyCache)}
                        </Typography>
                        <Typography variant={priceLabelSubVariant} className={cx('price-text', textClassName)}>
                            <strike>{formatPrice(regularPrice.value + otherPrice, regularPrice.currency, currencyCache)}</strike>
                        </Typography>
                    </div>
                    {!isPdp && !isQuickView && (
                        <>
                            <AsLowAsText textClassName={textClassName} />
                            <Typography variant={priceLabelSubVariant} className={cx('price-text', 'text-neutral-600', textClassName)}>
                                {formatPrice(lowestPriceTier.final_price.value + otherPrice, lowestPriceTier.final_price.currency, currencyCache)}
                            </Typography>
                        </>
                    )}
                </div>
            );
        }

        // else:
        // if there is only one tierprice
        const firstTierPrice = priceTiers[0];
        // case 4: if there is no discount and has tier price
        if (regularPrice.value === finalPrice.value) {
            return (
                <div className="price-case-4">
                    {/* case 4 */}
                    <Typography variant={priceLabelVariant} className={cx('price-text', textClassName)}>
                        {formatPrice(firstTierPrice.final_price.value + otherPrice, firstTierPrice.final_price.currency, currencyCache)}
                    </Typography>
                    <Typography variant={priceLabelSubVariant} className={cx('price-text')}>
                        <strike>{formatPrice(regularPrice.value + otherPrice, regularPrice.currency, currencyCache)}</strike>
                    </Typography>
                </div>
            );
        }
        // case 5: if final price is lower than tier price
        if (finalPrice.value < firstTierPrice.final_price.value) {
            return (
                <div className="price-case-5">
                    {/* case 5 */}
                    <Typography variant={priceLabelVariant} className={cx('price-text', textClassName)}>
                        {formatPrice(finalPrice.value + otherPrice, finalPrice.currency, currencyCache)}
                    </Typography>
                    <Typography variant={priceLabelSubVariant} className={cx('price-text', textClassName)}>
                        <strike>{formatPrice(regularPrice.value + otherPrice, regularPrice.currency, currencyCache)}</strike>
                    </Typography>
                </div>
            );
        }
        // case 6: if tier price is lower than final price and tier price qty is 1
        if (firstTierPrice.quantity === 1 || finalPrice.value === firstTierPrice.final_price.value) {
            return (
                <div className="price-case-6">
                    {/* case 6 */}
                    <Typography variant={priceLabelVariant} className={cx('price-text', textClassName)}>
                        {formatPrice(firstTierPrice.final_price.value + otherPrice, firstTierPrice.final_price.currency, currencyCache)}
                    </Typography>
                    <Typography variant={priceLabelSubVariant} className={cx('price-text', textClassName)}>
                        <strike>{formatPrice(regularPrice.value + otherPrice, regularPrice.currency, currencyCache)}</strike>
                    </Typography>
                </div>
            );
        }

        // case 7: if tier price is lower than final price but tier price qty > 1
        return (
            <div className="price-case-7">
                {/* case 7 */}
                <div className="flex flex-col">
                    <Typography variant={priceLabelVariant} className={cx('price-text', textClassName)}>
                        {formatPrice(finalPrice.value + otherPrice, finalPrice.currency, currencyCache)}
                    </Typography>
                    <Typography variant={priceLabelSubVariant} className={cx('price-text', textClassName)}>
                        <strike>{formatPrice(regularPrice.value + otherPrice, regularPrice.currency, currencyCache)}</strike>
                    </Typography>
                </div>
                {!isPdp && !isQuickView && (
                    <>
                        <AsLowAsText textClassName={textClassName} />
                        <Typography variant={priceLabelSubVariant} className={cx('price-text', 'text-neutral-600', textClassName)}>
                            {formatPrice(firstTierPrice.final_price.value + otherPrice, firstTierPrice.final_price.currency, currencyCache)}
                        </Typography>
                    </>
                )}
            </div>
        );
    }

    // else:
    // if there is no tier price

    // case 8: if there is no discount
    if (regularPrice.value === finalPrice.value) {
        return (
            <Typography
                variant={priceLabelVariant}
                className={cx('price-text', 'text-neutral-400', '!text-2xl', '!font-semibold', 'price-case-8', textClassName)}
            >
                {formatPrice(finalPrice.value + otherPrice, finalPrice.currency, currencyCache)}
            </Typography>
        );
    }
    // case 9: if has discount
    return (
        <div className={cx('price-case-9 price-text-discount', 'inline-flex', 'flex-col')}>
            {/* case 9 */}
            <Typography variant={priceLabelVariant} className={cx('price-text', 'text-neutral-400', '!text-2xl', '!font-semibold', textClassName)}>
                {validSpecial
                    ? formatPrice(finalPrice.value + otherPrice, finalPrice.currency, currencyCache)
                    : formatPrice(regularPrice.value + otherPrice, regularPrice.currency, currencyCache)}
            </Typography>
            {validSpecial && (
                <Typography variant={priceLabelSubVariant} className={cx('price-text', textClassName)}>
                    <strike>{formatPrice(regularPrice.value + otherPrice, regularPrice.currency, currencyCache)}</strike>
                </Typography>
            )}
        </div>
    );
};

export default SimpleProductTypePrice;
