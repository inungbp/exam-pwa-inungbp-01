/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import StarIcon from '@heroicons/react/24/solid/StarIcon';
import { COLORS } from '@theme_vars';
import cx from 'classnames';

// eslint-disable-next-line object-curly-newline
const RatingStar = ({
    classContainer,
    value = 1,
    maxvalue = 5,
    onChange = () => {},
    disabled = true,
    sizeIcon = 'sm',
    miniSummary = false,
    prefixName = 'noprefix',
}) => {
    const icon = [];

    const classes = cx('hover:cursor-pointer', {
        'w-[20px] h-[20px]': sizeIcon === 'sm',
        'w-[24px] h-[24px]': sizeIcon === 'md',
        'w-[28px] h-[28px]': sizeIcon === 'lg',
    });

    if (miniSummary) {
        return (
            <div role="button" className={cx('mr-0', 'p-0')} disabled={disabled}>
                <StarIcon className={cx('text-yellow-400', classes)} />
            </div>
        );
    }

    for (let ind = 1; ind <= maxvalue; ind += 1) {
        if (ind <= value) {
            icon.push(
                <div role="button" className={cx('mr-0', 'p-0')} key={ind} disabled={disabled} onClick={() => onChange(ind)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={cx(classes, 'text-yellow-400')}>
                        <path
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>,
            );
        } else {
            // eslint-disable-next-line no-lonely-if
            if (ind - value > 0 && ind - value < 1) {
                icon.push(
                    <div role="button" className={cx('mr-0', 'p-0')} key={ind} disabled={disabled} onClick={() => onChange(ind)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={cx(classes, 'text-yellow-400 flex desktop:hidden')}>
                            <path
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className={cx(classes, 'hidden desktop:flex definitions')}
                        >
                            <defs>
                                <linearGradient id={`${prefixName}-grad2-${ind}`}>
                                    <stop offset={`${(value - (ind - 1)) * 100}%`} stopColor={COLORS.yellow[400]} />
                                    <stop offset={`${(value - (ind - 1)) * 100}%`} stopColor={COLORS.neutral[200]} />
                                </linearGradient>
                            </defs>
                            <path
                                fill={`url(#${prefixName}-grad2-${ind})`}
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>,
                );
            } else {
                icon.push(
                    <div role="button" className={cx('mr-0', 'p-0')} key={ind} disabled={disabled} onClick={() => onChange(ind)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={cx(classes, 'text-neutral-50')}>
                            <path
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>,
                );
            }
        }
    }
    return <div className={cx('flex', 'flex-row', classContainer)}>{icon.map((Item) => Item)}</div>;
};

export default RatingStar;
