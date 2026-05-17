/* eslint-disable react/no-unstable-nested-components */
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
	Avatar,
	Box,
	Chip,
	IconButton,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Tooltip,
	Typography
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

function resolveState(idOrObj, states) {
	if (!idOrObj) return null;

	if (typeof idOrObj === 'object') return idOrObj;

	return states?.find((s) => (s._id || s.id) === idOrObj) || null;
}

function formatAmount(amount) {
	if (amount === undefined || amount === null || amount === '') return '—';

	return new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2
	}).format(amount);
}

function StateAvatar({ state, size = 36 }) {
	const code = (state?.isoCode || state?.name || '?').slice(0, 2).toUpperCase();
	return (
		<Avatar
			sx={{
				width: size,
				height: size,
				bgcolor: 'secondary.light',
				color: 'secondary.dark',
				fontSize: size < 32 ? 9 : 11,
				fontWeight: 800,
				borderRadius: '8px'
			}}
		>
			{code}
		</Avatar>
	);
}

function FreightBadge({ iconName, label, value, bgColor, textColor, borderColor }) {
	return (
		<Box
			sx={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: 0.75,
				px: 1.25,
				py: 0.75,
				borderRadius: 2,
				bgcolor: bgColor,
				border: '1px solid',
				borderColor
			}}
		>
			<FuseSvgIcon
				size={13}
				sx={{ color: textColor, flexShrink: 0 }}
			>
				{iconName}
			</FuseSvgIcon>
			<Box>
				<Typography
					variant="caption"
					sx={{ color: textColor, fontWeight: 700, lineHeight: 1, display: 'block', opacity: 0.75, fontSize: 10 }}
				>
					{label}
				</Typography>
				<Typography
					variant="body2"
					sx={{ fontWeight: 800, lineHeight: 1.2, mt: 0.2, color: textColor }}
				>
					{value}
				</Typography>
			</Box>
		</Box>
	);
}

function EmptyState({ selectedCountry, selectedState }) {
	const hasCountry = Boolean(selectedCountry);
	const hasState = Boolean(selectedState);

	let title;
	let message;

	if (!hasCountry) {
		title = 'Choose a country first';
		message = 'Select a country from the dropdown above to load its states.';
	} else if (!hasState) {
		title = 'Choose an origin state';
		message = `Select a state within ${selectedCountry.name} to view and manage its outbound shipping routes.`;
	} else {
		title = 'No routes configured yet';
		message = `${selectedState.name} has no outbound state routes. Click "Add Route" to define freight rates to destination states.`;
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
			style={{
				flex: 1,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '80px 24px'
			}}
		>
			<Box
				sx={{
					width: 96,
					height: 96,
					borderRadius: '50%',
					background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					mb: 3
				}}
			>
				<FuseSvgIcon
					size={48}
					color="disabled"
				>
					heroicons-outline:map
				</FuseSvgIcon>
			</Box>

			<Typography
				variant="h6"
				fontWeight={800}
				gutterBottom
			>
				{title}
			</Typography>

			<Typography
				variant="body2"
				color="text.secondary"
				textAlign="center"
				maxWidth={380}
			>
				{message}
			</Typography>
		</motion.div>
	);
}

