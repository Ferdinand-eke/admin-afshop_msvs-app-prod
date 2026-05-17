import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { createErrorHandler } from '../utils/errorHandler';
import {
	createCountry,
	createCountryShippingTable,
	deleteCountryById,
	deleteCountryShippingTableById,
	getCountries,
	getCountriesWithShippinTable,
	getCountriesWithShippinTableExcludeOrigin,
	getCountryById,
	getOperationalCountries,
	updateCountryById,
	updateCountryShippingTableById
} from '../apiRoutes';

export default function useCountries(params = {}) {
	return useQuery(['__countries', params], () => getCountries(params), {
		keepPreviousData: true,
		staleTime: 30000
	});
} // (Msvs => Done)

// Paginated hook for countries
export function useCountriesPaginated({ page = 0, limit = 20, search = '', filters = {} }) {
	const offset = page * limit;

	return useQuery(
		['__countries_paginated', { page, limit, search, filters }],
		() =>
			getCountries({
				limit,
				offset,
				search,
				...filters
			}),
		{
			keepPreviousData: true,
			staleTime: 30000
		}
	);
}

// operational
export function useOperationalCountries() {
	return useQuery(['__operational_countries'], getOperationalCountries);
}

// get single country
export function useSingleCountry(countryId) {
	if (!countryId || countryId === 'new') {
		return '';
	}

	return useQuery(['__countries', countryId], () => getCountryById(countryId), {
		enabled: Boolean(countryId)
		// staleTime: 5000,
	});
}

// create new country
export function useAddCountryMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	return useMutation(
		(newCountry) => {
			return createCountry(newCountry);
		},

		{
			onSuccess: (data) => {
				if (data?.data) {
					toast.success('Country added successfully!');
					queryClient.invalidateQueries(['__countries']);
					queryClient.refetchQueries('__countries', { force: true });
					navigate('/administrations/countries');
				}
			}
		},
		{
			onError: createErrorHandler({ defaultMessage: 'Failed to create country' })
		}
	);
}

// update new country
export function useCountryUpdateMutation() {
	const queryClient = useQueryClient();

	return useMutation(updateCountryById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('country updated successfully!!');
				queryClient.invalidateQueries('__countries');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to update country' })
	});
} // (Msvs => Done)

/** *Delete a county */
export function useDeleteSingleCountry() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(deleteCountryById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success(data?.data?.message || 'country deleted successfully!!');
				queryClient.invalidateQueries('__countries');
				navigate('/administrations/countries');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to delete country' })
	});
}

/** ***
 * #####################################################################
 * HANDLE SHIPPING-ROUTES-TABLE STARTS
 * #####################################################################
 */

export function useCountriesWithShippingTable() {
	return useQuery(['__countries_shippintables'], getCountriesWithShippinTable);
}

export function useCountriesWithShippingTableOriginExcluded(countryId) {
	if (!countryId || countryId === 'new') {
		return '';
	}

	return useQuery(
		['__countriesOriginExcluded', countryId],
		() => getCountriesWithShippinTableExcludeOrigin(countryId),
		{
			enabled: Boolean(countryId)
			// staleTime: 5000,
		}
	);
}

// Add To Country Shipping Table country
export function useCountryAddShippingTableMutation() {
	const queryClient = useQueryClient();

	return useMutation(createCountryShippingTable, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('Shipping route added successfully!');
				queryClient.invalidateQueries('__countries');
				queryClient.invalidateQueries('__countries_shippintables');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to add shipping route' })
	});
}

/** ***update Country Shipping Table  country */
export function useCountryUpdateShippingMutation() {
	const queryClient = useQueryClient();

	return useMutation(updateCountryShippingTableById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('Shipping route updated successfully!');
				queryClient.invalidateQueries('__countries');
				queryClient.invalidateQueries('__countries_shippintables');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to update shipping route' })
	});
}

/** ***delete Country Shipping Table entry */
export function useCountryDeleteShippingMutation() {
	const queryClient = useQueryClient();

	return useMutation(deleteCountryShippingTableById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('Shipping route removed successfully!');
				queryClient.invalidateQueries('__countries');
				queryClient.invalidateQueries('__countries_shippintables');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to delete shipping route' })
	});
}

/** ***
 * #####################################################################
 * HANDLE SHIPPING-ROUTES-TABLE ENDS
 * #####################################################################
 */
