import React from 'react';
import dynamic from 'next/dynamic';

const Item = dynamic(() => import('@core_modules/product/plugins/OptionItem/ConfigurableOption/Item'), { ssr: false });
const OptionItemAction = dynamic(() => import('@core_modules/product/plugins/OptionItemAction'), { ssr: false });

const ConfigurableView = (props) => {
    const {
        loading,
        loadingProduct,
        disabled,
        showQty = true,
        handleAddToCart,
        qty,
        setQty,
        t,
        options,
        selectConfigurable,
        showAddToCart = true,
        isGrid = true,
        showSwatches = true,
        customPos = false,
        CustomFooter,
        ...other
    } = props;
    const updatedOptions = customPos ? [...options].sort((a, b) => a.options.position - b.options.position) : options;

    if (loadingProduct) {
        return (
            <div className="flex flex-col w-full h-auto gap-2">
                <div className="h-4 bg-neutral-100 animate-pulse rounded-full dark:bg-gray-700 w-full" />
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-2">
                {showSwatches
                    && updatedOptions?.map((item, index) => (
                        <Item
                            key={index}
                            option={item.options}
                            selected={selectConfigurable}
                            value={item.value}
                            isGrid={isGrid}
                            {...other}
                            className={`product-configurableOption-${item.options.label}`}
                        />
                    ))}
            </div>
            {React.isValidElement(CustomFooter) ? (
                React.cloneElement(CustomFooter, {
                    ...other,
                    loading,
                    disabled,
                    showQty,
                    handleAddToCart,
                    qty,
                    setQty,
                    t,
                    showAddToCart,
                })
            ) : (
                <OptionItemAction
                    {...other}
                    loading={loading}
                    disabled={disabled}
                    showQty={showQty}
                    handleAddToCart={handleAddToCart}
                    qty={qty}
                    setQty={setQty}
                    t={t}
                    showAddToCart={showAddToCart}
                />
            )}
        </>
    );
};

export default ConfigurableView;
