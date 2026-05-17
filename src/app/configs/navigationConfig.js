import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);
/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */

const navigationConfig = [
	/** *Dashboard pane */
	{
		id: 'dashboards',
		title: 'Dashboards',
		subtitle: 'Navigation helpers',
		type: 'group',
		icon: 'heroicons-outline:home',
		translate: 'DASHBOARDS',
		children: [
			{
				id: 'shop.dashboards',
				title: 'Dashboard',
				type: 'item',
				icon: 'heroicons-outline:clipboard-check',
				url: '/dashboards/project'
			}
		]
	},

	/** *Manage users and roles */
	{
		id: 'users',
		title: 'Users Management',
		subtitle: 'Users management helpers',
		type: 'group',
		icon: 'heroicons-outline:home',
		// translate: 'SHOP-STAFF-USERS',
		children: [
			{
				id: 'users.admin',
				title: 'Admin staff',
				type: 'item',
				icon: 'heroicons-outline:user-group',
				url: '/users/admin'
			},
			{
				id: 'users.user',
				title: 'Uers',
				type: 'item',
				icon: 'heroicons-outline:user-group',
				url: '/users/list'
			}
			// {
			// 	id: 'users.shopstaff',
			// 	title: 'Shop Staff',
			// 	type: 'item',
			// 	icon: 'heroicons-outline:user-group',
			// 	url: '/users/shopstaff'
			// },
		]
	},

	/** *Admistrative activities & management pane */
	{
		id: 'administrations',
		title: 'Administrative Tasks',
		subtitle: 'Manage africanshops operations',
		type: 'group',
		icon: 'heroicons-outline:shopping-cart',
		// translate: 'VENDORS-&-VENDOR-PLANS',
		children: [
			{
				id: 'administrations.coutries',
				title: 'Countries of Operations',
				type: 'item',
				icon: 'heroicons-outline:shopping-cart',
				url: '/administrations/countries'
			},

			{
				id: 'administrations.states',
				title: 'States of Operations',
				type: 'item',
				icon: 'heroicons-outline:shopping-cart',
				url: '/administrations/states'
			},

			{
				id: 'administrations.lgas',
				title: 'LGAs/Counties of Operations',
				type: 'item',
				icon: 'heroicons-outline:shopping-cart',
				url: '/administrations/lgas'
			},

			{
				id: 'administrations.offices',
				title: 'Our offices of Operations',
				type: 'item',
				icon: 'heroicons-outline:shopping-cart',
				url: '/administrations/offices'
			},
			{
				id: 'departments.list',
				title: 'Our Departments',
				type: 'item',
				icon: 'heroicons-outline:shopping-cart',
				url: '/departments/list'
			},
			{
				id: 'designations.list',
				title: 'Departmental designations',
				type: 'item',
				icon: 'heroicons-outline:shopping-cart',
				url: '/designations/list'
			}
		]
	},

	/** *Market management pane */
	{
		id: 'markets',
		title: 'Markets',
		subtitle: 'Markets we operate',
		type: 'group',
		icon: 'heroicons-outline:shopping-cart',
		// translate: 'VENDORS-&-VENDOR-PLANS',
		children: [
			{
				id: 'market.categories',
				title: 'Market Categories',
				type: 'item',
				icon: 'heroicons-outline:shopping-cart',
				url: '/market-categories/list'
			},
			{
				id: 'markets.list',
				title: 'Markets',
				type: 'item',
				icon: 'heroicons-outline:shopping-cart',
				url: '/markets/list'
			}
		]
	},

	/** *Vendor-Plan management pane */
	{
		id: 'vendorplans',
		title: 'Vendor Plans & Vendors',
		subtitle: 'Manage vendor plan packages',
		type: 'group',
		icon: 'heroicons-outline:shopping-cart',
		// translate: 'VENDORS-&-VENDOR-PLANS',
		children: [
			{
				id: 'vendorplans.packages',
				title: 'Vendor Plans',
				type: 'item',
				icon: 'heroicons-outline:shopping-cart',
				url: '/vendorplans/packages'
			},

			{
				id: 'vendors.listvendors',
				title: 'Vendors',
				type: 'item',
				icon: 'heroicons-outline:shopping-cart',
				url: '/vendors/listvendors'
			},

			{
				id: 'partnervendors.listpartners',
				title: 'Partner Vendors',
				type: 'item',
				icon: 'heroicons-outline:shopping-cart',
				url: '/partnervendors/listpartners'
			}
		]
	},

	/** *Products management pane */
	{
		id: 'shopproducts',
		title: 'Products',
		subtitle: 'Manage your shop products',
		type: 'group',
		icon: 'heroicons-outline:shopping-cart',
		translate: 'PRODUCTS',
		children: [
			{
				id: 'tradehubs.list',
				title: 'Trade Hubs',
				type: 'item',
				icon: 'heroicons-outline:shopping-cart',
				url: '/tradehubs/list'
			},

			{
				id: 'productcategories.list',
				title: 'Product Categories',
				type: 'item',
				icon: 'heroicons-outline:shopping-cart',
				url: '/productcategories/list'
			},
			{
				id: 'productpackagings.list',
				title: 'Product Packaging',
				type: 'item',
				icon: 'heroicons-outline:shopping-cart',
				url: '/productpackagings/list'
			},
			{
				id: 'productunits.list',
				title: 'Product Units',
				type: 'item',
				icon: 'heroicons-outline:shopping-cart',
				url: '/productunits/list'
			}

			// {
			// 	//NAVIGATION:SHOP PRODUCTS
			// 	id: 'shopproducts.list',
			// 	title: 'Products',
			// 	type: 'item',
			// 	icon: 'heroicons-outline:shopping-cart',
			// 	url: '/shopproducts-list/products'
			// },
			// {
			// 	id: 'shopproducts.inventory',
			// 	title: 'Inventory',
			// 	type: 'item',
			// 	icon: 'heroicons-outline:shopping-cart',
			// 	url: '/shopproducts-list/inventory'
			// },
		]
	},

	/** *Admin ManageShop-orders  pane */
	{
		id: 'adminmanageorders',
		title: 'Orders-&-Pos',
		subtitle: 'Admin Manage orders',
		type: 'group',
		icon: 'heroicons-outline:home',
		translate: 'ORDERS-&-POS',
		children: [
			{
				id: 'admin-manage.orders',
				title: 'Manage Orders',
				type: 'item',
				icon: 'heroicons-outline:shopping-cart',
				url: '/admin-manage/orders'
			},
			{
				id: 'shoporders.pos',
				title: 'Manage Poin Of Sale (POS)',
				type: 'item',
				icon: 'heroicons-outline:shopping-cart',
				url: '/admin-manage/pos'
			},

			{
				id: 'shoporders.orderitems',
				title: 'Manage Order Items',
				type: 'item',
				icon: 'heroicons-outline:shopping-cart',
				url: '/admin-manage/orderitems'
			}
		]
	},

	/** *Admin Manage-Bookings-Providers and Reservations  pane */
	{
		id: 'adminmanagebookings',
		title: 'Bookings-&-Reservations',
		subtitle: 'Admin Manage Bookings',
		type: 'group',
		icon: 'heroicons-outline:home',
		translate: 'BOOKINGS-&-RESERVATIONS',
		children: [
			{
				id: 'admin-manage.bookingproviders',
				title: 'Merchants & Bookings List',
				type: 'item',
				icon: 'heroicons-outline:shopping-cart',
				url: '/bookings-hospitality/user-listings'
			},
			{
				id: 'admin-manage.reservations',
				title: 'Manage Reservations ',
				type: 'item',
				icon: 'heroicons-outline:shopping-cart',
				url: '/bookings-hospitality/reservations'
			},
			{
				id: 'admin-manage.amenities',
				title: 'Manage Amenities ',
				type: 'item',
				icon: 'heroicons-outline:shopping-cart',
				url: '/bookings-hospitality/amenities'
			}

		]
	},

	/** *Admin Manage-Restaurants,Bars&Spots-Providers and orders  pane */
	{
		id: 'adminmanageRCS',
		title: 'Restaurants-Clubs-&-Spots',
		subtitle: 'Admin Manage RCS',
		type: 'group',
		icon: 'heroicons-outline:home',
		translate: 'RESTAURANTS-&-CLUBS',
		children: [
			{
				id: 'rcs-management.rcs',
				title: 'Manage RCS',
				type: 'item',
				icon: 'heroicons-outline:shopping-cart',
				url: '/rcs-management/rcs-listings'
			},
			{
				id: 'rcs-management.rcs-orders',
				title: 'Manage RCS Orders ',
				type: 'item',
				icon: 'heroicons-outline:shopping-cart',
				url: '/rcs-management/rcs-reservations-menuorders'
			}
		]
	},

	/** *shop-orders orders pane */
	// {
	// 	id: 'shoporders',
	// 	title: 'Orders-&-Pos',
	// 	subtitle: 'Manage your shop orders',
	// 	type: 'group',
	// 	icon: 'heroicons-outline:home',
	// 	translate: 'ORDERS-&-POS',
	// 	children: [
	// 		{
	// 			id: 'shoporders.list',
	// 			title: 'Orders',
	// 			type: 'item',
	// 			icon: 'heroicons-outline:shopping-cart',
	// 			url: '/shoporders-list/orders'
	// 		},
	// 		{
	// 			id: 'shoporders.pos',
	// 			title: 'Poin Of Sale (POS)',
	// 			type: 'item',
	// 			icon: 'heroicons-outline:shopping-cart',
	// 			url: '/shoporders-list/pos'
	// 		},

	// 	]
	// },

	/** *Estate Properties management pane */
	{
		id: 'estateproperties',
		title: 'Manage prperties',
		subtitle: 'Properties management helpers',
		type: 'group',
		icon: 'heroicons-outline:home',
		translate: 'REAL-ESTATE-PROPERTIES',
		children: [
			// {
			// 	id: 'properties.list',
			// 	title: 'Properties',
			// 	type: 'item',
			// 	icon: 'heroicons-outline:clipboard-check',
			// 	url: '/properties/listings'
			// },

			// {
			// 	id: 'properties.managedlist',
			// 	title: 'Managed Properties',
			// 	type: 'item',
			// 	icon: 'heroicons-outline:clipboard-check',
			// 	url: '/property/managed-listings'
			// },

			{
				id: 'users.managedlist',
				title: 'Merchants & Properties',
				type: 'item',
				icon: 'heroicons-outline:clipboard-check',
				url: '/userlistings/managed-user-listings'
			}
		]
	},

	/** *Editorial management pane */
	{
		id: 'Editorials',
		title: 'Manage Editorials',
		subtitle: 'Editorials on africanshops',
		type: 'group',
		icon: 'heroicons-outline:home',
		translate: 'Editorials',
		children: [
			{
				id: 'postcategories.list',
				title: 'post categories',
				type: 'item',
				icon: 'heroicons-outline:clipboard-check',
				url: '/postcategories/list'
			},

			{
				id: 'posts.list',
				title: 'posts',
				type: 'item',
				icon: 'heroicons-outline:clipboard-check',
				url: '/posts/list'
			}

			// {
			// 	id: 'withdrawals.list',
			// 	title: 'Property Withdrawals',
			// 	type: 'item',
			// 	icon: 'heroicons-outline:clipboard-check',
			// 	url: '/finance/withdrawals'
			// },
		]
	},

	/** *Country Shipping Tables management pane */
	{
		id: 'CountryShipping',
		title: 'Country-Shipping-Table',
		subtitle: 'Our Country shipping table on africanshops',
		type: 'group',
		icon: 'heroicons-outline:home',
		translate: 'CountryShipping',
		children: [
			{
				id: 'countryshipping.list',
				title: 'Shipping Tabel(Countries)',
				type: 'item',
				icon: 'heroicons-outline:clipboard-check',
				url: '/countryshipping/list'
			},
			{
				id: 'stateshipping.list',
				title: 'Shipping Tabel(States)',
				type: 'item',
				icon: 'heroicons-outline:clipboard-check',
				url: '/countryshipping/stateshipping/list'
			},
			{
				id: 'lgashipping.list',
				title: 'Shipping Tabel(LGAs)',
				type: 'item',
				icon: 'heroicons-outline:clipboard-check',
				url: '/countryshipping/lgashipping/list'
			},
			{
				id: 'districtshipping.list',
				title: 'Shipping Tabel(Districts)',
				type: 'item',
				icon: 'heroicons-outline:clipboard-check',
				url: '/countryshipping/districtshipping/list'
			},
			// {
			// 	id: 'countryshipping.list',
			// 	title: 'Shipping Tabel(Countries)',
			// 	type: 'item',
			// 	icon: 'heroicons-outline:clipboard-check',
			// 	url: '/countryshipping/list'
			// }
		]
	},

	/** *Finance management pane */
	{
		id: 'FInance',
		title: 'Manage Finance',
		subtitle: 'Earnings from businesses you run',
		type: 'group',
		icon: 'heroicons-outline:home',
		translate: 'FINANCE',
		children: [
			{
				id: 'property.earnings',
				title: 'Wallet',
				type: 'item',
				icon: 'heroicons-outline:clipboard-check',
				url: '/africanshops/finance'
			}
		]
	},

	/** *Support management pane */
	{
		id: 'Support.Helpcenter',
		title: 'Get Support',
		subtitle: 'Get Clarity And Support From Admin',
		type: 'group',
		icon: 'heroicons-outline:home',
		translate: 'SUPPORT',
		children: [
			{
				id: 'support.earnings',
				title: 'Suppport',
				type: 'item',
				icon: 'heroicons-outline:support',
				url: '/support'
			}
		]
	},

	/** *Messanger pane */
	{
		id: 'Africanshops.Messanger',
		title: 'Messanger',
		subtitle: 'Chat with potential customres and admin',
		type: 'group',
		icon: 'heroicons-outline:chat-alt',
		translate: 'MESSANGER',
		children: [
			{
				id: 'apps.messenger',
				title: 'Messenger',
				type: 'item',
				icon: 'heroicons-outline:chat-alt',
				url: '/africanshops/messenger',
				translate: 'MESSENGER'
			}
		]
	}
];
export default navigationConfig;
