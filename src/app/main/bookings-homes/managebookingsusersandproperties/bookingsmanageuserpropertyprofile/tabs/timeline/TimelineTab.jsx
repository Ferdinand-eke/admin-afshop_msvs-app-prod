import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Avatar, Chip, Divider, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { format, formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

/**
 * The timeline tab - displays merchant activity history and important events
 */
function TimelineTab({ merchant }) {
	// Mock timeline activities for the merchant
	const [activities] = useState([
		{
			id: '1',
			type: 'property_added',
			title: 'New Property Listed',
			description: 'Added "Luxury Ocean View Suite" to portfolio',
			timestamp: new Date('2026-02-05T10:30:00'),
			icon: 'heroicons-outline:home',
			iconColor: 'blue'
		},
		{
			id: '2',
			type: 'booking_received',
			title: 'New Booking Received',
			description: 'John Doe booked Luxury Ocean View Suite for 5 nights',
			amount: 125000,
			timestamp: new Date('2026-02-01T14:20:00'),
			icon: 'heroicons-outline:calendar',
			iconColor: 'green'
		},
		{
			id: '3',
			type: 'verification_completed',
			title: 'Account Verified',
			description: 'Merchant account successfully verified by admin',
			timestamp: new Date('2026-01-28T09:15:00'),
			icon: 'heroicons-outline:badge-check',
			iconColor: 'purple'
		},
		{
			id: '4',
			type: 'payment_received',
			title: 'Payment Received',
			description: 'Received payment for booking #12345',
			amount: 60000,
			timestamp: new Date('2026-01-25T16:45:00'),
			icon: 'heroicons-outline:currency-dollar',
			iconColor: 'green'
		},
		{
			id: '5',
			type: 'property_updated',
			title: 'Property Updated',
			description: 'Updated pricing for Executive Apartment Downtown',
			timestamp: new Date('2026-01-20T11:30:00'),
			icon: 'heroicons-outline:pencil',
			iconColor: 'orange'
		},
		{
			id: '6',
			type: 'review_received',
			title: 'New Review Received',
			description: 'Michael Johnson left a 5-star review for Cozy Beach Bungalow',
			rating: 5,
			timestamp: new Date('2026-01-18T13:20:00'),
			icon: 'heroicons-outline:star',
			iconColor: 'yellow'
		},
		{
			id: '7',
			type: 'payout_processed',
			title: 'Payout Processed',
			description: 'Monthly earnings transferred to bank account',
			amount: 450000,
			timestamp: new Date('2026-01-15T10:00:00'),
			icon: 'heroicons-outline:cash',
			iconColor: 'green'
		},
		{
			id: '8',
			type: 'account_created',
			title: 'Account Created',
			description: 'Merchant account registered on the platform',
			timestamp: new Date('2026-01-10T08:00:00'),
			icon: 'heroicons-outline:user-add',
			iconColor: 'blue'
		}
	]);

	// Recent statistics
	const [recentStats] = useState([
		{
			id: '1',
			label: 'Properties Added',
			value: '3',
			period: 'Last 30 days',
			trend: 'up',
			percentage: '+50%'
		},
		{
			id: '2',
			label: 'Bookings Received',
			value: '12',
			period: 'Last 30 days',
			trend: 'up',
			percentage: '+25%'
		},
		{
			id: '3',
			label: 'Revenue Generated',
			value: 'NGN 890K',
			period: 'Last 30 days',
			trend: 'up',
			percentage: '+15%'
		},
		{
			id: '4',
			label: 'Average Rating',
			value: '4.7',
			period: 'Overall',
			trend: 'stable',
			percentage: '0%'
		}
	]);

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

	const getIconBackgroundColor = (color) => {
		const colorMap = {
			blue: 'bg-blue-100 text-blue-600',
			green: 'bg-green-100 text-green-600',
			purple: 'bg-purple-100 text-purple-600',
			orange: 'bg-orange-100 text-orange-600',
			yellow: 'bg-yellow-100 text-yellow-600',
			red: 'bg-red-100 text-red-600'
		};
		return colorMap[color] || 'bg-grey-100 text-grey-600';
	};

	return (
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			className="w-full p-12 sm:p-16 md:p-24"
		>
			<div className="md:flex md:space-x-32">
				{/* Main Timeline */}
				<div className="flex flex-col flex-1">
					<Card
						component={motion.div}
						variants={item}
						className="w-full mb-32"
					>
						<div className="px-32 pt-24 flex items-center justify-between">
							<div>
								<Typography className="text-2xl font-semibold leading-tight">Activity Timeline</Typography>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									Recent activities and important events for {merchant?.shopname}
								</Typography>
							</div>
							<Chip
								label="Live"
								color="success"
								size="small"
								icon={<FuseSvgIcon size={14}>heroicons-outline:lightning-bolt</FuseSvgIcon>}
							/>
						</div>

						<CardContent className="px-32 py-24">
							<List className="p-0">
								{activities.map((activity, index) => (
									<div key={activity.id}>
										<ListItem
											className="px-0 py-16"
											alignItems="flex-start"
										>
											<ListItemAvatar>
												<Avatar className={`w-48 h-48 ${getIconBackgroundColor(activity.iconColor)}`}>
													<FuseSvgIcon size={24}>{activity.icon}</FuseSvgIcon>
												</Avatar>
											</ListItemAvatar>
											<ListItemText
												primary={
													<div className="flex items-center justify-between mb-8">
														<Typography
															variant="body1"
															className="font-semibold"
														>
															{activity.title}
														</Typography>
														<Typography
															variant="caption"
															color="text.secondary"
															className="text-11"
														>
															{formatDistanceToNow(activity.timestamp, { addSuffix: true })}
														</Typography>
													</div>
												}
												secondary={
													<div className="mt-4">
														<Typography
															variant="body2"
															color="text.secondary"
															className="mb-8"
														>
															{activity.description}
														</Typography>
														{activity.amount && (
															<Chip
																label={`NGN ${activity.amount.toLocaleString()}`}
																size="small"
																color="success"
																className="text-11"
															/>
														)}
														{activity.rating && (
															<div className="flex items-center gap-4 mt-4">
																{[...Array(activity.rating)].map((_, i) => (
																	<FuseSvgIcon
																		key={i}
																		size={16}
																		className="text-yellow-500"
																	>
																		heroicons-solid:star
																	</FuseSvgIcon>
																))}
															</div>
														)}
														<Typography
															variant="caption"
															color="text.secondary"
															className="text-11 mt-8 block"
														>
															{format(activity.timestamp, 'MMMM dd, yyyy • hh:mm a')}
														</Typography>
													</div>
												}
											/>
										</ListItem>
										{index < activities.length - 1 && <Divider className="my-0" />}
									</div>
								))}
							</List>
						</CardContent>
					</Card>
				</div>

				{/* Sidebar - Recent Stats */}
				<div className="flex flex-col md:w-320">
					<Card
						component={motion.div}
						variants={item}
						className="w-full mb-32"
					>
						<div className="px-32 pt-24">
							<Typography className="text-2xl font-semibold leading-tight">Recent Performance</Typography>
						</div>

						<CardContent className="px-32 py-24">
							<div className="flex flex-col gap-16">
								{recentStats.map((stat) => (
									<div
										key={stat.id}
										className="p-16 bg-grey-50 rounded-lg"
									>
										<div className="flex items-center justify-between mb-8">
											<Typography
												variant="caption"
												color="text.secondary"
												className="text-11"
											>
												{stat.label}
											</Typography>
											<Chip
												label={stat.percentage}
												size="small"
												color={stat.trend === 'up' ? 'success' : 'default'}
												className="text-11 h-20"
												icon={
													stat.trend === 'up' ? (
														<FuseSvgIcon size={12}>heroicons-outline:trending-up</FuseSvgIcon>
													) : (
														<FuseSvgIcon size={12}>heroicons-outline:minus</FuseSvgIcon>
													)
												}
											/>
										</div>
										<Typography
											variant="h5"
											className="font-bold mb-4"
										>
											{stat.value}
										</Typography>
										<Typography
											variant="caption"
											color="text.secondary"
											className="text-11"
										>
											{stat.period}
										</Typography>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					<Card
						component={motion.div}
						variants={item}
						className="w-full mb-32"
					>
						<div className="px-32 pt-24">
							<Typography className="text-2xl font-semibold leading-tight">Quick Actions</Typography>
						</div>

						<CardContent className="px-32 py-24">
							<div className="flex flex-col gap-12">
								<div className="flex items-center gap-12 p-12 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
									<Avatar className="bg-blue-600 w-40 h-40">
										<FuseSvgIcon
											size={20}
											className="text-white"
										>
											heroicons-outline:eye
										</FuseSvgIcon>
									</Avatar>
									<div>
										<Typography
											variant="body2"
											className="font-semibold"
										>
											View All Properties
										</Typography>
										<Typography
											variant="caption"
											color="text.secondary"
										>
											Manage listings
										</Typography>
									</div>
								</div>

								<div className="flex items-center gap-12 p-12 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
									<Avatar className="bg-green-600 w-40 h-40">
										<FuseSvgIcon
											size={20}
											className="text-white"
										>
											heroicons-outline:calendar
										</FuseSvgIcon>
									</Avatar>
									<div>
										<Typography
											variant="body2"
											className="font-semibold"
										>
											View Bookings
										</Typography>
										<Typography
											variant="caption"
											color="text.secondary"
										>
											Check reservations
										</Typography>
									</div>
								</div>

								<div className="flex items-center gap-12 p-12 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors">
									<Avatar className="bg-purple-600 w-40 h-40">
										<FuseSvgIcon
											size={20}
											className="text-white"
										>
											heroicons-outline:chart-bar
										</FuseSvgIcon>
									</Avatar>
									<div>
										<Typography
											variant="body2"
											className="font-semibold"
										>
											View Analytics
										</Typography>
										<Typography
											variant="caption"
											color="text.secondary"
										>
											Performance metrics
										</Typography>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</motion.div>
	);
}

export default TimelineTab;
