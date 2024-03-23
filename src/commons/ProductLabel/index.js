/* eslint-disable camelcase */
import React from 'react';
import Badge from '@common_badge';
import Show from '@common_show';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

const generateNew = ({ newFromDate, newToDate }) => {
    let showLabelNew = false;
    const nowTime = new Date(Date.now()).getTime();
    if (newFromDate === null && newToDate === null) {
        showLabelNew = false;
    }

    if (newFromDate !== null && newToDate === null) {
        const startTime = new Date(newFromDate).getTime();
        if (nowTime >= startTime) {
            showLabelNew = true;
        }
    }

    if (newFromDate === null && newToDate !== null) {
        const endTime = new Date(newToDate).getTime();
        if (nowTime <= endTime) {
            showLabelNew = true;
        }
    }

    if (newFromDate !== null && newToDate !== null) {
        const startTime = new Date(newFromDate).getTime();
        const endTime = new Date(newToDate).getTime();
        if (nowTime >= startTime && endTime >= nowTime) {
            showLabelNew = true;
        }
    }

    return showLabelNew;
};

const generateSale = ({
    specialFromDate, specialToDate, priceRange, productType,
}) => {
    let validSpecial = false;
    const isBundleOrAw = productType === 'BundleProduct' || productType === 'AwGiftCardProduct';
    const nowTime = new Date(Date.now()).getTime();
    if (specialFromDate && specialFromDate !== null) {
        const startTime = new Date(specialFromDate).getTime();
        validSpecial = true;
        if (nowTime < startTime) validSpecial = false;
    }
    if (specialToDate && specialToDate !== null) {
        const endTime = new Date(specialToDate).getTime();
        validSpecial = true;
        if (nowTime > endTime) validSpecial = false;
    }
    const regularPrice = priceRange?.minimum_price?.regular_price || 0;
    const finalPrice = priceRange?.minimum_price?.final_price || 0;

    if (regularPrice.value > finalPrice.value) {
        validSpecial = true;
    }

    if (isBundleOrAw) {
        validSpecial = false;
    }

    return validSpecial;
};

const ProductLabel = ({
    className,
    classNameBadge,
    config,
    stockStatus,
    priceRange,
    specialFromDate,
    specialToDate,
    newFromDate,
    newToDate,
    fontSizeBadge,
    productType,
}) => {
    const { t } = useTranslation(['common', 'cart']);
    const IS_OOS = stockStatus === 'OUT_OF_STOCK';
    const showLabelNew = generateNew({ newFromDate, newToDate });
    const showSale = generateSale({
        priceRange, specialFromDate, specialToDate, productType,
    });

    return (
        <div className={cx('product-label', className)}>
            <Show when={IS_OOS}>
                <Badge
                    bold
                    className={cx('product-label-new !bg-neutral-250 uppercase mb-[6px]')}
                    label={t('common:cart:oos')}
                    fontSize={fontSizeBadge}
                    softColor
                />
            </Show>
            <Show when={!IS_OOS && config.enable && config.new.enable && showLabelNew}>
                <Badge
                    bold
                    success
                    className={cx('product-label-new uppercase', classNameBadge)}
                    label={t('common:title:new')}
                    fontSize={fontSizeBadge}
                    softColor
                />
            </Show>
            <Show when={!IS_OOS && config.enable && config.sale.enable && showSale}>
                <Badge
                    bold
                    danger
                    className={cx('product-label-sale uppercase', showLabelNew && 'mt-[4px]', classNameBadge)}
                    label={`${t('common:title:sale')}!`}
                    fontSize={fontSizeBadge}
                    softColor
                />
            </Show>
        </div>
    );
};

export default ProductLabel;
