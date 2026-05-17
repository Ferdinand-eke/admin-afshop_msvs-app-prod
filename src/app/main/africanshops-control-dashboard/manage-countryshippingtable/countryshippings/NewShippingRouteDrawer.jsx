import { useEffect } from 'react';
import {
	Avatar,
	Box,
	Button,
	CircularProgress,
	Divider,
	FormControl,
	FormHelperText,
	IconButton,
	InputAdornment,
	InputLabel,
	ListItemIcon,
	ListItemText,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
	useCountriesWithShippingTableOriginExcluded,
	useCountryAddShippingTableMutation
} from '../../../../api/countries/useCountries';

// Prevents e, E, +, -, and . so only whole non-negative integers can be typed
const blockNonInteger = (e) => {
	if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
};

// Safely parses a form value to integer; returns undefined for empty / non-numeric
const parseIntField = (v) => {
	if (v === '' || v === undefined || v === null) return undefined;
	const n = parseInt(v, 10);
	return Number.isNaN(n) ? undefined : n;
};

const schema = z.object({
	countryToShipTo: z.string().min(1, 'Please select a destination country'),
	airKilogramFreightFee: z.coerce.number({ invalid_type_error: 'Required' }).min(0, 'Must be 0 or more'),
	landKilogramFreightFee: z.coerce.number({ invalid_type_error: 'Required' }).min(0, 'Must be 0 or more'),
	perCbmFreightFee: z.coerce.number({ invalid_type_error: 'Required' }).min(0, 'Must be 0 or more'),
	seaKilogramFreightFee: z.coerce.number().min(0).optional().or(z.literal('')),
	airTransitDaysMin: z.coerce.number().int().min(0).optional().or(z.literal('')),
	airTransitDaysMax: z.coerce.number().int().min(0).optional().or(z.literal('')),
	landTransitDaysMin: z.coerce.number().int().min(0).optional().or(z.literal('')),
	landTransitDaysMax: z.coerce.number().int().min(0).optional().or(z.literal('')),
	seaTransitDaysMin: z.coerce.number().int().min(0).optional().or(z.literal('')),
	seaTransitDaysMax: z.coerce.number().int().min(0).optional().or(z.literal('')),
	notes: z.string().optional()
});

function SectionHeader({ iconName, title, bgColor, iconColor }) {
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: 1,
				py: 0.75,
				px: 1.5,
				borderRadius: 2,
				bgcolor: bgColor,
				mb: 2
			}}
		>
			<FuseSvgIcon
				size={15}
				sx={{ color: iconColor }}
			>
				{iconName}
			</FuseSvgIcon>
			<Typography
				variant="caption"
				sx={{ fontWeight: 800, color: iconColor, textTransform: 'uppercase', letterSpacing: 0.8 }}
			>
				{title}
			</Typography>
		</Box>
	);
}

function TransitDaysRow({ control, minName, maxName }) {
	return (
		<Stack
			direction="row"
			spacing={2}
			mb={3}
		>
			<Controller
				name={minName}
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label="Min Transit Days"
						type="number"
						size="small"
						fullWidth
						InputProps={{
							endAdornment: <InputAdornment position="end">days</InputAdornment>,
							inputProps: { min: 0, step: 1, onKeyDown: blockNonInteger }
						}}
						sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
					/>
				)}
			/>
			<Controller
				name={maxName}
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label="Max Transit Days"
						type="number"
						size="small"
						fullWidth
						InputProps={{
							endAdornment: <InputAdornment position="end">days</InputAdornment>,
							inputProps: { min: 0, step: 1, onKeyDown: blockNonInteger }
						}}
						sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
					/>
				)}
			/>
		</Stack>
	);
}

