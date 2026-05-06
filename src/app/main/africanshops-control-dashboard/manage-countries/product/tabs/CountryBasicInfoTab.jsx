import { Controller, useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import {
	Box,
	Chip,
	CircularProgress,
	Divider,
	Drawer,
	FormControl,
	FormHelperText,
	Grid,
	IconButton,
	InputAdornment,
	MenuItem,
	Paper,
	Select,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Tooltip,
	Typography
} from '@mui/material';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import CountrySelect from 'src/app/apselects/countryselect';
import StateSelect from 'src/app/apselects/stateselect';
import { useStatesByCountry } from 'src/app/api/states/useStates';
import { createBState, deleteStateById, updateStateById } from 'src/app/api/apiRoutes';

/* global window */

const EMPTY_STATE_FORM = {
	statelocation: null,
	name: '',
	slug: '',
	latitude: '',
	longitude: '',
	isoCode: '',
	countryCode: '',
	isFeatured: '',
	isInOperation: '',
	isPublished: ''
};

function stateToForm(state) {
	return {
		statelocation: null,
		name: state.name || '',
		slug: state.slug || '',
		latitude: state.latitude || '',
		longitude: state.longitude || '',
		isoCode: state.isoCode || '',
		countryCode: state.countryCode || '',
		isFeatured: state.isFeatured ?? '',
		isInOperation: state.isInOperation ?? '',
		isPublished: state.isPublished ?? ''
	};
}

const selectVal = (v) => (v === null || v === undefined ? '' : v);

function AddStateDrawer({ open, onClose, countryName, countryId, countryIsoCode, selectedState }) {
	const isEditMode = Boolean(selectedState?.id);
	const queryClient = useQueryClient();
	const [form, setForm] = useState(EMPTY_STATE_FORM);

	useEffect(() => {
		setForm(selectedState?.id ? stateToForm(selectedState) : EMPTY_STATE_FORM);
	}, [selectedState, open]);

	const addMutation = useMutation(createBState, {
		onSuccess: () => {
			toast.success('State added successfully!');
			queryClient.invalidateQueries(['states_by_country', countryId]);
			handleClose();
		},
		onError: (err) => {
			toast.error(err?.message || 'Failed to add state. Please try again.');
		}
	});

	const updateMutation = useMutation(updateStateById, {
		onSuccess: () => {
			toast.success('State updated successfully!');
			queryClient.invalidateQueries(['states_by_country', countryId]);
			handleClose();
		},
		onError: (err) => {
			toast.error(err?.message || 'Failed to update state. Please try again.');
		}
	});

	const deleteMutation = useMutation(deleteStateById, {
		onSuccess: () => {
			toast.success('State deleted!');
			queryClient.invalidateQueries(['states_by_country', countryId]);
			handleClose();
		},
		onError: (err) => {
			toast.error(err?.message || 'Failed to delete state.');
		}
	});

	const handleChange = (field) => (e) => {
		const val = e.target.value;
		setForm((prev) => ({
			...prev,
			[field]: val,
			...(field === 'name' ? { slug: val.toLowerCase().replace(/\s+/g, '-') } : {})
		}));
	};

	function handleStateLocationChange(stateObj) {
		setForm((prev) => ({
			...prev,
			statelocation: stateObj,
			...(stateObj
				? {
						name: stateObj.name || '',
						slug: (stateObj.name || '').toLowerCase().replace(/\s+/g, '-'),
						latitude: stateObj.latitude || '',
						longitude: stateObj.longitude || '',
						isoCode: stateObj.isoCode || '',
						countryCode: stateObj.countryCode || ''
					}
				: {})
		}));
	}

	function handleClose() {
		setForm(EMPTY_STATE_FORM);
		onClose();
	}

	function buildPayload() {
		return {
			businessCountry: countryId,
			name: form.name.trim(),
			slug: form.slug.trim(),
			latitude: form.latitude.trim(),
			longitude: form.longitude.trim(),
			isoCode: form.isoCode.trim(),
			countryCode: form.countryCode.trim(),
			isFeatured: form.isFeatured === true,
			isInOperation: form.isInOperation === true,
			isPublished: form.isPublished === true
		};
	}

	function handleSubmit() {
		const payload = buildPayload();

		if (isEditMode) {
			updateMutation.mutate({ ...payload, id: selectedState.id });
		} else {
			addMutation.mutate(payload);
		}
	}

	function handleDelete() {
		// eslint-disable-next-line no-alert
		if (window.confirm(`Delete "${selectedState?.name}"? This action cannot be undone.`)) {
			deleteMutation.mutate(selectedState.id);
		}
	}

	const isBusy = addMutation.isLoading || updateMutation.isLoading || deleteMutation.isLoading;
	const isSubmitDisabled = !form.name.trim() || !form.latitude.trim() || !form.longitude.trim() || isBusy;

	return (
		<Drawer
			anchor="right"
			open={open}
			onClose={handleClose}
			PaperProps={{ sx: { width: { xs: '100%', sm: 460 }, boxShadow: 8 } }}
		>
			<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
				{/* Drawer header */}
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						px: 3,
						py: 2.5,
						borderBottom: 1,
						borderColor: 'divider',
						bgcolor: 'background.default'
					}}
				>
					<Box>
						<Typography
							variant="h6"
							fontWeight={700}
						>
							{isEditMode ? 'Edit State' : 'Add New State'}
						</Typography>
						{countryName && (
							<Typography
								variant="caption"
								color="text.secondary"
							>
								{isEditMode ? `Editing · ${countryName}` : `Adding to ${countryName}`}
							</Typography>
						)}
					</Box>
					<Stack
						direction="row"
						spacing={0.5}
						alignItems="center"
					>
						{isEditMode && (
							<Tooltip title="Delete this state">
								<span>
									<IconButton
										size="small"
										color="error"
										onClick={handleDelete}
										disabled={isBusy}
									>
										<FuseSvgIcon size={18}>heroicons-outline:trash</FuseSvgIcon>
									</IconButton>
								</span>
							</Tooltip>
						)}
						<IconButton
							onClick={handleClose}
							size="small"
						>
							<FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
						</IconButton>
					</Stack>
				</Box>

				{/* Drawer body */}
				<Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3 }}>
					<Stack spacing={2.5}>
						{/* State picker — only shown when adding a new state */}
						{!isEditMode && (
							<>
								<Box>
									<StateSelect
										value={form.statelocation}
										onChange={handleStateLocationChange}
										countryCode={countryIsoCode}
									/>
									<Typography
										variant="caption"
										color="text.secondary"
										sx={{ mt: 0.5, display: 'block' }}
									>
										Pick from the list to auto-fill the fields below, or fill them manually.
									</Typography>
								</Box>

								<Divider />
							</>
						)}

						{/* Name */}
						<TextField
							label="State Name"
							value={form.name}
							onChange={handleChange('name')}
							fullWidth
							required
							size="small"
							placeholder="e.g. Lagos"
						/>

						{/* Slug */}
						<TextField
							label="Slug"
							value={form.slug}
							onChange={handleChange('slug')}
							fullWidth
							size="small"
							helperText="Auto-generated from name. Editable."
							InputProps={{
								startAdornment: <InputAdornment position="start">/</InputAdornment>
							}}
						/>

						{/* Coordinates */}
						<Grid
							container
							spacing={1.5}
						>
							<Grid
								item
								xs={6}
							>
								<TextField
									label="Latitude"
									value={form.latitude}
									onChange={handleChange('latitude')}
									fullWidth
									required
									size="small"
									placeholder="e.g. 6.5244"
								/>
							</Grid>
							<Grid
								item
								xs={6}
							>
								<TextField
									label="Longitude"
									value={form.longitude}
									onChange={handleChange('longitude')}
									fullWidth
									required
									size="small"
									placeholder="e.g. 3.3792"
								/>
							</Grid>
						</Grid>

						{/* ISO Code + Country Code */}
						<Grid
							container
							spacing={1.5}
						>
							<Grid
								item
								xs={6}
							>
								<TextField
									label="ISO Code"
									value={form.isoCode}
									onChange={handleChange('isoCode')}
									fullWidth
									size="small"
									placeholder="e.g. LA"
									inputProps={{ maxLength: 5, style: { textTransform: 'uppercase' } }}
								/>
							</Grid>
							<Grid
								item
								xs={6}
							>
								<TextField
									label="Country Code"
									value={form.countryCode}
									onChange={handleChange('countryCode')}
									fullWidth
									size="small"
									placeholder="e.g. NG"
									inputProps={{ maxLength: 5, style: { textTransform: 'uppercase' } }}
								/>
							</Grid>
						</Grid>

						<Divider />
						<Typography
							variant="caption"
							color="text.secondary"
							fontWeight={700}
							sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
						>
							Visibility Settings
						</Typography>

						{/* isInOperation */}
						<FormControl
							fullWidth
							size="small"
						>
							<Select
								value={selectVal(form.isInOperation)}
								onChange={handleChange('isInOperation')}
								displayEmpty
							>
								<MenuItem value="">
									<em>Operational Status</em>
								</MenuItem>
								<MenuItem value={false}>Not Operational</MenuItem>
								<MenuItem value>Operational</MenuItem>
							</Select>
						</FormControl>

						{/* isPublished */}
						<FormControl
							fullWidth
							size="small"
						>
							<Select
								value={selectVal(form.isPublished)}
								onChange={handleChange('isPublished')}
								displayEmpty
							>
								<MenuItem value="">
									<em>Publish Status</em>
								</MenuItem>
								<MenuItem value={false}>Not Published</MenuItem>
								<MenuItem value>Published</MenuItem>
							</Select>
						</FormControl>

						{/* isFeatured */}
						<FormControl
							fullWidth
							size="small"
						>
							<Select
								value={selectVal(form.isFeatured)}
								onChange={handleChange('isFeatured')}
								displayEmpty
							>
								<MenuItem value="">
									<em>Featured Status</em>
								</MenuItem>
								<MenuItem value={false}>Not Featured</MenuItem>
								<MenuItem value>Featured</MenuItem>
							</Select>
						</FormControl>
					</Stack>
				</Box>

				{/* Drawer footer */}
				<Box
					sx={{
						px: 3,
						py: 2.5,
						borderTop: 1,
						borderColor: 'divider'
					}}
				>
					<Stack
						direction="row"
						spacing={1.5}
					>
						<Button
							variant="outlined"
							color="inherit"
							fullWidth
							onClick={handleClose}
							disabled={isBusy}
						>
							Cancel
						</Button>
						<Button
							variant="contained"
							color="secondary"
							fullWidth
							onClick={handleSubmit}
							disabled={isSubmitDisabled}
						>
							{/* eslint-disable-next-line no-nested-ternary */}
							{isBusy ? 'Saving…' : isEditMode ? 'Update State' : 'Add State'}
						</Button>
					</Stack>
				</Box>
			</Box>
		</Drawer>
	);
}

