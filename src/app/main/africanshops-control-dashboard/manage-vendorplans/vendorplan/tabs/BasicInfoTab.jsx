import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';
import {
	InputAdornment,
	MenuItem,
	Select,
	Typography,
	Box,
	Paper,
	Divider,
	Grid,
	FormControl,
	InputLabel,
	FormHelperText,
	Chip,
	Stack
} from '@mui/material';
import {
	Store as StoreIcon,
	Restaurant as RestaurantIcon,
	Hotel as HotelIcon,
	Home as HomeIcon,
	LocalShipping as LogisticsIcon,
	Agriculture as AgricultureIcon
} from '@mui/icons-material';

// ShopKeyForPlan Enum Values
const SHOP_KEY_ENUM = {
	WHOLESALEANDRETAILERS: 'WHOLESALEANDRETAILERS',
	FOODVENDORS: 'FOODVENDORS',
	HOTELSANDAPARTMENTS: 'HOTELSANDAPARTMENTS',
	REALESTATE: 'REALESTATE',
	LOGISTICS: 'LOGISTICS',
	AGROTERRAYIELD: 'AGROTERRAYIELD'
};

// Plan key configuration with metadata
const PLAN_KEY_OPTIONS = [
	{
		value: SHOP_KEY_ENUM.WHOLESALEANDRETAILERS,
		label: 'Wholesale & Retailers',
		description: 'Service for marketplace',
		icon: StoreIcon,
		color: '#1976d2'
	},
	{
		value: SHOP_KEY_ENUM.FOODVENDORS,
		label: 'Food Vendors',
		description: 'Service for RCS (Restaurant & Catering Services)',
		icon: RestaurantIcon,
		color: '#f57c00'
	},
	{
		value: SHOP_KEY_ENUM.HOTELSANDAPARTMENTS,
		label: 'Hotels & Apartments',
		description: 'Service for Hospitality',
		icon: HotelIcon,
		color: '#7b1fa2'
	},
	{
		value: SHOP_KEY_ENUM.REALESTATE,
		label: 'Real Estate',
		description: 'Service for real estate',
		icon: HomeIcon,
		color: '#388e3c'
	},
	{
		value: SHOP_KEY_ENUM.LOGISTICS,
		label: 'Logistics',
		description: 'Service for logistics',
		icon: LogisticsIcon,
		color: '#0288d1'
	},
	{
		value: SHOP_KEY_ENUM.AGROTERRAYIELD,
		label: 'Agro & Rare-Earth Minerals',
		description: 'Service for agricultural and rare-earth minerals',
		icon: AgricultureIcon,
		color: '#689f38'
	}
];

/**
 * The basic info tab for vendor plan configuration.
 * Provides comprehensive plan setup including service type, pricing, features, and limits.
 */
