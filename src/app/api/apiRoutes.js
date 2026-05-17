import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { getAdminAccessToken, resetSessionForAdminUsers } from '../aaqueryhooks/utils/opsUtils';

/**
 * MAIN APIs STARTS
 */
const baseDomain = import.meta.env.VITE_API_BASE_URL_PROD; /** production & dev */

export const baseUrl = `${baseDomain}`;

export default function Api() {
	const Api = axios.create({
		baseURL: baseUrl
	});

	return Api;
}

export function authApi() {
	const TOKEN = getAdminAccessToken();

	// console.log('AUTH-ADMIN-TOKEN', TOKEN);
	const customHeaders = {
		Accept: 'application/json',
		withCredentials: true,
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	};

	const Api = axios.create({
		baseURL: baseUrl,
		// Bearer
		headers: { accesstoken: `${TOKEN}` }
	});

	Api.interceptors.response.use(
		(response) => response,
		(error) => {
			if (error?.response?.status === 403 || error?.response?.status === 401) {
				console.log('responseSTATS', error?.response?.status);
				AdminLogOutCall();

				return Promise.reject({ status: 401, errors: ['Unauthorized'] });
			}

			if (error.response?.status === 422) {
				const errors = Object.values(error?.response?.data?.errors || {});

				return Promise.reject({
					status: 422,
					errorsRaw: errors,
					errors: errors.reduce((error) => error)
				});
			}

			console.error(error);

			const rawMsg = error.response?.data?.message;
			const isValidationArray = Array.isArray(rawMsg) && rawMsg.length > 0;

			if (isValidationArray) {
				rawMsg.forEach((msg) => {
					const display = msg.includes(' - ') ? msg.split(' - ').slice(1).join(' - ') : msg;
					toast.error(display);
				});
			} else {
				toast.error(rawMsg || error.message);
			}

			return Promise.reject({
				status: error?.response?.status,
				message: rawMsg || error.message,
				validationErrors: isValidationArray ? rawMsg : null
			});
		}
	);

	return Api;
}

/** *News Blog */
export const getNewBlogPosts = () => Api().get('/posts');
export const getNewBlogPostsById = (id) => authApi().get(`/posts/${id}`);

/** **Admin Authentication authadmin */
export const adminSigin = (formData) => {
	return Api().post('/authadmin/adminlogin', formData);
};

/** ***
 * ###############################################################################
 * Departments handling starts here  (All functional as @ 20th August, 2024)
 * ###############################################################################
 */
/** *Handle departments */
export const getDepts = (params = {}) => {
	const queryParams = new URLSearchParams();

	if (params.limit) queryParams.append('limit', params.limit);
	if (params.offset) queryParams.append('offset', params.offset);
	if (params.search) queryParams.append('search', params.search);

	const queryString = queryParams.toString();
	const url = queryString ? `/departments?${queryString}` : '/departments';

	return authApi().get(url);
}; // done //(Msvs => Done)
export const getDeptById = (id) => authApi().get(`/departments/${id}`); // done //(Msvs => Done)
export const createDepartMent = (deptFormData) => authApi().post('/departments', deptFormData); // done

export const updateDeptById = (deptFormData) => {
	return authApi().put(`/departments/${deptFormData?.id || deptFormData?._id}`, deptFormData); // done
};
export const deleteDepartmentById = (id) => authApi().delete(`/departments/${id}`);

/** ***
 * ####################################################################
 * Departments handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */

/** ***
 * ###############################################################################
 * Designation handling starts here  (All functional as @ 20th August, 2024)
 * ###############################################################################
 */
export const getDesigs = (params = {}) => {
	const queryParams = new URLSearchParams();

	if (params.limit) queryParams.append('limit', params.limit);
	if (params.offset) queryParams.append('offset', params.offset);
	if (params.search) queryParams.append('search', params.search);

	const queryString = queryParams.toString();
	const url = queryString ? `/designations?${queryString}` : '/designations';

	return authApi().get(url);
}; // done //(Msvs => Done)
export const getDesigById = (id) => authApi().get(`/designations/${id}`); // done //(Msvs => Done)
export const getDesigByDepartmentId = (id) => authApi().get(`/designations/by-department/${id}`); // done //(Msvs => Done)
export const updateDesigById = (desigFormData) => {
	return authApi().put(`/designations/${desigFormData?.id || desigFormData?._id}`, desigFormData); // done //(Msvs => Done)
};
export const createDesignation = (desigFormData) => authApi().post('/designations', desigFormData); // done
export const deleteDesignationById = (id) => authApi().delete(`/designations/${id}`);

/** ***
 * ####################################################################
 * Designation handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */

/** ***
 * ###############################################################################
 * countries handling starts here  (All functional as @ 20th August, 2024)
 * ###############################################################################
 */
/** *Countries */
export const getCountries = (params = {}) => {
	const queryParams = new URLSearchParams();

	if (params.limit) queryParams.append('limit', params.limit);

	if (params.offset) queryParams.append('offset', params.offset);

	if (params.search) queryParams.append('search', params.search);

	if (params.isInOperation !== undefined) queryParams.append('isInOperation', params.isInOperation);

	const queryString = queryParams.toString();
	const url = queryString ? `/buzcountries?${queryString}` : '/buzcountries';

	return authApi().get(url);
}; /** done //(Msvs => Done) */

/** **operational countries */
export const getCountriesWithShippinTable = () => authApi().get('/buzcountries'); // done /** done //(Msvs => Done) */


export const getCountriesWithShippinTableExcludeOrigin = (originId) =>
	authApi().get(`/buzcountries/with-shipping-table/excluded-origin/${originId}`); // done /** done //(Msvs => Done) */

export const getCountryById = (id) => authApi().get(`/buzcountries/${id}`); // done /** done //(Msvs => Done) */

export const updateCountryById = (countryFormData) => {
	return authApi().put(`/buzcountries/${countryFormData?.id}`, countryFormData); // done /** done //(Msvs => Done) */
};

export const createCountry = (countryFormData) => authApi().post('/buzcountries', countryFormData); // done /** done //(Msvs => Done) */


export const deleteCountryById = (id) => authApi().delete(`/buzcountries/${id}`);

