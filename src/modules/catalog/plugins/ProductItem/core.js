/* eslint-disable eqeqeq */
import { debuging, modules } from '@config';
import { getLoginInfo } from '@helper_auth';
import { setCookies, getCookies } from '@helper_cookies';
import { useTranslation } from 'next-i18next';
import route, { useRouter } from 'next/router';
import { useQuery, useReactiveVar } from '@apollo/client';
import React, { useMemo } from 'react';
import { setResolver, getResolver } from '@helper_localstorage';
import { getSessionStorage, setSessionStorage } from '@helpers/sessionstorage';
import classNames from 'classnames';
import ConfigurableOpt from '@plugin_optionitem';
import { addWishlist, getDetailProduct } from '@core_modules/catalog/services/graphql';
import { addProductsToCompareList } from '@core_modules/product/services/graphql';
import { getCustomerUid } from '@core_modules/productcompare/service/graphql';
import { localCompare } from '@services/graphql/schema/local';
import { getStoreHost } from '@helpers/config';
import { getAppEnv } from '@core/helpers/env';
import ModalQuickView from '@plugin_productitem/components/QuickView';
import TagManager from 'react-gtm-module';
import { priceVar } from '@core/services/graphql/cache';

import ImageProductView from '@plugin_productitem/components/Image';
import DetailProductView from '@plugin_productitem/components/Detail';
import LabelView from '@plugin_productitem/components/LabelView';
import PriceFormat from '@common_priceformat';
import { getPriceFromList } from '@core_modules/product/helpers/getPrice';
import Button from '@common/Button';
import Typography from '@common/Typography';

import CartIcon from '@heroicons/react/24/outline/ShoppingCartIcon';
import HeartIcon from '@heroicons/react/24/outline/HeartIcon';
import CompareIcon from '@heroicons/react/24/outline/ArrowsRightLeftIcon';
import EyeIcon from '@heroicons/react/24/outline/EyeIcon';
import EyeSolidIcon from '@heroicons/react/20/solid/EyeIcon';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import Show from '@common/Show';
import Badge from '@common/Badge';