function BasicInfoTab() {
	const methods = useFormContext();
	const { control, formState, watch } = methods;
	const { errors } = formState;

	const selectedPlanKey = watch('plankey');
	const selectedPlanConfig = PLAN_KEY_OPTIONS.find((option) => option.value === selectedPlanKey);

	return (
		<Box sx={{ maxWidth: 1200, mx: 'auto' }}>
			{/* Plan Identification Section */}
			<Paper elevation={2} sx={{ p: 3, mb: 3 }}>
				<Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
					Plan Identification
				</Typography>
				<Divider sx={{ mb: 3 }} />

				<Grid container spacing={3}>
					<Grid item xs={12} md={6}>
						<Controller
							name="plansname"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									required
									label="Plan Name"
									id="plansname"
									variant="outlined"
									fullWidth
									error={!!errors.plansname}
									helperText={errors?.plansname?.message || 'Enter a descriptive plan name'}
									placeholder="e.g., Premium Marketplace Plan"
								/>
							)}
						/>
					</Grid>

					<Grid item xs={12} md={6}>
						<Controller
							name="plankey"
							control={control}
							render={({ field }) => (
								<FormControl fullWidth required error={!!errors.plankey} disabled={field.value}>
									<InputLabel id="plankey-label">Service Type (Plan Key)</InputLabel>
									<Select
										{...field}
										labelId="plankey-label"
										id="plankey"
										label="Service Type (Plan Key)"
										value={field.value || ''}
										renderValue={(selected) => {
											const option = PLAN_KEY_OPTIONS.find((opt) => opt.value === selected);
											if (!option) return selected;
											const IconComponent = option.icon;
											return (
												<Stack direction="row" spacing={1} alignItems="center">
													<IconComponent sx={{ fontSize: 20, color: option.color }} />
													<Typography>{option.label}</Typography>
												</Stack>
											);
										}}
									>
										<MenuItem value="" disabled>
											<em>Select a service type</em>
										</MenuItem>
										{PLAN_KEY_OPTIONS.map((option) => {
											const IconComponent = option.icon;
											return (
												<MenuItem key={option.value} value={option.value}>
													<Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
														<IconComponent sx={{ fontSize: 24, color: option.color }} />
														<Box sx={{ flex: 1 }}>
															<Typography variant="body1" sx={{ fontWeight: 500 }}>
																{option.label}
															</Typography>
															<Typography variant="caption" color="text.secondary">
																{option.description}
															</Typography>
														</Box>
													</Stack>
												</MenuItem>
											);
										})}
									</Select>
									<FormHelperText>
										{errors?.plankey?.message ||
											(field.value
												? 'Plan key is immutable once set'
												: 'Select the service type for this plan')}
									</FormHelperText>
								</FormControl>
							)}
						/>
					</Grid>

					{selectedPlanConfig && (
						<Grid item xs={12}>
							<Box
								sx={{
									p: 2,
									bgcolor: `${selectedPlanConfig.color}10`,
									borderLeft: 4,
									borderColor: selectedPlanConfig.color,
									borderRadius: 1
								}}
							>
								<Stack direction="row" spacing={2} alignItems="center">
									<selectedPlanConfig.icon sx={{ fontSize: 32, color: selectedPlanConfig.color }} />
									<Box>
										<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
											{selectedPlanConfig.label}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{selectedPlanConfig.description}
										</Typography>
									</Box>
								</Stack>
							</Box>
						</Grid>
					)}

					<Grid item xs={12}>
						<Controller
							name="planinfo"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									id="planinfo"
									label="Plan Description"
									type="text"
									multiline
									rows={4}
									variant="outlined"
									fullWidth
									placeholder="Provide a comprehensive description of this plan's features and benefits..."
									helperText="Detailed information about the plan that will be visible to vendors"
								/>
							)}
						/>
					</Grid>
				</Grid>
			</Paper>

			{/* Pricing & Commission Section */}
			<Paper elevation={2} sx={{ p: 3, mb: 3 }}>
				<Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
					Pricing & Commission
				</Typography>
				<Divider sx={{ mb: 3 }} />

				<Grid container spacing={3}>
					<Grid item xs={12} md={6}>
						<Controller
							name="price"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									required
									label="Monthly Storage Fee"
									id="price"
									variant="outlined"
									fullWidth
									type="number"
									InputProps={{
										startAdornment: <InputAdornment position="start">₦</InputAdornment>
									}}
									error={!!errors.price}
									helperText={errors?.price?.message || 'Price for product storage per month'}
									placeholder="0.00"
								/>
							)}
						/>
					</Grid>

					<Grid item xs={12} md={6}>
						<Controller
							name="percetageCommissionCharge"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Commission Rate"
									id="percetageCommissionCharge"
									InputProps={{
										startAdornment: <InputAdornment position="start">%</InputAdornment>
									}}
									type="number"
									variant="outlined"
									fullWidth
									error={!!errors.percetageCommissionCharge}
									helperText={
										errors?.percetageCommissionCharge?.message ||
										'Percentage commission charged on each sale'
									}
									placeholder="0.00"
								/>
							)}
						/>
					</Grid>

					<Grid item xs={12} md={6}>
						<Controller
							name="percetageCommissionChargeConversion"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Commission Rate (Decimal)"
									id="percetageCommissionChargeConversion"
									type="number"
									variant="outlined"
									fullWidth
									disabled
									helperText="Auto-calculated decimal conversion of percentage commission"
									placeholder="0.00"
								/>
							)}
						/>
					</Grid>

					<Grid item xs={12} md={6}>
						<Controller
							name="serviceChargeFeeOption"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Service Charge Fee"
									id="serviceChargeFeeOption"
									variant="outlined"
									fullWidth
									type="number"
									InputProps={{
										startAdornment: <InputAdornment position="start">₦</InputAdornment>
									}}
									error={!!errors.serviceChargeFeeOption}
									helperText={
										errors?.serviceChargeFeeOption?.message ||
										'Fixed service charge fee for plans without commission'
									}
									placeholder="0.00"
								/>
							)}
						/>
					</Grid>
				</Grid>
			</Paper>

			{/* Plan Features Section */}
			<Paper elevation={2} sx={{ p: 3, mb: 3 }}>
				<Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
					Plan Features
				</Typography>
				<Divider sx={{ mb: 3 }} />

				<Grid container spacing={3}>
					<Grid item xs={12} md={4}>
						<Controller
							name="support"
							control={control}
							render={({ field: { onChange, value } }) => (
								<FormControl fullWidth error={!!errors.support}>
									<InputLabel id="support-label">Support Incorporation</InputLabel>
									<Select
										labelId="support-label"
										id="support"
										label="Support Incorporation"
										onChange={onChange}
										value={value || ''}
									>
										<MenuItem value="">
											<em>Select support status</em>
										</MenuItem>
										<MenuItem value="Inclusive">
											<Stack direction="row" spacing={1} alignItems="center">
												<Chip label="Inclusive" color="success" size="small" />
												<Typography>Support Included</Typography>
											</Stack>
										</MenuItem>
										<MenuItem value="Non Inclusive">
											<Stack direction="row" spacing={1} alignItems="center">
												<Chip label="Non Inclusive" color="default" size="small" />
												<Typography>No Support</Typography>
											</Stack>
										</MenuItem>
									</Select>
									<FormHelperText>
										{errors?.support?.message || 'Does this plan include support services?'}
									</FormHelperText>
								</FormControl>
							)}
						/>
					</Grid>

					<Grid item xs={12} md={4}>
						<Controller
							name="adsbost"
							control={control}
							render={({ field: { onChange, value } }) => (
								<FormControl fullWidth error={!!errors.adsbost}>
									<InputLabel id="adsbost-label">Ads Boost</InputLabel>
									<Select
										labelId="adsbost-label"
										id="adsbost"
										label="Ads Boost"
										onChange={onChange}
										value={value || ''}
									>
										<MenuItem value="">
											<em>Select ads boost status</em>
										</MenuItem>
										<MenuItem value="Inclusive">
											<Stack direction="row" spacing={1} alignItems="center">
												<Chip label="Inclusive" color="success" size="small" />
												<Typography>Ads Boost Enabled</Typography>
											</Stack>
										</MenuItem>
										<MenuItem value="Non Inclusive">
											<Stack direction="row" spacing={1} alignItems="center">
												<Chip label="Non Inclusive" color="default" size="small" />
												<Typography>No Ads Boost</Typography>
											</Stack>
										</MenuItem>
									</Select>
									<FormHelperText>
										{errors?.adsbost?.message || 'Does this plan include ad boost features?'}
									</FormHelperText>
								</FormControl>
							)}
						/>
					</Grid>

					<Grid item xs={12} md={4}>
						<Controller
							name="dashboardandanalytics"
							control={control}
							render={({ field: { onChange, value } }) => (
								<FormControl fullWidth error={!!errors.dashboardandanalytics}>
									<InputLabel id="dashboardandanalytics-label">Analytics Dashboard</InputLabel>
									<Select
										labelId="dashboardandanalytics-label"
										id="dashboardandanalytics"
										label="Analytics Dashboard"
										onChange={onChange}
										value={value || ''}
									>
										<MenuItem value="">
											<em>Select analytics status</em>
										</MenuItem>
										<MenuItem value="Inclusive">
											<Stack direction="row" spacing={1} alignItems="center">
												<Chip label="Inclusive" color="success" size="small" />
												<Typography>Dashboard Enabled</Typography>
											</Stack>
										</MenuItem>
										<MenuItem value="Non Inclusive">
											<Stack direction="row" spacing={1} alignItems="center">
												<Chip label="Non Inclusive" color="default" size="small" />
												<Typography>No Dashboard</Typography>
											</Stack>
										</MenuItem>
									</Select>
									<FormHelperText>
										{errors?.dashboardandanalytics?.message ||
											'Does this plan include analytics dashboard?'}
									</FormHelperText>
								</FormControl>
							)}
						/>
					</Grid>
				</Grid>
			</Paper>

			{/* Plan Limits Section */}
			<Paper elevation={2} sx={{ p: 3, mb: 3 }}>
				<Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
					Plan Limits
				</Typography>
				<Divider sx={{ mb: 3 }} />

				<Grid container spacing={3}>
					<Grid item xs={12} md={6}>
						<Controller
							name="numberofproducts"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									required
									label="Product Upload Limit"
									id="numberofproducts"
									variant="outlined"
									fullWidth
									type="number"
									error={!!errors.numberofproducts}
									helperText={
										errors?.numberofproducts?.message ||
										'Number of products uploadable per every 10 sales'
									}
									placeholder="0"
								/>
							)}
						/>
					</Grid>

					<Grid item xs={12} md={6}>
						<Controller
							name="numberoffeaturedimages"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									required
									label="Product Images Limit"
									id="numberoffeaturedimages"
									variant="outlined"
									fullWidth
									type="number"
									error={!!errors.numberoffeaturedimages}
									helperText={
										errors?.numberoffeaturedimages?.message ||
										'Maximum number of images per product'
									}
									placeholder="0"
								/>
							)}
						/>
					</Grid>
				</Grid>
			</Paper>

			{/* Operational Status Section */}
			<Paper elevation={2} sx={{ p: 3 }}>
				<Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
					Operational Status
				</Typography>
				<Divider sx={{ mb: 3 }} />

				<Grid container spacing={3}>
					<Grid item xs={12} md={6}>
						<Controller
							name="isInOperation"
							control={control}
							render={({ field: { onChange, value } }) => (
								<FormControl fullWidth error={!!errors.isInOperation}>
									<InputLabel id="isInOperation-label">Operational Status</InputLabel>
									<Select
										labelId="isInOperation-label"
										id="isInOperation"
										label="Operational Status"
										onChange={onChange}
										value={value ?? ''}
									>
										<MenuItem value="">
											<em>Select operational status</em>
										</MenuItem>
										<MenuItem value={false}>
											<Stack direction="row" spacing={1} alignItems="center">
												<Chip label="Inactive" color="error" size="small" />
												<Typography>Not Operational</Typography>
											</Stack>
										</MenuItem>
										<MenuItem value>
											<Stack direction="row" spacing={1} alignItems="center">
												<Chip label="Active" color="success" size="small" />
												<Typography>Operational</Typography>
											</Stack>
										</MenuItem>
									</Select>
									<FormHelperText>
										{errors?.isInOperation?.message || 'Is this plan currently active and available?'}
									</FormHelperText>
								</FormControl>
							)}
						/>
					</Grid>
				</Grid>
			</Paper>
		</Box>
	);
}

export default BasicInfoTab;