function NewShippingRouteDrawer({ originCountry, onClose }) {
	const queryResult = useCountriesWithShippingTableOriginExcluded(originCountry?._id || originCountry?.id);
	const { data: destinationsData, isLoading: loadingDestinations } = queryResult || {};
	const destinations = destinationsData?.data?.countries || [];

	const addRoute = useCountryAddShippingTableMutation();

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isValid, isDirty }
	} = useForm({
		mode: 'onChange',
		resolver: zodResolver(schema),
		defaultValues: {
			countryToShipTo: '',
			airKilogramFreightFee: '',
			landKilogramFreightFee: '',
			perCbmFreightFee: '',
			seaKilogramFreightFee: '',
			airTransitDaysMin: '',
			airTransitDaysMax: '',
			landTransitDaysMin: '',
			landTransitDaysMax: '',
			seaTransitDaysMin: '',
			seaTransitDaysMax: '',
			notes: ''
		}
	});
	useEffect(() => {
		if (addRoute.isSuccess) {
			reset();
			onClose();
		}
	}, [addRoute.isSuccess, reset, onClose]);

	function onSubmit(values) {
		const destCountry = destinations?.find((c) => (c._id || c.id) === values.countryToShipTo);
		const payload = {
			countryCheckOrigin: originCountry._id || originCountry?.id,
			countryToShipTo: values.countryToShipTo,
			countryToShipToName: destCountry?.name,
			airKilogramFreightFee: parseInt(values.airKilogramFreightFee, 10),
			landKilogramFreightFee: parseInt(values.landKilogramFreightFee, 10),
			perCbmFreightFee: parseInt(values.perCbmFreightFee, 10),
			seaKilogramFreightFee: parseIntField(values.seaKilogramFreightFee),
			airTransitDaysMin: parseIntField(values.airTransitDaysMin),
			airTransitDaysMax: parseIntField(values.airTransitDaysMax),
			landTransitDaysMin: parseIntField(values.landTransitDaysMin),
			landTransitDaysMax: parseIntField(values.landTransitDaysMax),
			seaTransitDaysMin: parseIntField(values.seaTransitDaysMin),
			seaTransitDaysMax: parseIntField(values.seaTransitDaysMax),
			notes: values.notes
		};
		addRoute.mutate(payload);
	}

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			{/* Gradient header */}
			<Box
				sx={{
					background: 'linear-gradient(135deg, #1a237e 0%, #283593 60%, #3949ab 100%)',
					px: 3,
					pt: 4,
					pb: 3,
					position: 'relative',
					flexShrink: 0
				}}
			>
				<IconButton
					onClick={onClose}
					size="small"
					sx={{
						position: 'absolute',
						top: 12,
						right: 12,
						color: 'white',
						bgcolor: 'rgba(255,255,255,0.15)',
						'&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
					}}
				>
					<FuseSvgIcon size={18}>heroicons-outline:x</FuseSvgIcon>
				</IconButton>

				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
				>
					<Stack
						direction="row"
						alignItems="center"
						spacing={1.5}
						mb={0.75}
					>
						{originCountry?.flag && (
							<Avatar
								src={originCountry.flag}
								sx={{ width: 38, height: 38, border: '2px solid rgba(255,255,255,0.3)' }}
							/>
						)}
						<Box>
							<Typography
								variant="caption"
								sx={{ color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: 1 }}
							>
								New Route From
							</Typography>
							<Typography
								variant="h6"
								fontWeight={800}
								sx={{ color: 'white', lineHeight: 1.1 }}
							>
								{originCountry?.name || '...'}
							</Typography>
						</Box>
					</Stack>
					<Typography
						variant="caption"
						sx={{ color: 'rgba(255,255,255,0.55)' }}
					>
						Define freight rates and transit times to a new destination country
					</Typography>
				</motion.div>
			</Box>

			{/* Form */}
			<Box
				component="form"
				onSubmit={handleSubmit(onSubmit)}
				sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
			>
				<Box sx={{ flex: 1, overflow: 'auto', px: 3, py: 3 }}>
					{/* Destination */}
					<SectionHeader
						iconName="heroicons-outline:location-marker"
						title="Route Destination"
						bgColor="rgba(103, 58, 183, 0.08)"
						iconColor="rgb(81, 45, 168)"
					/>

					<Controller
						name="countryToShipTo"
						control={control}
						render={({ field }) => (
							<FormControl
								fullWidth
								size="small"
								error={!!errors.countryToShipTo}
								sx={{ mb: 3 }}
							>
								<InputLabel>Destination Country *</InputLabel>
								<Select
									{...field}
									label="Destination Country *"
									disabled={loadingDestinations}
									sx={{ borderRadius: 2 }}
									renderValue={(value) => {
										const c = destinations?.find((x) => x?._id || x?.id === value);
										if (!c) return null;
										return (
											<Stack
												direction="row"
												alignItems="center"
												spacing={1}
											>
												{c.flag && (
													<Avatar
														src={c.flag}
														sx={{ width: 18, height: 18 }}
													/>
												)}
												<Typography
													variant="body2"
													fontWeight={600}
												>
													{c.name}
												</Typography>
											</Stack>
										);
									}}
								>
									<MenuItem value="">
										<em>Select destination country</em>
									</MenuItem>
									{destinations?.map((country) => (
										<MenuItem
											key={country?._id || country?.id}
											value={country?._id || country?.id}
										>
											<ListItemIcon sx={{ minWidth: 36 }}>
												{country.flag ? (
													<Avatar
														src={country.flag}
														sx={{ width: 24, height: 24 }}
													/>
												) : (
													<Avatar sx={{ width: 24, height: 24, fontSize: 10, bgcolor: 'grey.300' }}>
														{country.isoCode}
													</Avatar>
												)}
											</ListItemIcon>
											<ListItemText
												primary={country.name}
												secondary={country.isoCode}
												primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
											/>
										</MenuItem>
									))}
								</Select>
								{errors.countryToShipTo && (
									<FormHelperText>{errors.countryToShipTo.message}</FormHelperText>
								)}
							</FormControl>
						)}
					/>

					<Divider sx={{ mb: 3 }} />

					{/* Air Freight */}
					<SectionHeader
						iconName="heroicons-outline:paper-airplane"
						title="Air Freight"
						bgColor="rgba(25, 118, 210, 0.08)"
						iconColor="rgb(21, 101, 192)"
					/>

					<Controller
						name="airKilogramFreightFee"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Rate per KG (Air) *"
								type="number"
								size="small"
								fullWidth
								error={!!errors.airKilogramFreightFee}
								helperText={errors.airKilogramFreightFee?.message}
								InputProps={{
									startAdornment: <InputAdornment position="start">₦</InputAdornment>,
									inputProps: { min: 0, step: 1, onKeyDown: blockNonInteger }
								}}
								sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
							/>
						)}
					/>

					<TransitDaysRow
						control={control}
						minName="airTransitDaysMin"
						maxName="airTransitDaysMax"
					/>

					<Divider sx={{ mb: 3 }} />

					{/* Land Freight */}
					<SectionHeader
						iconName="heroicons-outline:truck"
						title="Land Freight"
						bgColor="rgba(46, 125, 50, 0.08)"
						iconColor="rgb(27, 94, 32)"
					/>

					<Controller
						name="landKilogramFreightFee"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Rate per KG (Land) *"
								type="number"
								size="small"
								fullWidth
								error={!!errors.landKilogramFreightFee}
								helperText={errors.landKilogramFreightFee?.message}
								InputProps={{
									startAdornment: <InputAdornment position="start">₦</InputAdornment>,
									inputProps: { min: 0, step: 1, onKeyDown: blockNonInteger }
								}}
								sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
							/>
						)}
					/>

					<TransitDaysRow
						control={control}
						minName="landTransitDaysMin"
						maxName="landTransitDaysMax"
					/>

					<Divider sx={{ mb: 3 }} />

					{/* Sea / Bulk Freight */}
					<SectionHeader
						iconName="heroicons-outline:archive"
						title="Sea & Bulk Freight"
						bgColor="rgba(230, 81, 0, 0.08)"
						iconColor="rgb(191, 54, 12)"
					/>

					<Stack
						direction="row"
						spacing={2}
						mb={2}
					>
						<Controller
							name="perCbmFreightFee"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Rate per CBM *"
									type="number"
									size="small"
									fullWidth
									error={!!errors.perCbmFreightFee}
									helperText={errors.perCbmFreightFee?.message}
									InputProps={{
										startAdornment: <InputAdornment position="start">₦</InputAdornment>,
										inputProps: { min: 0, step: 1, onKeyDown: blockNonInteger }
									}}
									sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
								/>
							)}
						/>
						<Controller
							name="seaKilogramFreightFee"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Rate per KG (Sea)"
									type="number"
									size="small"
									fullWidth
									InputProps={{
										startAdornment: <InputAdornment position="start">₦</InputAdornment>,
										inputProps: { min: 0, step: 1, onKeyDown: blockNonInteger }
									}}
									sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
								/>
							)}
						/>
					</Stack>

					<TransitDaysRow
						control={control}
						minName="seaTransitDaysMin"
						maxName="seaTransitDaysMax"
					/>

					<Divider sx={{ mb: 3 }} />

					{/* Admin Notes */}
					<SectionHeader
						iconName="heroicons-outline:annotation"
						title="Admin Notes"
						bgColor="rgba(0,0,0,0.04)"
						iconColor="text.secondary"
					/>

					<Controller
						name="notes"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Notes (optional)"
								multiline
								rows={3}
								size="small"
								fullWidth
								placeholder="Special instructions or notes for this shipping route…"
								sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
							/>
						)}
					/>
				</Box>

				{/* Footer */}
				<Box
					sx={{
						px: 3,
						py: 2,
						borderTop: '1px solid',
						borderColor: 'divider',
						bgcolor: 'background.paper',
						flexShrink: 0
					}}
				>
					<Stack
						direction="row"
						spacing={2}
					>
						<Button
							variant="outlined"
							onClick={onClose}
							fullWidth
							sx={{ borderRadius: 2 }}
							disabled={addRoute.isLoading}
						>
							Cancel
						</Button>
						<Button
							variant="contained"
							color="secondary"
							fullWidth
							type="submit"
							disabled={!isValid || !isDirty || addRoute.isLoading}
							sx={{ borderRadius: 2, fontWeight: 700 }}
							startIcon={
								addRoute.isLoading ? (
									<CircularProgress
										size={16}
										color="inherit"
									/>
								) : null
							}
						>
							{addRoute.isLoading ? 'Saving…' : 'Create Route'}
						</Button>
					</Stack>
				</Box>
			</Box>
		</Box>
	);
}

export default NewShippingRouteDrawer;
