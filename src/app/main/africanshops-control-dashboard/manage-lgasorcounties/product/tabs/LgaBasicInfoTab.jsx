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
import { useDistrictsByLga } from 'src/app/api/districts/useDistricts';
import { createDistrict, deleteDistrictById, updateDistrictById } from 'src/app/api/apiRoutes';

/* global window */

const EMPTY_DISTRICT_FORM = {
	name: '',
	slug: '',
	latitude: '',
	longitude: '',
	isoCode: '',
	isFeatured: '',
	isInOperation: '',
	isPublished: ''
};

function districtToForm(d) {
	return {
		name: d.name || '',
		slug: d.slug || '',
		latitude: d.latitude || '',
		longitude: d.longitude || '',
		isoCode: d.isoCode || '',
		isFeatured: d.isFeatured ?? '',
		isInOperation: d.isInOperation ?? '',
		isPublished: d.isPublished ?? ''
	};
}

const selectVal = (v) => (v === null || v === undefined ? '' : v);

function AddDistrictDrawer({ open, onClose, lgaName, lgaId, businessCountry, businessState, selectedDistrict }) {
	const isEditMode = Boolean(selectedDistrict?.id);
	const queryClient = useQueryClient();
	const [form, setForm] = useState(EMPTY_DISTRICT_FORM);

	useEffect(() => {
		setForm(selectedDistrict?.id ? districtToForm(selectedDistrict) : EMPTY_DISTRICT_FORM);
	}, [selectedDistrict, open]);

	const addMutation = useMutation(createDistrict, {
		onSuccess: () => {
			toast.success('District created successfully!');
			queryClient.invalidateQueries(['districts_by_lga', lgaId]);
			handleClose();
		},
		onError: (err) => {
			toast.error(err?.response?.data?.message || err?.message || 'Failed to create district.');
		}
	});

	const updateMutation = useMutation(updateDistrictById, {
		onSuccess: () => {
			toast.success('District updated successfully!');
			queryClient.invalidateQueries(['districts_by_lga', lgaId]);
			handleClose();
		},
		onError: (err) => {
			toast.error(err?.response?.data?.message || err?.message || 'Failed to update district.');
		}
	});

	const deleteMutation = useMutation(deleteDistrictById, {
		onSuccess: () => {
			toast.success('District deleted!');
			queryClient.invalidateQueries(['districts_by_lga', lgaId]);
			handleClose();
		},
		onError: (err) => {
			toast.error(err?.response?.data?.message || err?.message || 'Failed to delete district.');
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
		setForm(EMPTY_DISTRICT_FORM);
		onClose();
	}

	function buildPayload() {
		return {
			businessLga: lgaId,
			businessCountry,
			businessState,
			name: form.name.trim(),
			latitude: form.latitude.trim(),
			longitude: form.longitude.trim(),
			isoCode: form.isoCode.trim(),
			isFeatured: form.isFeatured === true,
			isInOperation: form.isInOperation === true,
			isPublished: form.isPublished === true
		};
	}

	function handleSubmit() {
		const payload = buildPayload();

		if (isEditMode) {
			updateMutation.mutate({ ...payload, id: selectedDistrict.id });
		} else {
			addMutation.mutate(payload);
		}
	}

	function handleDelete() {
		// eslint-disable-next-line no-alert
		if (window.confirm(`Delete "${selectedDistrict?.name}"? This action cannot be undone.`)) {
			deleteMutation.mutate(selectedDistrict.id);
		}
	}

	const isBusy = addMutation.isLoading || updateMutation.isLoading || deleteMutation.isLoading;
	const isSubmitDisabled = !form.name.trim() || isBusy;

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
							{isEditMode ? 'Edit District' : 'Add New District'}
						</Typography>
						{lgaName && (
							<Typography
								variant="caption"
								color="text.secondary"
							>
								{isEditMode ? `Editing · ${lgaName}` : `Adding to ${lgaName}`}
							</Typography>
						)}
					</Box>
					<Stack
						direction="row"
						spacing={0.5}
						alignItems="center"
					>
						{isEditMode && (
							<Tooltip title="Delete this district">
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
						{/* Name */}
						<TextField
							label="District Name"
							value={form.name}
							onChange={handleChange('name')}
							fullWidth
							required
							size="small"
							placeholder="e.g. Agege Central"
						/>

						{/* Slug — auto-generated, editable */}
						<TextField
							label="Slug"
							value={form.slug}
							onChange={handleChange('slug')}
							fullWidth
							size="small"
							helperText="Auto-generated from name. Server appends a timestamp on create."
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
									size="small"
									placeholder="e.g. 3.3515"
								/>
							</Grid>
						</Grid>

						{/* ISO Code */}
						<TextField
							label="ISO Code"
							value={form.isoCode}
							onChange={handleChange('isoCode')}
							fullWidth
							size="small"
							placeholder="e.g. AGC"
							inputProps={{ maxLength: 10, style: { textTransform: 'uppercase' } }}
						/>

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
				<Box sx={{ px: 3, py: 2.5, borderTop: 1, borderColor: 'divider' }}>
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
							{isBusy ? 'Saving…' : isEditMode ? 'Update District' : 'Add District'}
						</Button>
					</Stack>
				</Box>
			</Box>
		</Drawer>
	);
}

function LgaBasicInfoTab() {
	const { watch } = useFormContext();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [selectedDistrict, setSelectedDistrict] = useState(null);

	const { productId } = useParams();
	const { data: countries } = useCountries();
	const {
		data: districtsResponse,
		isLoading: districtsLoading,
		isError: districtsError
	} = useDistrictsByLga(productId);

	const districts = districtsResponse?.data?.districts || [];
	const districtsPagination = districtsResponse?.data?.pagination || null;

	const form = watch();
	const filteredCountry = countries?.data?.countries?.find((c) => c.id === form.businessCountry) || null;

	function openAddDrawer() {
		setSelectedDistrict(null);
		setDrawerOpen(true);
	}

	function openEditDrawer(district) {
		setSelectedDistrict(district);
		setDrawerOpen(true);
	}

	function closeDrawer() {
		setDrawerOpen(false);
		setSelectedDistrict(null);
	}

	function renderDistrictsContent() {
		if (districtsLoading) {
			return (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
					<CircularProgress
						size={28}
						color="secondary"
					/>
				</Box>
			);
		}

		if (districtsError) {
			return (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
					<Typography
						variant="body2"
						color="error"
					>
						Failed to load districts. Please refresh.
					</Typography>
				</Box>
			);
		}

		if (districts.length > 0) {
			return (
				<TableContainer sx={{ maxHeight: 480 }}>
					<Table
						stickyHeader
						size="small"
					>
						<TableHead>
							<TableRow>
								{['District', 'ISO Code', 'Operational', 'Published', ''].map((header) => (
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
							{districts.map((district) => (
								<TableRow
									key={district.id}
									hover
									sx={{ '&:last-child td': { border: 0 } }}
								>
									<TableCell>
										<Typography
											variant="body2"
											fontWeight={600}
										>
											{district.name}
										</Typography>
										<Typography
											variant="caption"
											color="text.secondary"
										>
											/{district.slug}
										</Typography>
									</TableCell>
									<TableCell>
										<Typography
											variant="caption"
											sx={{ fontFamily: 'monospace', fontWeight: 600 }}
										>
											{district.isoCode || '—'}
										</Typography>
									</TableCell>
									<TableCell>
										<Chip
											label={district.isInOperation ? 'Operational' : 'Inactive'}
											size="small"
											color={district.isInOperation ? 'success' : 'default'}
											variant={district.isInOperation ? 'filled' : 'outlined'}
											sx={{ fontSize: '11px' }}
										/>
									</TableCell>
									<TableCell>
										<Chip
											label={district.isPublished ? 'Published' : 'Draft'}
											size="small"
											color={district.isPublished ? 'primary' : 'default'}
											variant={district.isPublished ? 'filled' : 'outlined'}
											sx={{ fontSize: '11px' }}
										/>
									</TableCell>
									<TableCell align="right">
										<Tooltip title="Edit district">
											<IconButton
												size="small"
												color="inherit"
												onClick={() => openEditDrawer(district)}
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
					{productId === 'new' ? 'Save this LGA first to add districts.' : 'No districts added yet.'}
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
						Add First District
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
			{/* ────── LEFT: LGA Read-Only Overview ────── */}
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
							LGA Overview
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

							{/* ISO Code */}
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
								LGA details are managed from the <strong>State page</strong>. Navigate to the parent
								state to add, edit, or remove this LGA.
							</Typography>
						</Box>
					</Box>
				</Paper>
			</Grid>

			{/* ────── RIGHT: Districts Table ────── */}
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
								Districts
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								{/* eslint-disable-next-line no-nested-ternary */}
								{districtsLoading
									? 'Loading…'
									: districtsPagination
										? `${districtsPagination.total} district${districtsPagination.total !== 1 ? 's' : ''} in this LGA`
										: 'No districts found'}
							</Typography>
						</Box>
						{productId !== 'new' && (
							<Tooltip title="Add a new district to this LGA">
								<Button
									variant="contained"
									color="secondary"
									size="small"
									startIcon={<FuseSvgIcon size={16}>heroicons-outline:plus</FuseSvgIcon>}
									onClick={openAddDrawer}
									sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600 }}
								>
									Add District
								</Button>
							</Tooltip>
						)}
					</Box>

					{renderDistrictsContent()}
				</Paper>
			</Grid>

			{/* District Drawer — shared for add and edit */}
			<AddDistrictDrawer
				open={drawerOpen}
				onClose={closeDrawer}
				lgaName={form.name}
				lgaId={productId}
				businessCountry={form.businessCountry}
				businessState={form.businessState}
				selectedDistrict={selectedDistrict}
			/>
		</Grid>
	);
}

export default LgaBasicInfoTab;
