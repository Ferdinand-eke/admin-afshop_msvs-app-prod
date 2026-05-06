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
import { useSingleLga } from 'src/app/api/lgas/useLgas';
import { City } from 'country-state-city';
import LgaCountyHeader from './LgaCountyHeader';
import BasicInfoTab from './tabs/LgaBasicInfoTab';
import ProductModel from './models/ProductModel';
/**
 * Form Validation Schema
 */
const schema = z.object({
	name: z.string().nonempty('You must enter an LGA/County name').min(3, 'The name must be at least 3 characters'),
	isoCode: z.string().optional(),
	longitude: z.string().optional(),
	latitude: z.string().optional(),
	businessCountry: z.string().optional(),
	businessState: z.string().optional(),
	isInOperation: z.union([z.boolean(), z.string()]).optional(),
	isPublished: z.union([z.boolean(), z.string()]).optional(),
	isFeatured: z.union([z.boolean(), z.string()]).optional()
});

/**
 * The product page.
 */
function LgaCounty() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const routeParams = useParams();
	const { productId } = routeParams;
	// const {
	// 	data: product,
	// 	isLoading,
	// 	isError
	// } = useGetECommerceProductQuery(productId, {
	// 	skip: !productId || productId === 'new'
	// });
	const {
		data: lgacounty,
		isLoading,
		isError
	} = useSingleLga(productId, {
		skip: !productId || productId === 'new'
	});

	// console.log("Single LGA", lgacounty?.data?.lga)

	const [tabValue, setTabValue] = useState(0);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {
			name: '',
			businessCountry: '',
			businessState: '',
			images: [],

			countryCode: '',
			stateCode: '',
			isoCode: '',
			latitude: '',
			longitude: '',

			isFeatured: '',
			isInOperation: '',
			isPublished: ''
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
		if (lgacounty?.data) {
			reset({ ...lgacounty?.data?.lga });
		}

		if (lgacounty?.data?.lga) {
			reset({
				...lgacounty?.data?.lga,
				// lgalocation: State.getStateByCodeAndCountry(lgacounty?.data?.lga?.isoCode, lgacounty?.data?.lga?.countryCode)
				lgalocation: City.getCitiesOfState(lgacounty?.data?.lga?.countryCode, lgacounty?.data?.lga?.stateCode)
			});
		}
	}, [lgacounty?.data, reset]);

	/**
	 * Tab Change
	 */
	function handleTabChange(_event, value) {
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
					to="/administrations/lgas"
					color="inherit"
				>
					Go to LGAs/Counties Page
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while product data is loading and form is setted
	 */
	if (
		_.isEmpty(form) ||
		(lgacounty?.data?.lga && routeParams.productId !== lgacounty?.data?.lga.id && routeParams.productId !== 'new')
	) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<LgaCountyHeader />}
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
						</Tabs>
						<div className="p-16 sm:p-24">
							<div className={tabValue !== 0 ? 'hidden' : ''}>
								<BasicInfoTab />
							</div>
						</div>
					</>
				}
				scroll={isMobile ? 'normal' : 'content'}
			/>
		</FormProvider>
	);
}

export default LgaCounty;
