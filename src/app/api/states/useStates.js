import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { createErrorHandler } from '../utils/errorHandler';
import {
	createBState,
	createStateShippingTable,
	deleteStateById,
	deleteStateShippingTableById,
	getBStates,
	getOperationalStateByCountryId,
	getStateById,
	getStatesByCountryAdmin,
	getStatesWithShippinTable,
	getStatesWithShippinTableExcludeOrigin,
	updateStateById,
	updateStateShippingTableById
} from '../apiRoutes';

export default function useStates(params = {}) {
	return useQuery(['states', params], () => getBStates(params), {
		keepPreviousData: true,
		staleTime: 30000
	});
}

// Paginated hook for states
export function useStatesPaginated({ page = 0, limit = 20, search = '', filters = {} }) {
	const offset = page * limit;

	return useQuery(
		['states_paginated', { page, limit, search, filters }],
		() =>
			getBStates({
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

// get single state
export function useSingleState(stateId) {
	if (!stateId || stateId === 'new') {
		return '';
	}

	return useQuery(['states', stateId], () => getStateById(stateId), {
		enabled: Boolean(stateId)
	});
}

// create new state
export function useAddStateMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	return useMutation(
		(newState) => {
			return createBState(newState);
		},

		{
			onSuccess: (data) => {
				if (data?.data?.success) {
					toast.success('State added successfully!');
					queryClient.invalidateQueries(['states']);
					queryClient.refetchQueries('states', { force: true });
					navigate('/administrations/states');
				}
			}
		},
		{
			onError: createErrorHandler({ defaultMessage: 'Failed to create state' })
		}
	);
}

/** *update existing state */
export function useStateUpdateMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(updateStateById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('state updated successfully!!');
				queryClient.invalidateQueries('states');
				queryClient.refetchQueries('states', { force: true });
				navigate('/administrations/states');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to update state' })
	});
} // (Msvs => Done)

/** *Delete a county */
export function useDeleteSingleState() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(deleteStateById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('state deleted successfully!!');
				queryClient.invalidateQueries('__countries');
				navigate('/administrations/states');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to delete state' })
	});
} // (Msvs => Done)

export function useStateFullRecord(stateId) {
	return useQuery(['state_full', stateId], () => getStateById(stateId), {
		enabled: Boolean(stateId) && stateId !== 'new',
		staleTime: 30000
	});
}

export function useStatesByCountry(countryId, { limit = 20, offset = 0 } = {}) {
	return useQuery(
		['states_by_country', countryId, { limit, offset }],
		() => getStatesByCountryAdmin({ cid: countryId, limit, offset }),
		{
			enabled: Boolean(countryId) && countryId !== 'new',
			keepPreviousData: true,
			staleTime: 30000
		}
	);
}

export function useOperationalStatesByCountry(countryId) {
	return useQuery(
		['__operational_states_by_country', countryId],
		() => getOperationalStateByCountryId(countryId),
		{
			enabled: Boolean(countryId),
			staleTime: 30000
		}
	);
}

/** ***
 * #####################################################################
 * HANDLE STATE SHIPPING-ROUTES-TABLE STARTS
 * #####################################################################
 */

export function useStatesWithShippingTable(countryId) {
	return useQuery(
		['__states_shippingtables', countryId],
		() => getStatesWithShippinTable(countryId),
		{
			enabled: Boolean(countryId),
			staleTime: 30000
		}
	);
}

export function useStatesWithShippingTableExcludedOrigin(originStateId, countryId) {
	if (!originStateId || !countryId) return { data: null, isLoading: false };

	return useQuery(
		['__states_shippingtables_excluded', originStateId, countryId],
		() => getStatesWithShippinTableExcludeOrigin(originStateId, countryId),
		{
			enabled: Boolean(originStateId) && Boolean(countryId),
			staleTime: 30000
		}
	);
}

function handleShippingError(error, defaultMessage) {
	// The interceptor already showed individual toasts for each validation message.
	// Only show the generic fallback when no field-level errors were already displayed.
	if (!error?.validationErrors) {
		createErrorHandler({ defaultMessage })(error);
	}
}

export function useStateAddShippingTableMutation() {
	const queryClient = useQueryClient();

	return useMutation(createStateShippingTable, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('State shipping route added successfully!');
				// Invalidate the full state record so the table reflects the new route immediately.
				// state_full drives the ShippingTable display; the other two keys serve the excluded-origin picker.
				queryClient.invalidateQueries(['state_full']);
				queryClient.invalidateQueries('__states_shippingtables');
				queryClient.invalidateQueries('__states_shippingtables_excluded');
			}
		},
		onError: (error) => handleShippingError(error, 'Failed to add state shipping route')
	});
}

export function useStateUpdateShippingMutation() {
	const queryClient = useQueryClient();

	return useMutation(updateStateShippingTableById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('State shipping route updated successfully!');
				queryClient.invalidateQueries(['state_full']);
				queryClient.invalidateQueries('__states_shippingtables');
				queryClient.invalidateQueries('__states_shippingtables_excluded');
			}
		},
		onError: (error) => handleShippingError(error, 'Failed to update state shipping route')
	});
}

export function useStateDeleteShippingMutation() {
	const queryClient = useQueryClient();

	return useMutation(deleteStateShippingTableById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('State shipping route removed successfully!');
				queryClient.invalidateQueries(['state_full']);
				queryClient.invalidateQueries('__states_shippingtables');
				queryClient.invalidateQueries('__states_shippingtables_excluded');
			}
		},
		onError: (error) => handleShippingError(error, 'Failed to delete state shipping route')
	});
}

/** ***
 * #####################################################################
 * HANDLE STATE SHIPPING-ROUTES-TABLE ENDS
 * #####################################################################
 */