/** ============================================================================================ */
/** *Shipping Table routes starts here */
export const getCountryShippingTable = (shipFrom, id) =>
	Api().get(`/buzcountries/get-shipping-table/${shipFrom}/${id}`);

export const createCountryShippingTable = (countryFormData) =>
	authApi().post(`/buzcountries/add-shipping-table/${countryFormData?.countryCheckOrigin}`, countryFormData); // done /** done //(Msvs => Done) */

export const updateCountryShippingTableById = (countryFormData) => {
	return authApi().put(`/buzcountries/update-shipping-table/${countryFormData?.countryToShipTo}`, countryFormData); // done /** done //(Msvs => Done) */
};

export const deleteCountryShippingTableById = (countryFormData) => {
	return authApi().put(`/buzcountries/delete-shipping-table/${countryFormData?.countryToShipTo}`, countryFormData); // done /** done //(Msvs => Done) */
};
/** *Shipping Table routes ends here */

/** *operational countries For End USERS &&& MERCHANTS */
export const getOperationalCountries = () => authApi().get('/buzcountries/operational'); // done
export const getOperationalCountryById = (id) => Api().get(`/buzcountries/operationale/${id}`); // done
/** ***
 * ####################################################################
 * countries handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */

/** =================================================================================== */

/** ***
 * ####################################################################
 * states handling starts here  (All done as @ 20th August, 2024)
 * ####################################################################
 */
export const getBStates = (params = {}) => {
	const queryParams = new URLSearchParams();

	if (params.limit) queryParams.append('limit', params.limit);

	if (params.offset) queryParams.append('offset', params.offset);

	if (params.search) queryParams.append('search', params.search);

	if (params.isInOperation !== undefined) queryParams.append('isInOperation', params.isInOperation);

	const queryString = queryParams.toString();
	const url = queryString ? `/buzstates?${queryString}` : '/buzstates';

	return authApi().get(url);
}; // done
export const getStateById = (id) => authApi().get(`/buzstates/${id}`); // done

export const getStateByCountryId = (cid) => authApi().get(`/buzstates/in-country/${cid}/operational`);

export const getStatesByCountryAdmin = ({ cid, limit = 20, offset = 0 }) => {
	const queryParams = new URLSearchParams();
	queryParams.append('limit', limit);
	queryParams.append('offset', offset);
	return authApi().get(`/buzstates/in-country/${cid}?${queryParams.toString()}`);
};

export const updateStateById = (stateFormData) => {
	return authApi().put(`/buzstates/${stateFormData?.id}`, stateFormData); // done // (Msvs => Done)
};
export const createBState = (stateFormData) => authApi().post('/buzstates', stateFormData); // done
export const deleteStateById = (id) => authApi().delete(`/buzstates/${id}`);
/** **operational state routes */
export const getOperationalBStates = () => Api().get('/buzstates/operational'); // done
export const getOperationalStateById = (id) => Api().get(`/buzstates/operational/${id}`); // done
export const getOperationalStateByCountryId = (cid) => authApi().get(`/buzstates/in-country/${cid}/operational`); // done (Operational) //(Msvs => Done)
// in-country/:cid/operational
/** *State Shipping Table routes starts here */
export const getStatesWithShippinTable = (countryId) =>
	authApi().get(`/buzstates/with-shipping-table/country/${countryId}`);

export const getStatesWithShippinTableExcludeOrigin = (originStateId, countryId) =>
	authApi().get(`/buzstates/with-shipping-table/excluded-origin/${originStateId}/country/${countryId}`);

export const createStateShippingTable = (payload) =>
	authApi().post(`/buzstates/add-shipping-table/${payload?.stateCheckOrigin}`, payload);

export const updateStateShippingTableById = (payload) =>
	authApi().put(`/buzstates/update-shipping-table/${payload?.stateToShipTo}`, payload);

export const deleteStateShippingTableById = (payload) =>
	authApi().put(`/buzstates/delete-shipping-table/${payload?.stateToShipTo}`, payload);
/** *State Shipping Table routes ends here */

/** ***
 * ####################################################################
 * states handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */

/** *================================================================ */

/** ***
 * ####################################################################
 * LGAs/COUNTIES handling starts here  (All done as @ 20th August, 2024)
 * ####################################################################
 */
export const getBLgas = (params = {}) => {
	const queryParams = new URLSearchParams();

	if (params.limit) queryParams.append('limit', params.limit);

	if (params.offset) queryParams.append('offset', params.offset);

	if (params.search) queryParams.append('search', params.search);

	if (params.isInOperation !== undefined) queryParams.append('isInOperation', params.isInOperation);

	const queryString = queryParams.toString();
	const url = queryString ? `/buz-lgas?${queryString}` : '/buz-lgas';

	return authApi().get(url);
}; // done
export const getOperationalBLgas = () => Api().get('/buz-lgas/operational'); // done
export const getLgaById = (id) => authApi().get(`/buz-lgas/${id}`); // done
export const getOperationalLgaById = (id) => Api().get(`/buz-lgas/operational/${id}`); // done
export const getLgaByStateId = (id) => Api().get(`/buz-lgas/state/${id}`); // done
export const getOperationalLgaByStateId = (sid) => Api().get(`/buz-lgas/in-state/${sid}/operational`); // done (Operational) //(Msvs => Done)
export const getLgasByStateAdmin = ({ stateId, limit = 20, offset = 0 }) =>
	authApi().get(`/buz-lgas/in-state/${stateId}`, { params: { limit, offset } }); // done (Admin)
export const updateLgaById = (lgaFormData) => {
	return authApi().put(`/buz-lgas/${lgaFormData?.id}`, lgaFormData); // done
};
export const createBLga = (stateFormData) => authApi().post('/buz-lgas', stateFormData); // done
export const deleteLgaById = (id) => authApi().delete(`/buz-lgas/${id}/delete`);
/** ***
 * ####################################################################
 * LGAs/COUNTIES handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */
/** *================================================================ */
/** ***
 * ####################################################################
 * Districts handling starts here  (Admin)
 * ______________________________________________________________________
 * ####################################################################
 */
