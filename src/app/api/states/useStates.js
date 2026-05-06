import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { createErrorHandler } from '../utils/errorHandler';
import {
	createBState,
	deleteStateById,
	getBStates,
	getStateById,
	getStatesByCountryAdmin,
	updateStateById
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
