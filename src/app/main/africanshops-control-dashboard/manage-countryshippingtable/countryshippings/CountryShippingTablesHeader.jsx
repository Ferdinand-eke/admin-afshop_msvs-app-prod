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

function CountryShippingTablesHeader({ countries, selectedCountryId, onCountryChange, onAddRoute, isLoading }) {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const selectedCountry = countries?.find((c) => c?._id || c?.id === selectedCountryId) || null;

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
						Country Shipping Routes
					</Typography>
					<Typography
						variant="caption"
						color="text.secondary"
						sx={{ mt: 0.5, display: 'block' }}
					>
						Manage country-to-country freight rates across air, land &amp; sea logistics
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
						disabled={!selectedCountryId || isLoading}
						size={isMobile ? 'small' : 'medium'}
						sx={{ borderRadius: 2, fontWeight: 700, px: 2.5, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
					>
						Add Shipping Route
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
					<FormControl
						size="small"
						sx={{ minWidth: { xs: '100%', sm: 320 } }}
					>
						<InputLabel id="origin-country-label">Select Origin Country</InputLabel>
						<Select
							labelId="origin-country-label"
							value={selectedCountryId}
							onChange={(e) => onCountryChange(e.target.value)}
							label="Select Origin Country"
							disabled={isLoading}
							sx={{ borderRadius: 2 }}
							renderValue={(value) => {
								const c = countries.find((x) => x._id === value);
								if (!c) return <em>Select a country…</em>;
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
								<em>Select a country to view its routes</em>
							</MenuItem>
							{countries.map((country) => (
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
										secondary={`${country.shippingTable?.length || 0} route${country.shippingTable?.length !== 1 ? 's' : ''} configured`}
										primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
										secondaryTypographyProps={{ variant: 'caption' }}
									/>
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{isLoading && (
						<CircularProgress
							size={18}
							thickness={5}
						/>
					)}

					{selectedCountry && (
						<Stack
							direction="row"
							spacing={1}
							flexWrap="wrap"
						>
							<Chip
								avatar={selectedCountry.flag ? <Avatar src={selectedCountry.flag} /> : undefined}
								label={selectedCountry.name}
								size="small"
								color="secondary"
								variant="outlined"
								sx={{ borderRadius: 2, fontWeight: 700 }}
							/>
							<Chip
								label={`${selectedCountry.shippingTable?.length || 0} route${selectedCountry.shippingTable?.length !== 1 ? 's' : ''}`}
								size="small"
								color="default"
								sx={{ borderRadius: 2 }}
							/>
							{selectedCountry.currency && (
								<Chip
									label={selectedCountry.currency}
									size="small"
									variant="outlined"
									sx={{ borderRadius: 2 }}
								/>
							)}
						</Stack>
					)}
				</Stack>
			</motion.div>
		</Box>
	);
}

export default CountryShippingTablesHeader;
