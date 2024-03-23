/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import Typography from '@common_typography';
import CheckIcon from '@heroicons/react/24/solid/CheckIcon';
import cx from 'classnames';
import parser from 'html-react-parser';
import propTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'next-i18next';

const Radio = (props) => {
    const {
        id,
        variant = 'multiple',
        data = [],
        onChange = () => {},
        onClick = () => {},
        value = '',
        name = 'radio',
        ariaLabel = 'radio',
        label,
        CustomItem,
        className = {},
        classNames = {},
        error = false,
        errorMessage = '',
        disabled = false,
        CustomLabel,
        useLoadMore = false,
        ComponentOptional = () => {},
        storeConfig,
        size = 'md',
        customItemProps = {},
        type = 'radio',
        checked,
        children,
    } = props;
    const { t } = useTranslation(['common']);
    const { radioGroupClasses = '', radioClasses = '' } = classNames;
    const [more, setMore] = React.useState(7);
    const [mappedData, setMappedData] = React.useState(data);
    const isVariantSingle = variant === 'single';

    React.useEffect(() => {
        if (isVariantSingle) {
            if (useLoadMore) {
                setMappedData(data?.slice(0, more));
            } else {
                setMappedData(data);
            }
        } else {
            setMappedData(data);
        }
    }, [useLoadMore, more, data]);

    const labelVariant = {
        sm: 'bd-2b',
        md: 'bd-1a',
        lg: 'bd-1',
    };

    // handle load more and load less list data
    const handleMore = () => {
        setMore(more + 7);
    };

    const handleLess = () => {
        setMore(more - 7);
    };

    const handleChange = (event) => {
        onChange(event.target.value);
    };

    const handleChangeCustom = (val) => {
        !disabled && onChange(val);
    };

    if (isVariantSingle) {
        return (
            <div className={cx('common-radio-container cursor-pointer', className)}>
                <input
                    type="radio"
                    id={id}
                    name={name}
                    aria-label={ariaLabel}
                    value={value}
                    checked={checked}
                    onChange={onChange}
                    onClick={onClick}
                    disabled={disabled}
                    className={cx(
                        'swift-form-radio',
                        'w-4',
                        'h-4',
                        'mr-2',
                        'border-solid',
                        'border-[1px]',
                        'focus:ring-0',
                        'focus:border-primary',
                        'text-primary',
                        'focus:shadow-[0_0_0_4px]',
                        'focus:shadow-primary-50',
                        'focus:ring-offset-0',
                        'checked:bg-[length:150%]',
                        'visible cursor-pointer',
                        {
                            'border-neutral-300 text-neutral-300': !disabled,
                            'w-5 h-5': size === 'md',
                            'w-6 h-6': size === 'lg',
                            'invisible hidden': type === 'check',
                        },
                        radioClasses,
                    )}
                />
                {children}
            </div>
        );
    }

    return (
        <div className={cx('m-0 mb-[10px] flex flex-col', className)}>
            {label ? (
                CustomLabel ? (
                    <CustomLabel />
                ) : (
                    <Typography variant="bd-2" className="uppercase">
                        {label.replace(/_/g, ' ')}
                    </Typography>
                )
            ) : null}
            <div className={cx('flex', 'flex-col', 'mt-2', radioGroupClasses)}>
                {mappedData.map((item, index) => {
                    // generate unique id
                    const uniqueIdName = item?.value
                        ? `${String(item.value)
                              .toLowerCase()
                              .replace(/[^a-z^0-9]+/g, '')}-radio-${index}`
                        : `radio-${index}`;
                    if (CustomItem) {
                        return (
                            <>
                                <CustomItem
                                    key={index}
                                    selected={JSON.stringify(value) === JSON.stringify(item.value)}
                                    onChange={handleChangeCustom}
                                    storeConfig={storeConfig}
                                    id={item.id || uniqueIdName}
                                    {...item}
                                    {...customItemProps}
                                    disabled={item.disabled || disabled}
                                />
                                {ComponentOptional(item)}
                            </>
                        );
                    }

                    return (
                        <div className="flex items-center mb-1" key={index}>
                            <input
                                type="radio"
                                disabled={item.disabled || disabled}
                                className={cx(
                                    'swift-form-radio',
                                    'w-4',
                                    'h-4',
                                    'mr-2',
                                    'border-solid',
                                    'border-[1px]',
                                    'focus:ring-0',
                                    'focus:border-primary',
                                    'text-primary',
                                    'focus:shadow-[0_0_0_4px]',
                                    'focus:shadow-primary-50',
                                    'focus:ring-offset-0',
                                    'checked:bg-[length:150%]',
                                    'visible',
                                    {
                                        'border-neutral-300 text-neutral-300': !disabled,
                                        'w-5 h-5': size === 'md',
                                        'w-6 h-6': size === 'lg',
                                        'invisible hidden': type === 'check',
                                    },
                                    radioClasses,
                                )}
                                name={item.name || `radio-${index}`}
                                ariaLabel={item.ariaLabel || `radio-${index}`}
                                value={item.value}
                                checked={item.value === value}
                                onChange={handleChange}
                                id={uniqueIdName}
                            />
                            <label htmlFor={uniqueIdName} className="cursor-pointer flex items-center group">
                                {type === 'check' ? (
                                    item.value === value ? (
                                        <div
                                            className={cx(
                                                'w-4 h-4 mr-1',
                                                'flex items-center justify-center',
                                                'border-[1px] border-solid rounded-full border-primary',
                                                'bg-primary',
                                                {
                                                    'w-5 h-5': size === 'md',
                                                    'w-6 h-6': size === 'lg',
                                                },
                                            )}
                                        >
                                            <CheckIcon
                                                className={cx('w-3 h-3 font-bold text-neutral-100', {
                                                    'w-5 h-5': size === 'md',
                                                    'w-6 h-6': size === 'lg',
                                                })}
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className={cx(
                                                'w-4 h-4 border-[1px] border-solid rounded-full mr-1',
                                                'group-hover:bg-primary-200 group-hover:border-primary',
                                                'group-focus:bg-primary-200 group-focus:border-primary',
                                                {
                                                    'border-[#D1D5DB] bg-neutral-white': disabled || item.disabled,
                                                    'group-hover:bg-neutral-white group-hover:border-neutral-200': disabled || item.disabled,
                                                    'w-5 h-5': size === 'md',
                                                    'w-6 h-6': size === 'lg',
                                                },
                                            )}
                                        />
                                    )
                                ) : null}
                                <Typography variant={labelVariant[size]}>{parser(item.label)}</Typography>
                            </label>
                        </div>
                    );
                })}
            </div>
            {error && <Typography className="text-red mt-[12px] first-letter:uppercase">{errorMessage}</Typography>}

            {useLoadMore && data.length > 7 && more <= 7 && (
                <a onClick={handleMore} className="mt-[10px] text-right cursor-pointer">
                    <Typography className="underline">{t('common:label:seeMore')}</Typography>
                </a>
            )}
            {useLoadMore && more > 7 && (
                <a onClick={handleLess} className="mt-[10px] text-right cursor-pointer">
                    <Typography className="underline">{t('common:label:seeLess')}</Typography>
                </a>
            )}
        </div>
    );
};

