import { useEffect, useState } from 'react';
import {
	Avatar,
	Box,
	Button,
	CircularProgress,
	Divider,
	IconButton,
	InputAdornment,
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
	useCountryUpdateShippingMutation,
	useCountryDeleteShippingMutation
} from '../../../../api/countries/useCountries';

const schema = z.object({
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

function resolveCountry(idOrObj, countries) {
	if (!idOrObj) return null;
	if (typeof idOrObj === 'object') return idOrObj;
	return countries?.find((c) => (c._id || c.id) === idOrObj) || null;
}

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
						InputProps={{ endAdornment: <InputAdornment position="end">days</InputAdornment> }}
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
						InputProps={{ endAdornment: <InputAdornment position="end">days</InputAdornment> }}
						sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
					/>
				)}
			/>
		</Stack>
	);
}

function EditShippingRouteDrawer({ route, originCountry, countries, onClose }) {
	const [confirmingDelete, setConfirmingDelete] = useState(false);
	const updateRoute = useCountryUpdateShippingMutation();
	const deleteRoute = useCountryDeleteShippingMutation();

	const destinationCountry = resolveCountry(route?._dest || route?.countryToShipTo, countries);

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isValid, isDirty }
	} = useForm({
		mode: 'onChange',
		resolver: zodResolver(schema),
		defaultValues: {
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
		if (!route) return;

		reset({
			airKilogramFreightFee: route.airKilogramFreightFee ?? '',
			landKilogramFreightFee: route.landKilogramFreightFee ?? '',
			perCbmFreightFee: route.perCbmFreightFee ?? '',
			seaKilogramFreightFee: route.seaKilogramFreightFee ?? '',
			airTransitDaysMin: route.airTransitDaysMin ?? '',
			airTransitDaysMax: route.airTransitDaysMax ?? '',
			landTransitDaysMin: route.landTransitDaysMin ?? '',
			landTransitDaysMax: route.landTransitDaysMax ?? '',
			seaTransitDaysMin: route.seaTransitDaysMin ?? '',
			seaTransitDaysMax: route.seaTransitDaysMax ?? '',
			notes: route.notes ?? ''
		});
	}, [route, reset]);

	useEffect(() => {
		if (updateRoute.isSuccess || deleteRoute.isSuccess) {
			onClose();
		}
	}, [updateRoute.isSuccess, deleteRoute.isSuccess, onClose]);

	function onSubmit(values) {
		const destinationId =
			destinationCountry?._id ?? (typeof route?.countryToShipTo === 'string' ? route.countryToShipTo : null);

		updateRoute.mutate({
			...values,
			countryCheckOrigin: originCountry?._id,
			countryToShipTo: destinationId
		});
	}

	function handleDelete() {
		const destinationId =
			destinationCountry?._id ?? (typeof route?.countryToShipTo === 'string' ? route.countryToShipTo : null);

		deleteRoute.mutate({
			countryCheckOrigin: originCountry?._id,
			countryToShipTo: destinationId
		});
		setConfirmingDelete(false);
	}

	const isBusy = updateRoute.isLoading || deleteRoute.isLoading;

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			{/* Header */}
			<Box
				sx={{
					background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 60%, #388e3c 100%)',
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
					{/* Origin → Destination */}
					<Stack
						direction="row"
						alignItems="center"
						spacing={1}
						mb={0.75}
					>
						{originCountry?.flag && (
							<Avatar
								src={originCountry.flag}
								sx={{ width: 30, height: 30, border: '2px solid rgba(255,255,255,0.3)' }}
							/>
						)}
						<FuseSvgIcon
							size={16}
							sx={{ color: 'rgba(255,255,255,0.7)' }}
						>
							heroicons-outline:arrow-right
						</FuseSvgIcon>
						{destinationCountry?.flag ? (
							<Avatar
								src={destinationCountry.flag}
								sx={{ width: 30, height: 30, border: '2px solid rgba(255,255,255,0.3)' }}
							/>
						) : null}
						<Box>
							<Typography
								variant="caption"
								sx={{ color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: 1 }}
							>
								Editing Route
							</Typography>
							<Typography
								variant="h6"
								fontWeight={800}
								sx={{ color: 'white', lineHeight: 1.1 }}
							>
								{originCountry?.name} → {destinationCountry?.name || 'Destination'}
							</Typography>
						</Box>
					</Stack>
					<Typography
						variant="caption"
						sx={{ color: 'rgba(255,255,255,0.55)' }}
					>
						Update freight rates and estimated transit times for this route
					</Typography>
				</motion.div>
			</Box>

			{/* Route summary chip */}
			<Box
				sx={{
					px: 3,
					py: 1.5,
					bgcolor: 'grey.50',
					borderBottom: '1px solid',
					borderColor: 'divider',
					display: 'flex',
					alignItems: 'center',
					gap: 1,
					flexShrink: 0
				}}
			>
				<FuseSvgIcon
					size={14}
					color="action"
				>
					heroicons-outline:information-circle
				</FuseSvgIcon>
				<Typography
					variant="caption"
					color="text.secondary"
				>
					Destination country cannot be changed. Delete and recreate to change the destination.
				</Typography>
			</Box>

			{/* Form */}
			<Box
				component="form"
				onSubmit={handleSubmit(onSubmit)}
				sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
			>
				<Box sx={{ flex: 1, overflow: 'auto', px: 3, py: 3 }}>
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
								InputProps={{ startAdornment: <InputAdornment position="start">₦</InputAdornment> }}
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
								InputProps={{ startAdornment: <InputAdornment position="start">₦</InputAdornment> }}
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

					{/* Sea / Bulk */}
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
									InputProps={{ startAdornment: <InputAdornment position="start">₦</InputAdornment> }}
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
									InputProps={{ startAdornment: <InputAdornment position="start">₦</InputAdornment> }}
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
						mb={1.5}
					>
						<Button
							variant="outlined"
							onClick={onClose}
							fullWidth
							sx={{ borderRadius: 2 }}
							disabled={isBusy}
						>
							Cancel
						</Button>
						<Button
							variant="contained"
							color="secondary"
							fullWidth
							type="submit"
							disabled={!isValid || !isDirty || isBusy}
							sx={{ borderRadius: 2, fontWeight: 700 }}
							startIcon={
								updateRoute.isLoading ? (
									<CircularProgress
										size={16}
										color="inherit"
									/>
								) : null
							}
						>
							{updateRoute.isLoading ? 'Saving…' : 'Save Changes'}
						</Button>
					</Stack>

					{confirmingDelete ? (
						<Stack
							direction="row"
							spacing={1}
							sx={{
								border: '1px solid',
								borderColor: 'error.light',
								borderRadius: 2,
								px: 2,
								py: 1.5,
								bgcolor: 'error.lighter'
							}}
						>
							<Typography
								variant="caption"
								color="error"
								sx={{ flex: 1, fontWeight: 600, alignSelf: 'center' }}
							>
								Remove route to {destinationCountry?.name}?
							</Typography>
							<Button
								size="small"
								onClick={() => setConfirmingDelete(false)}
								sx={{ borderRadius: 2 }}
								disabled={isBusy}
							>
								Cancel
							</Button>
							<Button
								size="small"
								variant="contained"
								color="error"
								onClick={handleDelete}
								disabled={isBusy}
								sx={{ borderRadius: 2 }}
								startIcon={
									deleteRoute.isLoading ? (
										<CircularProgress
											size={14}
											color="inherit"
										/>
									) : null
								}
							>
								{deleteRoute.isLoading ? 'Deleting…' : 'Confirm'}
							</Button>
						</Stack>
					) : (
						<Button
							variant="text"
							color="error"
							fullWidth
							onClick={() => setConfirmingDelete(true)}
							disabled={isBusy}
							startIcon={<FuseSvgIcon size={16}>heroicons-outline:trash</FuseSvgIcon>}
							sx={{ borderRadius: 2, fontSize: 13 }}
						>
							Delete This Route
						</Button>
					)}
				</Box>
			</Box>
		</Box>
	);
}

export default EditShippingRouteDrawer;
