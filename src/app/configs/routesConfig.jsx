import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import SignInConfig from '../main/sign-in/SignInConfig';
// import SignUpConfig from '../main/sign-up/SignUpConfig';
// import SignOutConfig from '../main/sign-out/SignOutConfig';
import Error404Page from '../main/404/Error404Page';
import DashboardsConfigs from '../main/dashboards/dashboardsConfigs';
// import DocumentationConfig from '../main/documentation/DocumentationConfig';
import UsersAppConfig from '../main/users/user/UsersAppConfig';
import StaffAppConfig from '../main/users/admin/StaffAppConfig';
import SignAcceptInviteConfig from '../main/sign-accept-invite/SignAcceptInviteConfig';
// import ManagedUserListingsAppConfig from "../main/homes/managedusersandproperties/ManagedUserListingsAppConfigppConfig";
import SupportHelpCenterAppConfig from '../main/vendors-shop/support-center/SupportHelpCenterAppConfig';
import AfricanshopsFinanceDashboardAppConfig from '../main/africanshops-finance/AfricanshopsFinanceDashboardAppConfig';
import AfricanshopsMessengerAppConfig from '../main/africanshops-messenger/AfricanshopsMessengerAppConfig';
import VendorPlansAppConfig from '../main/africanshops-control-dashboard/manage-vendorplans/VendorPlansAppConfig';
import VendorsAppConfig from '../main/africanshops-control-dashboard/manage-allvendors/VendorsAppConfig';
import CountriesAppConfig from '../main/africanshops-control-dashboard/manage-countries/CountriesAppConfig';
import StatesAppConfig from '../main/africanshops-control-dashboard/manage-states/StatesAppConfig';
import LgasCountiesAppConfig from '../main/africanshops-control-dashboard/manage-lgasorcounties/LgasCountiesAppConfig';
import OfficesAppConfig from '../main/africanshops-control-dashboard/manage-offices/OfficesAppConfig';
import DepartmentsAppConfig from '../main/africanshops-control-dashboard/manage-departments/DepartmentsAppConfig';
import DesignationsAppConfig from '../main/africanshops-control-dashboard/manage-designations/DesignationsAppConfig';
import MarketDashboardAppConfig from '../main/africanshops-control-dashboard/manage-markets-shops-products/dasboard/MarketDashboardAppConfig';
import MarketsAppConfig from '../main/africanshops-control-dashboard/manage-markets-shops-products/markets/MarketsAppConfig';
import MarketCategoryAppConfig from '../main/africanshops-control-dashboard/manage-markets-shops-products/marketcategories/MarketCategoryAppConfig';
import PartnerVendorsAppConfig from '../main/africanshops-control-dashboard/manage-partnervendors/PartnerVendorsAppConfig';
import ProductCategoriesAppConfig from '../main/africanshops-control-dashboard/manage-markets-shops-products/product-categories/ProductCategoriesAppConfig';
import ProductPackagingsAppConfig from '../main/africanshops-control-dashboard/manage-markets-shops-products/product-packagings/ProductPackagingsAppConfig';
import ProductUnitsAppConfig from '../main/africanshops-control-dashboard/manage-markets-shops-products/product-units/ProductUnitsAppConfig';
import TradehubsAppConfig from '../main/africanshops-control-dashboard/manage-markets-shops-products/tradhubs/TradehubsAppConfig';
import PostCategoriesAppConfig from '../main/africanshops-control-dashboard/manage-editorials/post-categories/PostCategoriesAppConfig';
import PostsAppConfig from '../main/africanshops-control-dashboard/manage-editorials/posts/PostsAppConfig';
import AdminManageOrdersAppConfig from '../main/africanshops-control-dashboard/manage-markets-shops-products/orders/AdminManageOrdersAppConfig';
import CountryShippingTableAppConfig from '../main/africanshops-control-dashboard/manage-countryshippingtable/CountryShippingTableAppConfig';
import ManagedUserListingsAppConfig from '../main/homes/managedusersandproperties/ManagedUserListingsAppConfig';
import ManagedBookingsUserListingsAppConfig from '../main/bookings-homes/managebookingsusersandproperties/ManagedBookingsUserListingsAppConfig';
import ManagedRcsListingsAppConfig from '../main/manage-rcses/managercses/ManagedRcsListingsAppConfig';
import AdminProfileSettingsAppConfig from '../main/africanshops-control-dashboard/manage-admin-settings/AdminProfileSettingsAppConfig';
// import AfricanshopsMessengerAppConfig from '../main/africanshops-messenger/AfricanshopsMessengerAppConfig';