export const getDistrictsByAdmin = ({ limit = 20, offset = 0 } = {}) =>
	authApi().get('/buz-districts', { params: { limit, offset } });
export const getDistrictsByLgaAdmin = ({ lgaId, limit = 20, offset = 0 }) =>
	authApi().get(`/buz-districts/in-lga/${lgaId}`, { params: { limit, offset } });
export const getDistrictByIdAdmin = (id) => authApi().get(`/buz-districts/${id}`);
export const createDistrict = (dto) => authApi().post('/buz-districts', dto);
export const updateDistrictById = ({ id, ...dto }) => authApi().put(`/buz-districts/${id}`, dto);
export const deleteDistrictById = (id) => authApi().delete(`/buz-districts/${id}/delete`);
/** ***
 * ####################################################################
 * Districts handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */
/** *================================================================ */

/** ***
 * ####################################################################
 * TRADEHUBS handling starts here  (All done as @ 20th August, 2024)
 * ####################################################################
 */
export const getTradehubs = () => authApi().get('/trade-hubs'); // done (Msvs => Done)
export const getTradehubById = (id) => authApi().get(`/trade-hubs/${id}/view`); // done/ //(Msvs => Done)

export const updateTradehubById = (hubFormData) => {
	return authApi().put(`/trade-hubs/${hubFormData?.id || hubFormData?._id}/update`, hubFormData); // done //(Msvs => Done)
};

export const createTradehub = (hubFormData) => authApi().post('/trade-hubs', hubFormData);

export const deleteTradehubById = (hubFormData) => {
	// console.log('DELETE-HUB-ID', hubFormData);
	return authApi().delete(`/trade-hubs/${hubFormData}/delete`); // done
};

/** ***
 * ####################################################################
 * TRADEHUBS handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */
/** *================================================================ */

/** ***
 * ####################################################################
 * PRODUCT-CATEGORIES handling starts here  (All done as @ 20th August, 2024)
 * ####################################################################
 */
// Product Categories Routes
export const getProdCats = () => Api().get('/categories'); // done //(Msvs => Done)
export const getProdCatById = (id) => Api().get(`/categories/${id}/view`); // done //(Msvs => Done)

export const updateProdCatById = (prodcatFormData) => {
	return authApi().put(`/categories/${prodcatFormData?.id}/update`, prodcatFormData); // done
}; // (Msvs => Done)
export const createProdCat = (prodcatFormData) => authApi().post('/categories', prodcatFormData); // done

export const featureProdCatById = (id) => authApi().put(`/categories/feature-category/${id}`);

export const unFeatureProdCatById = (id) => authApi().put(`/categories/unfeature-category/${id}`);

export const deleteProdCatById = (catId) => {
	return authApi().delete(`/categories/${catId}/delete`); // done
}; // (Msvs => Done)
/** ***
 * ####################################################################
 * PRODUCT-CATEGORIES  handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */
/** *================================================================ */

/** ***
 * ####################################################################
 * PRODUCT-UNITS handling starts here  (All done as @ 20th August, 2024)
 * ####################################################################
 */
// Product Units Routes
export const getProdUnits = () => authApi().get('/unit-weights'); // done //(Msvs => Done)
export const getProdUnitById = (id) => authApi().get(`/unit-weights/${id}/view`); // done //(Msvs => Done)
export const updateProdUnitById = (prodUnitFormData) =>
	authApi().put(`/unit-weights/${prodUnitFormData?.id}/update`, prodUnitFormData); // done //(Msvs => Done)

export const createProdUnit = (prodUnitFormData) => authApi().post('/unit-weights', prodUnitFormData); // done //(Msvs => Done)
export const deleteProdUnitsById = (catId) => {
	return authApi().delete(`/unit-weights/${catId}/delete`); // done //(Msvs => Done)
};
/** ***
 * ####################################################################
 * PRODUCT-UNIT  handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */
/** *================================================================ */

// Product Large Units Routes
export const getLargeProdUnits = () => Api().get('/large-units');
export const getLargeProdUnitById = (id) => Api().get(`/large-units/${id}`);
export const updateLargeProdUnitById = (prodLargeUnitData) =>
	authApi().put(`/large-units/${prodLargeUnitData?._id}`, prodLargeUnitData);
export const createLargeProdUnit = (prodLargeUnitData) => authApi().post('/large-units', prodLargeUnitData);

// Product Routes Routes
export const getProducts = () => Api().get('/products');
export const getProductById = (id) => Api().get(`/products/${id}`);

/// ============Product related========================//

/** Market Warehouse  Categories */
export const getMarketWarehouseCategories = () => Api().get('/waerehousecategories'); // done

/** ***
 * ####################################################################
 * Market-category handling starts here  (All done as @ 20th August, 2024)
 * ####################################################################
 */
// Market Categories
export const getMarketCategories = (params = {}) => {
	const queryParams = new URLSearchParams();

	if (params.limit) queryParams.append('limit', params.limit);
	if (params.offset) queryParams.append('offset', params.offset);
	if (params.search) queryParams.append('search', params.search);

	const queryString = queryParams.toString();
	const url = queryString ? `/market-categories?${queryString}` : '/market-categories';

	return authApi().get(url);
}; // done //(Msvs => Done)
export const getMarketCategoryById = (id) => authApi().get(`/market-categories/${id}`); // done //(Msvs => Done)
export const updateMarketCategoryById = (marketCategoryFormData) =>
	authApi().put(
		`/market-categories/${marketCategoryFormData?._id || marketCategoryFormData?.id}`,
		marketCategoryFormData
	); // done //(Msvs => Done)
export const createMarketCategory = (marketCategoryFormData) =>
	authApi().post('/market-categories', marketCategoryFormData); // done //(Msvs => Done)
export const deleteMarketCategoryById = (id) => authApi().delete(`/market-categories/${id}`); // (Msvs => Done)
/** ***
 * ####################################################################
 * Market Category handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */

/** *================================================================ */

/** ***
 * ####################################################################
 * Markets handling starts here  (All done as @ 20th August, 2024)
 * ####################################################################
 */
