import { useQuery } from 'react-query';
import { getDistrictsByAdmin, getDistrictsByLgaAdmin, getDistrictByIdAdmin } from '../apiRoutes';

export default function useDistricts({ limit = 20, offset = 0 } = {}) {
	return useQuery(['districts', { limit, offset }], () => getDistrictsByAdmin({ limit, offset }), {
		keepPreviousData: true,
		staleTime: 30000
	});
}

export function useDistrictsByLga(lgaId, { limit = 20, offset = 0 } = {}) {
	return useQuery(
		['districts_by_lga', lgaId, { limit, offset }],
		() => getDistrictsByLgaAdmin({ lgaId, limit, offset }),
		{
			enabled: Boolean(lgaId) && lgaId !== 'new',
			keepPreviousData: true,
			staleTime: 30000
		}
	);
}

export function useSingleDistrict(districtId) {
	return useQuery(['districts', districtId], () => getDistrictByIdAdmin(districtId), {
		enabled: Boolean(districtId) && districtId !== 'new',
		staleTime: 30000
	});
}
