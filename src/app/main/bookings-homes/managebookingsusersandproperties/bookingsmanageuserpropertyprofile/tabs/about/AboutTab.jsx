import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Chip, Grid, Divider, Avatar, Button, Box, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';

/**
 * The about tab - displays merchant profile and listed properties
 */
function AboutTab({ merchant }) {
	// Mock properties data based on the bookinglistproperties model
	const [mockProperties] = useState([
		{
			id: '1',
			title: 'Luxury Ocean View Suite',
			slug: 'luxury-ocean-view-suite',
			category: 'Hotel Room',
			price: 25000,
			roomCount: 3,
			bathroomCount: 2,
			guestCount: 6,
			rating: 4.8,
			numReviews: 124,
			isPublished: true,
			isFeatured: true,
			imageSrc: 'assets/images/apps/ecommerce/product-image-placeholder.png',
			description: 'Beautiful ocean-facing suite with modern amenities and stunning views',
			listingAccountBalance: 450000
		},
		{
			id: '2',
			title: 'Executive Apartment Downtown',
			slug: 'executive-apartment-downtown',
			category: 'Apartment',
			price: 18000,
			roomCount: 2,
			bathroomCount: 2,
			guestCount: 4,
			rating: 4.5,
			numReviews: 89,
			isPublished: true,
			isFeatured: false,
			imageSrc: 'assets/images/apps/ecommerce/product-image-placeholder.png',
			description: 'Modern apartment in the heart of the city with easy access to amenities',
			listingAccountBalance: 320000
		},
		{
			id: '3',
			title: 'Cozy Beach Bungalow',
			slug: 'cozy-beach-bungalow',
			category: 'Bungalow',
			price: 12000,
			roomCount: 1,
			bathroomCount: 1,
			guestCount: 2,
			rating: 4.9,
			numReviews: 156,
			isPublished: true,
			isFeatured: true,
			imageSrc: 'assets/images/apps/ecommerce/product-image-placeholder.png',
			description: 'Intimate beachfront bungalow perfect for romantic getaways',
			listingAccountBalance: 280000
		},
		{
			id: '4',
			title: 'Modern City Loft',
			slug: 'modern-city-loft',
			category: 'Loft',
			price: 22000,
			roomCount: 2,
			bathroomCount: 1,
			guestCount: 3,
			rating: 4.6,
			numReviews: 67,
			isPublished: false,
			isFeatured: false,
			imageSrc: 'assets/images/apps/ecommerce/product-image-placeholder.png',
			description: 'Stylish loft in downtown with industrial design',
			listingAccountBalance: 180000
		},
		{
			id: '5',
			title: 'Family Villa with Pool',
			slug: 'family-villa-pool',
			category: 'Villa',
			price: 35000,
			roomCount: 5,
			bathroomCount: 4,
			guestCount: 10,
			rating: 4.9,
			numReviews: 201,
			isPublished: true,
			isFeatured: true,
			imageSrc: 'assets/images/apps/ecommerce/product-image-placeholder.png',
			description: 'Spacious villa perfect for families with private pool',
			listingAccountBalance: 890000
		}
	]);

	const container = {
		show: {
			transition: {
				staggerChildren: 0.04
			}
		}
	};
	const item = {
		hidden: { opacity: 0, y: 40 },
		show: { opacity: 1, y: 0 }
	};

	// Table columns configuration
	const columns = useMemo(
		() => [
			{
				accessorKey: 'title',
				header: 'Property Name',
				size: 200,
				Cell: ({ row }) => (
					<div className="flex items-center gap-12">
						<img
							src={row.original.imageSrc}
							alt={row.original.title}
							className="w-48 h-48 rounded object-cover"
						/>
						<div>
							<Typography className="font-semibold text-13">{row.original.title}</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								{row.original.category}
							</Typography>
						</div>
					</div>
				)
			},
			{
				accessorKey: 'price',
				header: 'Price/Night',
				size: 120,
				Cell: ({ cell }) => (
					<Typography className="font-semibold text-blue-600">
						₦{cell.getValue().toLocaleString()}
					</Typography>
				)
			},
			{
				accessorKey: 'roomCount',
				header: 'Rooms',
				size: 80,
				Cell: ({ cell }) => (
					<div className="flex items-center gap-4">
						<FuseSvgIcon size={16}>heroicons-outline:home</FuseSvgIcon>
						<Typography variant="body2">{cell.getValue()}</Typography>
					</div>
				)
			},
			{
				accessorKey: 'guestCount',
				header: 'Guests',
				size: 80,
				Cell: ({ cell }) => (
					<div className="flex items-center gap-4">
						<FuseSvgIcon size={16}>heroicons-outline:users</FuseSvgIcon>
						<Typography variant="body2">{cell.getValue()}</Typography>
					</div>
				)
			},
			{
				accessorKey: 'rating',
				header: 'Rating',
				size: 100,
				Cell: ({ row }) => (
					<div className="flex items-center gap-4">
						<FuseSvgIcon
							size={16}
							className="text-yellow-600"
						>
							heroicons-solid:star
						</FuseSvgIcon>
						<Typography variant="body2" className="font-semibold">
							{row.original.rating}
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
						>
							({row.original.numReviews})
						</Typography>
					</div>
				)
			},
			{
				accessorKey: 'listingAccountBalance',
				header: 'Earnings',
				size: 120,
				Cell: ({ cell }) => (
					<Typography className="font-semibold text-green-600">
						₦{cell.getValue().toLocaleString()}
					</Typography>
				)
			},
			{
				accessorKey: 'isPublished',
				header: 'Status',
				size: 100,
				Cell: ({ row }) => (
					<div className="flex flex-col gap-4">
						<Chip
							label={row.original.isPublished ? 'Published' : 'Draft'}
							color={row.original.isPublished ? 'success' : 'default'}
							size="small"
						/>
						{row.original.isFeatured && (
							<Chip
								label="Featured"
								size="small"
								className="bg-yellow-500 text-white"
							/>
						)}
					</div>
				)
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				size: 100,
				Cell: ({ row }) => (
					<Button
						component={Link}
						to={`/hospitality/properties/${row.original.id}/${row.original.slug}`}
						size="small"
						variant="outlined"
						color="secondary"
					>
						View
					</Button>
				)
			}
		],
		[]
	);

	return (
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			className="w-full flex flex-col p-12 sm:p-16 md:p-24 gap-12 sm:gap-16 md:gap-24"
			sx={{ height: { xs: 'auto', lg: '100vh' }, overflow: { xs: 'visible', lg: 'hidden' } }}
		>
			{/* Top Section - Two Column Layout */}
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', lg: '340px 1fr' },
					gap: { xs: 2, sm: 2, md: 3 },
					height: { xs: 'auto', lg: '48vh' },
					overflow: 'hidden'
				}}
			>
				{/* Left Column - Stats, Status, and Business Info */}
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 }, overflow: { xs: 'visible', lg: 'auto' } }}>
					{/* Quick Stats */}
					<Card
						component={motion.div}
						variants={item}
						className="flex-shrink-0"
					>
						<div className="px-16 pt-16 pb-8">
							<Typography className="text-lg font-semibold">Quick Stats</Typography>
						</div>
						<CardContent className="px-16 py-12">
							<div className="flex flex-col gap-8">
								<div className="flex items-center justify-between p-8 bg-blue-50 rounded">
									<div className="flex items-center gap-8">
										<Avatar
											className="bg-blue-600"
											sx={{ width: 32, height: 32 }}
										>
											<FuseSvgIcon
												size={16}
												className="text-white"
											>
												heroicons-outline:home
											</FuseSvgIcon>
										</Avatar>
										<div>
											<Typography
												variant="caption"
												color="text.secondary"
											>
												Properties
											</Typography>
											<Typography className="font-bold text-14">{mockProperties.length}</Typography>
										</div>
									</div>
								</div>

								<div className="flex items-center justify-between p-8 bg-green-50 rounded">
									<div className="flex items-center gap-8">
										<Avatar
											className="bg-green-600"
											sx={{ width: 32, height: 32 }}
										>
											<FuseSvgIcon
												size={16}
												className="text-white"
											>
												heroicons-outline:check-circle
											</FuseSvgIcon>
										</Avatar>
										<div>
											<Typography
												variant="caption"
												color="text.secondary"
											>
												Published
											</Typography>
											<Typography className="font-bold text-14">
												{mockProperties.filter((p) => p.isPublished).length}
											</Typography>
										</div>
									</div>
								</div>

								<div className="flex items-center justify-between p-8 bg-yellow-50 rounded">
									<div className="flex items-center gap-8">
										<Avatar
											className="bg-yellow-600"
											sx={{ width: 32, height: 32 }}
										>
											<FuseSvgIcon
												size={16}
												className="text-white"
											>
												heroicons-outline:star
											</FuseSvgIcon>
										</Avatar>
										<div>
											<Typography
												variant="caption"
												color="text.secondary"
											>
												Featured
											</Typography>
											<Typography className="font-bold text-14">
												{mockProperties.filter((p) => p.isFeatured).length}
											</Typography>
										</div>
									</div>
								</div>

								<div className="flex items-center justify-between p-8 bg-purple-50 rounded">
									<div className="flex items-center gap-8">
										<Avatar
											className="bg-purple-600"
											sx={{ width: 32, height: 32 }}
										>
											<FuseSvgIcon
												size={16}
												className="text-white"
											>
												heroicons-outline:calendar
											</FuseSvgIcon>
										</Avatar>
										<div>
											<Typography
												variant="caption"
												color="text.secondary"
											>
												Avg. Rating
											</Typography>
											<Typography className="font-bold text-14">
												{mockProperties.length > 0
													? (
															mockProperties.reduce((acc, p) => acc + p.rating, 0) /
															mockProperties.length
													  ).toFixed(1)
													: '0.0'}
											</Typography>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Account Status */}
					<Card
						component={motion.div}
						variants={item}
						className="flex-shrink-0"
					>
						<div className="px-16 pt-16 pb-8">
							<Typography className="text-lg font-semibold">Account Status</Typography>
						</div>
						<CardContent className="px-16 py-12">
							<div className="flex flex-col gap-12">
								<div className="flex items-center justify-between">
									<Typography
										variant="body2"
										color="text.secondary"
									>
										Verification
									</Typography>
									<Chip
										label={merchant?.verified ? 'Verified' : 'Not Verified'}
										color={merchant?.verified ? 'success' : 'default'}
										size="small"
									/>
								</div>

								<div className="flex items-center justify-between">
									<Typography
										variant="body2"
										color="text.secondary"
									>
										Status
									</Typography>
									<Chip
										label={merchant?.isSuspended || merchant?.isBlocked ? 'Suspended' : 'Active'}
										color={merchant?.isSuspended || merchant?.isBlocked ? 'error' : 'success'}
										size="small"
									/>
								</div>

								<div className="flex items-center justify-between">
									<Typography
										variant="body2"
										color="text.secondary"
									>
										Blocked
									</Typography>
									<Chip
										label={merchant?.isBlocked ? 'Yes' : 'No'}
										color={merchant?.isBlocked ? 'error' : 'default'}
										size="small"
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Business Information */}
					<Card
						component={motion.div}
						variants={item}
						className="flex-shrink-0"
					>
						<div className="px-16 pt-16 pb-8 flex items-center justify-between">
							<Typography className="text-lg font-semibold">Business Information</Typography>
							<Chip
								label={merchant?.verified ? 'Verified' : 'Unverified'}
								color={merchant?.verified ? 'success' : 'default'}
								size="small"
								icon={
									<FuseSvgIcon size={12}>
										{merchant?.verified ? 'heroicons-outline:badge-check' : 'heroicons-outline:x-circle'}
									</FuseSvgIcon>
								}
							/>
						</div>

						<CardContent className="px-16 py-12">
							<div className="flex flex-col gap-16">
								<div>
									<Typography className="font-semibold mb-4 text-13 flex items-center gap-6">
										<FuseSvgIcon
											size={14}
											className="text-grey-600"
										>
											heroicons-outline:office-building
										</FuseSvgIcon>
										Business Name
									</Typography>
									<Typography
										variant="body2"
										className="ml-20"
									>
										{merchant?.shopname}
									</Typography>
								</div>

								<div>
									<Typography className="font-semibold mb-4 text-13 flex items-center gap-6">
										<FuseSvgIcon
											size={14}
											className="text-grey-600"
										>
											heroicons-outline:mail
										</FuseSvgIcon>
										Email
									</Typography>
									<Typography
										variant="body2"
										className="ml-20"
									>
										{merchant?.shopemail}
									</Typography>
								</div>

								<div>
									<Typography className="font-semibold mb-4 text-13 flex items-center gap-6">
										<FuseSvgIcon
											size={14}
											className="text-grey-600"
										>
											heroicons-outline:phone
										</FuseSvgIcon>
										Phone
									</Typography>
									<Typography
										variant="body2"
										className="ml-20"
									>
										{merchant?.shopphone || 'N/A'}
									</Typography>
								</div>

								<div>
									<Typography className="font-semibold mb-4 text-13 flex items-center gap-6">
										<FuseSvgIcon
											size={14}
											className="text-grey-600"
										>
											heroicons-outline:clipboard-list
										</FuseSvgIcon>
										Plan
									</Typography>
									<Chip
										label={merchant?.shopplan?.plansname || merchant?.merchantShopplan?.plansname || 'N/A'}
										color="primary"
										size="small"
										className="ml-20"
									/>
								</div>

								<div>
									<Typography className="font-semibold mb-4 text-13 flex items-center gap-6">
										<FuseSvgIcon
											size={14}
											className="text-grey-600"
										>
											heroicons-outline:location-marker
										</FuseSvgIcon>
										Location
									</Typography>
									<Typography
										variant="body2"
										className="ml-20"
									>
										{merchant?.address || merchant?.shopcity}, {merchant?.shopcountry}
									</Typography>
								</div>
							</div>
						</CardContent>
					</Card>
				</Box>

				{/* Right Column - Financial Overview */}
				<Card
					component={motion.div}
					variants={item}
					sx={{ overflow: 'visible', display: 'flex', flexDirection: 'column' }}
				>
					<div className="px-16 sm:px-20 md:px-24 pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10 md:pb-12 flex-shrink-0">
						<Typography className="text-lg sm:text-xl font-semibold">Financial Overview</Typography>
					</div>

					<CardContent
						className="px-16 sm:px-20 md:px-24 py-8 sm:py-12 md:py-16 flex-1 overflow-visible"
						sx={{ '&:last-child': { pb: { xs: 2, sm: 3, md: 4 } } }}
					>
						<Grid
							container
							spacing={{ xs: 2, sm: 2, md: 3 }}
						>
							<Grid
								item
								xs={12}
								sm={6}
								md={4}
							>
								<Paper
									elevation={0}
									className="flex flex-col items-center p-12 sm:p-16 md:p-20 lg:p-24 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl"
								>
									<FuseSvgIcon
										sx={{ fontSize: { xs: 28, sm: 32, md: 36, lg: 40 } }}
										className="text-green-600 mb-8 sm:mb-10 md:mb-12"
									>
										heroicons-outline:currency-dollar
									</FuseSvgIcon>
									<Typography
										sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.125rem' } }}
										className="font-bold text-green-600"
									>
										₦{(merchant?.shopaccount?.accountbalance || 0).toLocaleString()}
									</Typography>
									<Typography
										variant="caption"
										color="text.secondary"
										className="mt-4 sm:mt-6 md:mt-8 font-semibold text-center"
									>
										Account Balance
									</Typography>
									<Divider className="w-full my-8 sm:my-10 md:my-12" />
									<Typography
										variant="body2"
										color="text.secondary"
										className="text-center text-xs sm:text-sm"
									>
										Available for withdrawal
									</Typography>
								</Paper>
							</Grid>

							<Grid
								item
								xs={12}
								sm={6}
								md={4}
							>
								<Paper
									elevation={0}
									className="flex flex-col items-center p-12 sm:p-16 md:p-20 lg:p-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl"
								>
									<FuseSvgIcon
										sx={{ fontSize: { xs: 28, sm: 32, md: 36, lg: 40 } }}
										className="text-blue-600 mb-8 sm:mb-10 md:mb-12"
									>
										heroicons-outline:chart-bar
									</FuseSvgIcon>
									<Typography
										sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.125rem' } }}
										className="font-bold text-blue-600"
									>
										₦{(merchant?.totalRevenue || 0).toLocaleString()}
									</Typography>
									<Typography
										variant="caption"
										color="text.secondary"
										className="mt-4 sm:mt-6 md:mt-8 font-semibold text-center"
									>
										Total Revenue
									</Typography>
									<Divider className="w-full my-8 sm:my-10 md:my-12" />
									<Typography
										variant="body2"
										color="text.secondary"
										className="text-center text-xs sm:text-sm"
									>
										Lifetime earnings
									</Typography>
								</Paper>
							</Grid>

							<Grid
								item
								xs={12}
								sm={12}
								md={4}
							>
								<Paper
									elevation={0}
									className="flex flex-col items-center p-12 sm:p-16 md:p-20 lg:p-24 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl"
								>
									<FuseSvgIcon
										sx={{ fontSize: { xs: 28, sm: 32, md: 36, lg: 40 } }}
										className="text-purple-600 mb-8 sm:mb-10 md:mb-12"
									>
										heroicons-outline:calendar
									</FuseSvgIcon>
									<Typography
										sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.125rem' } }}
										className="font-bold text-purple-600"
									>
										{merchant?.totalBookings || 0}
									</Typography>
									<Typography
										variant="caption"
										color="text.secondary"
										className="mt-4 sm:mt-6 md:mt-8 font-semibold text-center"
									>
										Total Bookings
									</Typography>
									<Divider className="w-full my-8 sm:my-10 md:my-12" />
									<Typography
										variant="body2"
										color="text.secondary"
										className="text-center text-xs sm:text-sm"
									>
										Completed reservations
									</Typography>
								</Paper>
							</Grid>
						</Grid>

						<Divider className="my-12 sm:my-16 md:my-20 lg:my-24" />

						{/* Additional Financial Metrics */}
						<Grid
							container
							spacing={{ xs: 1.5, sm: 2 }}
						>
							<Grid
								item
								xs={6}
								sm={6}
								md={3}
							>
								<Box className="p-8 sm:p-12 md:p-14 lg:p-16 bg-orange-50 rounded-lg text-center">
									<Typography
										sx={{ fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' } }}
										className="font-bold text-orange-600"
									>
										₦{mockProperties.reduce((acc, p) => acc + p.listingAccountBalance, 0).toLocaleString()}
									</Typography>
									<Typography
										sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
										color="text.secondary"
										className="mt-1"
									>
										Properties Earnings
									</Typography>
								</Box>
							</Grid>
							<Grid
								item
								xs={6}
								sm={6}
								md={3}
							>
								<Box className="p-8 sm:p-12 md:p-14 lg:p-16 bg-teal-50 rounded-lg text-center">
									<Typography
										sx={{ fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' } }}
										className="font-bold text-teal-600"
									>
										₦{Math.round(
											mockProperties.reduce((acc, p) => acc + p.price, 0) / mockProperties.length
										).toLocaleString()}
									</Typography>
									<Typography
										sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
										color="text.secondary"
										className="mt-1"
									>
										Avg. Nightly Rate
									</Typography>
								</Box>
							</Grid>
							<Grid
								item
								xs={6}
								sm={6}
								md={3}
							>
								<Box className="p-8 sm:p-12 md:p-14 lg:p-16 bg-indigo-50 rounded-lg text-center">
									<Typography
										sx={{ fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' } }}
										className="font-bold text-indigo-600"
									>
										{mockProperties.filter((p) => p.isPublished).length}/{mockProperties.length}
									</Typography>
									<Typography
										sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
										color="text.secondary"
										className="mt-1"
									>
										Active Listings
									</Typography>
								</Box>
							</Grid>
							<Grid
								item
								xs={6}
								sm={6}
								md={3}
							>
								<Box className="p-8 sm:p-12 md:p-14 lg:p-16 bg-pink-50 rounded-lg text-center">
									<Typography
										sx={{ fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' } }}
										className="font-bold text-pink-600"
									>
										{(
											mockProperties.reduce((acc, p) => acc + p.rating, 0) / mockProperties.length
										).toFixed(1)}
										/5.0
									</Typography>
									<Typography
										sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
										color="text.secondary"
										className="mt-1"
									>
										Overall Rating
									</Typography>
								</Box>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			</Box>

			{/* Bottom Section - Properties Table */}
			<Card
				component={motion.div}
				variants={item}
				className="flex-1 overflow-hidden flex flex-col"
				sx={{ height: { xs: 'auto', lg: 'calc(52vh - 24px)' }, minHeight: { xs: '400px', lg: 'auto' } }}
			>
				<div className="px-12 sm:px-16 md:px-20 lg:px-24 pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10 md:pb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 sm:gap-0 flex-shrink-0">
					<div>
						<Typography className="text-lg sm:text-xl font-semibold">Listed Properties</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
						>
							{mockProperties.length} total listings
						</Typography>
					</div>
					<Button
						component={Link}
						to={`/hospitality/merchants/${merchant?.id}/properties`}
						variant="contained"
						color="secondary"
						size="small"
						startIcon={<FuseSvgIcon size={16}>heroicons-outline:plus</FuseSvgIcon>}
						sx={{ whiteSpace: 'nowrap' }}
					>
						Manage Properties
					</Button>
				</div>

				<Box
					className="flex-1 overflow-hidden"
					sx={{ px: { xs: 1, sm: 1.5, md: 2 } }}
				>
					<MaterialReactTable
						columns={columns}
						data={mockProperties}
						enableColumnActions={false}
						enableColumnFilters={false}
						enableSorting
						enablePagination
						enableBottomToolbar
						enableTopToolbar={false}
						enableColumnResizing={false}
						muiTableContainerProps={{
							sx: {
								maxHeight: { xs: 'calc(100% - 56px)', lg: 'calc(100% - 56px)' },
								overflowX: 'auto'
							}
						}}
						muiTablePaperProps={{
							elevation: 0,
							sx: { height: '100%', display: 'flex', flexDirection: 'column' }
						}}
						muiTableProps={{
							sx: {
								minWidth: { xs: '800px', sm: '100%' }
							}
						}}
						initialState={{
							pagination: { pageSize: 5, pageIndex: 0 },
							density: 'compact'
						}}
						muiPaginationProps={{
							rowsPerPageOptions: [5, 10, 15],
							showFirstButton: true,
							showLastButton: true,
							sx: {
								'.MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel': {
									fontSize: { xs: '0.75rem', sm: '0.875rem' }
								}
							}
						}}
					/>
				</Box>
			</Card>
		</motion.div>
	);
}

export default AboutTab;
