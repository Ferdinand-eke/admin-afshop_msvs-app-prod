import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {
	Avatar,
	Box,
	Chip,
	CircularProgress,
	FormControl,
	InputLabel,
	ListItemIcon,
	ListItemText,
	MenuItem,
	Select,
	Stack
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';

function StateShippingTablesHeader({
	countries,
	states,
	selectedCountryId,
	selectedStateId,
	onCountryChange,
	onStateChange,
	onAddRoute,
	isLoading,
	loadingStates
}) {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const selectedCountry = countries?.find((c) => (c._id || c.id) === selectedCountryId) || null;
	const selectedState = states?.find((s) => (s._id || s.id) === selectedStateId) || null;

	return (
		<Box
			sx={{
				borderBottom: '1px solid',
				borderColor: 'divider',
				bgcolor: 'background.paper',
				px: { xs: 2, md: 3 },
				py: { xs: 2, md: 2.5 }
			}}
		>
			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				alignItems={{ xs: 'flex-start', sm: 'center' }}
				justifyContent="space-between"
				spacing={2}
				mb={2.5}
			>
				<motion.div
					initial={{ x: -20, opacity: 0 }}
					animate={{ x: 0, opacity: 1, transition: { delay: 0.1 } }}
				>
					<Typography
						variant={isMobile ? 'h6' : 'h5'}
						fontWeight={800}
						lineHeight={1.1}
					>
						State Shipping Routes
					</Typography>
					<Typography
						variant="caption"
						color="text.secondary"
						sx={{ mt: 0.5, display: 'block' }}
					>
						Manage intra-country state-to-state freight rates for road, air &amp; bulk logistics
					</Typography>
				</motion.div>

				<motion.div
					initial={{ x: 20, opacity: 0 }}
					animate={{ x: 0, opacity: 1, transition: { delay: 0.15 } }}
				>
					<Button
						variant="contained"
						color="secondary"
						startIcon={<FuseSvgIcon size={18}>heroicons-outline:plus</FuseSvgIcon>}
						onClick={onAddRoute}
						disabled={!selectedStateId || isLoading || loadingStates}
						size={isMobile ? 'small' : 'medium'}
						sx={{ borderRadius: 2, fontWeight: 700, px: 2.5, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
					>
						Add Route
					</Button>
				</motion.div>
			</Stack>

			<motion.div
				initial={{ y: 8, opacity: 0 }}
				animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
			>
				<Stack
					direction={{ xs: 'column', sm: 'row' }}
					alignItems={{ xs: 'flex-start', sm: 'center' }}
					spacing={2}
					flexWrap="wrap"
				>
					{/* Step 1 — country */}
					<FormControl
						size="small"
						sx={{ minWidth: { xs: '100%', sm: 240 } }}
					>
						<InputLabel id="origin-country-label">Country</InputLabel>
						<Select
							labelId="origin-country-label"
							value={selectedCountryId}
							onChange={(e) => onCountryChange(e.target.value)}
							label="Country"
							disabled={isLoading}
							sx={{ borderRadius: 2 }}
							renderValue={(value) => {
								const c = countries.find((x) => (x._id || x.id) === value);
								if (!c) return <em>Select country…</em>;
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
								<em>Select a country</em>
							</MenuItem>
							{countries.map((country) => (
								<MenuItem
									key={country._id || country.id}
									value={country._id || country.id}
								>
									<ListItemIcon sx={{ minWidth: 36 }}>
										{country.flag ? (
											<Avatar
												src={country.flag}
												sx={{ width: 24, height: 24 }}
											/>
										) : (
											<Avatar
												sx={{
													width: 24,
													height: 24,
													fontSize: 10,
													bgcolor: 'grey.300'
												}}
											>
												{country.isoCode}
											</Avatar>
										)}
									</ListItemIcon>
									<ListItemText
										primary={country.name}
										secondary={country.isoCode}
										primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
										secondaryTypographyProps={{ variant: 'caption' }}
									/>
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{/* Step 2 — state (unlocked after country) */}
					<FormControl
						size="small"
						sx={{ minWidth: { xs: '100%', sm: 260 } }}
						disabled={!selectedCountryId || loadingStates}
					>
						<InputLabel id="origin-state-label">Origin State</InputLabel>
						<Select
							labelId="origin-state-label"
							value={selectedStateId}
							onChange={(e) => onStateChange(e.target.value)}
							label="Origin State"
							sx={{ borderRadius: 2 }}
							renderValue={(value) => {
								const s = states.find((x) => (x._id || x.id) === value);
								if (!s) return <em>Select state…</em>;
								return (
									<Stack
										direction="row"
										alignItems="center"
										spacing={1}
									>
										<Box
											sx={{
												width: 20,
												height: 20,
												borderRadius: '4px',
												bgcolor: 'secondary.light',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center'
											}}
										>
											<Typography
												sx={{ fontSize: 9, fontWeight: 800, color: 'secondary.dark', lineHeight: 1 }}
											>
												{(s.isoCode || s.name || '').slice(0, 2).toUpperCase()}
											</Typography>
										</Box>
										<Typography
											variant="body2"
											fontWeight={600}
										>
											{s.name}
										</Typography>
									</Stack>
								);
							}}
						>
							<MenuItem value="">
								<em>Select an origin state</em>
							</MenuItem>
							{states.map((state) => (
								<MenuItem
									key={state._id || state.id}
									value={state._id || state.id}
								>
									<ListItemIcon sx={{ minWidth: 36 }}>
										<Avatar
											sx={{
												width: 24,
												height: 24,
												fontSize: 9,
												fontWeight: 800,
												bgcolor: 'secondary.light',
												color: 'secondary.dark'
											}}
										>
											{(state.isoCode || state.name || '').slice(0, 2).toUpperCase()}
										</Avatar>
									</ListItemIcon>
									<ListItemText
										primary={state.name}
										secondary={`${state.shippingTable?.length || 0} route${state.shippingTable?.length !== 1 ? 's' : ''}`}
										primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
										secondaryTypographyProps={{ variant: 'caption' }}
									/>
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{(isLoading || loadingStates) && (
						<CircularProgress
							size={18}
							thickness={5}
						/>
					)}

					{selectedState && (
						<Stack
							direction="row"
							spacing={1}
							flexWrap="wrap"
						>
							{selectedCountry?.flag && (
								<Chip
									avatar={<Avatar src={selectedCountry.flag} />}
									label={selectedCountry.name}
									size="small"
									variant="outlined"
									sx={{ borderRadius: 2, fontWeight: 700 }}
								/>
							)}
							<Chip
								icon={
									<FuseSvgIcon size={14}>heroicons-outline:location-marker</FuseSvgIcon>
								}
								label={selectedState.name}
								size="small"
								color="secondary"
								variant="outlined"
								sx={{ borderRadius: 2, fontWeight: 700 }}
							/>
							<Chip
								label={`${selectedState.shippingTable?.length || 0} route${selectedState.shippingTable?.length !== 1 ? 's' : ''}`}
								size="small"
								color="default"
								sx={{ borderRadius: 2 }}
							/>
						</Stack>
					)}
				</Stack>
			</motion.div>
		</Box>
	);
}

export default StateShippingTablesHeader;
