import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import _ from '@lodash';
import { FormProvider, useForm } from 'react-hook-form';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSingleCountry } from 'src/app/api/countries/useCountries';
import { Country } from 'country-state-city';
import CountryHeader from './CountryHeader';
import CountryBasicInfoTab from './tabs/CountryBasicInfoTab';
// import InventoryTab from './tabs/InventoryTab';
// import PricingTab from './tabs/PricingTab';
import ProductImagesTab from './tabs/ProductImagesTab';
// import ShippingTab from './tabs/ShippingTab';
import ProductModel from './models/ProductModel';
/**
 * Form Validation Schema
 */
const schema = z.object({
	countrylocation: z.object({
		name: z.string()
	})
});

/**
 * The product page.
 */
function CountryPage() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const routeParams = useParams();
	const { productId } = routeParams;

	const {
		data: singleCountry,
		isLoading,
		isError
	} = useSingleCountry(productId, {
		skip: !productId || productId === 'new'
	});

	const [tabValue, setTabValue] = useState(0);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {
			name: '',
			flag: '',
			isFeatured: '',
			isInOperation: '',
			isPublished: '',
			isoCode: '',
			currency: '',
			phonecode: '',
			latitude: '',
			longitude: '',
			slug: '',
			vatRate: 0,
			images: [],
			countrylocation: {}
		},
		resolver: zodResolver(schema)
	});
	const { reset, watch } = methods;
	const form = watch();
	useEffect(() => {
		if (productId === 'new') {
			reset(ProductModel({}));
		}
	}, [productId, reset]);
	useEffect(() => {
		if (singleCountry?.data?.country) {
			reset({
				...singleCountry?.data?.country,
				countrylocation: Country.getCountryByCode(singleCountry?.data?.country?.isoCode)
			});
		}
	}, [singleCountry?.data, reset]);

	/**
	 * Tab Change
	 */
	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	/**
	 * Show Message if the requested products is not exists
	 */
	if (isError && productId !== 'new') {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography
					color="text.secondary"
					variant="h5"
				>
					There is no such product!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/administrations/countries"
					color="inherit"
				>
					Go to Products Page
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while product data is loading and form is setted
	 */
	if (
		_.isEmpty(form) ||
		(singleCountry?.data?.country &&
			routeParams.productId !== singleCountry?.data?.country?.id &&
			routeParams.productId !== 'new')
	) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<CountryHeader />}
				content={
					<>
						<Tabs
							value={tabValue}
							onChange={handleTabChange}
							indicatorColor="secondary"
							textColor="secondary"
							variant="scrollable"
							scrollButtons="auto"
							classes={{ root: 'w-full h-64 border-b-1' }}
						>
							<Tab
								className="h-64"
								label="Basic Info"
							/>
							<Tab
								className="h-64"
								label="Product Images"
							/>
						</Tabs>
						<div className={`p-16 sm:p-24 ${tabValue !== 0 ? 'hidden' : ''}`}>
							<CountryBasicInfoTab />
						</div>

						<div className={`p-16 sm:p-24 max-w-3xl ${tabValue !== 1 ? 'hidden' : ''}`}>
							<ProductImagesTab />
						</div>
					</>
				}
				scroll={isMobile ? 'normal' : 'content'}
			/>
		</FormProvider>
	);
}

export default CountryPage;
