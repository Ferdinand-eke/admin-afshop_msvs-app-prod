import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ManagedUserListingApp = lazy(() => import('./ManagedUserListingApp'));
const PropertyListing = lazy(() => import('./product/PropertyListing'));
const BookingsProperties = lazy(() => import('./products/BookingsProperties'));
const ProfileApp = lazy(() => import('./bookingsmanageprofile/ProfileApp'));
const PropertyProfileApp = lazy(() => import('./bookingsmanageuserpropertyprofile/PropertyProfileApp'));

const ReservationsOnBookingsProperties = lazy(() => import('./reservations/ReservationsOnBookingsProperties'));
const AmenitiesOnBookingsProperties = lazy(() => import('./amenities/AmenitiesOnBookingsProperties'));

/**
 * The E-Commerce app configuration.
 */

const ManagedBookingsUserListingsAppConfig = {
	settings: {
		layout: {}
	},

	routes: [
		{
			path: 'bookings-hospitality',
			element: <ManagedUserListingApp />,
			children: [
				{
					path: '',
					element: <Navigate to="user-listings" />
				},
				{
					path: 'user-listings',
					element: <BookingsProperties />
				}, //Msvs => DOne

				{
					path: 'user-listings/:productId/*',
					element: <PropertyListing />
				},
				// {
				// 	path: 'user-listings/:merchantId/userproperties',
				// 	element: <ProfileApp />
				// },

				{
					path: 'user-listings/:merchantId/manage',
					element: <PropertyProfileApp />
				},

				{
					path: 'reservations',
					element: <ReservationsOnBookingsProperties />
				},

				{
					path: 'amenities',
					element: <AmenitiesOnBookingsProperties />
				}
				//AmenitiesOnBookingsProperties
			]
		}

	]
};

export default ManagedBookingsUserListingsAppConfig;
