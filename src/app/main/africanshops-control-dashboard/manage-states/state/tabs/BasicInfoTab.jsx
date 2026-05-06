import { useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import {
	Box,
	Chip,
	CircularProgress,
	Divider,
	Drawer,
	FormControl,
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
import useCountries from 'src/app/api/countries/useCountries';
import LgaSelect from 'src/app/apselects/lgaselect';
import { useLgasByState } from 'src/app/api/lgas/useLgas';
import { createBLga, deleteLgaById, updateLgaById } from 'src/app/api/apiRoutes';

/* global window */

const EMPTY_LGA_FORM = {
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

function lgaToForm(lga) {
	return {
		name: lga.name || '',
		slug: lga.slug || '',
		latitude: lga.latitude || '',
		longitude: lga.longitude || '',
		isoCode: lga.isoCode || '',
		countryCode: lga.countryCode || '',
		isFeatured: lga.isFeatured ?? '',
		isInOperation: lga.isInOperation ?? '',
		isPublished: lga.isPublished ?? ''
	};
}

const selectVal = (v) => (v === null || v === undefined ? '' : v);

function AddLgaDrawer({ open, onClose, stateName, stateId, selectedLga, stateIsoCode, countryCode }) {
	const isEditMode = Boolean(selectedLga?.id) && !selectedLga.id.startsWith('placeholder-');
	const queryClient = useQueryClient();
	const [form, setForm] = useState(EMPTY_LGA_FORM);
	const [lgaLocation, setLgaLocation] = useState(null);

	useEffect(() => {
		setForm(selectedLga?.id ? lgaToForm(selectedLga) : EMPTY_LGA_FORM);
		setLgaLocation(null);
	}, [selectedLga, open]);

	function handleLgaLocationChange(cityObj) {
		setLgaLocation(cityObj);

		if (cityObj) {
			const name = cityObj.name || '';
			setForm((prev) => ({
				...prev,
				name,
				slug: name.toLowerCase().replace(/\s+/g, '-'),
				latitude: cityObj.latitude || '',
				longitude: cityObj.longitude || '',
				countryCode: cityObj.countryCode || prev.countryCode
			}));
		}
	}

	const addMutation = useMutation(createBLga, {
		onSuccess: () => {
			toast.success('LGA added successfully!');
			queryClient.invalidateQueries(['lgas_by_state', stateId]);
			handleClose();
		},
		onError: (err) => {
			toast.error(err?.message || 'Failed to add LGA. Please try again.');
		}
	});

	const updateMutation = useMutation(updateLgaById, {
		onSuccess: () => {
			toast.success('LGA updated successfully!');
			queryClient.invalidateQueries(['lgas_by_state', stateId]);
			handleClose();
		},
		onError: (err) => {
			toast.error(err?.message || 'Failed to update LGA. Please try again.');
		}
	});

	const deleteMutation = useMutation(deleteLgaById, {
		onSuccess: () => {
			toast.success('LGA deleted!');
			queryClient.invalidateQueries(['lgas_by_state', stateId]);
			handleClose();
		},
		onError: (err) => {
			toast.error(err?.message || 'Failed to delete LGA.');
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

	function handleClose() {
		setForm(EMPTY_LGA_FORM);
		setLgaLocation(null);
		onClose();
	}

	function buildPayload() {
		return {
			businessState: stateId,
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
			updateMutation.mutate({ ...payload, id: selectedLga.id });
		} else {
			addMutation.mutate(payload);
		}
	}

	function handleDelete() {
		// eslint-disable-next-line no-alert
		if (window.confirm(`Delete "${selectedLga?.name}"? This action cannot be undone.`)) {
			deleteMutation.mutate(selectedLga.id);
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
				{/* Header */}
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
							{isEditMode ? 'Edit LGA / County' : 'Add New LGA / County'}
						</Typography>
						{stateName && (
							<Typography
								variant="caption"
								color="text.secondary"
							>
								{isEditMode ? `Editing · ${stateName}` : `Adding to ${stateName}`}
							</Typography>
						)}
					</Box>
					<Stack
						direction="row"
						spacing={0.5}
						alignItems="center"
					>
						{isEditMode && (
							<Tooltip title="Delete this LGA">
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

				{/* Body */}
				<Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3 }}>
					<Stack spacing={2.5}>
						{/* LGA picker — add mode only */}
						{!isEditMode && (
							<>
								<Box>
									<LgaSelect
										value={lgaLocation}
										onChange={handleLgaLocationChange}
										countryCode={countryCode}
										stateCode={stateIsoCode}
									/>
									<Typography
										variant="caption"
										color="text.secondary"
										sx={{ mt: 0.75, display: 'block' }}
									>
										Pick from the list to auto-fill the fields below, or fill them manually.
									</Typography>
								</Box>
								<Divider />
							</>
						)}

						{/* Name */}
						<TextField
							label="LGA / County Name"
							value={form.name}
							onChange={handleChange('name')}
							fullWidth
							required
							size="small"
							placeholder="e.g. Ikeja"
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
									placeholder="e.g. 6.6018"
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
									placeholder="e.g. 3.3515"
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
									placeholder="e.g. IK"
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

				{/* Footer */}
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
							{isBusy ? 'Saving…' : isEditMode ? 'Update LGA' : 'Add LGA'}
						</Button>
					</Stack>
				</Box>
			</Box>
		</Drawer>
	);
}

function BasicInfoTab() {
	const { watch } = useFormContext();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [selectedLga, setSelectedLga] = useState(null);

	const { productId } = useParams();
	const { data: countries } = useCountries();

	const { data: lgasResponse, isLoading: lgasLoading, isError: lgasError } = useLgasByState(productId);

	const lgas = lgasResponse?.data?.lgas || [];
	const lgasPagination = lgasResponse?.data?.pagination || null;

	const form = watch();
	const filteredCountry = countries?.data?.countries?.find((c) => c.id === form.businessCountry) || null;

	function openAddDrawer() {
		setSelectedLga(null);
		setDrawerOpen(true);
	}

	function openEditDrawer(lga) {
		setSelectedLga(lga);
		setDrawerOpen(true);
	}

	function closeDrawer() {
		setDrawerOpen(false);
		setSelectedLga(null);
	}

	function renderLgasContent() {
		if (lgasLoading) {
			return (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
					<CircularProgress
						size={28}
						color="secondary"
					/>
				</Box>
			);
		}

		if (lgasError) {
			return (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
					<Typography
						variant="body2"
						color="error"
					>
						Failed to load LGAs. Please refresh.
					</Typography>
				</Box>
			);
		}

		if (lgas.length > 0) {
			return (
				<TableContainer sx={{ maxHeight: 480 }}>
					<Table
						stickyHeader
						size="small"
					>
						<TableHead>
							<TableRow>
								{['LGA / County', 'ISO Code', 'Operational', 'Published', ''].map((header) => (
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
							{lgas.map((lga) => (
								<TableRow
									key={lga.id}
									hover
									sx={{ '&:last-child td': { border: 0 } }}
								>
									<TableCell>
										<Typography
											variant="body2"
											fontWeight={600}
										>
											{lga.name}
										</Typography>
										<Typography
											variant="caption"
											color="text.secondary"
										>
											/{lga.slug}
										</Typography>
									</TableCell>
									<TableCell>
										<Typography
											variant="caption"
											sx={{ fontFamily: 'monospace', fontWeight: 600 }}
										>
											{lga.isoCode || '—'}
										</Typography>
									</TableCell>
									<TableCell>
										<Chip
											label={lga.isInOperation ? 'Operational' : 'Inactive'}
											size="small"
											color={lga.isInOperation ? 'success' : 'default'}
											variant={lga.isInOperation ? 'filled' : 'outlined'}
											sx={{ fontSize: '11px' }}
										/>
									</TableCell>
									<TableCell>
										<Chip
											label={lga.isPublished ? 'Published' : 'Draft'}
											size="small"
											color={lga.isPublished ? 'primary' : 'default'}
											variant={lga.isPublished ? 'filled' : 'outlined'}
											sx={{ fontSize: '11px' }}
										/>
									</TableCell>
									<TableCell align="right">
										<Tooltip title="Edit LGA">
											<IconButton
												size="small"
												color="inherit"
												onClick={() => openEditDrawer(lga)}
											>
												<FuseSvgIcon size={16}>heroicons-outline:pencil</FuseSvgIcon>
											</IconButton>
										</Tooltip>
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
					{productId === 'new' ? 'Save this state first to add LGAs.' : 'No LGAs added yet.'}
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
						Add First LGA
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
			{/* ────── LEFT: State Read-Only Overview ────── */}
			<Grid
				item
				xs={12}
				lg={5}
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
						<Typography
							variant="subtitle1"
							fontWeight={700}
						>
							State Overview
						</Typography>
						<Chip
							label="Read Only"
							size="small"
							icon={
								<FuseSvgIcon
									size={12}
									style={{ marginLeft: 6 }}
								>
									heroicons-outline:lock-closed
								</FuseSvgIcon>
							}
							sx={{ fontSize: '11px', height: 22, pl: 0.5 }}
						/>
					</Box>

					<Box sx={{ px: 3, pt: 3, pb: 2.5 }}>
						{/* Hero — name + slug */}
						<Box sx={{ mb: 3 }}>
							<Typography
								variant="h5"
								fontWeight={800}
								sx={{ lineHeight: 1.2, mb: 0.5 }}
							>
								{form.name || '—'}
							</Typography>
							{form.slug && (
								<Typography
									variant="caption"
									color="text.secondary"
									sx={{ fontFamily: 'monospace', fontSize: '12px' }}
								>
									/{form.slug}
								</Typography>
							)}
						</Box>

						{/* Info rows */}
						<Stack
							divider={<Divider />}
							spacing={0}
						>
							{/* Country */}
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									py: 1.5
								}}
							>
								<Typography
									variant="caption"
									color="text.secondary"
									sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}
								>
									Country
								</Typography>
								<Typography
									variant="body2"
									fontWeight={600}
								>
									{filteredCountry?.name || '—'}
								</Typography>
							</Box>

							{/* ISO Code + Country Code */}
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									py: 1.5
								}}
							>
								<Typography
									variant="caption"
									color="text.secondary"
									sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}
								>
									ISO Code
								</Typography>
								<Typography
									variant="body2"
									fontWeight={600}
									sx={{ fontFamily: 'monospace', textTransform: 'uppercase' }}
								>
									{form.isoCode || '—'}
								</Typography>
							</Box>

							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									py: 1.5
								}}
							>
								<Typography
									variant="caption"
									color="text.secondary"
									sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}
								>
									Country Code
								</Typography>
								<Typography
									variant="body2"
									fontWeight={600}
									sx={{ fontFamily: 'monospace', textTransform: 'uppercase' }}
								>
									{form.countryCode || '—'}
								</Typography>
							</Box>

							{/* Coordinates */}
							<Box sx={{ py: 1.5 }}>
								<Typography
									variant="caption"
									color="text.secondary"
									sx={{
										fontWeight: 700,
										textTransform: 'uppercase',
										letterSpacing: '0.5px',
										display: 'block',
										mb: 1
									}}
								>
									Coordinates
								</Typography>
								<Stack
									direction="row"
									spacing={3}
								>
									<Box>
										<Typography
											variant="caption"
											color="text.secondary"
											display="block"
										>
											Latitude
										</Typography>
										<Typography
											variant="body2"
											fontWeight={600}
											sx={{ fontFamily: 'monospace' }}
										>
											{form.latitude || '—'}
										</Typography>
									</Box>
									<Box>
										<Typography
											variant="caption"
											color="text.secondary"
											display="block"
										>
											Longitude
										</Typography>
										<Typography
											variant="body2"
											fontWeight={600}
											sx={{ fontFamily: 'monospace' }}
										>
											{form.longitude || '—'}
										</Typography>
									</Box>
								</Stack>
							</Box>

							{/* Status badges */}
							<Box sx={{ py: 1.5 }}>
								<Typography
									variant="caption"
									color="text.secondary"
									sx={{
										fontWeight: 700,
										textTransform: 'uppercase',
										letterSpacing: '0.5px',
										display: 'block',
										mb: 1.5
									}}
								>
									Status
								</Typography>
								<Stack
									direction="row"
									spacing={1}
									flexWrap="wrap"
									useFlexGap
								>
									<Chip
										label={form.isInOperation ? 'Operational' : 'Not Operational'}
										size="small"
										color={form.isInOperation ? 'success' : 'default'}
										variant={form.isInOperation ? 'filled' : 'outlined'}
										sx={{ fontSize: '11px' }}
									/>
									<Chip
										label={form.isPublished ? 'Published' : 'Not Published'}
										size="small"
										color={form.isPublished ? 'primary' : 'default'}
										variant={form.isPublished ? 'filled' : 'outlined'}
										sx={{ fontSize: '11px' }}
									/>
									<Chip
										label={form.isFeatured ? 'Featured' : 'Not Featured'}
										size="small"
										color={form.isFeatured ? 'warning' : 'default'}
										variant={form.isFeatured ? 'filled' : 'outlined'}
										sx={{ fontSize: '11px' }}
									/>
								</Stack>
							</Box>
						</Stack>

						{/* Advisory note */}
						<Box
							sx={{
								mt: 3,
								p: 2,
								borderRadius: 1.5,
								bgcolor: 'action.hover',
								display: 'flex',
								alignItems: 'flex-start',
								gap: 1.5
							}}
						>
							<FuseSvgIcon
								size={16}
								sx={{ mt: 0.25, flexShrink: 0, color: 'text.secondary' }}
							>
								heroicons-outline:information-circle
							</FuseSvgIcon>
							<Typography
								variant="caption"
								color="text.secondary"
								sx={{ lineHeight: 1.6 }}
							>
								State details are managed from the <strong>Country page</strong>. Navigate to the parent
								country to add, edit, or remove this state.
							</Typography>
						</Box>
					</Box>
				</Paper>
			</Grid>

			{/* ────── RIGHT: LGAs Table ────── */}
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
								LGAs / Counties
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								{/* eslint-disable-next-line no-nested-ternary */}
								{lgasLoading
									? 'Loading…'
									: lgasPagination
										? `${lgasPagination.total} local government area${lgasPagination.total !== 1 ? 's' : ''} in this state`
										: 'No LGAs found'}
							</Typography>
						</Box>
						{productId !== 'new' && (
							<Tooltip title="Add a new LGA to this state">
								<Button
									variant="contained"
									color="secondary"
									size="small"
									startIcon={<FuseSvgIcon size={16}>heroicons-outline:plus</FuseSvgIcon>}
									onClick={openAddDrawer}
									sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600 }}
								>
									Add LGA
								</Button>
							</Tooltip>
						)}
					</Box>

					{renderLgasContent()}
				</Paper>
			</Grid>

			{/* LGA Drawer — shared for add and edit */}
			<AddLgaDrawer
				open={drawerOpen}
				onClose={closeDrawer}
				stateName={form.name}
				stateId={productId}
				selectedLga={selectedLga}
				stateIsoCode={form.isoCode}
				countryCode={filteredCountry?.isoCode || form.countryCode}
			/>
		</Grid>
	);
}

export default BasicInfoTab;