Radio.propTypes = {
    data: propTypes.array,
    onChange: propTypes.func,
    value: propTypes.any,
    name: propTypes.string,
    ariaLabel: propTypes.string,
    label: propTypes.oneOfType([propTypes.string, propTypes.bool]),
    CustomItem: propTypes.any,
    className: propTypes.oneOfType([propTypes.string, propTypes.object]),
    classNames: propTypes.shape({
        radioGroupClasses: propTypes.oneOfType([propTypes.string, propTypes.object]),
        radioClasses: propTypes.oneOfType([propTypes.string, propTypes.object]),
    }),
    error: propTypes.bool,
    errorMessage: propTypes.string,
    disabled: propTypes.bool,
    CustomLabel: propTypes.any,
    useLoadMore: propTypes.bool,
    ComponentOptional: propTypes.func,
    storeConfig: propTypes.object,
    size: propTypes.oneOf(['sm', 'md', 'lg']),
    customItemProps: propTypes.object,
    type: propTypes.oneOf(['check', 'radio']),
};

Radio.defaultProps = {
    data: [],
    onChange: () => {},
    value: '',
    name: 'radio',
    ariaLabel: 'radio',
    label: '',
    CustomItem: false,
    className: {},
    classNames: {
        radioGroupClasses: '',
        radioClasses: '',
    },
    error: false,
    errorMessage: '',
    disabled: false,
    CustomLabel: false,
    useLoadMore: false,
    ComponentOptional: () => {},
    storeConfig: {},
    size: 'md',
    customItemProps: {},
    type: 'radio',
};

export default Radio;