function CountryBasicInfoTab() {
	const methods = useFormContext();
	const { control, formState, setValue, watch } = methods;
	const { errors } = formState;
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [selectedState, setSelectedState] = useState(null);

	const { productId } = useParams();
	const { data: statesResponse, isLoading: statesLoading, isError: statesError } = useStatesByCountry(productId);
	const states = statesResponse?.data?.states || [];

	const countrylocation = watch('countrylocation');

	const setCustomValue = (id, value) => {
		setValue(id, value, {
			shouldDirty: true,
			shouldTouch: true,
			shouldValidate: true
		});
	};

	function openAddDrawer() {
		setSelectedState(null);
		setDrawerOpen(true);
	}

	function openEditDrawer(state) {
		setSelectedState(state);
		setDrawerOpen(true);
	}

	function closeDrawer() {
		setDrawerOpen(false);
		setSelectedState(null);
	}

	// Auto-populate fields when a country is selected from the picker
	useEffect(() => {
		if (!countrylocation?.isoCode) return;

		setValue('name', countrylocation.name || '', { shouldDirty: true });
		setValue('isoCode', countrylocation.isoCode || '', { shouldDirty: true });
		setValue('currency', countrylocation.currency || '', { shouldDirty: true });
		setValue('phonecode', countrylocation.phonecode || '', { shouldDirty: true });
		setValue('latitude', countrylocation.latitude || '', { shouldDirty: true });
		setValue('longitude', countrylocation.longitude || '', { shouldDirty: true });
		setValue('slug', countrylocation.name?.toLowerCase().replace(/\s+/g, '-') || '', {
			shouldDirty: true
		});
	}, [countrylocation, setValue]);

	function renderStatesContent() {
		if (statesLoading) {
			return (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
					<CircularProgress
						size={28}
						color="secondary"
					/>
				</Box>
			);
		}

		if (statesError) {
			return (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
					<Typography
						variant="body2"
						color="error"
					>
						Failed to load states. Please refresh.
					</Typography>
				</Box>
			);
		}

		if (states.length > 0) {
			return (
				<TableContainer sx={{ maxHeight: 480 }}>
					<Table
						stickyHeader
						size="small"
					>
						<TableHead>
							<TableRow>
								{['State Name', 'Operational', 'Published', ''].map((header) => (
									<TableCell
										key={header}
										align={header === '' ? 'right' : 'left'}
										sx={{
											fontWeight: 700,
											fontSize: '11px',
											textTransform: 'uppercase',
											letterSpacing: '0.5px',
											py: 1.5
										}}
									>
										{header}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{states.map((state) => (
								<TableRow
									key={state.id}
									hover
									sx={{ '&:last-child td': { border: 0 } }}
								>
									<TableCell>
										<Typography
											variant="body2"
											fontWeight={600}
										>
											{state.name}
										</Typography>
										<Typography
											variant="caption"
											color="text.secondary"
										>
											/{state.slug}
										</Typography>
									</TableCell>
									<TableCell>
										<Chip
											label={state.isInOperation ? 'Operational' : 'Inactive'}
											size="small"
											color={state.isInOperation ? 'success' : 'default'}
											variant={state.isInOperation ? 'filled' : 'outlined'}
											sx={{ fontSize: '11px' }}
										/>
									</TableCell>
									<TableCell>
										<Chip
											label={state.isPublished ? 'Published' : 'Draft'}
											size="small"
											color={state.isPublished ? 'primary' : 'default'}
											variant={state.isPublished ? 'filled' : 'outlined'}
											sx={{ fontSize: '11px' }}
										/>
									</TableCell>
									<TableCell align="right">
										<Stack
											direction="row"
											spacing={0.5}
											justifyContent="flex-end"
										>
											<Tooltip title="Edit state">
												<IconButton
													size="small"
													color="inherit"
													onClick={() => openEditDrawer(state)}
												>
													<FuseSvgIcon size={16}>heroicons-outline:pencil</FuseSvgIcon>
												</IconButton>
											</Tooltip>
										</Stack>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			);
		}

		return (
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					py: 8
				}}
			>
				<Typography
					variant="body1"
					color="text.secondary"
				>
					{productId === 'new' ? 'Save this country first to add states.' : 'No states added yet.'}
				</Typography>
				{productId !== 'new' && (
					<Button
						variant="outlined"
						color="secondary"
						size="small"
						sx={{ mt: 2 }}
						startIcon={<FuseSvgIcon size={16}>heroicons-outline:plus</FuseSvgIcon>}
						onClick={openAddDrawer}
					>
						Add First State
					</Button>
				)}
			</Box>
		);
	}

	return (
		<Grid
			container
			spacing={3}
		>
			{/* ────── LEFT: Country Form ────── */}
			<Grid
				item
				xs={12}
				lg={5}
			>
				<Paper
					elevation={0}
					variant="outlined"
					sx={{ borderRadius: 2, p: 3 }}
				>
					<Typography
						variant="subtitle1"
						fontWeight={700}
						sx={{ mb: 2.5 }}
					>
						Country Details
					</Typography>

					{/* Country Picker — only shown when creating a new country */}
					{productId === 'new' && (
						<Box sx={{ mb: 2.5 }}>
							<CountrySelect
								value={countrylocation}
								onChange={(value) => setCustomValue('countrylocation', value)}
							/>
						</Box>
					)}

					{/* Name + ISO Code */}
					<Grid
						container
						spacing={1.5}
						sx={{ mb: 2 }}
					>
						<Grid
							item
							xs={8}
						>
							<Controller
								name="name"
								control={control}
								defaultValue=""
								render={({ field }) => (
									<TextField
										{...field}
										label="Country Name"
										fullWidth
										size="small"
										error={!!errors.name}
										helperText={errors?.name?.message}
									/>
								)}
							/>
						</Grid>
						<Grid
							item
							xs={4}
						>
							<Controller
								name="isoCode"
								control={control}
								defaultValue=""
								render={({ field }) => (
									<TextField
										{...field}
										label="ISO Code"
										fullWidth
										size="small"
										inputProps={{ maxLength: 3, style: { textTransform: 'uppercase' } }}
										error={!!errors.isoCode}
										helperText={errors?.isoCode?.message}
									/>
								)}
							/>
						</Grid>
					</Grid>

					{/* Currency + Phone Code */}
					<Grid
						container
						spacing={1.5}
						sx={{ mb: 2 }}
					>
						<Grid
							item
							xs={6}
						>
							<Controller
								name="currency"
								control={control}
								defaultValue=""
								render={({ field }) => (
									<TextField
										{...field}
										label="Currency"
										fullWidth
										size="small"
										placeholder="e.g. NGN"
										error={!!errors.currency}
										helperText={errors?.currency?.message}
									/>
								)}
							/>
						</Grid>
						<Grid
							item
							xs={6}
						>
							<Controller
								name="phonecode"
								control={control}
								defaultValue=""
								render={({ field }) => (
									<TextField
										{...field}
										label="Phone Code"
										fullWidth
										size="small"
										placeholder="e.g. +234"
										error={!!errors.phonecode}
										helperText={errors?.phonecode?.message}
									/>
								)}
							/>
						</Grid>
					</Grid>

					{/* Latitude + Longitude */}
					<Grid
						container
						spacing={1.5}
						sx={{ mb: 2 }}
					>
						<Grid
							item
							xs={6}
						>
							<Controller
								name="latitude"
								control={control}
								defaultValue=""
								render={({ field }) => (
									<TextField
										{...field}
										label="Latitude"
										fullWidth
										size="small"
										placeholder="e.g. 9.0820"
										error={!!errors.latitude}
										helperText={errors?.latitude?.message}
									/>
								)}
							/>
						</Grid>
						<Grid
							item
							xs={6}
						>
							<Controller
								name="longitude"
								control={control}
								defaultValue=""
								render={({ field }) => (
									<TextField
										{...field}
										label="Longitude"
										fullWidth
										size="small"
										placeholder="e.g. 8.6753"
										error={!!errors.longitude}
										helperText={errors?.longitude?.message}
									/>
								)}
							/>
						</Grid>
					</Grid>

					{/* Slug */}
					<Controller
						name="slug"
						control={control}
						defaultValue=""
						render={({ field }) => (
							<TextField
								{...field}
								label="Slug"
								fullWidth
								size="small"
								sx={{ mb: 2 }}
								placeholder="e.g. nigeria"
								error={!!errors.slug}
								helperText={errors?.slug?.message || 'URL-friendly country identifier'}
								InputProps={{
									startAdornment: <InputAdornment position="start">/</InputAdornment>
								}}
							/>
						)}
					/>

					{/* VAT Rate */}
					<Controller
						name="vatRate"
						control={control}
						defaultValue={0}
						render={({ field }) => (
							<TextField
								{...field}
								label="VAT Rate"
								type="number"
								fullWidth
								size="small"
								sx={{ mb: 2 }}
								error={!!errors.vatRate}
								helperText={errors?.vatRate?.message}
								InputProps={{
									endAdornment: <InputAdornment position="end">%</InputAdornment>,
									inputProps: { min: 0, max: 100, step: 0.1 }
								}}
							/>
						)}
					/>

					<Divider sx={{ my: 2 }} />
					<Typography
						variant="caption"
						color="text.secondary"
						fontWeight={700}
						sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', mb: 1.5 }}
					>
						Visibility & Operations
					</Typography>

					{/* isInOperation */}
					<Typography style={{ fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
						Are we operational in this country?
					</Typography>
					<Controller
						name="isInOperation"
						control={control}
						defaultValue=""
						render={({ field: { onChange, value } }) => (
							<FormControl
								fullWidth
								size="small"
								sx={{ mb: 2 }}
								error={!!errors.isInOperation}
							>
								<Select
									id="isInOperation"
									onChange={onChange}
									value={value === undefined || value === null ? '' : value}
								>
									<MenuItem value="">Select an operations status</MenuItem>
									<MenuItem value={false}>Not Operational</MenuItem>
									<MenuItem value>Operational</MenuItem>
								</Select>
								{errors?.isInOperation && (
									<FormHelperText>{errors.isInOperation.message}</FormHelperText>
								)}
							</FormControl>
						)}
					/>

					{/* isPublished */}
					<Typography style={{ fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
						Publish this country?
					</Typography>
					<Controller
						name="isPublished"
						control={control}
						defaultValue=""
						render={({ field: { onChange, value } }) => (
							<FormControl
								fullWidth
								size="small"
								sx={{ mb: 2 }}
								error={!!errors.isPublished}
							>
								<Select
									id="isPublished"
									onChange={onChange}
									value={value === undefined || value === null ? '' : value}
								>
									<MenuItem value="">Select a publish status</MenuItem>
									<MenuItem value={false}>Not Published</MenuItem>
									<MenuItem value>Published</MenuItem>
								</Select>
								{errors?.isPublished && <FormHelperText>{errors.isPublished.message}</FormHelperText>}
							</FormControl>
						)}
					/>

					{/* isFeatured */}
					<Typography style={{ fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
						Feature this country?
					</Typography>
					<Controller
						name="isFeatured"
						control={control}
						defaultValue=""
						render={({ field: { onChange, value } }) => (
							<FormControl
								fullWidth
								size="small"
								error={!!errors.isFeatured}
							>
								<Select
									id="isFeatured"
									onChange={onChange}
									value={value === undefined || value === null ? '' : value}
								>
									<MenuItem value="">Select a featured status</MenuItem>
									<MenuItem value={false}>Not Featured</MenuItem>
									<MenuItem value>Featured</MenuItem>
								</Select>
								{errors?.isFeatured && <FormHelperText>{errors.isFeatured.message}</FormHelperText>}
							</FormControl>
						)}
					/>
				</Paper>
			</Grid>

			{/* ────── RIGHT: States Table ────── */}
			<Grid
				item
				xs={12}
				lg={7}
			>
				<Paper
					elevation={0}
					variant="outlined"
					sx={{ borderRadius: 2, overflow: 'hidden' }}
				>
					{/* Panel header */}
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							px: 3,
							py: 2,
							borderBottom: 1,
							borderColor: 'divider',
							bgcolor: 'background.default'
						}}
					>
						<Box>
							<Typography
								variant="subtitle1"
								fontWeight={700}
							>
								States / Provinces
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								{statesLoading ? 'Loading…' : `${states.length} regions in this country`}
							</Typography>
						</Box>
						{productId !== 'new' && (
							<Tooltip title="Add a new state to this country">
								<Button
									variant="contained"
									color="secondary"
									size="small"
									startIcon={<FuseSvgIcon size={16}>heroicons-outline:plus</FuseSvgIcon>}
									onClick={openAddDrawer}
									sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600 }}
								>
									Add State
								</Button>
							</Tooltip>
						)}
					</Box>

					{renderStatesContent()}
				</Paper>
			</Grid>

			{/* State Drawer — shared for add and edit */}
			<AddStateDrawer
				open={drawerOpen}
				onClose={closeDrawer}
				countryName={countrylocation?.name}
				countryId={productId}
				countryIsoCode={countrylocation?.isoCode}
				selectedState={selectedState}
			/>
		</Grid>
	);
}

export default CountryBasicInfoTab;