// Market
export const getMarkets = (params = {}) => {
	const queryParams = new URLSearchParams();

	if (params.limit) queryParams.append('limit', params.limit);

	if (params.offset) queryParams.append('offset', params.offset);

	if (params.search) queryParams.append('search', params.search);

	if (params.isInOperation !== undefined) queryParams.append('isInOperation', params.isInOperation);

	const queryString = queryParams.toString();
	const url = queryString ? `/markets?${queryString}` : '/markets';

	return authApi().get(url);
}; // done //(Msvs => Done)

export const getMarketById = (id) => authApi().get(`/markets/${id}`); // done //(Msvs => Done)
// export const getMarketsByLgaId = (id) => Api().get(`/markets/${id}`);
export const updateMarketById = (marketFormData) => authApi().put(`/markets/${marketFormData?.id}`, marketFormData); // done //(Msvs => Done)
export const createMarket = (marketFormData) => authApi().post('/markets', marketFormData); // done
export const featureMarket = (id) => authApi().put(`/markets/feature-market/${id}`);
export const unFeatureMarket = (id) => authApi().put(`/markets/unfeature-market/${id}`);
export const getMarketsByStateId = (id) => Api().get(`/markets/states/${id}`);
export const getMarketsByLgaId = (id) => Api().get(`/markets/lga/${id}`);
export const deleteMarketById = (id) => authApi().delete(`/markets/${id}`);

/** ***
 * ####################################################################
 * Markets handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */

/** *================================================================ */

/** ***
 * ####################################################################
 * Shop Plans handling starts here  (All done as @ 20th August, 2024)
 * ####################################################################
 */
// SHopPlans Routes
export const getShopPlans = () => Api().get('/merchant-plans'); // done //(Msvs => Done)
export const getShopPlanById = (id) => Api().get(`/merchant-plans/${id}/view`); // done //(Msvs => Done)
export const updateShopPlanById = (planFormData) =>
	authApi().put(`/merchant-plans/${planFormData?.id}/update`, planFormData); // done //(Msvs => Done)
export const createShopPlan = (planFormData) => authApi().post('/merchant-plans/create-plan', planFormData); // done //(Msvs => Done)
export const deleteShopPlanById = (id) => authApi().delete(`/merchant-plans/delete-plan/${id}/delete`); // done //(Msvs => Done)

/** ***
 * ####################################################################
 * Shop Plans handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */

/** *================================================================ */

/** ***
 * ####################################################################
 * Shops/Merchants handling starts here  (All done as @ 20th August, 2024)
 * ####################################################################
 */
// SHops Routes
export const getShops = (params = {}) => {
	const queryParams = new URLSearchParams();

	if (params.limit) queryParams.append('limit', params.limit);
	if (params.offset) queryParams.append('offset', params.offset);
	if (params.search) queryParams.append('search', params.search);

	const queryString = queryParams.toString();
	const url = queryString ? `/auth-merchant/admin/merchants?${queryString}` : '/auth-merchant/admin/merchants';

	return authApi().get(url);
}; // (Msvs => Done)
export const getShopById = (id) => authApi().get(`/auth-merchant/admin/merchants/${id}`); // (Msvs => Done)

export const updateShopById = (id, shopFormData) => authApi().put(`/auth-merchant/${id}`, shopFormData);

export const createApiShop = (shopFormData) => authApi().post('/auth-merchant', shopFormData);
// export const createApiVendorShop = (shopFormData) =>
//   authApi().post('/shops', shopFormData);
export const createApiMerchantVendorShop = (shopFormData) =>
	authApi().post('/auth-merchant/create/resource-vendor', shopFormData); // done***
export const updateApiMerchantVendorShop = (shopFormData) =>
	authApi().put(`/auth-merchant/admin/merchants/${shopFormData?.id}`, shopFormData); // done*** //(Msvs => Done)
export const deleteShopById = (id) => authApi().delete(`/shops/${id}`);

/** **Partners Shops handling */
export const createApiPartnerVendorShop = (shopFormData) =>
	authApi().post('/shops/create/resource-partner', shopFormData);
export const updateApiPartnerVendorShop = (shopFormData) =>
	authApi().put(`/shops/update/resource-partner/${shopFormData?._id}`, shopFormData);
/** **Company Shops handling */
export const createApiCompanyVendorShop = (shopFormData) =>
	authApi().post('/shops/create/resource-company', shopFormData);
export const updateApiCompanyVendorShop = (shopFormData) =>
	authApi().put(`/shops/update/resource-company/${shopFormData?._id}`, shopFormData);

export const adminMakeShopHomeSlider = (id, shopFormData) =>
	authApi().put(`/shops/makeshop-homeslider/${id}`, shopFormData);

export const adminUnMakeShopHomeSlider = (id, shopFormData) =>
	authApi().put(`/shops/unmakeshop-homeslider/${id}`, shopFormData);

export const adminMakeShopBannerAd = (id, shopFormData) =>
	authApi().put(`/shops/makeshop-bannerads/${id}`, shopFormData);

export const adminUnMakeShopBannerAd = (id, shopFormData) =>
	authApi().put(`/shops/unmakeshop-bannerads/${id}`, shopFormData);

export const adminMakeShopPromotion = (id, shopFormData) =>
	authApi().put(`/shops/makeshop-promotion/${id}`, shopFormData);

export const adminUnMakeShopPromotion = (id, shopFormData) =>
	authApi().put(`/shops/unmakeshop-promotion/${id}`, shopFormData);
/** ***
 * ####################################################################
 * Shop  handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */

/** *================================================================ */

/** **####################################################################
 * OFFICE ROUTES starts here
 *################################################################## */

export const getOffices = () => Api().get('/offices');

export const getOfficeById = (id) => Api().get(`/offices/${id}`);
export const getOfficeByLgaId = (id) => Api().get(`/offices/by-lga/${id}`);

export const createApiOfficeOutlet = (formData) => authApi().post('/offices/create/resource-office', formData); // done***

export const updateApiOfficeOutlet = (formData) =>
	authApi().put(`/offices/update/resource-office/${formData?._id}`, formData); // done***
export const deleteOfficeById = (id) => authApi().delete(`/offices/${id}`);
/** **####################################################################
 * OFFICE ROUTES ends here
 *################################################################## */

