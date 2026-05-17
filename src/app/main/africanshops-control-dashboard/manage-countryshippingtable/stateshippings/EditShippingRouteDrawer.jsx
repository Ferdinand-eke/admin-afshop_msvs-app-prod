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
	useStateDeleteShippingMutation,
	useStateUpdateShippingMutation
} from '../../../../api/states/useStates';

const blockNonInteger = (e) => {
	if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
};

const parseIntField = (v) => {
	if (v === '' || v === undefined || v === null) return undefined;
	const n = parseInt(v, 10);
	return Number.isNaN(n) ? undefined : n;
};

const schema = z.object({
	landKilogramFreightFee: z.coerce.number({ invalid_type_error: 'Required' }).min(0, 'Must be 0 or more'),
	airKilogramFreightFee: z.coerce.number({ invalid_type_error: 'Required' }).min(0, 'Must be 0 or more'),
	perCbmFreightFee: z.coerce.number({ invalid_type_error: 'Required' }).min(0, 'Must be 0 or more'),
	expressKilogramFreightFee: z.coerce.number().min(0).optional().or(z.literal('')),
	seaKilogramFreightFee: z.coerce.number().min(0).optional().or(z.literal('')),
	distanceKm: z.coerce.number().int().min(0).optional().or(z.literal('')),
	landTransitDaysMin: z.coerce.number().int().min(0).optional().or(z.literal('')),
	landTransitDaysMax: z.coerce.number().int().min(0).optional().or(z.literal('')),
	airTransitDaysMin: z.coerce.number().int().min(0).optional().or(z.literal('')),
	airTransitDaysMax: z.coerce.number().int().min(0).optional().or(z.literal('')),
	seaTransitDaysMin: z.coerce.number().int().min(0).optional().or(z.literal('')),
	seaTransitDaysMax: z.coerce.number().int().min(0).optional().or(z.literal('')),
	notes: z.string().optional()
});