function StateShippingTable({ selectedState, selectedCountry, states, onEditRoute }) {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const routes = useMemo(() => selectedState?.state?.shippingTable || [], [selectedState]);

	const routesWithDest = useMemo(
		() => routes.map((r) => ({ ...r, _dest: resolveState(r.stateToShipTo, states) })),
		[routes, states]
	);

	const paginatedRoutes = useMemo(
		() => routesWithDest.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
		[routesWithDest, page, rowsPerPage]
	);

	if (!selectedState || routes.length === 0) {
		return (
			<Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
				<EmptyState
					selectedCountry={selectedCountry}
					selectedState={selectedState}
				/>
			</Box>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
			style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
		>
			<Paper
				elevation={0}
				sx={{
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					overflow: 'hidden',
					borderRadius: 0
				}}
			>
				{/* Origin banner */}
				<Box
					sx={{
						px: 3,
						py: 1.5,
						bgcolor: 'grey.50',
						borderBottom: '1px solid',
						borderColor: 'divider',
						display: 'flex',
						alignItems: 'center',
						gap: 1.5
					}}
				>
					{selectedCountry?.flag && (
						<Avatar
							src={selectedCountry.flag}
							sx={{ width: 22, height: 22, boxShadow: 1 }}
						/>
					)}
					<StateAvatar
						state={selectedState}
						size={28}
					/>
					<Typography
						variant="body2"
						fontWeight={600}
						color="text.secondary"
					>
						Outbound routes from{' '}
						<Box
							component="span"
							sx={{ color: 'secondary.main', fontWeight: 800 }}
						>
							{selectedState.name}
						</Box>
						{selectedCountry && (
							<Box
								component="span"
								sx={{ fontWeight: 400 }}
							>
								{' '}
								· {selectedCountry.name}
							</Box>
						)}
					</Typography>

					<Chip
						label={`${routes.length} route${routes.length !== 1 ? 's' : ''}`}
						size="small"
						color="secondary"
						variant="outlined"
						sx={{ ml: 'auto', borderRadius: 2, fontWeight: 700 }}
					/>
				</Box>

				{/* Table */}
				<TableContainer sx={{ flex: 1, overflow: 'auto' }}>
					<Table
						stickyHeader
						size="small"
					>
						<TableHead>
							<TableRow>
								<TableCell sx={{ fontWeight: 800, py: 1.5, bgcolor: 'background.paper', whiteSpace: 'nowrap' }}>
									Destination State
								</TableCell>
								<TableCell sx={{ fontWeight: 800, py: 1.5, bgcolor: 'background.paper', whiteSpace: 'nowrap' }}>
									Land / Road
								</TableCell>
								<TableCell sx={{ fontWeight: 800, py: 1.5, bgcolor: 'background.paper', whiteSpace: 'nowrap' }}>
									Air Freight
								</TableCell>
								<TableCell sx={{ fontWeight: 800, py: 1.5, bgcolor: 'background.paper', whiteSpace: 'nowrap' }}>
									Bulk / CBM
								</TableCell>
								<TableCell sx={{ fontWeight: 800, py: 1.5, bgcolor: 'background.paper', whiteSpace: 'nowrap' }}>
									Express
								</TableCell>
								<TableCell
									sx={{ fontWeight: 800, py: 1.5, bgcolor: 'background.paper' }}
									align="center"
								>
									Actions
								</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{paginatedRoutes.map((route, idx) => (
								<TableRow
									key={route._id || route.id || idx}
									hover
									sx={{
										cursor: 'pointer',
										transition: 'background 0.15s',
										'&:last-child td': { borderBottom: 0 }
									}}
									onClick={() => onEditRoute(route)}
								>
									<TableCell sx={{ py: 2 }}>
										<Stack
											direction="row"
											alignItems="center"
											spacing={1.5}
										>
											<StateAvatar state={route._dest} />
											<Box>
												<Typography
													variant="body2"
													fontWeight={700}
												>
													{route._dest?.name || route.stateToShipToName || 'Unknown'}
												</Typography>
												<Typography
													variant="caption"
													color="text.secondary"
												>
													{route._dest?.isoCode || ''}
													{route.distanceKm ? ` · ${route.distanceKm} km` : ''}
												</Typography>
											</Box>
										</Stack>
									</TableCell>

									<TableCell sx={{ py: 2 }}>
										<FreightBadge
											iconName="heroicons-outline:truck"
											label="ROAD / KG"
											value={`₦${formatAmount(route.landKilogramFreightFee)}`}
											bgColor="rgba(46, 125, 50, 0.08)"
											textColor="rgb(27, 94, 32)"
											borderColor="rgba(46, 125, 50, 0.2)"
										/>
									</TableCell>

									<TableCell sx={{ py: 2 }}>
										<FreightBadge
											iconName="heroicons-outline:paper-airplane"
											label="AIR / KG"
											value={`₦${formatAmount(route.airKilogramFreightFee)}`}
											bgColor="rgba(25, 118, 210, 0.08)"
											textColor="rgb(21, 101, 192)"
											borderColor="rgba(25, 118, 210, 0.2)"
										/>
									</TableCell>

									<TableCell sx={{ py: 2 }}>
										<FreightBadge
											iconName="heroicons-outline:archive"
											label="PER CBM"
											value={`₦${formatAmount(route.perCbmFreightFee)}`}
											bgColor="rgba(230, 81, 0, 0.08)"
											textColor="rgb(191, 54, 12)"
											borderColor="rgba(230, 81, 0, 0.2)"
										/>
									</TableCell>

									<TableCell sx={{ py: 2 }}>
										{route.expressKilogramFreightFee !== undefined &&
										route.expressKilogramFreightFee !== null &&
										route.expressKilogramFreightFee !== '' ? (
											<FreightBadge
												iconName="heroicons-outline:lightning-bolt"
												label="EXPRESS"
												value={`₦${formatAmount(route.expressKilogramFreightFee)}`}
												bgColor="rgba(123, 31, 162, 0.08)"
												textColor="rgb(106, 27, 154)"
												borderColor="rgba(123, 31, 162, 0.2)"
											/>
										) : (
											<Typography
												variant="caption"
												color="text.disabled"
											>
												—
											</Typography>
										)}
									</TableCell>

									<TableCell
										sx={{ py: 2 }}
										align="center"
										onClick={(e) => e.stopPropagation()}
									>
										<Tooltip title="Edit this route">
											<IconButton
												size="small"
												color="secondary"
												onClick={(e) => {
													e.stopPropagation();
													onEditRoute(route);
												}}
												sx={{
													bgcolor: 'secondary.lighter',
													'&:hover': { bgcolor: 'secondary.main', color: 'white' },
													transition: 'all 0.2s',
													width: 32,
													height: 32
												}}
											>
												<FuseSvgIcon size={15}>heroicons-outline:pencil</FuseSvgIcon>
											</IconButton>
										</Tooltip>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>

				<TablePagination
					component="div"
					count={routes.length}
					page={page}
					onPageChange={(_, newPage) => setPage(newPage)}
					rowsPerPage={rowsPerPage}
					onRowsPerPageChange={(e) => {
						setRowsPerPage(parseInt(e.target.value, 10));
						setPage(0);
					}}
					rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
					sx={{ borderTop: '1px solid', borderColor: 'divider', flexShrink: 0 }}
				/>
			</Paper>
		</motion.div>
	);
}

export default StateShippingTable;