// Ads Routes
export const getAds = () => Api().get('/ads'); // done
export const getAdById = (id) => Api().get(`/ads/${id}`); // done
export const updateAdById = (adFormData) => authApi().put(`/ads/${adFormData?._id}`, adFormData); // done
export const createAd = (adFormData) => authApi().post('/ads', adFormData); // done

/** ***
 * ####################################################################
 * Post categories handling starts here  (All done as @ 20th August, 2024)
 * ####################################################################
 */
// Post categories Routes
export const getPostcats = () => Api().get('/postcats'); // done
export const getPostcatById = (id) => Api().get(`/postcats/${id}`); // done
export const updatePostcatById = (postcatFormData) =>
	authApi().put(`/postcats/${postcatFormData?._id}`, postcatFormData); // done
export const createPostcat = (postcatFormData) => authApi().post('/postcats', postcatFormData); // done
export const deletePostcatsById = (id) => authApi().delete(`/postcats/${id}`);
/** ***
 * ####################################################################
 * Post categories  handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */
/** *================================================================ */

/** ***
 * ####################################################################
 * Blog Posts handling starts here  (All done as @ 20th August, 2024)
 * ####################################################################
 */
// Post Routes
export const getNewsPosts = () => Api().get('/posts'); // done
export const getAdminPosts = () => authApi().get('/posts/adminposts'); // done
// export const getPosts = () => Api().get('/posts');
// export const getPostById = (id) => Api().get(`/posts/${id}`);
export const getSinglePostById = (id) => Api().get(`/posts/${id}`); // done
export const adminGetSinglePostById = (id) => authApi().get(`/posts/getpostbyadmin/${id}`); // done
export const getPostById = (id) => authApi().get(`/posts/bycreator/${id}`); // done
export const updatePostById = (postFormData) => authApi().put(`/posts/${postFormData?._id}`, postFormData); // done
export const createPost = (postFormData) => authApi().post('/posts', postFormData); // done

export const deleteBlogPostById = (id) => authApi().delete(`/posts/${id}`);
/** ***
 * ####################################################################
 * Blog Posts   handling ends here
 * ______________________________________________________________________
 * ####################################################################
 */
/** *================================================================ */

// Faq Routes
export const getFaqs = () => Api().get('/faqs'); // done
export const getApiFaqById = (id) => authApi().get(`/faqs/byadmin/${id}`); // done
export const updateFaqById = (faqFormData) => authApi().put(`/faqs/${faqFormData?._id}`, faqFormData); // done
export const createApiFaq = (faqFormData) => authApi().post('/faqs', faqFormData); // done

// Partners Routes
export const getPartners = () => Api().get('/partners'); // done
export const getAdminPartnerById = (id) => authApi().get(`/partners/byadmin/${id}`); // done
export const getPartnerById = (id) => Api().get(`/partners/${id}`);
export const updatePartnerById = (partnerFormData) =>
	authApi().put(`/partners/${partnerFormData?._id}`, partnerFormData);
export const createPartner = (partnerFormData) => authApi().post('/partners', partnerFormData);

// Banner Routes users
export const getBanners = () => Api().get('/banners'); // done
export const getApiBannerById = (id) => Api().get(`/banners/${id}`); // done
export const updateBannerById = (bannerFormData) => authApi().put(`/banners/${bannerFormData?._id}`, bannerFormData); // done
export const createBanner = (bannerFormData) => authApi().post('/banners', bannerFormData); // done
export const adminMakeHomeSlider = (id) => authApi().put(`/banners/makehomeslider/${id}`);
export const adminUnMakeHomeSlider = (id) => authApi().put(`/banners/unmakehomeslider/${id}`);

// Legal/Advocacy Routes
export const getLegals = () => Api().get('/privacies'); // done
export const getApiLegalById = (id) => Api().get(`/privacies/${id}`);
export const updateLegalById = (legalFormData) => authApi().put(`/privacies/${legalFormData?._id}`, legalFormData);
export const createLegal = (legalFormData) => authApi().post('/privacies', legalFormData);

// Website Info Routes
export const getInfos = () => Api().get('/infos');
export const getApiInfoById = (id) => Api().get(`/infos/${id}`);
export const updateInfoById = (id, InfoFormData) => authApi().put(`/infos/${id}`, InfoFormData);
export const createInfo = (InfoFormData) => authApi().post('/infos', InfoFormData);

/** ***
 * ###########################################################################################
 * Admin ORDERS-Management handling starts here  (All done as @ 20th August, 2024)
 * ##############################################################################################
 */
// Admin Order Routes
export const adminGetOrders = (params = {}) => {
	const queryParams = new URLSearchParams();

	if (params.limit) queryParams.append('limit', params.limit);

	if (params.offset) queryParams.append('offset', params.offset);

	if (params.search) queryParams.append('search', params.search);

	if (params.isPaid !== undefined) queryParams.append('isPaid', params.isPaid);

	if (params.isPacked !== undefined) queryParams.append('isPacked', params.isPacked);

	if (params.isShipped !== undefined) queryParams.append('isShipped', params.isShipped);

	if (params.isDelivered !== undefined) queryParams.append('isDelivered', params.isDelivered);

	const queryString = queryParams.toString();
	const url = queryString ? `/admin/orders?${queryString}` : '/admin/orders';

	return authApi().get(url);
};
export const adminGetOrderById = (id) => authApi().get(`/admin/orders/${id}`);

export const adminDeleteOrders = (id) => authApi().delete(`/admin/orders/${id}`);
export const adminPackOrders = (id) => authApi().patch(`/admin/orders/${id}/package`);
export const adminShipOrders = (id) => authApi().patch(`/admin/orders/${id}/ship-unship`);
export const adminConfirmOrderArrival = (id) => authApi().patch(`/admin/orders/${id}/confirm-order-arrival`);
export const adminDeliverOrders = (id) => authApi().patch(`/admin/orders/${id}/deliver-undeliver`);

/** ****Manaing order-items */

export const adminGet_OrderItems = () => authApi().get('/adminmanage-orderitems');

export const adminGet_ApproveAndPayRefund = (itemId) =>
	authApi().put(`/adminmanage-orderitems/refund-credit-wallet/${itemId}/on-order-item`);

