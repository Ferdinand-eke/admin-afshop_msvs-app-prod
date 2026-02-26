import { useMemo, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import DataTable from 'app/shared-components/data-table/DataTable';
import { Chip, Paper, Box, TextField, MenuItem, Button } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';

/**
 * The reservations tab - displays all bookings/reservations for this merchant
 */
function ReservationsTab({ merchant }) {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);
	const [globalFilter, setGlobalFilter] = useState('');
	const [propertyFilter, setPropertyFilter] = useState('all');
	const [statusFilter, setStatusFilter] = useState('all');

	// Mock reservations data based on the bookinglistreservations model
	const [mockReservations] = useState([
		{
			id: '1',
			bookingPropertyId: '1',
			propertyTitle: 'Luxury Ocean View Suite',
			roomOnPropertyId: 'room-101',
			userCreatorId: 'user-abc123',
			guestName: 'John Doe',
			guestEmail: 'john.doe@example.com',
			startDate: new Date('2026-03-15'),
			endDate: new Date('2026-03-20'),
			totalPrice: 125000,
			taxPrice: 5000,
			isPaid: true,
			PaidAt: new Date('2026-02-01'),
			isCheckIn: false,
			isCheckOut: false,
			isTripFullfiled: false,
			checkInCode: 'CHK-IN-12345',
			checkOutCode: 'CHK-OUT-12345',
			createdAt: new Date('2026-02-01')
		},
		{
			id: '2',
			bookingPropertyId: '2',
			propertyTitle: 'Executive Apartment Downtown',
			roomOnPropertyId: 'apt-205',
			userCreatorId: 'user-xyz789',
			guestName: 'Jane Smith',
			guestEmail: 'jane.smith@example.com',
			startDate: new Date('2026-02-25'),
			endDate: new Date('2026-02-28'),
			totalPrice: 54000,
			taxPrice: 2000,
			isPaid: true,
			PaidAt: new Date('2026-02-10'),
			isCheckIn: true,
			checkedInAt: new Date('2026-02-25'),
			isCheckOut: false,
			isTripFullfiled: false,
			checkInCode: 'CHK-IN-67890',
			checkOutCode: 'CHK-OUT-67890',
			createdAt: new Date('2026-02-10')
		},
		{
			id: '3',
			bookingPropertyId: '3',
			propertyTitle: 'Cozy Beach Bungalow',
			roomOnPropertyId: null,
			userCreatorId: 'user-def456',
			guestName: 'Michael Johnson',
			guestEmail: 'michael.j@example.com',
			startDate: new Date('2026-01-20'),
			endDate: new Date('2026-01-25'),
			totalPrice: 60000,
			taxPrice: 2500,
			isPaid: true,
			PaidAt: new Date('2026-01-10'),
			isCheckIn: true,
			checkedInAt: new Date('2026-01-20'),
			isCheckOut: true,
			checkedOutAt: new Date('2026-01-25'),
			isTripFullfiled: true,
			tripFullfiledAt: new Date('2026-01-25'),
			checkInCode: 'CHK-IN-24680',
			checkOutCode: 'CHK-OUT-24680',
			createdAt: new Date('2026-01-10')
		},
		{
			id: '4',
			bookingPropertyId: '1',
			propertyTitle: 'Luxury Ocean View Suite',
			roomOnPropertyId: 'room-203',
			userCreatorId: 'user-ghi789',
			guestName: 'Sarah Williams',
			guestEmail: 'sarah.w@example.com',
			startDate: new Date('2026-04-10'),
			endDate: new Date('2026-04-15'),
			totalPrice: 125000,
			taxPrice: 5000,
			isPaid: false,
			PaidAt: null,
			isCheckIn: false,
			isCheckOut: false,
			isTripFullfiled: false,
			checkInCode: 'CHK-IN-13579',
			checkOutCode: 'CHK-OUT-13579',
			createdAt: new Date('2026-02-08')
		},
		{
			id: '5',
			bookingPropertyId: '2',
			propertyTitle: 'Executive Apartment Downtown',
			roomOnPropertyId: 'apt-301',
			userCreatorId: 'user-jkl012',
			guestName: 'David Brown',
			guestEmail: 'david.brown@example.com',
			startDate: new Date('2026-03-01'),
			endDate: new Date('2026-03-07'),
			totalPrice: 108000,
			taxPrice: 4000,
			isPaid: true,
			PaidAt: new Date('2026-02-15'),
			isCheckIn: false,
			isCheckOut: false,
			isTripFullfiled: false,
			checkInCode: 'CHK-IN-97531',
			checkOutCode: 'CHK-OUT-97531',
			createdAt: new Date('2026-02-15')
		}
	]);

	// Filter reservations based on filters
	const filteredReservations = useMemo(() => {
		let filtered = [...mockReservations];

		// Property filter
		if (propertyFilter !== 'all') {
			filtered = filtered.filter((res) => res.bookingPropertyId === propertyFilter);
		}

		// Status filter
		if (statusFilter !== 'all') {
			filtered = filtered.filter((res) => {
				if (statusFilter === 'completed') return res.isTripFullfiled;
				if (statusFilter === 'active') return res.isCheckIn && !res.isCheckOut;
				if (statusFilter === 'upcoming') return !res.isCheckIn && res.isPaid;
				if (statusFilter === 'unpaid') return !res.isPaid;
				return true;
			});
		}

		// Global search filter
		if (globalFilter) {
			const searchLower = globalFilter.toLowerCase();
			filtered = filtered.filter(
				(res) =>
					res.guestName.toLowerCase().includes(searchLower) ||
					res.guestEmail.toLowerCase().includes(searchLower) ||
					res.propertyTitle.toLowerCase().includes(searchLower) ||
					res.id.toLowerCase().includes(searchLower)
			);
		}

		return filtered;
	}, [mockReservations, propertyFilter, statusFilter, globalFilter]);

	const totalCount = useMemo(() => filteredReservations.length, [filteredReservations]);
	const pageCount = useMemo(() => {
		if (!totalCount || !rowsPerPage) return 0;
		return Math.ceil(totalCount / rowsPerPage);
	}, [totalCount, rowsPerPage]);

	// Get unique properties for filter dropdown
	const uniqueProperties = useMemo(() => {
		const props = mockReservations.reduce((acc, res) => {
			if (!acc.find((p) => p.id === res.bookingPropertyId)) {
				acc.push({
					id: res.bookingPropertyId,
					title: res.propertyTitle
				});
			}
			return acc;
		}, []);
		return props;
	}, [mockReservations]);

	// Pagination handlers
	const handlePageChange = useCallback((newPage) => {
		setPage(newPage);
	}, []);

	const handleRowsPerPageChange = useCallback((newRowsPerPage) => {
		setRowsPerPage(newRowsPerPage);
		setPage(0);
	}, []);

	const handleGlobalFilterChange = useCallback((value) => {
		setGlobalFilter(value);
		setPage(0);
	}, []);

	// Get reservation status
	const getReservationStatus = useCallback((reservation) => {
		if (reservation.isTripFullfiled) return 'completed';
		if (!reservation.isPaid) return 'unpaid';
		if (reservation.isCheckIn && !reservation.isCheckOut) return 'active';
		if (!reservation.isCheckIn) return 'upcoming';
		return 'unknown';
	}, []);

	// Get status color
	const getStatusColor = useCallback((status) => {
		switch (status) {
			case 'completed':
				return 'success';
			case 'active':
				return 'info';
			case 'upcoming':
				return 'warning';
			case 'unpaid':
				return 'error';
			default:
				return 'default';
		}
	}, []);

	// Get status label
	const getStatusLabel = useCallback((status) => {
		switch (status) {
			case 'completed':
				return 'Completed';
			case 'active':
				return 'Active';
			case 'upcoming':
				return 'Upcoming';
			case 'unpaid':
				return 'Unpaid';
			default:
				return 'Unknown';
		}
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'id',
				header: 'Booking ID',
				size: 140,
				Cell: ({ row }) => (
					<Typography
						variant="body2"
						className="font-mono text-11"
					>
						{row.original.id}
					</Typography>
				)
			},
			{
				accessorKey: 'guestName',
				header: 'Guest Details',
				size: 200,
				Cell: ({ row }) => (
					<div className="flex flex-col gap-4">
						<Typography
							variant="body2"
							className="font-semibold"
						>
							{row.original.guestName}
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
							className="text-11"
						>
							{row.original.guestEmail}
						</Typography>
					</div>
				)
			},
			{
				accessorKey: 'propertyTitle',
				header: 'Property',
				size: 200,
				Cell: ({ row }) => (
					<div className="flex flex-col gap-4">
						<Typography
							variant="body2"
							className="font-medium"
						>
							{row.original.propertyTitle}
						</Typography>
						{row.original.roomOnPropertyId && (
							<Typography
								variant="caption"
								color="text.secondary"
								className="text-11"
							>
								Room: {row.original.roomOnPropertyId}
							</Typography>
						)}
					</div>
				)
			},
			{
				accessorKey: 'dates',
				header: 'Check-In / Check-Out',
				size: 180,
				Cell: ({ row }) => (
					<div className="flex flex-col gap-4">
						<div className="flex items-center gap-4">
							<FuseSvgIcon
								size={14}
								className="text-green-600"
							>
								heroicons-outline:login
							</FuseSvgIcon>
							<Typography
								variant="caption"
								className="text-11"
							>
								{format(row.original.startDate, 'MMM dd, yyyy')}
							</Typography>
						</div>
						<div className="flex items-center gap-4">
							<FuseSvgIcon
								size={14}
								className="text-red-600"
							>
								heroicons-outline:logout
							</FuseSvgIcon>
							<Typography
								variant="caption"
								className="text-11"
							>
								{format(row.original.endDate, 'MMM dd, yyyy')}
							</Typography>
						</div>
					</div>
				)
			},
			{
				accessorKey: 'totalPrice',
				header: 'Total Amount',
				size: 140,
				Cell: ({ row }) => (
					<div className="flex flex-col gap-4">
						<Typography
							variant="body2"
							className="font-bold text-blue-600"
						>
							NGN {row.original.totalPrice.toLocaleString()}
						</Typography>
						{row.original.taxPrice > 0 && (
							<Typography
								variant="caption"
								color="text.secondary"
								className="text-11"
							>
								+ Tax: NGN {row.original.taxPrice.toLocaleString()}
							</Typography>
						)}
					</div>
				)
			},
			{
				accessorKey: 'paymentStatus',
				header: 'Payment',
				size: 120,
				Cell: ({ row }) => (
					<div className="flex flex-col gap-4">
						<Chip
							label={row.original.isPaid ? 'Paid' : 'Unpaid'}
							color={row.original.isPaid ? 'success' : 'error'}
							size="small"
							className="text-11"
						/>
						{row.original.isPaid && row.original.PaidAt && (
							<Typography
								variant="caption"
								color="text.secondary"
								className="text-11"
							>
								{format(row.original.PaidAt, 'MMM dd')}
							</Typography>
						)}
					</div>
				)
			},
			{
				accessorKey: 'status',
				header: 'Status',
				size: 120,
				Cell: ({ row }) => {
					const status = getReservationStatus(row.original);
					return (
						<Chip
							label={getStatusLabel(status)}
							color={getStatusColor(status)}
							size="small"
							className="font-semibold text-11"
						/>
					);
				}
			},
			{
				accessorKey: 'checkInStatus',
				header: 'Check In/Out',
				size: 140,
				Cell: ({ row }) => (
					<div className="flex flex-col gap-4">
						<div className="flex items-center gap-8">
							{row.original.isCheckIn ? (
								<FuseSvgIcon
									size={16}
									className="text-green-600"
								>
									heroicons-outline:check-circle
								</FuseSvgIcon>
							) : (
								<FuseSvgIcon
									size={16}
									className="text-grey-400"
								>
									heroicons-outline:x-circle
								</FuseSvgIcon>
							)}
							<Typography
								variant="caption"
								className="text-11"
							>
								Check-In
							</Typography>
						</div>
						<div className="flex items-center gap-8">
							{row.original.isCheckOut ? (
								<FuseSvgIcon
									size={16}
									className="text-green-600"
								>
									heroicons-outline:check-circle
								</FuseSvgIcon>
							) : (
								<FuseSvgIcon
									size={16}
									className="text-grey-400"
								>
									heroicons-outline:x-circle
								</FuseSvgIcon>
							)}
							<Typography
								variant="caption"
								className="text-11"
							>
								Check-Out
							</Typography>
						</div>
					</div>
				)
			},
			{
				accessorKey: 'createdAt',
				header: 'Booked On',
				size: 120,
				Cell: ({ row }) => (
					<Typography
						variant="caption"
						className="text-11"
					>
						{format(row.original.createdAt, 'MMM dd, yyyy')}
					</Typography>
				)
			}
		],
		[getReservationStatus, getStatusColor, getStatusLabel]
	);

	const container = {
		show: {
			transition: {
				staggerChildren: 0.04
			}
		}
	};

	const item = {
		hidden: { opacity: 0, y: 40 },
		show: { opacity: 1, y: 0 }
	};

	return (
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			className="w-full p-12 sm:p-16 md:p-24"
		>
			<Paper
				component={motion.div}
				variants={item}
				className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full"
				elevation={0}
			>
				{/* Header with stats and filters */}
				<Box className="px-24 py-16 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
					<div className="flex items-center justify-between mb-16">
						<div>
							<Typography
								variant="h6"
								className="font-bold"
							>
								Reservations & Bookings
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
								className="mt-4"
							>
								Manage and monitor all reservations for {merchant?.shopname}
							</Typography>
						</div>
						<Button
							variant="outlined"
							color="secondary"
							size="small"
							startIcon={<FuseSvgIcon size={16}>heroicons-outline:download</FuseSvgIcon>}
						>
							Export Data
						</Button>
					</div>

					{/* Statistics Cards */}
					<div className="flex gap-16 mb-16">
						<div className="flex flex-col items-center px-16 py-8 bg-white rounded-lg shadow-sm">
							<Typography
								variant="h5"
								className="font-bold text-blue-600"
							>
								{mockReservations.length}
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								Total
							</Typography>
						</div>
						<div className="flex flex-col items-center px-16 py-8 bg-white rounded-lg shadow-sm">
							<Typography
								variant="h5"
								className="font-bold text-info-600"
							>
								{mockReservations.filter((r) => getReservationStatus(r) === 'active').length}
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								Active
							</Typography>
						</div>
						<div className="flex flex-col items-center px-16 py-8 bg-white rounded-lg shadow-sm">
							<Typography
								variant="h5"
								className="font-bold text-warning-600"
							>
								{mockReservations.filter((r) => getReservationStatus(r) === 'upcoming').length}
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								Upcoming
							</Typography>
						</div>
						<div className="flex flex-col items-center px-16 py-8 bg-white rounded-lg shadow-sm">
							<Typography
								variant="h5"
								className="font-bold text-green-600"
							>
								{mockReservations.filter((r) => getReservationStatus(r) === 'completed').length}
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								Completed
							</Typography>
						</div>
						<div className="flex flex-col items-center px-16 py-8 bg-white rounded-lg shadow-sm">
							<Typography
								variant="h5"
								className="font-bold text-red-600"
							>
								{mockReservations.filter((r) => !r.isPaid).length}
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								Unpaid
							</Typography>
						</div>
					</div>

					{/* Filters */}
					<div className="flex gap-16">
						<TextField
							select
							label="Filter by Property"
							value={propertyFilter}
							onChange={(e) => setPropertyFilter(e.target.value)}
							size="small"
							className="min-w-200"
						>
							<MenuItem value="all">All Properties</MenuItem>
							{uniqueProperties.map((prop) => (
								<MenuItem
									key={prop.id}
									value={prop.id}
								>
									{prop.title}
								</MenuItem>
							))}
						</TextField>

						<TextField
							select
							label="Filter by Status"
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							size="small"
							className="min-w-180"
						>
							<MenuItem value="all">All Statuses</MenuItem>
							<MenuItem value="upcoming">Upcoming</MenuItem>
							<MenuItem value="active">Active</MenuItem>
							<MenuItem value="completed">Completed</MenuItem>
							<MenuItem value="unpaid">Unpaid</MenuItem>
						</TextField>
					</div>
				</Box>

				{/* Data Info Display */}
				{totalCount > 0 && (
					<Box className="px-24 py-12 border-b">
						<Typography
							variant="body2"
							color="text.secondary"
						>
							Showing {Math.min(page * rowsPerPage + 1, totalCount)} to{' '}
							{Math.min((page + 1) * rowsPerPage, totalCount)} of {totalCount.toLocaleString()} Reservations
							{(propertyFilter !== 'all' || statusFilter !== 'all' || globalFilter) && ' (filtered)'}
						</Typography>
					</Box>
				)}

				<DataTable
					data={filteredReservations}
					columns={columns}
					manualPagination
					rowCount={totalCount}
					pageCount={pageCount}
					onPaginationChange={(updater) => {
						const newPagination =
							typeof updater === 'function' ? updater({ pageIndex: page, pageSize: rowsPerPage }) : updater;

						if (newPagination.pageIndex !== page) {
							handlePageChange(newPagination.pageIndex);
						}

						if (newPagination.pageSize !== rowsPerPage) {
							handleRowsPerPageChange(newPagination.pageSize);
						}
					}}
					onGlobalFilterChange={handleGlobalFilterChange}
					state={{
						pagination: {
							pageIndex: page,
							pageSize: rowsPerPage
						},
						globalFilter
					}}
					initialState={{
						density: 'comfortable',
						showGlobalFilter: true,
						showColumnFilters: false,
						pagination: {
							pageIndex: 0,
							pageSize: 20
						}
					}}
					muiPaginationProps={{
						rowsPerPageOptions: [10, 20, 50, 100],
						showFirstButton: true,
						showLastButton: true
					}}
					renderEmptyRowsFallback={() => (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { delay: 0.1 } }}
							className="flex flex-col flex-1 items-center justify-center h-full py-48"
						>
							<FuseSvgIcon
								size={48}
								color="disabled"
							>
								heroicons-outline:calendar
							</FuseSvgIcon>
							<Typography
								color="text.secondary"
								variant="h5"
								className="mt-16"
							>
								No reservations found!
							</Typography>
							<Typography
								color="text.secondary"
								variant="body1"
								className="mt-8"
							>
								{globalFilter || propertyFilter !== 'all' || statusFilter !== 'all'
									? 'Try adjusting your filters'
									: 'Reservations will appear here once guests make bookings'}
							</Typography>
						</motion.div>
					)}
				/>
			</Paper>
		</motion.div>
	);
}

export default ReservationsTab;
