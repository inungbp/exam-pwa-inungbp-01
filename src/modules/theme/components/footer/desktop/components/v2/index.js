import CmsRenderer from '@core_modules/cms/components/cms-renderer';
import { COLORS } from '@core/theme/vars';
import Divider from '@common/Divider';
import DesktopInstall from '@core_modules/theme/components/customPWAInstall/desktop';
import dynamic from 'next/dynamic';
import Button from '@common/Button';
import cx from 'classnames';
import Typography from '@common/Typography';
import { DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

const SwitcherCurrency = dynamic(() => import('@common_currency'), { ssr: false });
const SwitcherLanguage = dynamic(() => import('@common_language'), { ssr: false });
const FooterV2 = (props) => {
    const {
        data, loading, storeConfig, t,
    } = props;
    return (
        <>
            <div className="bg-neutral-700 flex flex-col justify-center items-center">
                {!loading ? <CmsRenderer content={data.cmsBlocks.items[0].content} storeConfig={storeConfig} /> : null}
                <div className="flex flex-col items-center justify-center tablet:flex-row gap-y-6 mb-8 desktop:mt-6 mobile:mt-4">
                    <DesktopInstall
                        t={t}
                        CustomButton={(
                            <Button
                                className={cx('group', 'tablet:mr-6', 'swift-button-install', 'border-neutral-300', 'hover:border-primary-700')}
                                variant="outlined"
                                iconProps={{ className: cx('w-[20px]', 'text-neutral-600', 'inline-block', 'group-hover:!text-primary-700') }}
                            >
                                <Typography className="group-hover:!text-primary-700">{t('common:header:downloadApps')}</Typography>
                            </Button>
                        )}
                    />
                    <div className="flex flex-row gap-6 flex-wrap justify-center">
                        <Button
                            className={cx(
                                'border-neutral-300',
                                'hover:border-primary-700',
                                'focus:border-primary-700',

                            )}
                            variant="outlined"
                        >
                            <DevicePhoneMobileIcon
                                className={cx(
                                    'mr-2',
                                    'w-5 h-5',
                                )}
                            />
                            Download Apps
                        </Button>
                        <SwitcherCurrency
                            {...props}
                            CustomButton={(
                                <Button
                                    className={cx('group', 'swift-currency-switcher', 'border-neutral-300', 'hover:border-primary-700')}
                                    variant="outlined"
                                />
                            )}
                        />
                        <SwitcherLanguage
                            {...props}
                            CustomButton={(
                                <Button
                                    className={cx(
                                        'group',
                                        'swift-language-switcher',
                                        'border-neutral-300',
                                        'hover:border-primary-700',
                                        'focus:border-primary-700',
                                    )}
                                    variant="outlined"
                                />
                            )}
                        />
                    </div>
                </div>
                <Divider />
                <style jsx global>
                    {`
                        .footer-links a {
                            font-size: 16px;
                            font-style: normal;
                            font-weight: 500;
                            line-height: 24px; /* 150% */
                            margin-bottom: 8px;
                            margin-left: 12px;
                            margin-right: 12px;
                            text-decoration: none;
                            color: ${COLORS.neutral[200]};
                            &:hover {
                                color: ${COLORS.neutral[200]};
                            }
                        }
                        .footer-links .magezon-icon i.fab {
                            color: ${COLORS.neutral.white}
                        }
                        .footer-links .prose {
                            width: 100%;
                            max-width: 100% !important;
                        }
                        .footer-links.payment-list {
                            background: ${COLORS.neutral[500]};
                        }
                        .footer-links.payment-list .prose > div {
                            display: flex;
                            flex-direction: row !important;
                            justify-content: center;
                            flex-wrap: wrap;
                            padding: 6px 0px;
                        }
                        .footer-links.payment-list .prose>div {
                            gap: 1rem;
                        }
                        .footer-links.payment-list .prose img {
                            margin: 0px;
                        }
                        .footer-links .mgz-text .prose > div {
                            display: flex;
                            flex-direction: row;
                            justify-content: center;
                            flex-wrap: wrap;
                            padding: 16px;
                        }
                        .footer-links.social-media .magezon-icon i {
                            font-size: 32px;
                        }
                        .footer-links.social-media .magezon-icon .magezon-icon-inner {
                            height: auto;
                            width: 3em;
                        }
                        .footer-links.social-media .mgz-element-inner {
                            padding: 5px 3px;
                        }
                        @media screen and (max-width: 500px) {
                            .footer-links .mgz-text .prose > div {
                                flex-direction: column;
                                gap: 24px;
                            }
                        }
                        @media screen and (max-width: 900px) {
                            .footer-links.w-full.flex .prose>div {
                                max-width: 576px;
                            }
                        }
                    `}
                </style>
            </div>
        </>
    );
};
FooterV2.propTypes = {};
export default FooterV2;
