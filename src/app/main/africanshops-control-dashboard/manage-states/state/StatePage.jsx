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
import { useSingleState } from 'src/app/api/states/useStates';
import {
	// Country,
	State
	// City
} from 'country-state-city';
import SingleStateHeader from './SingleStateHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import ProductModel from './models/ProductModel';
/**
 * Form Validation Schema
 */
const schema = z.object({
	businessCountry: z
		.string()
		.nonempty('You must select a county')
		.min(5, 'The product name must be at least 5 characters'),
	statelocation: z.object({
		name: z.string()
	})
});

/**
 * The product page.
 */
function StatePage() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const routeParams = useParams();
	const { productId } = routeParams;

	const {
		data: stateData,
		isLoading,
		isError
	} = useSingleState(productId, {
		skip: !productId || productId === 'new'
	});
	const [tabValue, setTabValue] = useState(0);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {
			businessCountry: '',
			statelocation: {}
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
		// if (state?.data) {
		// 	reset({ ...state?.data });
		// }
		if (stateData?.data?.state) {
			// console.log("stateData", stateData?.data?.state)
			reset({
				...stateData?.data?.state,
				// statelocation:State.getStatesOfCountry(state?.data?.countryCode),
				statelocation: State.getStateByCodeAndCountry(
					stateData?.data?.state?.isoCode,
					stateData?.data?.state?.countryCode
				)
			});
		}
	}, [stateData?.data?.state, reset]);

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
	// console.log("Getting State error", isError)
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
					{isError} There is no such state!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/administrations/states"
					color="inherit"
				>
					Go to Products Page
				</Button>
			</motion.div>
		);
	}

	// console.log("STATE-DATA", state?.data)

	/**
	 * Wait while product data is loading and form is setted
	 */
	if (
		_.isEmpty(form) ||
		(stateData?.data?.state &&
			routeParams.productId !== stateData?.data?.state?.id &&
			routeParams.productId !== 'new')
	) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<SingleStateHeader />}
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

export default StatePage;
