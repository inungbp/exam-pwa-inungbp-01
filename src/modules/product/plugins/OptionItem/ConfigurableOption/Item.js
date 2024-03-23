import dynamic from 'next/dynamic';
import classNames from 'classnames';

// import SelectOption from '@common_optionconfigurable';
const CustomRadio = dynamic(() => import('@common_forms/Radio'), { ssr: false });
const SelectOption = dynamic(() => import('@common_optionconfigurable'), { ssr: false });

const ItemConfigurableView = (props) => {
    const {
        option, selected, value, handleSelect, error, loading, configProduct, isGrid, disableItem, ...other
    } = props;
    const classItem = 'w-8 h-8 m-4 flex items-center justify-center';

    return (
        <CustomRadio
            flex="row"
            CustomItem={SelectOption}
            value={selected[option.attribute_code]}
            data={value}
            onChange={(val) => handleSelect(val, option.attribute_code)}
            classContainer={isGrid ? classNames('xs:max-sm:justify-center', `product-OptionItem-${option.label}`) : ''}
            classItem={classItem}
            error={!!error[option.attribute_code] && !selected[option.attribute_code]}
            errorMessage={error[option.attribute_code] ? error[option.attribute_code] : ''}
            disabled={loading || disableItem}
            {...other}
            className="w-full overflow-x-scroll scrollbar-none !mb-0"
            label={false}
            classNames={{
                radioGroupClasses: classNames(
                    '!flex-row w-max gap-0.5 !mt-0 mx-auto',
                    (error && (Object.keys(error).length > 0)) && 'mb-1',
                ),
            }}
        />
    );
};

export default ItemConfigurableView;