export const adminGetOrderItemsOfOrderById = (id) => authApi().get(`/admin/orders/adminorderitems-of-order/${id}`);
/** ***
 * ###########################################################################################
 * Admin ORDERS-Management handling ends here  (All done as @ 20th August, 2024)
 * ##############################################################################################
 */
/** *================================================================ */

// Finance Manage Orders and cashout Routes
export const adminFinanceGetOrders = () => authApi().get('/financehandleorders');
export const adminFinanceGetOrderById = (id) => authApi().get(`/financehandleorders/finance/${id}`);
export const adminFinanceCompleteOrders = (id) => authApi().put(`/financehandleorders/complete-order/${id}`);

// Finance Manage Withdrawals Requests and Approval Routes
export const adminFinanceGetWithdrawals = () => authApi().get('/handlewithdrawals');
export const adminFinanceGetApprovedWithdrawals = () => authApi().get('/handlewithdrawals/showapproved');
export const adminFinanceGetWithdrawalsById = (id) => authApi().get(`/handlewithdrawals/finance/${id}`);
export const adminFinanceApproveWithdrawals = (id) => authApi().put(`/handlewithdrawals/complete-withdrawal/${id}`);
export const adminFinancePayoutWithdrawals = (id) => authApi().put(`/handlewithdrawals/payout-withdrawal/${id}`);

// export const getBarners = () => Api().get('/barners');
// export const getPosts = () => Api().get('/posts');
// export const findOnePost = (id) => Api().get(`/posts/${id}`);

// shop product handling starts
// export const storeShopProduct = (formData) =>
//   Api().post('/store/shopproducts', formData);

// export const getShopProducts = () => Api().get('/shop/product/list');

// shop product handling ends

// Users/Customers Routes users
export const getApiUsers = () => authApi().get('/auth-user/admin/users'); // new Dashboard ***Done
export const getApiUserById = (id) => authApi().get(`/auth-user/admin/users/${id}`);
export const getApiPopuplatedUserById = (id) =>  {
	console.log("API CALL FOR POPULATED USER BY ID:", id);
	return authApi().get(`/auth-user/admin/users/${id}/populated-user`)
}

export const updateApiUserById = (usersFormData) => authApi().put(`/auth-user/admin/users/${usersFormData?.id}`, usersFormData);

export const createApiUser = (usersFormData) => authApi().post('/auth-user/admin/users', usersFormData);

export const adminSuspendDisciplineUser = (id) => authApi().put(`/auth-user/admin/users/suspenduser/${id}`);

export const adminUnSuspendDisciplineUser = (id) => authApi().put(`/auth-user/admin/users/unsuspenduser/${id}`);

export const adminBlockDisciplineUser = (id) => authApi().put(`/auth-user/admin/users/blockuser/${id}`);
/// blockuser/
export const adminUnBlockDisciplineUser = (id) => authApi().put(`/auth-user/admin/users/unblockuser/${id}`);

// Users/Customers and discipinary Routes ends here

/** *
 * Admin/ControlPanel AdminUsers Routes adminusers starts
 */
export const getApiAdminUsers = (params = {}) => {
	const queryParams = new URLSearchParams();

	if (params.limit) queryParams.append('limit', params.limit);

	if (params.offset) queryParams.append('offset', params.offset);

	if (params.name) queryParams.append('name', params.name);

	const queryString = queryParams.toString();
	const url = queryString ? `/authadmin/get-all-admins?${queryString}` : '/authadmin/get-all-admins';

	return authApi().get(url);
}; // new Dashboard done //(Msvs => Done)
export const getApiAdminUserById = (id) => authApi().get(`/authadmin/get-admin/${id}/not-populated`); // (Msvs => Do)
export const getApiAdminUserByIdNotPopulated = (id) => authApi().get(`/authadmin/get-admin/${id}/not-populated`);

/// Updated disciplinary endpoints - using unified routes with action payload
export const adminBlockDisciplineStaff = (staffId) =>
	authApi().put(`/authadmin/disciplinary/block/${staffId}`, { action: 'block' });

export const adminUnBlockDisciplineStaff = (staffId) =>
	authApi().put(`/authadmin/disciplinary/block/${staffId}`, { action: 'unblock' });

/// suspend/unsuspend admin control panel user - using unified routes with action payload
export const adminSuspendDisciplineStaff = (staffId) =>
	authApi().put(`/authadmin/disciplinary/suspend/${staffId}`, { action: 'suspend' });

export const adminUnSuspendDisciplineStaff = (staffId) =>
	authApi().put(`/authadmin/disciplinary/suspend/${staffId}`, { action: 'unsuspend' });

/// User Leadership Status user/
export const adminMakeLeader = (id) => authApi().put(`/admin/makeceo/${id}`);

export const adminUnMakeLeader = (id) => authApi().put(`/admin/unmakeceo/${id}`);

// Admin/ControlPanel AdminUsers Routes adminusers starts

export const updateApiAdminUserById = (adminFormData) => authApi().put(`/authadmin/update-profile/${adminFormData?._id || adminFormData?.id}`, adminFormData);

export const createApiAdminUser = (adminFormData) => authApi().post('/admin', adminFormData);

export const createRecruitAdminUserApi = (adminFormData) => authApi().post('/authadmin/recruit-staff', adminFormData); // (Msvs => Done)

export const newAdminUserInviteAcceptanceEndpoint = (adminFormData) =>
	authApi().post('/authadmin/accept-invite', adminFormData);

export const adminDeleteAdminStaff = (id) => authApi().delete(`/admin/${id}/delete-admin`);

/** ****
 * #######################################################################
 * Admin/ControlPanel Admin Get Shops Routes  starts and MERCHANT__STATS |
 * ########################################################################
 */
export const getApiAdminMerchants = () => authApi().get('/shops'); // new Dashboard done

/** ***
 * ###################################################################################################
 * ESTATE PROPERTIES handling starts here  (All done as @ 20th August, 2024)
 * ####################################################################################################
 */