function resolveState(idOrObj, states) {
	if (!idOrObj) return null;
	if (typeof idOrObj === 'object') return idOrObj;
	return states?.find((s) => (s._id || s.id) === idOrObj) || null;
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

function StateAvatar({ state, size = 30 }) {
	const code = (state?.isoCode || state?.name || '?').slice(0, 2).toUpperCase();
	return (
		<Avatar
			sx={{
				width: size,
				height: size,
				bgcolor: 'rgba(255,255,255,0.2)',
				color: 'white',
				fontSize: size < 28 ? 9 : 11,
				fontWeight: 800,
				borderRadius: '8px',
				border: '2px solid rgba(255,255,255,0.3)'
			}}
		>
			{code}
		</Avatar>
	);
}

function EditShippingRouteDrawer({ route, originState, originCountry, states, onClose }) {
	const [confirmingDelete, setConfirmingDelete] = useState(false);
	const updateRoute = useStateUpdateShippingMutation();
	const deleteRoute = useStateDeleteShippingMutation();

	const destinationState = resolveState(route?._dest || route?.stateToShipTo, states);

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isValid, isDirty }
	} = useForm({
		mode: 'onChange',
		resolver: zodResolver(schema),
		defaultValues: {
			landKilogramFreightFee: '',
			airKilogramFreightFee: '',
			perCbmFreightFee: '',
			expressKilogramFreightFee: '',
			seaKilogramFreightFee: '',
			distanceKm: '',
			landTransitDaysMin: '',
			landTransitDaysMax: '',
			airTransitDaysMin: '',
			airTransitDaysMax: '',
			seaTransitDaysMin: '',
			seaTransitDaysMax: '',
			notes: ''
		}
	});

	useEffect(() => {
		if (!route) return;
		reset({
			landKilogramFreightFee: route.landKilogramFreightFee ?? '',
			airKilogramFreightFee: route.airKilogramFreightFee ?? '',
			perCbmFreightFee: route.perCbmFreightFee ?? '',
			expressKilogramFreightFee: route.expressKilogramFreightFee ?? '',
			seaKilogramFreightFee: route.seaKilogramFreightFee ?? '',
			distanceKm: route.distanceKm ?? '',
			landTransitDaysMin: route.landTransitDaysMin ?? '',
			landTransitDaysMax: route.landTransitDaysMax ?? '',
			airTransitDaysMin: route.airTransitDaysMin ?? '',
			airTransitDaysMax: route.airTransitDaysMax ?? '',
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
			destinationState?._id ?? (typeof route?.stateToShipTo === 'string' ? route.stateToShipTo : null);

		updateRoute.mutate({
			stateCheckOrigin: originState?._id || originState?.id,
			stateToShipTo: destinationId,
			landKilogramFreightFee: parseInt(values.landKilogramFreightFee, 10),
			airKilogramFreightFee: parseInt(values.airKilogramFreightFee, 10),
			perCbmFreightFee: parseInt(values.perCbmFreightFee, 10),
			expressKilogramFreightFee: parseIntField(values.expressKilogramFreightFee),
			seaKilogramFreightFee: parseIntField(values.seaKilogramFreightFee),
			distanceKm: parseIntField(values.distanceKm),
			landTransitDaysMin: parseIntField(values.landTransitDaysMin),
			landTransitDaysMax: parseIntField(values.landTransitDaysMax),
			airTransitDaysMin: parseIntField(values.airTransitDaysMin),
			airTransitDaysMax: parseIntField(values.airTransitDaysMax),
			seaTransitDaysMin: parseIntField(values.seaTransitDaysMin),
			seaTransitDaysMax: parseIntField(values.seaTransitDaysMax),
			notes: values.notes
		});
	}

	function handleDelete() {
		const destinationId =
			destinationState?._id ?? (typeof route?.stateToShipTo === 'string' ? route.stateToShipTo : null);

		deleteRoute.mutate({
			stateCheckOrigin: originState?._id || originState?.id,
			stateToShipTo: destinationId
		});
		setConfirmingDelete(false);
	}

	const isBusy = updateRoute.isLoading || deleteRoute.isLoading;

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			{/* Header */}
			<Box
				sx={{
					background: 'linear-gradient(135deg, #006064 0%, #00838f 60%, #0097a7 100%)',
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
						spacing={1}
						mb={0.75}
					>
						{originCountry?.flag && (
							<Avatar
								src={originCountry.flag}
								sx={{ width: 22, height: 22, border: '2px solid rgba(255,255,255,0.3)' }}
							/>
						)}
						<StateAvatar state={originState} />
						<FuseSvgIcon
							size={16}
							sx={{ color: 'rgba(255,255,255,0.7)' }}
						>
							heroicons-outline:arrow-right
						</FuseSvgIcon>
						<StateAvatar state={destinationState} />
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
								{originState?.name} → {destinationState?.name || 'Destination'}
							</Typography>
						</Box>
					</Stack>
					<Typography
						variant="caption"
						sx={{ color: 'rgba(255,255,255,0.55)' }}
					>
						Update freight rates and transit times for this state-to-state route
					</Typography>
				</motion.div>
			</Box>

			{/* Info bar */}
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
					Destination state cannot be changed. Delete and recreate to change the destination.
				</Typography>
			</Box>

			{/* Form */}
			<Box
				component="form"
				onSubmit={handleSubmit(onSubmit)}
				sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
			>
				<Box sx={{ flex: 1, overflow: 'auto', px: 3, py: 3 }}>
					{/* Land / Road */}
					<SectionHeader
						iconName="heroicons-outline:truck"
						title="Land / Road Freight"
						bgColor="rgba(46, 125, 50, 0.08)"
						iconColor="rgb(27, 94, 32)"
					/>

					<Controller
						name="landKilogramFreightFee"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Rate per KG (Road) *"
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

					{/* Air */}
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

					{/* Bulk / Sea */}
					<SectionHeader
						iconName="heroicons-outline:archive"
						title="Bulk / Sea Freight"
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

					{/* Express */}
					<SectionHeader
						iconName="heroicons-outline:lightning-bolt"
						title="Express / Courier"
						bgColor="rgba(123, 31, 162, 0.08)"
						iconColor="rgb(106, 27, 154)"
					/>

					<Stack
						direction="row"
						spacing={2}
						mb={3}
					>
						<Controller
							name="expressKilogramFreightFee"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Express Rate per KG"
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
						<Controller
							name="distanceKm"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Distance (km)"
									type="number"
									size="small"
									fullWidth
									InputProps={{
										endAdornment: <InputAdornment position="end">km</InputAdornment>,
										inputProps: { min: 0, step: 1, onKeyDown: blockNonInteger }
									}}
									sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
								/>
							)}
						/>
					</Stack>

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
								placeholder="Special handling notes or route-specific instructions…"
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
								Remove route to {destinationState?.name || 'this state'}?
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
