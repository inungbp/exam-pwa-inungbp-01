// Library
import Link from 'next/link';
import React from 'react';
import Carousel from '@components/Slider/Carousel';
import Typography from '@components/Typography';
import { GraphCustomer } from '@services/graphql';
import { customerFeautres } from '@config';
import Footer from '../Footer';
import Loaders from '../Loader';
// Styling And Component
import useStyles from './style';


const WithToken = (props) => {
    const { token, t } = props;
    const styles = useStyles();
    let userData = {};
    let wishlist = [];
    const { data, loading, error } = GraphCustomer.getCustomer(token);
    if (!data || loading || error) return <Loaders />;
    if (data) {
        userData = data;
        wishlist = data.customer && data.customer.wishlist && data.customer.wishlist.items.map(({ product }) => ({
            ...product,
            name: product.name,
            link: product.url_key,
            imageSrc: product.small_image.url,
            price: product.price_range.minimum_price.regular_price.value,
        }));
    }

    const menu = [
        {
            href: '/sales/order/history',
            title: t('customer:menu:myOrder'),
        }, {
            href: '/customer/account/profile',
            title: t('customer:menu:myAccount'),
        }, {
            href: '/customer/account/address',
            title: t('customer:menu:address'),
        }, {
            href: '/customer/setting',
            title: t('customer:menu:setting'),
        },
    ];
    if (wishlist.length <= 0) {
        menu.push({
            href: '/wishlist',
            title: 'Wishlist',
        });
    }
    if (customerFeautres.giftCard) {
        menu.push({
            href: '/awgiftcard/card',
            title: 'Gift Card',
        });
    }
    if (customerFeautres.storeCredit) {
        menu.push({
            href: '/customer/account/storecredit',
            title: t('customer:menu:storeCredit'),
        });
    }
    return (
        <div className={styles.root}>
            <div className={styles.account_wrapper}>
                <div className={[styles.account_block, styles.padding_vertical_40, styles.border_bottom].join(' ')}>
                    <h3 className={styles.account_username}>
                        {userData && userData.customer && `${userData.customer.firstname} ${userData.customer.lastname}`}
                    </h3>
                    <p className={styles.account_email}>{userData && userData.customer && userData.customer.email}</p>
                </div>
                <div className={[styles.account_block, styles.padding_vertical_40].join(' ')}>
                    <div className={styles.account_point}>
                        <p className={styles.account_point_title}>{t('customer:menu:myPoint')}</p>
                        <h3 className={styles.account_point_summary}>100.000</h3>
                    </div>
                    <div className={styles.account_block}>
                        <ul className={styles.account_navigation}>
                            {
                                menu.map(({ href, title }, index) => (
                                    <li className={styles.account_navigation_item} key={index}>
                                        <Link href={href}>
                                            <a className={styles.account_navigation_link}>{title}</a>
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
                {
                    wishlist.length > 0 ? (
                        <div className={[styles.account_block, styles.wishlistBlock].join(' ')}>
                            <div className={styles.account_clearfix}>
                                <div className={styles.spanWishlist}>
                                    <Typography variant="span" type="bold" letter="capitalize" className={styles.account_wishlist_title}>
                                        Wishlist
                                    </Typography>
                                    <Link
                                        href="/wishlist"
                                        className={[styles.account_wishlist_read_more].join(' ')}
                                    >
                                        <a>
                                            <Typography
                                                variant="span"
                                                type="bold"
                                                letter="capitalize"
                                            >
                                                {t('customer:menu:readMore')}
                                            </Typography>
                                        </a>
                                    </Link>
                                </div>
                            </div>
                            <div className={styles.account_clearfix}>
                                <Carousel
                                    data={wishlist}
                                    className={[styles.wishlistBlock, styles.margin20].join(' ')}
                                />
                            </div>
                        </div>
                    ) : (
                        <span className={styles.span} />
                    )
                }
                <Footer {...props} />
            </div>
        </div>
    );
};

export default WithToken;