export const adminGetEstatePropertiess = (params = {}) => {
	const queryParams = new URLSearchParams();

	if (params.limit) queryParams.append('limit', params.limit);

	if (params.offset) queryParams.append('offset', params.offset);

	if (params.title) queryParams.append('title', params.title);

	if (params.numberOfRooms) queryParams.append('numberOfRooms', params.numberOfRooms);

	if (params.minPrice) queryParams.append('minPrice', params.minPrice);

	if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);

	if (params.propertyUseCase) queryParams.append('propertyUseCase', params.propertyUseCase);

	if (params.status) queryParams.append('status', params.status);

	if (params.merchantId) queryParams.append('merchantId', params.merchantId);

	const queryString = queryParams.toString();
	const url = queryString ? `/real-estate/admin/properties?${queryString}` : '/real-estate/admin/properties';

	return authApi().get(url);
}; // done

// Get single estate property by ID
export const adminGetEstatePropertyById = (propertyId) => authApi().get(`/real-estate/admin/properties/${propertyId}`);

/** **Shop on Estate properties */
export const adminGetShopOnEstateProperties = () => authApi().get('/handle-estates/get-shopsonestates'); // done
export const adminGetSingleShopAndEstateProperties = (id) =>
	authApi().get(`/handle-estates/get-shop-and-its-estateproperties/${id}`);
/** ***
 * ###################################################################################################
 * ESTATE PROPERTIES handling ends here  (All done as @ 20th August, 2024)
 * ####################################################################################################
 */
/** ============================================================================================================= */
/** ***
 * ###################################################################################################
 * HOSPITALITY/BOOKINGS PROPERTIES handling starts here
 * ####################################################################################################
 */

/** **Shop on Hospitality properties */
export const adminGetMerchantsOnHospitalityProperties = () =>
	authApi().get('/handle-hospitality/get-merchants-on-hospitality'); // done
export const adminGetSingleMerchantAndHospitalityProperties = (merchantId) =>
	authApi().get(`/handle-hospitality/get-marchants/${merchantId}/and-hospitality-properties`);

/** *****Getting and handling reservations */
export const adminGetBookingsReservationsApi = () => authApi().get('/handle-hospitality/get-hospitality-reservations');

/** ****###CANCELLED RESERVATIONS Handling######### */
export const adminGetCancelledReservationsApi = () => authApi().get('/handle-hospitality/get-cancelled-reservations');

export const adminApproveRefundsApi = (refundPayload) =>
	authApi().get(`/handle-hospitality/${refundPayload}/approve-credit-refund_request`);
/** ***
 * ###################################################################################################
 * HOSPITALITY/BOOKINGS PROPERTIES handling ends here  (All done as @ 20th August, 2024)
 * ####################################################################################################
 */

/** ***
 * ###################################################################################################
 * BOOKING PROPERTY AMENITIES handling starts here
 * ####################################################################################################
 */

/** **Get all amenities (paginated) */
export const adminGetAllAmenitiesApi = (params = {}) => {
	const queryParams = new URLSearchParams();

	if (params.limit) queryParams.append('limit', params.limit);
	if (params.offset) queryParams.append('offset', params.offset);

	const queryString = queryParams.toString();
	const url = queryString ? `/bookings/admin/amenities?${queryString}` : '/bookings/admin/amenities';

	return authApi().get(url);
};

/** **Get single amenity by ID */
export const adminGetSingleAmenityApi = (amenityId) => authApi().get(`/bookings/admin/amenities/${amenityId}/view`);

/** **Create a new amenity */
export const adminCreateAmenityApi = (amenityData) => authApi().post('/bookings/admin/amenities/create', amenityData);

/** **Update an existing amenity */
export const adminUpdateAmenityApi = ({ amenityId, ...amenityData }) =>
	authApi().put(`/bookings/admin/amenities/${amenityId}/update`, amenityData);

/** **Delete an amenity */
export const adminDeleteAmenityApi = (amenityId) => authApi().delete(`/bookings/admin/amenities/${amenityId}/delete`);

/** ***
 * ###################################################################################################
 * BOOKING PROPERTY AMENITIES handling ends here
 * ####################################################################################################
 */

/** ***
 * ###################################################################################################
 * REAL ESTATE ACQUISITIONS handling starts here
 * ####################################################################################################
 */
// View All Acquisitions (Admin)
export const adminGetAllAcquisitions = (params = {}) => {
	const queryParams = new URLSearchParams();

	if (params.limit) queryParams.append('limit', params.limit);

	if (params.offset) queryParams.append('offset', params.offset);

	if (params.status) queryParams.append('status', params.status);

	const queryString = queryParams.toString();
	const url = queryString
		? `/real-estate/acquisitions/admin/all?${queryString}`
		: '/real-estate/acquisitions/admin/all';

	return authApi().get(url);
};

// View Single Acquisition (Admin)
export const adminGetSingleAcquisition = (acquisitionId) =>
	authApi().get(`/real-estate/acquisitions/admin/${acquisitionId}`);

// Verify Payment
export const adminVerifyAcquisitionPayment = (acquisitionId, adminNotes) =>
	authApi().put(`/real-estate/acquisitions/admin/${acquisitionId}/verify-payment`, { adminNotes });

// Reject Payment
export const adminRejectAcquisitionPayment = (acquisitionId, rejectionReason) =>
	authApi().put(`/real-estate/acquisitions/admin/${acquisitionId}/reject-payment`, { rejectionReason });

// Verify Documents
export const adminVerifyAcquisitionDocuments = (acquisitionId, adminNotes) =>
	authApi().put(`/real-estate/acquisitions/admin/${acquisitionId}/verify-documents`, { adminNotes });

// Reject Documents
export const adminRejectAcquisitionDocuments = (acquisitionId, rejectionReason) =>
	authApi().put(`/real-estate/acquisitions/admin/${acquisitionId}/reject-documents`, { rejectionReason });

// Complete Acquisition
export const adminCompleteAcquisition = (acquisitionId, adminNotes) =>
	authApi().put(`/real-estate/acquisitions/admin/${acquisitionId}/complete`, { adminNotes });

// Cancel Acquisition
export const adminCancelAcquisition = (acquisitionId, cancellationReason) =>
	authApi().put(`/real-estate/acquisitions/admin/${acquisitionId}/cancel`, { cancellationReason });

/** ***
 * ###################################################################################################
 * REAL ESTATE OFFERS handling starts here
 * ####################################################################################################
 */