const ProductItem = (props) => {
    const {
        id,
        url_key = '',
        categorySelect,
        review,
        className = '',
        enableAddToCart,
        enableOption,
        enableQuickView,
        isGrid = true,
        catalogList,
        weltpixel_labels,
        enablePrice = true,
        enableWishlist,
        enableImage = true,
        imageProps = {},
        enableProductCompare = true,
        enableShortDescription = true,
        preload,
        usedInWishlist = false,
        handlingRemove = () => {},
        ...other
    } = props;
    const {
        storeConfig = {}, __typename, price_range, price_tiers, special_from_date, special_to_date, stock_status,
    } = props;
    const router = useRouter();
    const { t } = useTranslation(['catalog', 'common']);
    const [feed, setFeed] = React.useState(false);
    const [spesificProduct, setSpesificProduct] = React.useState({});
    const [openQuickView, setOpenQuickView] = React.useState(false);

    // Customizable Options
    const [customizableOptions, setCustomizableOptions] = React.useState([]);
    const [errorCustomizableOptions, setErrorCustomizableOptions] = React.useState([]);

    React.useEffect(() => {
        router.beforePopState(({ as }) => {
            const lastCatalogsVisited = getSessionStorage('lastCatalogsVisited');
            if (lastCatalogsVisited && as === lastCatalogsVisited[0]) {
                setSessionStorage('restoreCatalogPosition', true);
            }
            return true;
        });
    }, []);

    React.useEffect(() => {
        if (errorCustomizableOptions && errorCustomizableOptions.length > 0) {
            // eslint-disable-next-line consistent-return
            const errorCustomizable = errorCustomizableOptions.filter((err) => {
                const findValue = customizableOptions.find((op) => op.option_id === err.option_id);
                return !findValue;
            });
            setErrorCustomizableOptions(errorCustomizable);
        }
    }, [customizableOptions]);

    const checkCustomizableOptionsValue = async () => {
        if (other.options && other.options.length > 0) {
            const requiredOptions = other.options.filter((op) => op.required);
            if (requiredOptions.length > 0) {
                if (customizableOptions.length > 0) {
                    let countError = 0;
                    const optionsError = [];
                    for (let idx = 0; idx < requiredOptions.length; idx += 1) {
                        const op = requiredOptions[idx];
                        const findValue = customizableOptions.find((val) => val.option_id === op.option_id);
                        if (!findValue) {
                            optionsError.push(op);
                            countError += 1;
                        }
                    }
                    if (countError > 0) {
                        await setErrorCustomizableOptions(optionsError);
                        return false;
                    }
                    return true;
                }
                await setErrorCustomizableOptions(requiredOptions);

                return false;
            }
            return true;
        }
        return true;
    };

    let isLogin = '';
    if (typeof window !== 'undefined') isLogin = getLoginInfo();

    const [getProduct, { data: dataDetailProduct, error: errorDetailProduct, loading: loadingDetailProduct }] = getDetailProduct(
        storeConfig.pwa || {},
        {
            context: {
                request: 'internal',
            },
        },
    );

    // cache price
    const cachePrice = useReactiveVar(priceVar);

    const getPrice = () => {
        let productPrice = [];

        const keysPriceVar = Object.keys(cachePrice).filter((keyPrice) => keyPrice.includes(categorySelect));

        if (keysPriceVar.length) {
            productPrice = cachePrice[keysPriceVar[0]].products.items;
        }

        return productPrice;
    };

    const stockStatus = useMemo(() => {
        const keysPriceVar = Object.keys(cachePrice).filter((keyPrice) => keyPrice.includes(categorySelect));
        if (keysPriceVar.length) {
            const product = cachePrice[keysPriceVar[0]].products.items.filter((prod) => prod.id === id);
            if (product[0]?.stock_status) {
                return product[0]?.stock_status;
            }
        }

        return stock_status;
    }, [stock_status, cachePrice, categorySelect]);

    const [postAddWishlist] = addWishlist();
    const [getUid, { data: dataUid, refetch: refetchCustomerUid }] = getCustomerUid();
    const [addProductCompare] = addProductsToCompareList();
    const { data: dataCompare, client } = useQuery(localCompare);

    React.useEffect(() => {
        if (isLogin && !dataUid && modules.productcompare.enabled) {
            getUid();
        }
    }, [isLogin, dataUid]);

    const handleFeed = (itemProps) => {
        if (isLogin && isLogin !== '') {
            // GA 4 dataLayer
            TagManager.dataLayer({
                dataLayer: {
                    ecommerce: {
                        action: {
                            items: [
                                {
                                    currency: itemProps.price_range.minimum_price.regular_price.currency,
                                    item_name: itemProps.name,
                                    item_id: itemProps.sku,
                                    price: itemProps.price_range.minimum_price.regular_price.value || 0,
                                    item_category: itemProps.categories?.length > 0 ? itemProps.categories[0].name : '',
                                    item_stock_status: itemProps.stock_status,
                                },
                            ],
                        },
                    },
                    event: 'add_to_wishlist',
                },
            });
            postAddWishlist({
                variables: {
                    productId: id,
                },
            })
                .then(async () => {
                    await setFeed(!feed);
                    await window.toastMessage({ open: true, variant: 'success', text: t('common:message:feedSuccess') });
                    route.push('/wishlist');
                })
                .catch((e) => {
                    window.toastMessage({
                        open: true,
                        variant: 'error',
                        text: debuging.originalError ? e.message.split(':')[1] : t('common:message:feedFailed'),
                    });
                });
        } else if (typeof window.toastMessage !== 'undefined') {
            window.toastMessage({
                open: true,
                variant: 'warning',
                text: t('catalog:wishlist:addWithoutLogin'),
            });
        }
    };

    const handleSetCompareList = (id_compare) => {
        window.backdropLoader(true);
        const uid_product_compare = getCookies('uid_product_compare');
        const uids = [];
        let uid_customer = '';
        uids.push(id_compare.toString());
        if (isLogin) {
            /* eslint-disable */
            uid_customer = dataUid ? (dataUid.customer.compare_list ? dataUid.customer.compare_list.uid : '') : '';
            /* eslint-enable */
        }
        let isExist = false;
        if (dataCompare && dataCompare.items && dataCompare.items.length > 0) {
            dataCompare.items.map((item) => {
                if (item.uid === id_compare.toString()) {
                    isExist = true;
                }
                return null;
            });
        }
        if (!isExist) {
            addProductCompare({
                variables: {
                    uid: isLogin ? uid_customer : uid_product_compare,
                    products: uids,
                },
            })
                .then(async (res) => {
                    client.writeQuery({
                        query: localCompare,
                        data: {
                            item_count: res.data.addProductsToCompareList.item_count,
                            items: res.data.addProductsToCompareList.items,
                        },
                    });
                    if (isLogin) {
                        refetchCustomerUid();
                    }
                    window.backdropLoader(false);
                    window.toastMessage({ open: true, variant: 'success', text: t('common:productCompare:successCompare') });
                })
                .catch((e) => {
                    window.backdropLoader(false);
                    window.toastMessage({
                        open: true,
                        variant: 'error',
                        text: debuging.originalError ? e.message.split(':')[1] : t('common:productCompare:failedCompare'),
                    });
                });
        } else {
            window.backdropLoader(false);
            window.toastMessage({
                open: true,
                variant: 'error',
                text: t('common:productCompare:existProduct'),
            });
        }
    };

    const handleClick = async (itemProps) => {
        // GA 4 dataLayer
        TagManager.dataLayer({
            dataLayer: {
                event: 'select_item',
                ecommerce: {
                    action: {
                        items: [
                            {
                                currency: itemProps.price_range.minimum_price.regular_price.currency,
                                item_name: itemProps.name,
                                item_id: itemProps.sku,
                                price: itemProps.price_range.minimum_price.regular_price.value || 0,
                                item_category: itemProps.categories?.length > 0 ? itemProps.categories[0].name : '',
                                item_stock_status: itemProps.stock_status,
                            },
                        ],
                    },
                },
            },
        });
        if (!url_key) {
            route.push('/null');
        } else if (modules.checkout.checkoutOnly) {
            window.open(`${getStoreHost(getAppEnv()) + url_key}.html`);
        } else {
            const currentPageOffset = window.scrollY;
            const urlResolver = getResolver();
            urlResolver[`/${url_key}`] = {
                type: 'PRODUCT',
            };
            await setResolver(urlResolver);
            setCookies('lastCategory', categorySelect);
            const lastCatalogsOffset = getSessionStorage('lastCatalogsOffset') || [];
            const lastCatalogsVisited = getSessionStorage('lastCatalogsVisited') || [];
            const lastProductsVisited = getSessionStorage('lastProductsVisited') || [];
            setSessionStorage('lastCatalogsOffset', [currentPageOffset, ...lastCatalogsOffset]);
            setSessionStorage('lastCatalogsVisited', [sessionStorage.getItem('currentUrl'), ...lastCatalogsVisited]);
            setSessionStorage('lastProductsVisited', [`/${url_key}`, ...lastProductsVisited]);
            route.push(
                {
                    pathname: '/[...slug]',
                    query: {
                        slug: url_key,
                    },
                },
                `/${url_key}`,
            );
        }
    };

    const handleQuickView = async () => {
        if (!url_key) {
            window.backdropLoader(false);
            setOpenQuickView(false);
        } else {
            window.backdropLoader(true);
            getProduct({
                variables: {
                    url_key,
                },
            });
        }
    };

    React.useEffect(() => {
        if (errorDetailProduct) {
            window.backdropLoader(false);
        }
        if (!loadingDetailProduct && dataDetailProduct?.products?.items?.length > 0) {
            window.backdropLoader(false);
            setOpenQuickView(true);
        }
    }, [dataDetailProduct]);

    const ratingValue = review && review.rating_summary ? parseInt(review.rating_summary, 10) / 20 : 0;
    const DetailProps = {
        spesificProduct,
        handleClick,
        handleFeed,
        ratingValue,
        feed,
        id,
        handleSetCompareList,
    };
    const showAddToCart = typeof enableAddToCart !== 'undefined' ? enableAddToCart : storeConfig?.pwa?.add_to_cart_enable;
    const showOption = typeof enableOption !== 'undefined' ? enableOption : storeConfig?.pwa?.configurable_options_enable;
    const showQuickView = typeof enableQuickView !== 'undefined' ? enableQuickView : storeConfig?.pwa?.quick_view_enable;
    const showWishlist = typeof enableWishlist !== 'undefined' ? enableWishlist : modules.wishlist.enabled;
    const showProductCompare = enableProductCompare || modules.productcompare.enabled;
    const showShortDescription = enableShortDescription;

    const generatePrice = (priceDataItem = []) => {
        // handle if loading price
        let priceProduct = {
            priceRange: spesificProduct.price_range ? spesificProduct.price_range : price_range,
            // eslint-disable-next-line camelcase
            priceTiers: spesificProduct.price_tiers ? spesificProduct.price_tiers : price_tiers,
            productType: __typename,
            specialFromDate: special_from_date,
            specialToDate: special_to_date,
        };
        if (priceDataItem && priceDataItem.length > 0) {
            priceProduct = {
                priceRange: spesificProduct.price_range ? spesificProduct.price_range : priceDataItem[0].price_range,
                priceTiers: spesificProduct.price_tiers ? spesificProduct.price_tiers : priceDataItem[0].price_tiers,
                // eslint-disable-next-line no-underscore-dangle
                productType: priceDataItem[0].__typename,
                specialFromDate: priceDataItem[0].special_from_date,
                specialToDate: priceDataItem[0].special_to_date,
                priceView: priceDataItem[0].price_view,
            };
        }

        return (
            <div className="product-item-price h-[50px] text-center">
                <Show when={priceProduct}>
                    <PriceFormat {...priceProduct} specialFromDate={special_from_date} specialToDate={special_to_date} />
                </Show>
            </div>
        );
    };

    const CustomerFooter = (params) => {
        const {
            loading, disabled, handleAddToCart, viewItemOnly,
        } = params;
        const priceData = getPriceFromList(getPrice(), id);
        return (
            <div className="flex flex-col gap-2 items-center tablet:gap-4">
                {enablePrice && generatePrice(priceData)}
                <div className="hidden tablet:flex desktop:flex flex-row gap-1 justify-center items-center w-full">
                    <Show when={showAddToCart && !viewItemOnly}>
                        <Button
                            iconProps={{ className: 'w-4 h-4 hidden desktop:flex' }}
                            icon={<CartIcon className="text-neutral-white" />}
                            disabled={disabled}
                            onClick={handleAddToCart}
                            loading={loading}
                            className={classNames(
                                'swift-action-tocart w-max h-[38px] desktop:h-[40px] tablet:max-w-[116px] desktop:max-w-max',
                                '!px-4 !py-2 justify-center',
                                'hover:!bg-primary-200 disabled:hover:!bg-neutral-100',
                            )}
                        >
                            <Typography color="white" className="font-normal text-sm tablet:truncate">
                                {t('common:button:addToCart')}
                            </Typography>
                        </Button>
                    </Show>
                    <Show when={showAddToCart && viewItemOnly}>
                        <Button
                            className={classNames(
                                '!py-0 w-max h-[38px] desktop:h-[40px] tablet:max-w-[116px] desktop:max-w-max justify-center',
                                'hover:shadow-[0_0_0_4px] hover:shadow-primary-300',
                            )}
                            link="/[...slug]"
                            linkProps={{
                                as: `/${url_key}`,
                            }}
                        >
                            <Typography color="white" className="font-normal text-sm">
                                {t('common:button:viewItem')}
                            </Typography>
                        </Button>
                    </Show>
                </div>
            </div>
        );
    };

    const isOos = useMemo(() => stockStatus === 'OUT_OF_STOCK', [stockStatus]);
    const viewItemOnly = __typename === 'BundleProduct'
        || __typename === 'DownloadableProduct'
        || __typename === 'GroupedProduct'
        || __typename === 'AwGiftCardProduct';

    const priceData = getPriceFromList(getPrice(), id);

    if (isGrid) {
        return (
            <>
                {openQuickView && showQuickView && (
                    <ModalQuickView
                        open={openQuickView}
                        onClose={() => setOpenQuickView(false)}
                        data={
                            // eslint-disable-next-line no-underscore-dangle
                            dataDetailProduct?.__typename === 'AwGiftCardProduct' ? dataDetailProduct : dataDetailProduct?.products
                        }
                        dataPrice={getPrice()}
                        keyProduct={url_key}
                        t={t}
                        weltpixel_labels={weltpixel_labels}
                        storeConfig={storeConfig}
                    />
                )}
                <div
                    className={classNames(
                        'w-full inline-block h-full overflow-hidden relative cursor-pointer',
                        'shadow border border-neutral-100 rounded-lg p-2 lg:p-4',
                        'desktop:hover:shadow-lg',
                        'tablet:max-w-[230px] desktop:min-w-[288px] desktop:max-w-full',
                        'flex flex-col swift-catalog-item-product',
                        className,
                    )}
                >
                    <div className="w-full relative group overflow-hidden">
                        {!isOos && storeConfig?.pwa?.label_enable && LabelView ? (
                            <LabelView t={t} {...other} isGrid={isGrid} spesificProduct={spesificProduct} />
                        ) : null}
                        {isOos && (
                            <div className={classNames('absolute top-2 tablet:top-3 left-2 tablet:left-3 z-10')}>
                                <Badge
                                    bold
                                    label={stockStatus.replace(/_/g, ' ')}
                                    className="!bg-neutral-50 !text-neutral-400 !text-xs tablet:!text-sm"
                                />
                            </div>
                        )}
                        {!showQuickView && (
                            <>
                                <Button
                                    onClick={handleQuickView}
                                    icon={<EyeIcon />}
                                    iconProps={{
                                        className: 'w-3 h-3 !text-neutral-800 mr-[6px]',
                                    }}
                                    className={classNames(
                                        '!bg-neutral-50 shadow-md invisible',
                                        'desktop:group-hover:visible',
                                        'absolute px-3 py-2',
                                        'left-1/2 bottom-4 -translate-x-1/2 z-[2] w-32',
                                        'swift-quickview-button',
                                    )}
                                    size="sm"
                                >
                                    <span className="text-sm !text-neutral-900 justify-center">{t('catalog:title:quickView')}</span>
                                </Button>
                                <Button
                                    onClick={handleQuickView}
                                    iconOnly
                                    icon={<EyeSolidIcon />}
                                    iconProps={{
                                        className: classNames(
                                            'w-[20px] !h-[20px] !text-neutral-800',
                                            'absolute left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%]',
                                        ),
                                    }}
                                    classNameText="relative"
                                    className={classNames(
                                        'desktop:hidden w-7 h-7',
                                        '!bg-neutral-50 shadow-md',
                                        'absolute bottom-2 left-2 z-[2]',
                                        '!p-[6px]',
                                    )}
                                />
                            </>
                        )}
                        <Show when={showWishlist || showProductCompare}>
                            <div className={classNames(
                                'flex-row gap-1',
                                'hidden', 'tablet:flex',
                                'desktop:flex',
                                'absolute',
                                '-translate-x-2/4',
                                '-translate-y-2/4',
                                'z-[99]',
                                'left-2/4',
                                'bottom-0',
                            )}
                            >
                                <Show when={showWishlist && !usedInWishlist}>
                                    <Button
                                        iconOnly
                                        icon={<HeartIcon />}
                                        iconProps={{
                                            className: feed
                                                ? '!w-4 !h-4 text-neutral-white'
                                                : '!w-4 !h-4 hover:text-neutral-white',
                                        }}
                                        variant={feed ? 'primary' : 'outlined'}
                                        onClick={() => handleFeed(props)}
                                        className={classNames(
                                            'swift-action-towishlist !p-[10px] !border-neutral-200 hover:bg-primary group',
                                            'hover:!shadow-none focus:!shadow-none hover:!opacity-100',
                                            '[&_span_svg]:hover:text-neutral-white',
                                            'invisible group-hover:visible',
                                        )}
                                    />
                                </Show>
                                <Show when={usedInWishlist}>
                                    <Button
                                        iconOnly
                                        icon={<TrashIcon />}
                                        iconProps={{ className: '!w-4 !h-4 hover:text-neutral-white text-primary' }}
                                        variant="outlined"
                                        onClick={() => handlingRemove()}
                                        className={classNames(
                                            'swift-action-toremove !p-[10px] !border-neutral-200 hover:bg-primary group',
                                            'hover:!shadow-none focus:!shadow-none hover:!opacity-100',
                                            '[&_span_svg]:hover:text-neutral-white',
                                            'invisible group-hover:visible',
                                        )}
                                    />
                                </Show>
                                <Show when={showProductCompare}>
                                    <Button
                                        iconOnly
                                        icon={<CompareIcon />}
                                        iconProps={{ className: '!w-4 !h-4 hover:text-neutral-white' }}
                                        variant="outlined"
                                        onClick={() => handleSetCompareList(props?.id)}
                                        className={classNames(
                                            'swift-action-tocompare !p-[10px] !border-neutral-200 hover:bg-primary group',
                                            'hover:!shadow-none focus:!shadow-none hover:!opacity-100',
                                            '[&_span_svg]:hover:text-neutral-white',
                                            'invisible group-hover:visible',
                                        )}
                                    />
                                </Show>
                            </div>
                        </Show>
                        <Show when={enableImage}>
                            <ImageProductView
                                t={t}
                                handleClick={() => handleClick(props)}
                                spesificProduct={spesificProduct}
                                urlKey={url_key}
                                {...other}
                                {...imageProps}
                                isGrid={isGrid}
                                preload={preload}
                            />
                        </Show>
                    </div>
                    <div className="pt-4 relative flex flex-col gap-4 flex-1">
                        <DetailProductView
                            t={t}
                            urlKey={url_key}
                            catalogList={catalogList}
                            {...DetailProps}
                            {...other}
                            showShortDescription={showShortDescription}
                            Pricing={enablePrice && !showOption && generatePrice(priceData)}
                            isGrid={isGrid}
                        />
                        <Show when={showOption}>
                            <div className="hidden tablet:flex desktop:flex flex-col gap-2 tablet:gap-4 h-full justify-between">
                                <ConfigurableOpt
                                    t={t}
                                    data={{
                                        ...other,
                                        url_key,
                                        review,
                                    }}
                                    stockStatus={stockStatus}
                                    dataPrice={getPrice()}
                                    showQty={false}
                                    catalogList={catalogList}
                                    handleSelecteProduct={setSpesificProduct}
                                    showAddToCart={showAddToCart}
                                    viewItemOnly={viewItemOnly}
                                    propsItem={{
                                        className: 'w-5 h-5',
                                    }}
                                    labelAddToCart={t('common:button:addToCart')}
                                    isGrid={isGrid}
                                    {...other}
                                    customizableOptions={customizableOptions}
                                    setCustomizableOptions={setCustomizableOptions}
                                    errorCustomizableOptions={errorCustomizableOptions}
                                    checkCustomizableOptionsValue={checkCustomizableOptionsValue}
                                    CustomFooter={<CustomerFooter />}
                                    showWishlist={showWishlist}
                                    enableProductCompare={showProductCompare}
                                    isPlp
                                />
                            </div>
                            <div className="flex flex-col tablet:hidden h-full justify-end">{generatePrice(priceData)}</div>
                        </Show>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {openQuickView && showQuickView && (
                <ModalQuickView
                    open={openQuickView}
                    onClose={() => setOpenQuickView(false)}
                    data={
                        // eslint-disable-next-line no-underscore-dangle
                        dataDetailProduct?.__typename === 'AwGiftCardProduct' ? dataDetailProduct : dataDetailProduct?.products
                    }
                    dataPrice={getPrice()}
                    keyProduct={url_key}
                    t={t}
                    weltpixel_labels={weltpixel_labels}
                    storeConfig={storeConfig}
                />
            )}
            <div
                className={classNames(
                    'flex flex-row gap-2 tablet:gap-4',
                    'w-full overflow-hidden relative cursor-pointer',
                    'shadow  border border-neutral-100 rounded-lg p-2 tablet:p-4',
                    'h-full min-h-[136px] tablet:min-h-max',
                    'desktop:hover:shadow-lg',
                    className,
                )}
            >
                <div className="basis-auto h-full">
                    <div
                        className="relative max-w-full group h-max"
                        style={{
                            width: storeConfig?.pwa?.image_product_width,
                            height: storeConfig?.pwa?.image_product_height,
                        }}
                    >
                        {!isOos && storeConfig?.pwa?.label_enable && LabelView ? (
                            <LabelView t={t} {...other} isGrid={isGrid} spesificProduct={spesificProduct} />
                        ) : null}
                        {isOos && (
                            <div className="absolute top-2 tablet:top-3 left-2 tablet:left-3 z-10">
                                <Badge bold label={stockStatus.replace(/_/g, ' ')} className="!bg-neutral text-white !text-xs tablet:!text-sm" />
                            </div>
                        )}
                        {!showQuickView && (
                            <>
                                <Button
                                    onClick={handleQuickView}
                                    icon={<EyeIcon />}
                                    iconProps={{
                                        className: 'w-3 h-3 !text-neutral-800 mr-[6px]',
                                    }}
                                    className={classNames(
                                        '!bg-neutral-50 shadow-md invisible',
                                        'desktop:group-hover:visible',
                                        'absolute px-3 py-2',
                                        'desktop:left-2 desktop:bottom-2 z-[2] desktop:w-32',
                                    )}
                                    size="sm"
                                >
                                    <span className="text-sm !text-neutral-900 justify-center">{t('catalog:title:quickView')}</span>
                                </Button>
                                <Button
                                    iconOnly
                                    onClick={handleQuickView}
                                    icon={<EyeSolidIcon />}
                                    iconProps={{
                                        className: classNames(
                                            'w-[20px] !h-[20px] !text-neutral-800',
                                            'absolute left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%]',
                                        ),
                                    }}
                                    classNameText="relative"
                                    className={classNames(
                                        'desktop:hidden w-7 h-7',
                                        '!bg-neutral-50 shadow-md',
                                        'absolute bottom-2 left-2 z-[2]',
                                        '!p-[6px]',
                                    )}
                                />
                            </>
                        )}
                        <Show when={showWishlist || showProductCompare}>
                            <div className={classNames(
                                'flex-row gap-1',
                                'hidden', 'tablet:flex',
                                'desktop:flex',
                                'absolute',
                                '-translate-x-2/4',
                                '-translate-y-2/4',
                                'z-[99]',
                                'left-2/4',
                                'bottom-0',
                            )}
                            >
                                <Show when={showWishlist && !usedInWishlist}>
                                    <Button
                                        iconOnly
                                        icon={<HeartIcon />}
                                        iconProps={{
                                            className: feed
                                                ? '!w-4 !h-4 text-neutral-white'
                                                : '!w-4 !h-4 hover:text-neutral-white',
                                        }}
                                        variant={feed ? 'primary' : 'outlined'}
                                        onClick={() => handleFeed(props)}
                                        className={classNames(
                                            'swift-action-towishlist !p-[10px] !border-neutral-200 hover:bg-primary group',
                                            'hover:!shadow-none focus:!shadow-none hover:!opacity-100',
                                            '[&_span_svg]:hover:text-neutral-white',
                                            'invisible group-hover:visible',
                                        )}
                                    />
                                </Show>
                                <Show when={usedInWishlist}>
                                    <Button
                                        iconOnly
                                        icon={<TrashIcon />}
                                        iconProps={{ className: '!w-4 !h-4 hover:text-neutral-white text-primary' }}
                                        variant="outlined"
                                        onClick={() => handlingRemove()}
                                        className={classNames(
                                            'swift-action-toremove !p-[10px] !border-neutral-200 hover:bg-primary group',
                                            'hover:!shadow-none focus:!shadow-none hover:!opacity-100',
                                            '[&_span_svg]:hover:text-neutral-white',
                                            'invisible group-hover:visible',
                                        )}
                                    />
                                </Show>
                                <Show when={showProductCompare}>
                                    <Button
                                        iconOnly
                                        icon={<CompareIcon />}
                                        iconProps={{ className: '!w-4 !h-4 hover:text-neutral-white' }}
                                        variant="outlined"
                                        onClick={() => handleSetCompareList(props?.id)}
                                        className={classNames(
                                            'swift-action-tocompare !p-[10px] !border-neutral-200 hover:bg-primary group',
                                            'hover:!shadow-none focus:!shadow-none hover:!opacity-100',
                                            '[&_span_svg]:hover:text-neutral-white',
                                            'invisible group-hover:visible',
                                        )}
                                    />
                                </Show>
                            </div>
                        </Show>
                        <Show when={enableImage}>
                            <ImageProductView
                                t={t}
                                handleClick={() => handleClick(props)}
                                spesificProduct={spesificProduct}
                                urlKey={url_key}
                                {...other}
                                isGrid={isGrid}
                                preload={preload}
                            />
                        </Show>
                    </div>
                </div>
                <div className="basis-full h-full">
                    <div className="flex flex-col gap-4 start-xs h-full justify-between">
                        <DetailProductView
                            t={t}
                            {...DetailProps}
                            {...other}
                            enableWishlist={false}
                            urlKey={url_key}
                            showShortDescription
                            Pricing={enablePrice && !showOption && generatePrice(priceData)}
                            isGrid={isGrid}
                        />
                        {showOption ? (
                            <div className={classNames('hidden tablet:flex flex-col justify-between h-full gap-2 lg:gap-4')}>
                                <ConfigurableOpt
                                    t={t}
                                    data={{
                                        ...other,
                                        url_key,
                                        review,
                                    }}
                                    stockStatus={stockStatus}
                                    dataPrice={getPrice()}
                                    showQty={false}
                                    catalogList={catalogList}
                                    handleSelecteProduct={setSpesificProduct}
                                    showAddToCart={showAddToCart}
                                    viewItemOnly={viewItemOnly}
                                    labelAddToCart={t('common:button:addToCart')}
                                    isGrid={isGrid}
                                    {...other}
                                    customizableOptions={customizableOptions}
                                    setCustomizableOptions={setCustomizableOptions}
                                    errorCustomizableOptions={errorCustomizableOptions}
                                    checkCustomizableOptionsValue={checkCustomizableOptionsValue}
                                    CustomFooter={<CustomerFooter />}
                                    showWishlist={showWishlist}
                                    enableProductCompare={showProductCompare}
                                    isPlp
                                />
                            </div>
                        ) : null}
                        <div className="flex tablet:hidden">{generatePrice(priceData)}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductItem;
