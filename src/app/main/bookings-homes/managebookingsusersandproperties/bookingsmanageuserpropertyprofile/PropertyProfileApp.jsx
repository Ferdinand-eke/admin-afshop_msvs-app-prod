import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseLoading from '@fuse/core/FuseLoading';
import { styled, useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useNavigate, useParams, Link, useSearchParams } from 'react-router-dom';
import { useSingleShop } from 'src/app/api/shops/useAdminShops';
import AboutTab from './tabs/about/AboutTab';
import ReservationsTab from './tabs/reservations/ReservationsTab';
import TimelineTab from './tabs/timeline/TimelineTab';

// Tab names mapping - defined outside component to prevent recreation
const TAB_NAMES = ['about', 'timeline', 'reservations'];


const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider,
		'& > .container': {
			maxWidth: '100%'
		}
	}
}));

/**
 * The merchant profile page for hospitality merchants.
 */
function PropertyProfileApp() {
	const theme = useTheme();
	const navigate = useNavigate();
	const routeParams = useParams();
	const { merchantId } = routeParams;
	const [searchParams, setSearchParams] = useSearchParams();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	// Get initial tab from URL - use useMemo to prevent recreation
	const initialTab = useMemo(() => {
		const tabParam = searchParams.get('tab');
		const tabIndex = TAB_NAMES.indexOf(tabParam);
		return tabIndex !== -1 ? tabIndex : 0;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Only run once on mount

	const [selectedTab, setSelectedTab] = useState(initialTab);

	// Fetch merchant data
	const {
		data: merchantData,
		isLoading,
		isError
	} = useSingleShop(merchantId);

	const merchant = merchantData?.data?.merchant;

	// Update URL when tab changes - only update when selectedTab changes
	useEffect(() => {
		const currentTabName = TAB_NAMES[selectedTab];
		const urlTabParam = searchParams.get('tab');

		// Only update if the URL param is different from current tab
		if (urlTabParam !== currentTabName) {
			setSearchParams({ tab: currentTabName }, { replace: true });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedTab]); // Only depend on selectedTab

	function handleTabChange(_event, value) {
		setSelectedTab(value);
	}

	// Loading state  popertyId
	if (isLoading) {
		return <FuseLoading />;
	}

	// Error state
	if (isError || !merchant) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<FuseSvgIcon
					size={48}
					color="disabled"
				>
					heroicons-outline:exclamation-circle
				</FuseSvgIcon>
				<Typography
					color="text.secondary"
					variant="h5"
					className="mt-16"
				>
					Merchant not found!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/bookings-hospitality/merchants"
					color="secondary"
				>
					<FuseSvgIcon size={20}>heroicons-outline:arrow-left</FuseSvgIcon>
					<span className="mx-8">Back to Merchants</span>
				</Button>
			</motion.div>
		);
	}

	return (
		<Root
			header={
				<div className="flex flex-col w-full">
					{/* Cover Image Section */}
					{merchant?.coverimage && (
						<img
							className="h-160 lg:h-240 object-cover w-full"
							src={merchant.coverimage}
							alt="Merchant Cover"
						/>
					)}

					<motion.div
						initial={{ x: 20, opacity: 0 }}
						animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
						className="px-24 pt-16"
					>
						<Typography
							className="flex items-center sm:mb-12 cursor-pointer"
							onClick={() => navigate(-1)}
							role="button"
							color="inherit"
						>
							<FuseSvgIcon size={20}>
								{theme.direction === 'ltr'
									? 'heroicons-outline:arrow-sm-left'
									: 'heroicons-outline:arrow-sm-right'}
							</FuseSvgIcon>
							<span className="flex mx-4 font-medium">Back to Hospitality Merchants</span>
						</Typography>
					</motion.div>

					<div className="mt-20 flex flex-col flex-0 lg:flex-row items-center max-w-5xl w-full mx-auto px-32 lg:h-72">
						<div className="-mt-96 lg:-mt-88 rounded-full">
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1, transition: { delay: 0.1 } }}
							>
								<Avatar
									sx={{ borderColor: 'background.paper' }}
									className="w-128 h-128 border-4"
									src={
										merchant?.coverimage || 'assets/images/apps/ecommerce/product-image-placeholder.png'
									}
									alt={merchant?.shopname}
								/>
							</motion.div>
						</div>

						<div className="flex flex-col items-center lg:items-start mt-16 lg:mt-0 lg:ml-32">
							<div className="flex items-center gap-8">
								<Typography className="text-lg font-bold leading-none">{merchant?.shopname}</Typography>
								{merchant?.verified && (
									<Chip
										icon={
											<FuseSvgIcon
												size={14}
												className="text-white"
											>
												heroicons-outline:badge-check
											</FuseSvgIcon>
										}
										label="Verified"
										size="small"
										className="bg-green-600 text-white text-11"
									/>
								)}
							</div>
							<Typography
								color="text.secondary"
								className="mt-4"
							>
								{merchant?.shopcity || merchant?.address}, {merchant?.shopcountry}
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
								className="mt-4"
							>
								{merchant?.shopplan?.plansname || 'Hospitality Merchant'}
							</Typography>
						</div>

						<div className="hidden lg:flex h-32 mx-32 border-l-2" />

						<div className="flex items-center mt-24 lg:mt-0 space-x-24">
							<div className="flex flex-col items-center">
								<Typography className="font-bold">{merchant?.properties?.length || 0}</Typography>
								<Typography
									className="text-sm font-medium"
									color="text.secondary"
								>
									PROPERTIES
								</Typography>
							</div>
							<div className="flex flex-col items-center">
								<Typography className="font-bold">{merchant?.totalBookings || 0}</Typography>
								<Typography
									className="text-sm font-medium"
									color="text.secondary"
								>
									BOOKINGS
								</Typography>
							</div>
							<div className="flex flex-col items-center">
								<Chip
									label={merchant?.isSuspended || merchant?.isBlocked ? 'Suspended' : 'Active'}
									size="small"
									color={merchant?.isSuspended || merchant?.isBlocked ? 'error' : 'success'}
									className="font-semibold"
								/>
							</div>
						</div>

						<div className="flex flex-1 justify-end my-16 lg:my-0">
							<Tabs
								value={selectedTab}
								onChange={handleTabChange}
								indicatorColor="primary"
								textColor="inherit"
								variant="scrollable"
								scrollButtons={false}
								className="-mx-4 min-h-40"
								classes={{
									indicator: 'flex justify-center bg-transparent w-full h-full'
								}}
								TabIndicatorProps={{
									children: (
										<Box
											sx={{ bgcolor: 'text.disabled' }}
											className="w-full h-full rounded-full opacity-20"
										/>
									)
								}}
							>
								<Tab
									className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
									disableRipple
									label="About"
									icon={<FuseSvgIcon size={16}>heroicons-outline:information-circle</FuseSvgIcon>}
									iconPosition="start"
								/>
								<Tab
									className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
									disableRipple
									label="Timeline"
									icon={<FuseSvgIcon size={16}>heroicons-outline:clock</FuseSvgIcon>}
									iconPosition="start"
								/>
								<Tab
									className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
									disableRipple
									label="Reservations"
									icon={<FuseSvgIcon size={16}>heroicons-outline:calendar</FuseSvgIcon>}
									iconPosition="start"
								/>
							</Tabs>
						</div>
					</div>
				</div>
			}
			content={
				<div className="flex flex-auto justify-center w-full mx-auto px-12 py-0">
					{selectedTab === 0 && <AboutTab merchant={merchant} />}
					{selectedTab === 1 && <TimelineTab merchant={merchant} />}
					{selectedTab === 2 && <ReservationsTab merchant={merchant} />}
				</div>
			}
			scroll={isMobile ? 'normal' : 'page'}
		/>
	);
}

export default PropertyProfileApp;