// View All Offers (Admin)
export const adminGetAllOffers = (params = {}) => {
	const queryParams = new URLSearchParams();

	if (params.limit) queryParams.append('limit', params.limit);

	if (params.offset) queryParams.append('offset', params.offset);

	if (params.propertyId) queryParams.append('propertyId', params.propertyId);

	if (params.status) queryParams.append('status', params.status);

	const queryString = queryParams.toString();
	const url = queryString
		? `/realestate-offers/admin/all-offers?${queryString}`
		: '/realestate-offers/admin/all-offers';

	return authApi().get(url);
};

// Manage Offer (Admin)
export const adminManageOffer = (offerId, action, data) =>
	authApi().post(`/realestate-offers/admin/manage/${offerId}`, { action, data });

// Delete Offer (Admin)
export const adminDeleteOffer = (offerId) => authApi().delete(`/realestate-offers/admin/delete/${offerId}`);

/** ***
 * ###################################################################################################
 * REAL ESTATE INSPECTIONS handling starts here (Placeholder routes)
 * ####################################################################################################
 */
// View All Inspections (Admin) - Placeholder
export const adminGetAllInspections = (params = {}) => {
	const queryParams = new URLSearchParams();

	if (params.limit) queryParams.append('limit', params.limit);

	if (params.offset) queryParams.append('offset', params.offset);

	if (params.propertyId) queryParams.append('propertyId', params.propertyId);

	if (params.status) queryParams.append('status', params.status);

	if (params.date) queryParams.append('date', params.date);

	const queryString = queryParams.toString();
	const url = queryString
		? `/real-estate/inspections/admin/all?${queryString}`
		: '/real-estate/inspections/admin/all';

	return authApi().get(url);
};

// View Single Inspection (Admin) - Placeholder
export const adminGetSingleInspection = (inspectionId) =>
	authApi().get(`/real-estate/inspections/admin/${inspectionId}`);

// Schedule Inspection (Admin) - Placeholder
export const adminScheduleInspection = (inspectionData) =>
	authApi().post('/real-estate/inspections/admin/schedule', inspectionData);

// Update Inspection Status (Admin) - Placeholder
export const adminUpdateInspectionStatus = (inspectionId, status, notes) =>
	authApi().put(`/real-estate/inspections/admin/${inspectionId}/status`, { status, notes });

/** ***
 * ###################################################################################################
 * ADMIN PROFILE & SETTINGS handling starts here
 * ####################################################################################################
 */
// Get current admin profile
export const getAdminProfile = () => authApi().get('/authadmin/profile');

// Update admin social media handles (self-service)
export const updateAdminSocialMedia = (socialMediaData) =>
	authApi().put('/authadmin/profile/social-media', socialMediaData);

// Get admin referral links
export const getAdminReferralLinks = () => authApi().get('/authadmin/profile');

// Generate admin referral links
export const generateAdminReferralLinks = () => authApi().put('/authadmin/referral-links/generate');

/** ***
 * ###################################################################################################
 * ADMIN PROFILE & SETTINGS handling ends here
 * ####################################################################################################
 */

/** ***
 * ###################################################################################################
 * APPLICATION SETTINGS handling starts here 'application-settings
 * ####################################################################################################
 */
// Get all application settings (Admin)
export const adminGetAllApplicationSettings = () => authApi().get('/application-settings/admin/all'); /***Msvs => Done */

// Get single application setting by ID
export const adminGetApplicationSettingById = (settingId) =>
	authApi().get(`/application-settings/admin/get-settings/${settingId}`);

// Create new application setting
export const adminCreateApplicationSetting = (settingData) =>
	authApi().post('/application-settings/admin/create-settings', settingData); /***Msvs => Done */

// Update application setting
export const adminUpdateApplicationSetting = (settingId, settingData) =>
	authApi().put(`/application-settings/admin/${settingId}/update-settings`, settingData);

// Activate application setting
export const adminActivateApplicationSetting = (settingId) =>
	authApi().patch(`/application-settings/admin/activate-settings/${settingId}`);

// Delete application setting
export const adminDeleteApplicationSetting = (settingId) =>
	authApi().delete(`/application-settings/admin/delete-settings/${settingId}`);

/** ***
 * ###################################################################################################
 * APPLICATION SETTINGS handling ends here
 * ####################################################################################################
 */

/** **
 *
 * LOG OUT HANDLING BELOW
 */
export const AdminLogOutCall = () => {
	if (typeof window !== 'undefined') {
		try {
			/** Fuse admin starts */
			resetSessionForAdminUsers();
			Cookies.remove('jwt_auth_credentials');
			/** *Fuse admin ends */

			Cookies.remove('authUserInfo');
			Cookies.remove('isloggedin');
			Cookies.remove('_auth');
			Cookies.remove('_auth_state');
			Cookies.remove('_auth_type');
			Cookies.remove('_auth_storage');
			Cookies.remove('_ga');
			Cookies.remove('_ga_WJH9CH067R');
			Cookies.remove('SLG_G_WPT_TO');
			Cookies.remove('ADMIN_AFSP_Show_Hide_tmp_Lead');
			Cookies.remove('ADMIN_AFSP_Show_Hide_tmp_Lead_ARC');

			// Cookies.set(
			//   'ADMIN_AFSP_Show_Hide_tmp_Lead',
			//   JSON.stringify(response?.data?.accessToken),
			//   '1h'
			// );

			window.location.reload(false);
		} catch (error) {
			console.log(error);
		}
	}
};

/** ***Shop Users Logout functionality */
export const logOut = () => {
	// const logeAuthOut = useSignOut();
	if (typeof window !== 'undefined') {
		// remove logged in user's cookie and redirect to login page 'authUserCookie', state.user, 60 * 24
		try {
			// Api()
			//   .post(`/logout`)
			//   .then((response) => {
			//     // alert('logged out successfully');
			//     console.log('logged out successfully');
			//   });

			// logeAuthOut();

			window.location.reload(false);
		} catch (error) {
			console.log(error.response && error.response.data.message ? error.response.data.message : error.message);
		}

		Cookies.remove('ADMIN_AFSP_Show_Hide_tmp_Lead');
	}
};