const routeConfigs = [
	SignInConfig,
	SignAcceptInviteConfig,
	UsersAppConfig,
	StaffAppConfig,
	// PropertiesAppConfig,
	// ServiceTypesAppConfig,

	// PropertyTypesAppConfig,
	ManagedUserListingsAppConfig,

	/** **Africanshops Merhcant's Dashboard Configs Starts Here */
	SupportHelpCenterAppConfig,
	AfricanshopsFinanceDashboardAppConfig,
	AfricanshopsMessengerAppConfig,
	/** **Africanshops Merhcant's Dashboard Configs Ends Here */

	/** ***
	 *#############################################################
	 * ADMIN CONCERNS AND FUNCTIONALITIES ===> STARTS JUST BELOW
	 * #################################################################
	 */

	/** **Africanshops Admin & Administrative Dashboard Configs Starts Here */
	AdminProfileSettingsAppConfig /** Admin Profile & Referral Links */,
	VendorPlansAppConfig /** Msvs Complete CRUD=> Done */,
	VendorsAppConfig,
	CountriesAppConfig /** Msvs Complete CRUD=> Done */,
	StatesAppConfig /** Msvs Complete CRUD=> Done */,
	LgasCountiesAppConfig /** Msvs Complete CRUD=> Done */,
	OfficesAppConfig /** Msvs Complete CRUD=> Done */,
	DepartmentsAppConfig /** Msvs Complete CRUD=> Done */,
	DesignationsAppConfig /** Msvs Complete CRUD=> Done */,
	/** **Africanshops Admin & Administrative Dashboard Configs Ends Here */

	/** **Africanshops Admin Market Management  Configs Starts Here */
	MarketDashboardAppConfig,
	MarketsAppConfig /** Msvs Complete CRUD=> Done */,
	MarketCategoryAppConfig /** Msvs Complete CRUD=> Done */,
	PartnerVendorsAppConfig,
	/** **Africanshops Admin Market Management  Configs Ends Here */

	/** **Africanshops Admin Product Management  Configs Starts Here */
	TradehubsAppConfig,
	ProductCategoriesAppConfig,
	ProductPackagingsAppConfig,
	ProductUnitsAppConfig,
	/** **Africanshops Admin Product Management  Configs Ends Here */

	/** **Africanshops Admin orders Management  Configs Starts Here */
	AdminManageOrdersAppConfig,
	/** **Africanshops Admin orders Management  Configs Ends Here */

	/** **Africanshops Admin Editorial Management  Configs Starts CountryShippingTableAppConfig Here */
	PostCategoriesAppConfig,
	PostsAppConfig,
	/** **Africanshops Admin Editorial Management  Configs Ends Here */

	/** **Africanshops Countries Shipping Table Management  Configs Starts  Here */
	CountryShippingTableAppConfig,
	/** **Africanshops Countries Shipping Table Management  Configs Ends Here */

	/** **Africanshops Bookings Property Management  Configs Starts  Here */
	ManagedBookingsUserListingsAppConfig,
	/** **Africanshops Bookings Property Management  Configs Ends Here */

	/** **Africanshops RCS  Management  Configs Starts  Here */
	ManagedRcsListingsAppConfig,
	/** **Africanshops RCS Management  Configs Ends Here */

	/**
	 * Routes Below to be disabled starts
	 */
	// ...PagesConfigs,
	// ...UserInterfaceConfigs,
	...DashboardsConfigs
	// ...AppsConfigs,
	// ...authRoleExamplesConfigs,
	/**
	 * Routes Below to be disabled ends
	 */
];

/**
 * The routes of the application.
 */
const routes = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
	{
		path: '/',
		element: <Navigate to="/dashboards/project" />,
		// element: <Navigate to="/home" />,
		auth: settingsConfig.defaultAuth
	},
	{
		path: 'loading',
		element: <FuseLoading />
	},
	{
		path: '404',
		element: <Error404Page />
	},
	{
		path: '*',
		element: <Navigate to="404" />
	}
];
export default routes;
