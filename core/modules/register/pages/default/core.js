/* eslint-disable max-len */
import Layout from '@layout';
import React from 'react';
import { setLogin, setEmailConfirmationFlag } from '@helper_auth';
import { setCartId, getCartId } from '@helper_cartid';
import {
    expiredToken, custDataNameCookie, recaptcha, modules,
} from '@config';
import { useQuery } from '@apollo/client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import Router from 'next/router';

import { regexPhone } from '@helper_regex';
import { getAppEnv } from '@helpers/env';

import {
    register,
    getGuestCustomer,
    otpConfig as queryOtpConfig,
    mergeCart as mutationMergeCart,
    getCustomerCartId,
} from '@core_modules/register/services/graphql';
import { getCustomer } from '@core_modules/register/services/graphql/schema';
import { setLocalStorage } from '@root/core/helpers/localstorage';

const appEnv = getAppEnv();

const Register = (props) => {
    const {
        t, storeConfig, pageConfig, Content,
    } = props;
    const config = {
        title: t('register:pageTitle'),
        header: 'relative', // available values: "absolute", "relative", false (default)
        headerTitle: t('register:title'),
        bottomNav: false,
    };
    // enable recaptcha
    const enableRecaptcha = recaptcha.enable && modules.register.recaptcha.enabled;

    const [phoneIsWa, setPhoneIsWa] = React.useState(false);
    const [cusIsLogin, setIsLogin] = React.useState(0);
    const [disabled, setdisabled] = React.useState(false);
    const [getGuest, { data: guestData }] = getGuestCustomer();
    const recaptchaRef = React.createRef();
    const sitekey = recaptcha.siteKey[appEnv] ? recaptcha.siteKey[appEnv] : recaptcha.siteKey.dev;

    let cartId = '';
    const { router } = Router;
    const expired = storeConfig.oauth_access_token_lifetime_customer
        ? new Date(Date.now() + parseInt(storeConfig.oauth_access_token_lifetime_customer, 10) * 3600000)
        : expiredToken;

    if (typeof window !== 'undefined') {
        cartId = getCartId();
    }
    React.useEffect(() => {
        if (Object.keys(router.query).length !== 0) {
            getGuest({
                variables: {
                    ids: {
                        in: [router.query.order_id],
                    },
                },
            });
        }
    }, [router]);

    const [getCart, cartData] = getCustomerCartId();
    const [mergeCart, { called }] = mutationMergeCart();
    const custData = useQuery(getCustomer, {
        context: {
            request: 'internal',
        },
        skip: !cusIsLogin,
    });
    const otpConfig = queryOtpConfig();

    const enableOtp = otpConfig.data && otpConfig.data.otpConfig.otp_enable[0].enable_otp_register;

    const [sendRegister] = register();

    let configValidation = {
        email: Yup.string().email(t('validate:email:wrong')).required(t('validate:email:required')),
        firstName: Yup.string().required(t('validate:firstName:required')),
        lastName: Yup.string().required(t('validate:lastName:required')),
        password: Yup.string().required(t('validate:password:required')),
        confirmPassword: Yup.string()
            .required(t('validate:confirmPassword:required'))
            // eslint-disable-next-line no-use-before-define
            .test('check-pass', t('validate:confirmPassword.wrong'), (input) => input === formik.values.password),
    };

    if (enableOtp) {
        configValidation = {
            ...configValidation,
            phoneNumber: Yup.string().required(t('validate:phoneNumber:required')).matches(regexPhone, t('validate:phoneNumber:wrong')),
            whatsappNumber: Yup.string().required(t('validate:whatsappNumber:required')).matches(regexPhone, t('validate:whatsappNumber:wrong')),
            otp: Yup.number().required('Otp is required'),
        };
    }

    if (enableRecaptcha) {
        configValidation = {
            ...configValidation,
            captcha: Yup.string().required(`Captcha ${t('validate:required')}`),
        };
    }

    const RegisterSchema = Yup.object().shape(configValidation);

    const handleSendRegister = (values, resetForm) => {
        sendRegister({
            variables: values,
        })
            .then(async ({ data }) => {
                resetForm();
                if (data.internalCreateCustomerToken.is_email_confirmation) {
                    window.backdropLoader(false);
                    setEmailConfirmationFlag({ status: '00', message: t('register:openEmail'), variant: 'success' });

                    window.toastMessage({
                        open: true,
                        text: t('register:openEmail'),
                        variant: 'success',
                    });

                    setTimeout(() => {
                        Router.push('/customer/account/login');
                    }, 2000);
                } else {
                    await setIsLogin(1);
                    getCart();
                    window.backdropLoader(false);
                }
                setdisabled(false);
            })
            .catch((e) => {
                // console.log(e.errors);
                setdisabled(false);
                window.backdropLoader(false);
                window.toastMessage({
                    open: true,
                    text: e.message.split(':')[0] || t('register:failed'),
                    variant: 'error',
                });
            });
    };

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phoneNumber: '',
            whatsappNumber: '',
            subscribe: false,
            otp: '',
            captcha: '',
        },
        validationSchema: RegisterSchema,
        onSubmit: (values, { resetForm }) => {
            setdisabled(true);
            window.backdropLoader(true);
            if (enableRecaptcha) {
                fetch('/captcha-validation', {
                    method: 'post',
                    body: JSON.stringify({
                        response: values.captcha,
                    }),
                    headers: { 'Content-Type': 'application/json' },
                })
                    .then((data) => data.json())
                    .then((json) => {
                        if (json.success) {
                            handleSendRegister(values, resetForm);
                        } else {
                            window.toastMessage({
                                open: true,
                                variant: 'error',
                                text: t('register:failed'),
                            });
                        }
                        window.backdropLoader(false);
                    })
                    .catch(() => {
                        window.backdropLoader(false);
                        window.toastMessage({
                            open: true,
                            variant: 'error',
                            text: t('common:error:fetchError'),
                        });
                    });

                recaptchaRef.current.reset();
            } else {
                handleSendRegister(values, resetForm);
            }
        },
    });

    const handleChangeCaptcha = (value) => {
        formik.setFieldValue('captcha', value || '');
    };

    const handleWa = () => {
        if (phoneIsWa === false) {
            // eslint-disable-next-line no-use-before-define
            formik.setFieldValue('whatsappNumber', formik.values.phoneNumber);
        }
        setPhoneIsWa(!phoneIsWa);
    };

    const handleChangePhone = (event) => {
        const { value } = event.target;
        if (phoneIsWa === true) {
            formik.setFieldValue('whatsappNumber', value);
        }
        formik.setFieldValue('phoneNumber', value);
    };

    if (cartData.data && custData.data) {
        setLocalStorage(custDataNameCookie, {
            email: custData.data.customer.email,
            firstname: custData.data.customer.firstname,
            customer_group: custData.data.customer.customer_group,
        });
        const custCartId = cartData.data.customerCart.id;
        if (cartId === '' || !cartId) {
            setLogin(1, expired);
            setCartId(custCartId, expired);
            window.toastMessage({
                open: true,
                text: t('register:success'),
                variant: 'success',
            });
            Router.push('/customer/account');
        } else if (!called && cartId !== custCartId) {
            mergeCart({
                variables: {
                    sourceCartId: cartId,
                    destionationCartId: custCartId,
                },
            })
                .then(() => {
                    setLogin(1, expired);
                    setCartId(custCartId, expired);
                    window.toastMessage({
                        open: true,
                        text: t('register:success'),
                        variant: 'success',
                    });
                    Router.push('/customer/account');
                })
                .catch((e) => {
                    setdisabled(false);
                    window.backdropLoader(false);
                    window.toastMessage({
                        open: true,
                        text: e.message.split(':')[1] || t('register:failed'),
                        variant: 'error',
                    });
                });
        } else {
            Router.push('/customer/account');
        }
    }

    if (guestData) {
        formik.initialValues.firstName = guestData.ordersFilter.data[0].detail[0].customer_firstname;
        formik.initialValues.lastName = guestData.ordersFilter.data[0].detail[0].customer_lastname;
        formik.initialValues.email = guestData.ordersFilter.data[0].detail[0].customer_email;
    }

    return (
        <Layout pageConfig={pageConfig || config} {...props}>
            <Content
                {...props}
                t={t}
                formik={formik}
                enableOtp={enableOtp}
                setdisabled={setdisabled}
                handleChangePhone={handleChangePhone}
                handleWa={handleWa}
                phoneIsWa={phoneIsWa}
                enableRecaptcha={enableRecaptcha}
                sitekey={sitekey}
                handleChangeCaptcha={handleChangeCaptcha}
                disabled={disabled}
                recaptchaRef={recaptchaRef}
            />
        </Layout>
    );
};

export default Register;
